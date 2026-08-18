"use client";

import { GitHubRepo } from "../../types/github";
import { Star, GitFork, Code2, Bot, StickyNote, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface RepositoryListProps {
  repos: GitHubRepo[];
  totalPublicRepos: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  loading: boolean;
  onSelectRepoForChat?: (repo: GitHubRepo) => void;
  onOpenRepoNote?: (repo: GitHubRepo) => void;
  repoNotesMap?: Record<string, string>;
}

export default function RepositoryList({
  repos,
  totalPublicRepos,
  currentPage,
  onPageChange,
  loading,
  onSelectRepoForChat,
  onOpenRepoNote,
  repoNotesMap = {},
}: RepositoryListProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalPublicRepos / itemsPerPage) || 1;

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-5 gap-2">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Public Repositories
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold">
            {totalPublicRepos}
          </span>
        </h3>
        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 font-medium">
          Page {currentPage} of {totalPages} (10 per page)
        </span>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-sm text-center text-blue-600 py-8 font-medium animate-pulse flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Fetching page {currentPage} repositories from GitHub...
        </div>
      )}

      {/* Empty State */}
      {!loading && repos.length === 0 && (
        <p className="text-sm text-center text-slate-500 py-8">
          No repositories found for this page.
        </p>
      )}

      {/* Repositories Grid */}
      {!loading && repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {repos.map((repo) => {
            const repoNote = repoNotesMap[repo.full_name.toLowerCase()];
            const hasNote = Boolean(repoNote);

            return (
              <div
                key={repo.id}
                className="border border-slate-200 p-5 rounded-xl flex flex-col justify-between hover:border-slate-300 bg-white shadow-2xs hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:underline text-base break-all"
                    >
                      {repo.name}
                    </a>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>

                  {/* Saved Repo Note Display */}
                  {hasNote && (
                    <div className="mt-3 text-[11px] bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-lg line-clamp-2 flex items-start gap-1.5">
                      <StickyNote className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{repoNote}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {repo.language && (
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-blue-600" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      {repo.forks_count}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {onOpenRepoNote && (
                      <button
                        onClick={() => onOpenRepoNote(repo)}
                        className="px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 transition font-medium flex items-center gap-1"
                      >
                        <StickyNote className="w-3 h-3 text-slate-500" />
                        <span>{hasNote ? "Note" : "Add Note"}</span>
                      </button>
                    )}

                    {onSelectRepoForChat && (
                      <button
                        onClick={() => onSelectRepoForChat(repo)}
                        className="px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md border border-blue-200/60 transition flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-200 pt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-semibold text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
