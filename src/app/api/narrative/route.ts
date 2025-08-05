
import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject } from "firebase/storage";
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
    const contentType = request.headers.get('content-type') || '';
    let dataToSave: { Context: string; Challenges: string; Opportunities: string; fileName?: string };

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (file) {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          
          const storageRef = ref(storage, `narrative_documents/${file.name}`);
          await uploadBytes(storageRef, fileBuffer, { contentType: file.type });
          
          const parsedContent = await parseDocx(fileBuffer);
          dataToSave = { ...parsedContent, fileName: file.name };
      } else {
        return NextResponse.json({ success: false, error: 'No file found in form data.' }, { status: 400 });
      }
    } else if (contentType.includes('application/json')) {
        const jsonData = await request.json();
        dataToSave = {
            Context: jsonData.Context || "",
            Challenges: jsonData.Challenges || "",
            Opportunities: jsonData.Opportunities || "",
        };
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported Content-Type.' }, { status: 415 });
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
    const docRef = doc(db, "narratives", NARRATIVE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().fileName) {
        const fileName = docSnap.data().fileName;
        const storageRef = ref(storage, `narrative_documents/${fileName}`);
        try {
            await deleteObject(storageRef);
        } catch (storageError: any) {
            // If file not found, we can ignore, otherwise log it
            if (storageError.code !== 'storage/object-not-found') {
                console.warn("Could not delete file from storage:", storageError);
            }
        }
    }

    await deleteDoc(docRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document: ", error);
    return NextResponse.json({ success: false, error: "Failed to delete item." }, { status: 500 });
  }
}
