"use client";

import { Crown } from "lucide-react";

interface CompareRowProps {
  label: string;
  val1: number;
  val2: number;
}

export default function CompareRow({ label, val1, val2 }: CompareRowProps) {
  const isUser1Winner = val1 > val2;
  const isUser2Winner = val2 > val1;

  return (
    <div className="grid grid-cols-3 py-3 items-center text-center text-sm border-b border-slate-100">
      <span className="text-left font-semibold text-slate-700">{label}</span>

      <div className={`font-bold flex items-center justify-center gap-1.5 ${isUser1Winner ? "text-emerald-600 text-base" : "text-slate-900"}`}>
        <span>{val1.toLocaleString()}</span>
        {isUser1Winner && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
      </div>

      <div className={`font-bold flex items-center justify-center gap-1.5 ${isUser2Winner ? "text-emerald-600 text-base" : "text-slate-900"}`}>
        <span>{val2.toLocaleString()}</span>
        {isUser2Winner && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
      </div>
    </div>
  );
}
