"use client";

import Image from "next/image";
import { GitHubUser } from "../../types/github";

interface CompareUserHeaderProps {
  user: GitHubUser;
}

export default function CompareUserHeader({ user }: CompareUserHeaderProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={56}
        height={56}
        className="rounded-full mb-1"
        unoptimized
      />
      <span className="font-bold text-gray-900">
        {user.name || user.login}
      </span>
      <span className="text-xs text-blue-600">@{user.login}</span>
    </div>
  );
}
