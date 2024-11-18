// SERVER ACTIONS
"use server";

import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  //  If the user is not authenticated would be rendered the clerk login screen
  auth().protect();

  //   The session clams are the custumized session token in clerk
  //   https://clerk.com/docs/backend-requests/making/custom-session-token?_gl=1*qnbkan*_gcl_au*MTM3NzI4OTA2NS4xNzIxNTc2ODEw*_ga*NDM4NDA3NTEzLjE3MjE1NzY4NzQ.*_ga_1WMF5X234K*MTcyMTgxNjk4MS4yLjEuMTcyMTgxNjk5Ni4wLjAuMA..
  const { sessionClaims } = await auth();
  console.log("sessionClaims", sessionClaims?.email);
  // create a new document to the firebase
  const documentCollectionReference = adminDb.collection("documents");
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }); // Format the date as "Month Day, Year"

  const documentReference = await documentCollectionReference.add({
    title: `Untitled Document - ${formattedDate}`, // Set the title with the formatted date
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(documentReference.id)
    .set({
      userId: sessionClaims?.email,
      role: "owner",
      createdAt: new Date(),
      roomId: documentReference.id,
    });
  console.log("documentReference", documentReference.id);
  return {
    docId: documentReference.id,
  };
}

export async function deleteDocument(roomId: string) {
  auth().protect();
  console.log("deleteDocument", roomId);

  try {
    // delete the document reference itself
    // reference to the room id
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();
    // Delete the room reference in the user's collection for everu user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect(); // Ensure the user is authenticated

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}
