
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { StandardInitiative } from '@/lib/types';
import { randomBytes } from 'crypto';

const COLLECTION_NAME = 'standard-initiatives';

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
    const data: StandardInitiative[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as StandardInitiative);
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error getting documents: ", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data from Firestore.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const body: Omit<StandardInitiative, 'id'> = await request.json();
      
      const docId = generateSlug(body.shortName);
      const docRef = doc(db, COLLECTION_NAME, docId);
  
      const newInitiative = {
          ...body,
          id: docId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      };
      
      await setDoc(docRef, newInitiative);
  
      const savedData = { ...newInitiative, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return NextResponse.json({ success: true, data: savedData });
    } catch (error) {
      console.error('Error in POST handler:', error);
      return NextResponse.json({ success: false, error: 'Failed to save data.' }, { status: 500 });
    }
  }

export async function PUT(request: Request) {
    try {
        const body: Partial<StandardInitiative> & { id: string } = await request.json();
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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Document ID is required.' }, { status: 400 });
        }

        await deleteDoc(doc(db, COLLECTION_NAME, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete data.' }, { status: 500 });
    }
}
