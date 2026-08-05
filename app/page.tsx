"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserExplorer from "../components/explorer/UserExplorer";
import UserCompare from "../components/compare/UserCompare";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"explorer" | "compare">("explorer");

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Feature Tab Views */}
        {activeTab === "explorer" && <UserExplorer />}
        {activeTab === "compare" && <UserCompare />}
      </div>
    </div>
  );
}
