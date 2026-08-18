"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import UserExplorer from "../components/explorer/UserExplorer";
import UserCompare from "../components/compare/UserCompare";
import UserNotes from "../components/notes/UserNotes";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"explorer" | "compare" | "notes">("explorer");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Dark Blue Header Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Wide Content Area - Preserve state across tab switches */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className={activeTab === "explorer" ? "block" : "hidden"}>
          <UserExplorer />
        </div>
        <div className={activeTab === "compare" ? "block" : "hidden"}>
          <UserCompare />
        </div>
        <div className={activeTab === "notes" ? "block" : "hidden"}>
          <UserNotes />
        </div>
      </main>
    </div>
  );
}
