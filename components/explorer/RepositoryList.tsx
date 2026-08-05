"use client";

import { GitHubRepo } from "../../types/github";

interface RepositoryListProps {
  repos: GitHubRepo[];
  totalPublicRepos: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  loading: boolean;
  onSelectRepoForChat?: (repo: GitHubRepo) => void;
}

export default function RepositoryList({
  repos,
  totalPublicRepos,
  currentPage,
  onPageChange,
  loading,
  onSelectRepoForChat,
}: RepositoryListProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalPublicRepos / itemsPerPage) || 1;

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 mb-4 gap-1">
        <h3 className="text-lg font-bold text-gray-900">
          Public Repositories ({totalPublicRepos})
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
          Page {currentPage} of {totalPages} (10 per page)
        </span>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-sm text-center text-blue-600 py-6 font-medium animate-pulse">
          Fetching page {currentPage} repositories from GitHub...
        </p>
      )}

      {/* Empty State */}
      {!loading && repos.length === 0 && (
        <p className="text-sm text-center text-gray-500 py-6">
          No repositories found for this page.
        </p>
      )}

      {/* Repositories Grid */}
      {!loading && repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="border border-gray-200 p-4 rounded-lg flex flex-col justify-between hover:border-gray-300 bg-white shadow-xs"
            >
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline text-base break-all"
                >
                  {repo.name}
                </a>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {repo.language && (
                    <span className="font-medium text-gray-700">
                      ⚡ {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>

                {/* AI Chat Button */}
                {onSelectRepoForChat && (
                  <button
                    onClick={() => onSelectRepoForChat(repo)}
                    className="px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded transition flex items-center gap-1"
                  >
                    🤖 AI Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <span className="text-xs font-medium text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
