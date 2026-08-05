import { GitHubUser, GitHubRepo } from "../types/github";

const BASE_URL = "https://api.github.com";

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`);
  if (!res.ok) {
    throw new Error("GitHub user not found!");
  }
  return res.json();
}

export async function fetchUserRepos(
  username: string,
  page: number = 1,
  perPage: number = 10
): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}&page=${page}`
  );
  if (!res.ok) {
    return [];
  }
  return res.json();
}
