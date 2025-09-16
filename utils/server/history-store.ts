import { adminDatabase } from "@/shared/lib/firebase/admin";

export interface HistoryEntry {
  body?: string;
  duration: number;
  error?: string;
  headers?: Record<string, string>;
  method: string;
  requestSize: number;
  responseSize: number;
  status: number;
  statusText: string;
  timestamp: number;
  url: string;
}

export type HistoryWithId = HistoryEntry & { id: string };

export async function addHistory(
  uid: string,
  entry: HistoryEntry,
): Promise<string> {
  const reference = adminDatabase
    .collection("users")
    .doc(uid)
    .collection("history")
    .doc();
  await reference.set(entry);
  return reference.id;
}

export async function getHistory(uid: string): Promise<HistoryWithId[]> {
  const snap = await adminDatabase
    .collection("users")
    .doc(uid)
    .collection("history")
    .orderBy("timestamp", "desc")
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
