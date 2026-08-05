"use client";

import Image from "next/image";
import { GitHubUser } from "../../types/github";

interface UserProfileCardProps {
  user: GitHubUser;
  onSummarize?: () => void;
  loadingSummary?: boolean;
  hasSummary?: boolean;
}

export default function UserProfileCard({
  user,
  onSummarize,
  loadingSummary,
  hasSummary,
}: UserProfileCardProps) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center text-center mb-6 bg-white relative">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={96}
        height={96}
        className="rounded-full mb-3"
        unoptimized
      />
      <h2 className="text-xl font-bold">{user.name || user.login}</h2>
      <a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-sm mb-2 hover:underline font-medium"
      >
        @{user.login}
      </a>
      {user.bio && <p className="text-gray-600 text-sm mb-3">{user.bio}</p>}

      {/* AI Summary Button - Disabled when loading or when summary is already generated */}
      {onSummarize && (
        <button
          onClick={onSummarize}
          disabled={loadingSummary || hasSummary}
          className={`mb-4 px-3.5 py-1.5 text-xs font-medium rounded shadow-xs transition flex items-center gap-1.5 ${
            hasSummary
              ? "bg-purple-100 text-purple-800 border border-purple-200 cursor-default"
              : loadingSummary
              ? "bg-purple-400 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {loadingSummary ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Summary...
            </>
          ) : hasSummary ? (
            "✨ Summary Generated"
          ) : (
            "✨ AI Profile Summary"
          )}
        </button>
      )}

      <div className="flex gap-6 text-sm font-semibold border-t border-gray-100 pt-3 w-full justify-center">
        <div>
          <span className="block text-gray-900">{user.public_repos}</span>
          <span className="text-gray-500 font-normal text-xs">Repos</span>
        </div>
        <div>
          <span className="block text-gray-900">{user.followers}</span>
          <span className="text-gray-500 font-normal text-xs">Followers</span>
        </div>
        <div>
          <span className="block text-gray-900">{user.following}</span>
          <span className="text-gray-500 font-normal text-xs">Following</span>
        </div>
      </div>
    </div>
  );
}
