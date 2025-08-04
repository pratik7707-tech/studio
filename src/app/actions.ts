'use server';

import type { BudgetItem, NarrativeData } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import mammoth from 'mammoth';

const NARRATIVE_DOC_ID = "narrative_1";

export async function saveNarrative(data: {
  context: string;
  challenge: string;
  opportunity: string;
}) {
  try {
    const docRef = doc(db, 'narratives', NARRATIVE_DOC_ID);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    const newDoc = await getDoc(docRef);
    const newDocData = newDoc.data();
    if (newDocData) {
        return { success: true, data: serializeNarrativeData(newDocData) };
    }
    return { success: false, error: "Failed to retrieve saved data." };

  } catch (error) {
    console.error('Error saving document: ', error);
    return { success: false, error: 'Failed to save data to Firestore.' };
  }
}


export async function deleteNarrative() {
  try {
    await deleteDoc(doc(db, "narratives", NARRATIVE_DOC_ID));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, error: "Failed to delete item from Firestore." };
  }
}

function serializeFirestoreTimestamp(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

function serializeNarrativeData(docData: any): NarrativeData {
    const serializedData: { [key: string]: any } = { id: NARRATIVE_DOC_ID };
    for (const key in docData) {
        if (docData[key] instanceof Timestamp) {
            serializedData[key] = serializeFirestoreTimestamp(docData[key]);
        } else {
            serializedData[key] = docData[key];
        }
    }
    return serializedData as NarrativeData;
}


export async function getNarrative() {
  try {
    const docRef = doc(db, 'narratives', NARRATIVE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: serializeNarrativeData(docSnap.data()) };
    } else {
      // Return a default structure if the document doesn't exist
      return { success: true, data: { id: NARRATIVE_DOC_ID, context: '', challenge: '', opportunity: '' } };
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return { success: false, error: "Failed to fetch data from Firestore." };
  }
}

export async function uploadNarrativeFromDocx(fileBase64: string) {
    try {
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const { value: text } = await mammoth.extractRawText({ buffer: fileBuffer });
        
        const sections: { [key: string]: string[] } = {
            context: [],
            challenge: [],
            opportunity: [],
        };

        const lines = text.split('\n');
        let currentSection: keyof typeof sections | null = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            const lowercasedLine = trimmedLine.toLowerCase();

            if (lowercasedLine.includes('context')) {
                currentSection = 'context';
                const contentAfterHeading = trimmedLine.substring(lowercasedLine.indexOf('context') + 'context'.length).trim();
                if (contentAfterHeading.startsWith(':')) {
                    if (contentAfterHeading.length > 1) sections[currentSection].push(contentAfterHeading.substring(1).trim());
                } else if(contentAfterHeading.length > 0) {
                    sections[currentSection].push(contentAfterHeading);
                }
            } else if (lowercasedLine.includes('challenge')) {
                currentSection = 'challenge';
                const contentAfterHeading = trimmedLine.substring(lowercasedLine.indexOf('challenge') + 'challenge'.length).trim();
                 if (contentAfterHeading.startsWith(':')) {
                    if (contentAfterHeading.length > 1) sections[currentSection].push(contentAfterHeading.substring(1).trim());
                } else if(contentAfterHeading.length > 0) {
                    sections[currentSection].push(contentAfterHeading);
                }
            } else if (lowercasedLine.includes('opportunity')) {
                currentSection = 'opportunity';
                 const contentAfterHeading = trimmedLine.substring(lowercasedLine.indexOf('opportunity') + 'opportunity'.length).trim();
                if (contentAfterHeading.startsWith(':')) {
                    if (contentAfterHeading.length > 1) sections[currentSection].push(contentAfterHeading.substring(1).trim());
                } else if(contentAfterHeading.length > 0) {
                    sections[currentSection].push(contentAfterHeading);
                }
            } else if (currentSection && trimmedLine) {
                sections[currentSection].push(trimmedLine);
            }
        }

        const narrativeData = {
            context: sections.context.join('\n').trim(),
            challenge: sections.challenge.join('\n').trim(),
            opportunity: sections.opportunity.join('\n').trim(),
        };

        return await saveNarrative(narrativeData);

    } catch (error) {
        console.error('Error processing DOCX file:', error);
        return { success: false, error: 'Failed to process DOCX file.' };
    }
}
