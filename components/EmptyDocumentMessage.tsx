import { ArrowLeftCircle } from "lucide-react";

interface EmptyDocumentMessageProps {
  message: string;
  button: React.ReactNode;
}

const EmptyDocumentMessage = ({
  message,
  button,
}: EmptyDocumentMessageProps) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="flex items-center space-x-2 animate-pulse">
      <ArrowLeftCircle className="w-12 h-12" />
      <h1 className="font-bold text-xl">{message}</h1>
    </div>
    {button}
  </div>
);

export default EmptyDocumentMessage;
