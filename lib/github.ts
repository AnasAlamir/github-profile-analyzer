import { GitHubUser, GitHubRepo, GitHubCommit, GitHubContentItem } from "../types/github";

const BASE_URL = "https://api.github.com";

// Helper headers for GitHub API
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
  }

  return headers;
}

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`, {
    headers: getHeaders(),
  });
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
    `${BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}&page=${page}`,
    { headers: getHeaders() }
  );
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`, {
      headers: {
        ...getHeaders(),
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!res.ok) {
      return "No README file found for this repository.";
    }

    return await res.text();
  } catch (err) {
    return "Could not load README content.";
  }
}

// Fetch recent 5 commits of a repository
export async function fetchRepoCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
  try {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits?per_page=5`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    return [];
  }
}

// Fetch top-level file structure of a repository
export async function fetchRepoContents(owner: string, repo: string): Promise<GitHubContentItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    return [];
  }
}
