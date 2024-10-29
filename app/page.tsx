"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { DocumentData } from "firebase-admin/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewDocumentButton from "@/components/NewDocumentButton";
import DocumentTitle from "@/components/DocumentTitle";
import DocumentCard from "@/components/DocumentCard";
import EmptyDocumentMessage from "@/components/EmptyDocumentMessage";
import TabSelector from "@/components/TabSelector";

interface RoomDocument extends DocumentData {
  createdAt: string;
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
      return (
        <h1 className="font-bold text-xl">
          No documents have been shared with you yet.
        </h1>
      );
    }

    return documentsToShow.map((document) => (
      <DocumentCard key={document.id} id={document.id} role={document.role} />
    ));
  }, [activeTab, groupedData]);

  return (
    <main className="p-6">
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
            {loading ? <p>Loading documents...</p> : renderDocuments()}
          </div>
        </div>
      )}
    </main>
  );
}
