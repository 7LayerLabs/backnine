import { init, tx, id } from "@instantdb/admin";

// Initialize InstantDB Admin SDK for server-side operations
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

export const adminDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
});

export { tx, id };
