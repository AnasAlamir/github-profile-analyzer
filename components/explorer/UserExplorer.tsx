"use client";

import { useState } from "react";
import { GitHubUser, GitHubRepo } from "../../types/github";
import { fetchUserProfile, fetchUserRepos } from "../../lib/github";
import SearchBar from "./SearchBar";
import UserProfileCard from "./UserProfileCard";
import RepositoryList from "./RepositoryList";
import AiProfileSummary from "./AiProfileSummary";
import AiRepoChatModal from "./AiRepoChatModal";

export default function UserExplorer() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // AI Repo Chat State
  const [selectedRepoForChat, setSelectedRepoForChat] = useState<GitHubRepo | null>(null);

  // Search user profile and fetch page 1 of repos
  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    setAiSummary(null);
    setCurrentPageNumber(1);

    try {
      const [profileData, page1Repos] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username, 1, 10),
      ]);

      setUser(profileData);
      setRepos(page1Repos);
    } catch (err: any) {
      setError(err.message || "Failed to fetch GitHub data");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific page on demand when user clicks Previous or Next
  const handlePageChange = async (newPageNumber: number) => {
    if (!user) return;

    setLoadingRepos(true);
    setCurrentPageNumber(newPageNumber);

    try {
      const itemsPerPage = 10;
      const pageRepos = await fetchUserRepos(user.login, newPageNumber, itemsPerPage);
      setRepos(pageRepos);
    } catch (err) {
      console.error("Failed to load page repositories", err);
    } finally {
      setLoadingRepos(false);
    }
  };

  // Generate AI Profile Summary
  const handleGenerateSummary = async () => {
    if (!user || aiSummaryLoading || aiSummary) return;

    setAiSummaryLoading(true);
    setAiSummary(null);

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, repos }),
      });

      const data = await response.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        setAiSummary("Could not generate AI profile summary.");
      }
    } catch (err) {
      setAiSummary("Failed to reach AI summary service.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-1 text-center text-gray-900">
        🔍 Profile Explorer
      </h2>
      <p className="text-xs text-gray-500 text-center mb-5">
        Enter a GitHub username below to view their profile, stats, and public repositories.
      </p>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <p className="text-red-600 text-sm text-center mb-4 font-medium">{error}</p>
      )}

      {user && (
        <UserProfileCard
          user={user}
          onSummarize={handleGenerateSummary}
          loadingSummary={aiSummaryLoading}
          hasSummary={Boolean(aiSummary)}
        />
      )}

      {/* AI Profile Summary View */}
      <AiProfileSummary
        summary={aiSummary}
        loading={aiSummaryLoading}
        onClose={() => setAiSummary(null)}
      />

      {user && (
        <RepositoryList
          repos={repos}
          totalPublicRepos={user.public_repos}
          currentPage={currentPageNumber}
          onPageChange={handlePageChange}
          loading={loadingRepos}
          onSelectRepoForChat={(repo) => setSelectedRepoForChat(repo)}
        />
      )}

      {/* Grounded AI Repository Chat Modal */}
      {selectedRepoForChat && (
        <AiRepoChatModal
          repo={selectedRepoForChat}
          onClose={() => setSelectedRepoForChat(null)}
        />
      )}
    </div>
  );
}
