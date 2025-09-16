import "server-only";

import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKey = String.raw`${process.env.FIREBASE_PRIVATE_KEY!}`;

  admin.initializeApp({
    credential: admin.credential.cert({ clientEmail, privateKey, projectId }),
  });
}

export const adminAuth = admin.auth();
export const adminDatabase = admin.firestore();
