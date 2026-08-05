"use client";

import Image from "next/image";
import { GitHubUser } from "../../types/github";

interface UserProfileCardProps {
  user: GitHubUser;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg flex flex-col items-center text-center mb-6 bg-white">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={96}
        height={96}
        className="rounded-full mb-3"
        unoptimized
      />
      <h2 className="text-xl font-bold">{user.name || user.login}</h2>
      <a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-sm mb-2 hover:underline font-medium"
      >
        @{user.login}
      </a>
      {user.bio && <p className="text-gray-600 text-sm mb-4">{user.bio}</p>}

      <div className="flex gap-6 text-sm font-semibold border-t border-gray-100 pt-3 w-full justify-center">
        <div>
          <span className="block text-gray-900">{user.public_repos}</span>
          <span className="text-gray-500 font-normal text-xs">Repos</span>
        </div>
        <div>
          <span className="block text-gray-900">{user.followers}</span>
          <span className="text-gray-500 font-normal text-xs">Followers</span>
        </div>
        <div>
          <span className="block text-gray-900">{user.following}</span>
          <span className="text-gray-500 font-normal text-xs">Following</span>
        </div>
      </div>
    </div>
  );
}
