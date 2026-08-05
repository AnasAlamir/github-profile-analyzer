"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GitHubUser, GitHubRepo } from "../types/github";
import { fetchUserProfile, fetchUserRepos } from "../lib/github";

interface UserMetrics {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  topLanguage: string;
}

export default function UserCompare() {
  const [user1Name, setUser1Name] = useState("octocat");
  const [user2Name, setUser2Name] = useState("torvalds");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [metrics1, setMetrics1] = useState<UserMetrics | null>(null);
  const [metrics2, setMetrics2] = useState<UserMetrics | null>(null);

  // Helper function to calculate metrics from profile + repos
  const calculateMetrics = (user: GitHubUser, repos: GitHubRepo[]): UserMetrics => {
    let totalStars = 0;
    let totalForks = 0;
    const langCount: Record<string, number> = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    // Find language with highest count
    const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
    const topLanguage = sortedLangs.length > 0 ? sortedLangs[0][0] : "N/A";

    return {
      user,
      repos,
      totalStars,
      totalForks,
      topLanguage,
    };
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1Name.trim() || !user2Name.trim()) {
      setError("Please enter two usernames to compare.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch data for both users in parallel
      const [u1, r1, u2, r2] = await Promise.all([
        fetchUserProfile(user1Name.trim()),
        fetchUserRepos(user1Name.trim()),
        fetchUserProfile(user2Name.trim()),
        fetchUserRepos(user2Name.trim()),
      ]);

      setMetrics1(calculateMetrics(u1, r1));
      setMetrics2(calculateMetrics(u2, r2));
    } catch (err: any) {
      setError(err.message || "Failed to fetch user data for comparison.");
      setMetrics1(null);
      setMetrics2(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-4">
      <h2 className="text-xl font-bold mb-4 text-center">⚔️ Compare GitHub Users</h2>

      {/* Comparison Form */}
      <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={user1Name}
          onChange={(e) => setUser1Name(e.target.value)}
          placeholder="First username..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white"
        />
        <span className="self-center font-bold text-gray-400">VS</span>
        <input
          type="text"
          value={user2Name}
          onChange={(e) => setUser2Name(e.target.value)}
          placeholder="Second username..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Metrics Results */}
      {metrics1 && metrics2 && (
        <div className="border border-gray-200 rounded-lg p-4 overflow-x-auto">
          {/* Header with User Avatars */}
          <div className="grid grid-cols-3 text-center pb-4 border-b border-gray-200 items-center">
            <div className="text-left font-semibold text-gray-500 text-sm">Metric</div>
            
            {/* User 1 Header */}
            <div className="flex flex-col items-center">
              <Image
                src={metrics1.user.avatar_url}
                alt={metrics1.user.login}
                width={56}
                height={56}
                className="rounded-full mb-1"
                unoptimized
              />
              <span className="font-bold text-gray-900">{metrics1.user.name || metrics1.user.login}</span>
              <span className="text-xs text-blue-600">@{metrics1.user.login}</span>
            </div>

            {/* User 2 Header */}
            <div className="flex flex-col items-center">
              <Image
                src={metrics2.user.avatar_url}
                alt={metrics2.user.login}
                width={56}
                height={56}
                className="rounded-full mb-1"
                unoptimized
              />
              <span className="font-bold text-gray-900">{metrics2.user.name || metrics2.user.login}</span>
              <span className="text-xs text-blue-600">@{metrics2.user.login}</span>
            </div>
          </div>

          {/* Metric Comparison Rows */}
          <div className="divide-y divide-gray-100 text-sm">
            {/* Repositories */}
            <Row
              label="Public Repositories"
              val1={metrics1.user.public_repos}
              val2={metrics2.user.public_repos}
            />

            {/* Total Stars */}
            <Row
              label="Total Stars Received"
              val1={metrics1.totalStars}
              val2={metrics2.totalStars}
            />

            {/* Total Forks */}
            <Row
              label="Total Forks"
              val1={metrics1.totalForks}
              val2={metrics2.totalForks}
            />

            {/* Followers */}
            <Row
              label="Followers"
              val1={metrics1.user.followers}
              val2={metrics2.user.followers}
            />

            {/* Top Language */}
            <div className="grid grid-cols-3 py-3 items-center text-center">
              <span className="text-left font-medium text-gray-600">Top Language</span>
              <span className="font-bold text-gray-900">{metrics1.topLanguage}</span>
              <span className="font-bold text-gray-900">{metrics2.topLanguage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Row Helper Component
function Row({ label, val1, val2 }: { label: string; val1: number; val2: number }) {
  const winner = val1 > val2 ? 1 : val2 > val1 ? 2 : 0;

  return (
    <div className="grid grid-cols-3 py-3 items-center text-center">
      <span className="text-left font-medium text-gray-600">{label}</span>
      
      <span className={`font-bold ${winner === 1 ? "text-green-600 text-base" : "text-gray-900"}`}>
        {val1.toLocaleString()} {winner === 1 && "👑"}
      </span>

      <span className={`font-bold ${winner === 2 ? "text-green-600 text-base" : "text-gray-900"}`}>
        {val2.toLocaleString()} {winner === 2 && "👑"}
      </span>
    </div>
  );
}
