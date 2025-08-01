'use server';

import type { BudgetItem, ContextItem } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export async function saveNarrativeItem(item: {
  id?: string;
  text: string;
  type: 'Context' | 'Challenge' | 'Opportunity';
}) {
  try {
    if (item.id) {
      // Update existing document
      const docRef = doc(db, 'narratives', item.id);
      await updateDoc(docRef, {
        text: item.text,
        type: item.type,
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: item.id };
    } else {
      // Add new document
      const docRef = await addDoc(collection(db, 'narratives'), {
        text: item.text,
        type: item.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error('Error saving document: ', error);
    return { success: false, error: 'Failed to save data to Firestore.' };
  }
}

export async function deleteNarrativeItem(id: string) {
  try {
    await deleteDoc(doc(db, "narratives", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, error: "Failed to delete item from Firestore." };
  }
}

function serializeFirestoreTimestamp(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

export async function getNarrativeItems() {
  try {
    const q = query(collection(db, "narratives"), orderBy("createdAt"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => {
      const docData = doc.data();
      const serializedData: { [key: string]: any } = { id: doc.id };
      for (const key in docData) {
        if (docData[key] instanceof Timestamp) {
          serializedData[key] = serializeFirestoreTimestamp(docData[key]);
        } else {
          serializedData[key] = docData[key];
        }
      }
      return serializedData;
    }) as ContextItem[];
    return { success: true, data };
  } catch (error) {
    console.error("Error getting documents: ", error);
    return { success: false, error: "Failed to fetch data from Firestore." };
  }
}
