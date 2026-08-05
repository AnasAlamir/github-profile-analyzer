"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import UserExplorer from "../components/explorer/UserExplorer";
import UserCompare from "../components/compare/UserCompare";
import UserNotes from "../components/notes/UserNotes";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"explorer" | "compare" | "notes">("explorer");

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Header Title & Short Intro */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            🚀 GitHub Profile Explorer
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search GitHub developers, explore public repositories, save notes, and compare developer metrics.
          </p>
        </div>

        {/* Top Navbar */}
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Feature Tab Views */}
        {activeTab === "explorer" && <UserExplorer />}
        {activeTab === "compare" && <UserCompare />}
        {activeTab === "notes" && <UserNotes />}
      </div>
    </div>
  );
}
