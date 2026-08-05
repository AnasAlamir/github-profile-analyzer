import { GitHubUser, GitHubRepo, GitHubCommit, GitHubContentItem } from "../types/github";

/**
 * Generate AI Summary & Analysis for a GitHub Profile using Groq API
 */
export async function getAiProfileSummary(
  user: GitHubUser,
  repos: GitHubRepo[]
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error("GROQ_API_KEY is not configured in .env.local");
  }

  // Extract top repository metadata for the AI prompt
  const topRepos = repos.slice(0, 10).map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
  }));

  const promptText = `Summarize and analyze this GitHub developer profile. 
Format your response STRICTLY in Markdown using "###" for section titles and "*" for bullet lists. Include 3 sections: Executive Summary, Key Technical Strengths, and Portfolio Highlights.

Developer: ${user.name || user.login} (@${user.login})
Bio: ${user.bio || "None"}
Public Repos: ${user.public_repos}, Followers: ${user.followers}
Top Repositories: ${JSON.stringify(topRepos)}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer and software career analyzer.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response returned from Groq API");
  }

  return content;
}

/**
 * Format Grounded Prompt for Repository Chat Assistant
 */
export function buildGroundedRepoPrompt(
  repoName: string,
  userMessage: string,
  readme: string,
  contents: GitHubContentItem[],
  commits: GitHubCommit[]
): string {
  const treeSummary = contents
    .slice(0, 15)
    .map((item) => `- ${item.path} (${item.type})`)
    .join("\n");

  const commitSummary = commits
    .slice(0, 5)
    .map((c) => `- "${c.commit.message}" by ${c.commit.author.name}`)
    .join("\n");

  const readmeSnippet = readme.slice(0, 1500);

  return `You are a helpful software engineering AI assistant answering questions about the repository "${repoName}".
Your answers MUST be grounded in the following actual repository data:

=== REPOSITORY DIRECTORY STRUCTURE ===
${treeSummary || "No directory listing available"}

=== RECENT COMMITS ===
${commitSummary || "No recent commits found"}

=== README DOCUMENTATION ===
${readmeSnippet}

=== USER QUESTION ===
${userMessage}

Please answer accurately and concisely based strictly on the above repository data.`;
}
