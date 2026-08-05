"use client";

import { GitHubRepo } from "../types/github";

interface RepositoryListProps {
  repos: GitHubRepo[];
}

export default function RepositoryList({ repos }: RepositoryListProps) {
  if (repos.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold mb-3 border-b border-gray-100 pb-2">
        Repositories ({repos.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border border-gray-200 p-4 rounded-lg flex flex-col justify-between hover:border-gray-300 bg-white"
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

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
              {repo.language && (
                <span className="font-medium text-gray-700">
                  ⚡ {repo.language}
                </span>
              )}
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
