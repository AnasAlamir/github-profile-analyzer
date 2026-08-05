import { GitHubUser, GitHubRepo } from "../types/github";

export interface UserMetrics {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  topLanguage: string;
}

export function calculateUserMetrics(user: GitHubUser, repos: GitHubRepo[]): UserMetrics {
  let totalStars = 0;
  let totalForks = 0;
  const languageCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });
  const sortedLanguages = Object.entries(languageCounts).sort(([, countA], [, countB]) => countB - countA);
  const topLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : "N/A";

  return {
    user,
    repos,
    totalStars,
    totalForks,
    topLanguage,
  };
}
