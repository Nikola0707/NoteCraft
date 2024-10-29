import DocumentTitle from "./DocumentTitle";

interface DocumentCardProps {
  id: string;
  role: "owner" | "editor";
}

const DocumentCard = ({ id, role }: DocumentCardProps) => (
  <div className="bg-white p-2 border border-black rounded-md">
    <DocumentTitle href={`/document/${id}`} id={id} role={role} />
  </div>
);

export default DocumentCard;
