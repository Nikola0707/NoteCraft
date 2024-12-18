"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { DocumentData } from "firebase-admin/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewDocumentButton from "@/components/NewDocumentButton";
import DocumentCard from "@/components/DocumentCard";
import EmptyDocumentMessage from "@/components/EmptyDocumentMessage";
import TabSelector from "@/components/TabSelector";
import DocumentsNotFound from "@/components/DocumentsNotFound";

interface RoomDocument extends DocumentData {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

export default function Home() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [data, loading, error] = useCollection(
    user?.emailAddresses?.[0]
      ? query(
          collectionGroup(db, "rooms"),
          where("userId", "==", user.emailAddresses[0].toString())
        )
      : null
  );
  // Effect for grouping documents based on role
  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        const document = { id: curr.id, ...roomData };

        if (roomData.role === "owner") {
          acc.owner.push(document);
        } else {
          acc.editor.push(document);
        }
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const hasDocuments =
    groupedData.owner.length > 0 || groupedData.editor.length > 0;

  // Function to render documents based on the active tab
  const renderDocuments = useCallback(() => {
    let documentsToShow = [];

    switch (activeTab) {
      case "my-documents":
        documentsToShow = groupedData.owner;
        break;
      case "shared-with-me":
        documentsToShow = groupedData.editor;
        break;
      default:
        documentsToShow = [...groupedData.owner, ...groupedData.editor];
    }

    if (activeTab === "my-documents" && documentsToShow.length === 0) {
      return (
        <EmptyDocumentMessage
          message="Get started with creating a New Document!"
          button={<NewDocumentButton />}
        />
      );
    }

    if (activeTab === "shared-with-me" && documentsToShow.length === 0) {
      return <DocumentsNotFound />;
    }
    console.log("documentsToShow", documentsToShow);
    return documentsToShow.map((document) => (
      <DocumentCard
        key={document.id}
        id={document.id}
        role={document.role}
        createdAt={document.createdAt}
      />
    ));
  }, [activeTab, groupedData]);
  return (
    <main className="p-6 h-full">
      {!hasDocuments ? (
        <EmptyDocumentMessage
          message="Get started with creating a New Document!"
          button={<NewDocumentButton />}
        />
      ) : (
        <div>
          {/* Tab Selector */}
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Document List */}
          <div className="space-y-2">
            {loading ? (
              <p>Loading documents...</p>
            ) : (
              <div className="flex flex-col gap-2">{renderDocuments()}</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
