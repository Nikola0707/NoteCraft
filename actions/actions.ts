// SERVER ACTIONS
"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  //  If the user is not authenticated would be rendered the clerk login screen
  auth().protect();

  //   The session clams are the custumized session token in clerk
  //   https://clerk.com/docs/backend-requests/making/custom-session-token?_gl=1*qnbkan*_gcl_au*MTM3NzI4OTA2NS4xNzIxNTc2ODEw*_ga*NDM4NDA3NTEzLjE3MjE1NzY4NzQ.*_ga_1WMF5X234K*MTcyMTgxNjk4MS4yLjEuMTcyMTgxNjk5Ni4wLjAuMA..
  const { sessionClaims } = await auth();

  // create a new document to the firebase
  const documentCollectionReference = adminDb.collection("documents");
  const documentReference = await documentCollectionReference.add({
    title: "New Document",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(documentReference.id)
    .set({
      userId: sessionClaims?.id,
      role: "owner",
      createdAt: new Date(),
      roomId: documentReference.id,
    });

  return {
    docId: documentReference.id,
  };
}
