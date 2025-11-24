import { db, storage } from "../config/firebase";
import { auth as firebaseAuth } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  Trade,
  ChecklistTemplate,
  ChecklistItem,
  PsychologyLog,
} from "../types";

// ==================== TRADES ====================

export const auth = firebaseAuth;

export async function addTrade(
  userId: string,
  tradeData: Omit<Trade, "id" | "createdAt" | "updatedAt">
) {
  try {
    const docRef = await addDoc(collection(db, "trades"), {
      ...tradeData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding trade:", error);
    throw error;
  }
}

export async function updateTrade(tradeId: string, updates: Partial<Trade>) {
  try {
    await updateDoc(doc(db, "trades", tradeId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating trade:", error);
    throw error;
  }
}

export async function deleteTrade(tradeId: string) {
  try {
    await deleteDoc(doc(db, "trades", tradeId));
  } catch (error) {
    console.error("Error deleting trade:", error);
    throw error;
  }
}

export async function getUserTrades(userId: string): Promise<Trade[]> {
  try {
    const q = query(collection(db, "trades"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Trade;
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }
}

export async function getTrade(tradeId: string): Promise<Trade | null> {
  try {
    const snapshot = await getDoc(doc(db, "trades", tradeId));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Trade;
  } catch (error) {
    console.error("Error fetching trade:", error);
    throw error;
  }
}

// ==================== CHECKLIST TEMPLATES ====================

export async function createChecklistTemplate(
  userId: string,
  items: Omit<ChecklistItem, "id" | "createdAt">[]
) {
  try {
    const itemsWithIds = items.map((item) => ({
      ...item,
      id: doc(collection(db, "dummy")).id,
      createdAt: Timestamp.now(),
    }));

    const docRef = await addDoc(collection(db, "checklist_template"), {
      userId,
      items: itemsWithIds,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating checklist template:", error);
    throw error;
  }
}

export async function updateChecklistTemplate(
  templateId: string,
  items: ChecklistItem[]
) {
  try {
    await updateDoc(doc(db, "checklist_template", templateId), {
      items,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating checklist template:", error);
    throw error;
  }
}

export async function getUserChecklistTemplate(
  userId: string
): Promise<ChecklistTemplate | null> {
  try {
    const q = query(
      collection(db, "checklist_template"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      items: data.items || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as ChecklistTemplate;
  } catch (error) {
    console.error("Error fetching checklist template:", error);
    throw error;
  }
}

export async function addChecklistItem(
  templateId: string,
  item: Omit<ChecklistItem, "id" | "createdAt">
) {
  try {
    const template = await getDoc(doc(db, "checklist_template", templateId));
    if (!template.exists()) throw new Error("Template not found");

    const newItem: ChecklistItem = {
      ...item,
      id: doc(collection(db, "dummy")).id,
      createdAt: new Date(),
    };

    const items = template.data().items || [];
    items.push(newItem);

    await updateDoc(doc(db, "checklist_template", templateId), {
      items,
      updatedAt: Timestamp.now(),
    });

    return newItem.id;
  } catch (error) {
    console.error("Error adding checklist item:", error);
    throw error;
  }
}

export async function updateChecklistItem(
  templateId: string,
  item: ChecklistItem
) {
  try {
    const template = await getDoc(doc(db, "checklist_template", templateId));
    if (!template.exists()) throw new Error("Template not found");

    const items = (template.data().items || []).map((i: ChecklistItem) =>
      i.id === item.id ? item : i
    );

    await updateDoc(doc(db, "checklist_template", templateId), {
      items,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating checklist item:", error);
    throw error;
  }
}

export async function deleteChecklistItem(templateId: string, itemId: string) {
  try {
    const template = await getDoc(doc(db, "checklist_template", templateId));
    if (!template.exists()) throw new Error("Template not found");

    const items = (template.data().items || []).filter(
      (i: ChecklistItem) => i.id !== itemId
    );

    await updateDoc(doc(db, "checklist_template", templateId), {
      items,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    throw error;
  }
}

// ==================== PSYCHOLOGY LOGS ====================

export async function addPsychologyLog(
  userId: string,
  logData: Omit<PsychologyLog, "id">
) {
  try {
    const docRef = await addDoc(collection(db, "psychology_logs"), {
      ...logData,
      userId,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding psychology log:", error);
    throw error;
  }
}

export async function getUserPsychologyLogs(
  userId: string
): Promise<PsychologyLog[]> {
  try {
    const q = query(
      collection(db, "psychology_logs"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as PsychologyLog)
    );
  } catch (error) {
    console.error("Error fetching psychology logs:", error);
    throw error;
  }
}

// ==================== FILE UPLOADS ====================

export async function uploadTradeScreenshot(
  userId: string,
  tradeId: string,
  imageUri: string
) {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `trades/${userId}/${tradeId}/${Date.now()}`
    );
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    throw error;
  }
}

export async function deleteTradeScreenshot(screenshotUrl: string) {
  try {
    const storageRef = ref(storage, screenshotUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting screenshot:", error);
    throw error;
  }
}
