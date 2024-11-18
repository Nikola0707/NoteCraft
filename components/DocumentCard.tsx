import Link from "next/link";
import DocumentTitle from "./DocumentTitle";
import { FiEdit3, FiUser } from "react-icons/fi";
import { deleteDocument } from "@/actions/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
interface DocumentCardProps {
  id: string;
  role: "owner" | "editor";
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const DocumentCard = ({ id, role, createdAt }: DocumentCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const formattedDate = new Date(createdAt.seconds * 1000).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }
  );

  return (
    <div className="flex h-24">
      <Link
        href={`/document/${id}`}
        className="bg-white border rounded-l-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      >
        <div className="p-4 flex flex-col justify-between h-full">
          {/* Title Section */}
          <div>
            <DocumentTitle id={id} />
          </div>

          {/* Footer Section */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {role === "owner" ? (
                <FiUser className="text-blue-500" />
              ) : (
                <FiEdit3 className="text-green-500" />
              )}
              <span className="capitalize">{role}</span>
            </div>

            <div className="text-gray-500 text-xs">
              Created on: <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button
          asChild
          variant="destructive"
          className="h-full rounded-l-none shadow-md hover:shadow-lg transition-shadow"
        >
          <DialogTrigger>Delete</DialogTrigger>
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you absolutely sure you want to delete?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              document and all its contents, removing all users from the
              document.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="destructive"
              // disabled={isPending}
              onClick={() => deleteDocument(id)}
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCard;
