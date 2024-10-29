import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Use Clerk's auth protection to ensure the request is authenticated.
  auth().protect();

  // Retrieve the session claims from the authenticated user.
  const { sessionClaims } = await auth();

  // Extract the room information from the request body.
  const { room } = await req.json();

  // Prepare a new Liveblocks session using the user's email from the session claims.
  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      // Set the user's name in the session information.
      name: sessionClaims?.fullName!,
      // Set the user's email in the session information.
      email: sessionClaims?.email!,
      // Set the user's avatar image in the session information.
      avatar: sessionClaims?.image!,
    },
  });

  // Access the "rooms" collection group in Firestore to query user data.
  // Filter the documents where the userId matches the sessionClaims' id.
  // Execute the query and get the matching documents.
  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  // Find the specific document within the queried results where the document id matches the room id.
  const userInRoom = usersInRoom.docs.find((document) => document.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      {
        message: "You are not in this room",
      },
      { status: 403 }
    );
  }
}
