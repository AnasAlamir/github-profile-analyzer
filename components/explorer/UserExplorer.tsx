"use client";

import { useState, useEffect } from "react";
import { GitHubUser, GitHubRepo } from "../../types/github";
import { fetchUserProfile, fetchUserRepos } from "../../lib/github";
import {
  getProfileNote,
  saveProfileNote,
  getRepoNote,
  saveRepoNote,
  getAllRepoNotes,
} from "../../lib/notes";
import SearchBar from "./SearchBar";
import UserProfileCard from "./UserProfileCard";
import RepositoryList from "./RepositoryList";
import AiProfileSummary from "./AiProfileSummary";
import AiRepoChatModal from "./AiRepoChatModal";
import NotesModal from "../common/NotesModal";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 10;

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

  // Notes Modal State
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesModalTitle, setNotesModalTitle] = useState("");
  const [notesModalInitialNote, setNotesModalInitialNote] = useState("");
  const [notesModalSaveHandler, setNotesModalSaveHandler] = useState<
    (note: string) => void
  >(() => () => { });
  const [currentProfileNote, setCurrentProfileNote] = useState("");
  const [repoNotesMap, setRepoNotesMap] = useState<Record<string, string>>({});

  // Reload notes state
  const refreshNotes = () => {
    if (user) {
      setCurrentProfileNote(getProfileNote(user.login));
    }
    setRepoNotesMap(getAllRepoNotes());
  };

  useEffect(() => {
    refreshNotes();
  }, [user]);

  // Search user profile and fetch page 1 of repos
  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    setAiSummary(null);
    setCurrentPageNumber(1);

    try {
      const [profileData, page1Repos] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username, 1, ITEMS_PER_PAGE),
      ]);

      setUser(profileData);
      setRepos(page1Repos);
      setCurrentProfileNote(getProfileNote(profileData.login));
      setRepoNotesMap(getAllRepoNotes());
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
      const pageRepos = await fetchUserRepos(user.login, newPageNumber, ITEMS_PER_PAGE);
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

  // Open Notes Modal for User Profile
  const handleOpenProfileNote = () => {
    if (!user) return;
    setNotesModalTitle(`Profile @${user.login}`);
    setNotesModalInitialNote(getProfileNote(user.login));
    setNotesModalSaveHandler(() => (content: string) => {
      saveProfileNote(user.login, content);
      setCurrentProfileNote(content);
      setNotesModalOpen(false);
    });
    setNotesModalOpen(true);
  };

  // Open Notes Modal for Repository
  const handleOpenRepoNote = (repo: GitHubRepo) => {
    setNotesModalTitle(`Repo ${repo.full_name}`);
    setNotesModalInitialNote(getRepoNote(repo.full_name));
    setNotesModalSaveHandler(() => (content: string) => {
      saveRepoNote(repo.full_name, content);
      setRepoNotesMap(getAllRepoNotes());
      setNotesModalOpen(false);
    });
    setNotesModalOpen(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span>Profile Explorer</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter a GitHub username below to view their profile, stats, and public repositories.
        </p>
      </div>

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
          onOpenNote={handleOpenProfileNote}
          hasNote={Boolean(currentProfileNote)}
          noteContent={currentProfileNote}
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
          onOpenRepoNote={handleOpenRepoNote}
          repoNotesMap={repoNotesMap}
        />
      )}

      {/* Grounded AI Repository Chat Modal */}
      {selectedRepoForChat && (
        <AiRepoChatModal
          repo={selectedRepoForChat}
          onClose={() => setSelectedRepoForChat(null)}
        />
      )}

      {/* Notes Modal */}
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title={notesModalTitle}
        initialNote={notesModalInitialNote}
        onSave={notesModalSaveHandler}
      />
    </div>
  );
}
