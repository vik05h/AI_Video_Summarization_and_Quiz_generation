import { Injectable, inject } from '@angular/core';
// Import FirestoreError from the firebase library
import { Firestore, doc, getDoc, setDoc, arrayUnion, FirestoreError } from '@angular/fire/firestore';

// Define interfaces for our data structures
export interface SummaryHistoryItem {
  videoId: string;
  title: string;
  summaryText: string;
  createdAt: Date;
}

export interface QuizHistoryItem {
  videoId: string;
  score: number;
  totalQuestions: number;
  takenAt: Date;
}


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore: Firestore = inject(Firestore);

  // Method to add a new summary to a user's history
  async addSummaryToHistory(userId: string, summary: Omit<SummaryHistoryItem, 'createdAt'>) {
    if (!userId) return;

    const userHistoryRef = doc(this.firestore, `histories/${userId}`);
    const newSummaryEntry: SummaryHistoryItem = { ...summary, createdAt: new Date() };

    // --- CHANGED BLOCK ---
    // The setDoc command with { merge: true } replaces the previous try...catch logic.
    // It creates the document if it doesn't exist, or merges the data if it does.
    // Combined with arrayUnion, it safely adds the new summary to the array.
    await setDoc(userHistoryRef, {
      summaries: arrayUnion(newSummaryEntry)
    }, { merge: true });
  }
  
  // You can create a similar method for 'addQuizToHistory'

  // Method to get a user's entire history
  async getUserHistory(userId: string) {
    if (!userId) return null;
    
    const userHistoryRef = doc(this.firestore, `histories/${userId}`);
    const docSnap = await getDoc(userHistoryRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  }
}