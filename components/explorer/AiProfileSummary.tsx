"use client";

import ReactMarkdown from "react-markdown";

interface AiProfileSummaryProps {
  summary: string | null;
  loading: boolean;
  onClose: () => void;
}

export default function AiProfileSummary({
  summary,
  loading,
  onClose,
}: AiProfileSummaryProps) {
  if (!summary && !loading) return null;

  return (
    <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-5 mb-6 shadow-xs relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
          ✨ AI Profile Insights & Analysis
        </h3>
        <button
          onClick={onClose}
          className="text-purple-400 hover:text-purple-700 text-lg font-bold px-1"
        >
          &times;
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-purple-700 text-xs py-3 font-medium">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Generating AI profile summary & insights...
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-purple-100 text-xs text-gray-800 space-y-2 [&_h3]:font-bold [&_h3]:text-purple-900 [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:border-b [&_h3]:border-purple-100 [&_h3]:pb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-1">
          <ReactMarkdown>{summary || ""}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
