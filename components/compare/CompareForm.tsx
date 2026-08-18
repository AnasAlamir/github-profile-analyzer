"use client";

import { useState } from "react";
import { GitCompare, Loader2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 mb-6 max-w-3xl mx-auto">
      <input
        type="text"
        value={user1Name}
        onChange={(e) => setUser1Name(e.target.value)}
        placeholder="First GitHub username..."
        className="w-full sm:flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
      />
      <span className="font-extrabold text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
        VS
      </span>
      <input
        type="text"
        value={user2Name}
        onChange={(e) => setUser2Name(e.target.value)}
        placeholder="Second GitHub username..."
        className="w-full sm:flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
      />
      <button
        type="submit"
        disabled={loading || !user1Name.trim() || !user2Name.trim()}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-xs"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Comparing...</span>
          </>
        ) : (
          <>
            <GitCompare className="w-4 h-4" />
            <span>Compare</span>
          </>
        )}
      </button>
    </form>
  );
}
