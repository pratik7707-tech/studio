
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp, setDoc } from 'firebase/firestore';
import type { BudgetItem } from '@/lib/types';
import { randomBytes } from 'crypto';

function generateSlug(name: string) {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-');

    const randomString = randomBytes(3).toString('hex');
    return `${slug}-${randomString}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || (type !== 'operating' && type !== 'position')) {
    return NextResponse.json({ success: false, error: 'Invalid budget type specified.' }, { status: 400 });
  }

  try {
    const q = query(collection(db, 'budgets'), where('type', '==', type));
    const querySnapshot = await getDocs(q);
    const data: BudgetItem[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as BudgetItem);
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error getting documents: ", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data from Firestore.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<BudgetItem, 'id'> = await request.json();
    
    // Generate a unique, human-readable ID
    const docId = generateSlug(body.shortName);
    const docRef = doc(db, 'budgets', docId);

    const newBudgetItem = {
        ...body,
        id: docId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    
    await setDoc(docRef, newBudgetItem);

    return NextResponse.json({ success: true, data: { id: docId } });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ success: false, error: 'Failed to save data.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
      const body: Partial<BudgetItem> & { id: string } = await request.json();
      const { id, ...dataToUpdate } = body;
  
      if (!id) {
        return NextResponse.json({ success: false, error: 'Document ID is required.' }, { status: 400 });
      }
      
      const docRef = doc(db, 'budgets', id);
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

        await deleteDoc(doc(db, 'budgets', id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete data.' }, { status: 500 });
    }
}
