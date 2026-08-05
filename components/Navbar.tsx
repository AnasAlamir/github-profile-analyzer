"use client";

interface NavbarProps {
  activeTab: "explorer" | "compare" | "notes";
  onTabChange: (tab: "explorer" | "compare" | "notes") => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <div className="flex justify-center gap-2 mb-6 bg-gray-200 p-1 rounded-lg w-max mx-auto">
      <button
        onClick={() => onTabChange("explorer")}
        className={`px-4 py-2 rounded-md font-medium text-sm transition ${
          activeTab === "explorer"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        🔍 Profile Explorer
      </button>
      <button
        onClick={() => onTabChange("compare")}
        className={`px-4 py-2 rounded-md font-medium text-sm transition ${
          activeTab === "compare"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        ⚔️ Compare Users
      </button>
      <button
        onClick={() => onTabChange("notes")}
        className={`px-4 py-2 rounded-md font-medium text-sm transition ${
          activeTab === "notes"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        📝 Saved Notes
      </button>
    </div>
  );
}
