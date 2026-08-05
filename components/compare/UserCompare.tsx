"use client";

import { useState } from "react";
import { fetchUserProfile, fetchUserRepos } from "../../lib/github";
import { calculateUserMetrics, UserMetrics } from "../../lib/compare";
import CompareForm from "./CompareForm";
import CompareResults from "./CompareResults";

export default function UserCompare() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [metrics1, setMetrics1] = useState<UserMetrics | null>(null);
  const [metrics2, setMetrics2] = useState<UserMetrics | null>(null);

  const handleCompare = async (user1Name: string, user2Name: string) => {
    setLoading(true);
    setError(null);

    try {
      const [user1, repos1, user2, repos2] = await Promise.all([
        fetchUserProfile(user1Name),
        fetchUserRepos(user1Name),
        fetchUserProfile(user2Name),
        fetchUserRepos(user2Name),
      ]);

      setMetrics1(calculateUserMetrics(user1, repos1));
      setMetrics2(calculateUserMetrics(user2, repos2));
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
      <h2 className="text-xl font-bold mb-1 text-center text-gray-900">
        ⚔️ Compare GitHub Users
      </h2>
      <p className="text-xs text-gray-500 text-center mb-5">
        Compare two GitHub developers side-by-side on stars, forks, followers, and top languages.
      </p>

      {/* Comparison Input Form */}
      <CompareForm onCompare={handleCompare} loading={loading} />

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Comparison Results */}
      {metrics1 && metrics2 && (
        <CompareResults metrics1={metrics1} metrics2={metrics2} />
      )}
    </div>
  );
}
