import LiveBlocksProvider from "@/components/LiveBlocksProvider";

function PageLaylout({ children }: { children: React.ReactNode }) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
export default PageLaylout;
