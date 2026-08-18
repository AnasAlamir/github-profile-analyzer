"use client";

import Image from "next/image";
import { GitHubUser } from "../../types/github";
import { Sparkles, StickyNote, BookOpen, Users, UserCheck, ExternalLink, Loader2 } from "lucide-react";

interface UserProfileCardProps {
  user: GitHubUser;
  onSummarize?: () => void;
  loadingSummary?: boolean;
  hasSummary?: boolean;
  onOpenNote?: () => void;
  hasNote?: boolean;
  noteContent?: string;
}

export default function UserProfileCard({
  user,
  onSummarize,
  loadingSummary,
  hasSummary,
  onOpenNote,
  hasNote,
  noteContent,
}: UserProfileCardProps) {
  return (
    <div className="border border-slate-200 p-6 rounded-xl flex flex-col items-center text-center mb-6 bg-white shadow-xs relative">
      <div className="relative mb-3">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={100}
          height={100}
          className="rounded-full ring-4 ring-slate-100 shadow-sm"
          unoptimized
        />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">{user.name || user.login}</h2>
      <a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-sm mb-3 hover:underline font-medium flex items-center gap-1"
      >
        @{user.login}
        <ExternalLink className="w-3 h-3" />
      </a>

      {user.bio && <p className="text-slate-600 text-sm mb-4 max-w-xl leading-relaxed">{user.bio}</p>}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
        {onSummarize && (
          <button
            onClick={onSummarize}
            disabled={loadingSummary || hasSummary}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs ${hasSummary
              ? "bg-purple-100 text-purple-800 border border-purple-200 cursor-default"
              : loadingSummary
                ? "bg-purple-600 text-white opacity-80 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
          >
            {loadingSummary ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating AI Summary...</span>
              </>
            ) : hasSummary ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Summary Generated</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Profile Summary</span>
              </>
            )}
          </button>
        )}

        {onOpenNote && (
          <button
            onClick={onOpenNote}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300/80 transition flex items-center gap-1.5 shadow-xs"
          >
            <StickyNote className="w-3.5 h-3.5 text-slate-600" />
            <span>{hasNote ? "Edit Note" : "Add Note"}</span>
          </button>
        )}
      </div>

      {/* Display Saved Profile Note Box */}
      {hasNote && noteContent && (
        <div className="w-full max-w-2xl bg-amber-50/90 border border-amber-200 p-3.5 rounded-lg text-left mb-5 text-xs text-amber-950 shadow-2xs">
          <span className="font-semibold flex items-center gap-1.5 text-amber-900 mb-1">
            <StickyNote className="w-3.5 h-3.5 text-amber-700" />
            Profile Note:
          </span>
          <p className="whitespace-pre-wrap leading-relaxed text-amber-900">{noteContent}</p>
        </div>
      )}

      {/* Stats Footer Grid */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 w-full max-w-md">
        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
          <BookOpen className="w-4 h-4 text-slate-500 mb-1" />
          <span className="text-base font-bold text-slate-900">{user.public_repos}</span>
          <span className="text-slate-500 font-medium text-[11px]">Repositories</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Users className="w-4 h-4 text-slate-500 mb-1" />
          <span className="text-base font-bold text-slate-900">{user.followers}</span>
          <span className="text-slate-500 font-medium text-[11px]">Followers</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
          <UserCheck className="w-4 h-4 text-slate-500 mb-1" />
          <span className="text-base font-bold text-slate-900">{user.following}</span>
          <span className="text-slate-500 font-medium text-[11px]">Following</span>
        </div>
      </div>
    </div>
  );
}
