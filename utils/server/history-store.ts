import { firestoreAdmin } from "@/shared/lib/firebase/admin";

export interface HistoryDatabaseEntry {
  body?: null | string;
  duration: number;
  error?: null | string;
  headers?: Record<string, string>;
  id?: string;
  method: string;
  requestSize: number;
  responseSize: number;
  status: number;
  statusText?: string;
  timestamp: string;
  url: string;
}

const ROOT_COLLECTION = "history";
const HISTORY_LIMIT = 200;

export async function addHistoryEntry(
  uid: string,
  entry: Omit<HistoryDatabaseEntry, "id">,
) {
  const documentReference = await firestoreAdmin
    .collection(ROOT_COLLECTION)
    .doc(uid)
    .collection("entries")
    .add(entry);
  return documentReference.id;
}

export async function getUserHistory(
  uid: string,
): Promise<HistoryDatabaseEntry[]> {
  const snap = await firestoreAdmin
    .collection(ROOT_COLLECTION)
    .doc(uid)
    .collection("entries")
    .orderBy("timestamp", "desc")
    .limit(HISTORY_LIMIT)
    .get();
  return snap.docs.map((document_) => {
    const data = document_.data();
    return {
      id: document_.id,
      body: data.body,
      duration: data.duration,
      error: data.error,
      headers: data.headers,
      method: data.method,
      requestSize: data.requestSize,
      responseSize: data.responseSize,
      status: data.status,
      statusText: data.statusText,
      timestamp: data.timestamp,
      url: data.url,
    };
  });
}
