"use client";

import { UserMetrics } from "../../lib/compare";
import CompareUserHeader from "./CompareUserHeader";
import CompareRow from "./CompareRow";

interface CompareResultsProps {
  metrics1: UserMetrics;
  metrics2: UserMetrics;
}

export default function CompareResults({ metrics1, metrics2 }: CompareResultsProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 overflow-x-auto bg-white">
      {/* Header Row with User Avatars */}
      <div className="grid grid-cols-3 text-center pb-4 border-b border-gray-200 items-center">
        <div className="text-left font-semibold text-gray-500 text-sm">Metric</div>
        <CompareUserHeader user={metrics1.user} />
        <CompareUserHeader user={metrics2.user} />
      </div>

      {/* Metric Comparison Table Rows */}
      <div className="divide-y divide-gray-100 text-sm">
        <CompareRow
          label="Public Repositories"
          val1={metrics1.user.public_repos}
          val2={metrics2.user.public_repos}
        />
        <CompareRow
          label="Total Stars Received"
          val1={metrics1.totalStars}
          val2={metrics2.totalStars}
        />
        <CompareRow
          label="Total Forks"
          val1={metrics1.totalForks}
          val2={metrics2.totalForks}
        />
        <CompareRow
          label="Followers"
          val1={metrics1.user.followers}
          val2={metrics2.user.followers}
        />

        {/* Top Language Row */}
        <div className="grid grid-cols-3 py-3 items-center text-center">
          <span className="text-left font-medium text-gray-600">Top Language</span>
          <span className="font-bold text-gray-900">{metrics1.topLanguage}</span>
          <span className="font-bold text-gray-900">{metrics2.topLanguage}</span>
        </div>
      </div>
    </div>
  );
}
