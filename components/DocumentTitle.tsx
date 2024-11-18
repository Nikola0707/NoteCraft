"use client";
import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";

function DocumentTitle({
  href,
  id,
  role,
}: {
  href: string;
  id: string;
  role: string;
}) {
  const [data] = useDocumentData(doc(db, "documents", id));
  if (!data) return null;

  return (
    <Link href={href} className="truncate block w-28">
      {data.title} - <span className="capitalize">{role}</span>
    </Link>
  );
}

export default DocumentTitle;
