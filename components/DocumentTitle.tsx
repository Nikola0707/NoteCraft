"use client";
import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

function DocumentTitle({ id }: { id: string }) {
  const [data] = useDocumentData(doc(db, "documents", id));
  if (!data)
    return <p className="font-bold text-lg text-gray-400">Loading...</p>;

  return (
    <h2 className="font-bold text-lg text-gray-800 truncate w-96">
      {data.title}
    </h2>
  );
}

export default DocumentTitle;
