
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { BudgetEnvelope } from '@/lib/types';
import { randomBytes } from 'crypto';

const COLLECTION_NAME = 'budget-envelopes';

function generateSlug(name: string) {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-');

    const randomString = randomBytes(3).toString('hex');
    return `${slug}-${randomString}`;
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const data: BudgetEnvelope[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as BudgetEnvelope);
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error getting documents: ", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data from Firestore.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const body: Omit<BudgetEnvelope, 'id'> = await request.json();
      
      const docId = generateSlug(body.department);
      const docRef = doc(db, COLLECTION_NAME, docId);
  
      const newEnvelope = {
          ...body,
          id: docId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      };
      
      await setDoc(docRef, newEnvelope);
  
      // For immediate use on the client, we'll simulate the server-generated timestamps.
      const savedData = { ...newEnvelope, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return NextResponse.json({ success: true, data: savedData });
    } catch (error) {
      console.error('Error in POST handler:', error);
      return NextResponse.json({ success: false, error: 'Failed to save data.' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
      const body: Partial<BudgetEnvelope> & { id: string } = await request.json();
      const { id, ...dataToUpdate } = body;
  
      if (!id) {
        return NextResponse.json({ success: false, error: 'Document ID is required.' }, { status: 400 });
      }
      
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
          ...dataToUpdate,
          updatedAt: serverTimestamp()
      });
  
      return NextResponse.json({ success: true, data: { id } });
    } catch (error) {
      console.error('Error in PUT handler:', error);
      return NextResponse.json({ success: false, error: 'Failed to update data.' }, { status: 500 });
    }
}
