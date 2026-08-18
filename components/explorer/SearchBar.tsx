"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState("AnasAlamir");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub username (e.g. octocat, karpathy)..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-xs"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Search</span>
          </>
        )}
      </button>
    </form>
  );
}
