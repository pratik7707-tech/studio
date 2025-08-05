
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { BudgetEnvelope } from '@/lib/types';

const COLLECTION_NAME = 'budget-envelopes';

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
