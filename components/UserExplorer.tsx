"use client";

import React, { useState } from "react";
import { GitHubUser, GitHubRepo } from "../types/github";
import { fetchUserProfile, fetchUserRepos } from "../lib/github";
import SearchBar from "./SearchBar";
import UserProfileCard from "./UserProfileCard";
import RepositoryList from "./RepositoryList";

export default function UserExplorer() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const [profileData, reposData] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username),
      ]);

      setUser(profileData);
      setRepos(reposData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch GitHub data");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-center">GitHub Profile Explorer</h1>

      {/* Search Input Bar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center mb-4 font-medium">{error}</p>
      )}

      {/* User Profile Card */}
      {user && <UserProfileCard user={user} />}

      {/* User Repositories List */}
      {user && <RepositoryList repos={repos} />}
    </div>
  );
}
