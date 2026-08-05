"use client";

import { useState } from "react";

interface CompareFormProps {
  onCompare: (user1: string, user2: string) => void;
  loading: boolean;
}

export default function CompareForm({ onCompare, loading }: CompareFormProps) {
  const [user1Name, setUser1Name] = useState("karpathy");
  const [user2Name, setUser2Name] = useState("torvalds");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user1Name.trim() && user2Name.trim()) {
      onCompare(user1Name.trim(), user2Name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={user1Name}
        onChange={(e) => setUser1Name(e.target.value)}
        placeholder="First username..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="self-center font-bold text-gray-400">VS</span>
      <input
        type="text"
        value={user2Name}
        onChange={(e) => setUser2Name(e.target.value)}
        placeholder="Second username..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Comparing..." : "Compare"}
      </button>
    </form>
  );
}
