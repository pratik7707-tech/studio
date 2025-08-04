
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { parseDocx } from './parser';

const NARRATIVE_DOC_ID = "narrative_1";

function serializeFirestoreTimestamp(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

function serializeNarrativeData(docData: any): any {
    const serializedData: { [key: string]: any } = { id: NARRATIVE_DOC_ID };
    for (const key in docData) {
        if (docData[key] instanceof Timestamp) {
            serializedData[key] = serializeFirestoreTimestamp(docData[key]);
        } else {
            serializedData[key] = docData[key];
        }
    }
    return serializedData;
}


export async function GET() {
  try {
    const docRef = doc(db, 'narratives', NARRATIVE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: serializeNarrativeData(docSnap.data()) });
    } else {
      return NextResponse.json({ success: true, data: { id: NARRATIVE_DOC_ID, Context: '', Challenges: '', Opportunities: '' } });
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data from Firestore." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    let dataToSave: { Context: string; Challenges: string; Opportunities: string; };

    if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        dataToSave = await parseDocx(fileBuffer);
    } else {
        const body = await request.json().catch(() => formData.get('jsonData'));
        const jsonData = typeof body === 'string' ? JSON.parse(body) : body;
        dataToSave = {
            Context: jsonData.Context || "",
            Challenges: jsonData.Challenges || "",
            Opportunities: jsonData.Opportunities || "",
        };
    }
    
    const docRef = doc(db, 'narratives', NARRATIVE_DOC_ID);
    await setDoc(docRef, {
      ...dataToSave,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    const newDoc = await getDoc(docRef);
    const newDocData = newDoc.data();
    if (newDocData) {
        return NextResponse.json({ success: true, data: serializeNarrativeData(newDocData) });
    }
    
    return NextResponse.json({ success: false, error: "Failed to retrieve saved data." }, { status: 500 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ success: false, error: 'Failed to save data.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteDoc(doc(db, "narratives", NARRATIVE_DOC_ID));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document: ", error);
    return NextResponse.json({ success: false, error: "Failed to delete item from Firestore." }, { status: 500 });
  }
}
