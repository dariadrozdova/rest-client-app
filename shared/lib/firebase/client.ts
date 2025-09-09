"use client";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

export const app = getApps().length ? getApps()[0] : initializeApp(cfg);
export const auth = getAuth(app);
