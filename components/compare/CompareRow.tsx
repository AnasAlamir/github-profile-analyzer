"use client";

interface CompareRowProps {
  label: string;
  val1: number;
  val2: number;
}

export default function CompareRow({ label, val1, val2 }: CompareRowProps) {
  const isUser1Winner = val1 > val2;
  const isUser2Winner = val2 > val1;

  return (
    <div className="grid grid-cols-3 py-3 items-center text-center">
      <span className="text-left font-medium text-gray-600">{label}</span>

      <span className={`font-bold ${isUser1Winner ? "text-green-600 text-base" : "text-gray-900"}`}>
        {val1.toLocaleString()} {isUser1Winner && "👑"}
      </span>

      <span className={`font-bold ${isUser2Winner ? "text-green-600 text-base" : "text-gray-900"}`}>
        {val2.toLocaleString()} {isUser2Winner && "👑"}
      </span>
    </div>
  );
}
