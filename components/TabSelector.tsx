interface TabSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const TabSelector = ({ activeTab, setActiveTab }: TabSelectorProps) => (
  <div className="flex space-x-4 border-b pb-2 mb-4">
    {["all", "my-documents", "shared-with-me"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 font-semibold ${
          activeTab === tab
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
        }`}
      >
        {tab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </button>
    ))}
  </div>
);
export default TabSelector;
