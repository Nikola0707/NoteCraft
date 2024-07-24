import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

function DocumentLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  auth().protect();
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
export default DocumentLayout;
