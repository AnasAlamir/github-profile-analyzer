import { GitHubUser, GitHubRepo } from "../types/github";

/**
 * Generate AI Summary & Analysis for a GitHub Profile using Groq API
 */
export async function getAiProfileSummary(
  user: GitHubUser,
  repos: GitHubRepo[]
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;

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

  // 1. Groq API (Super fast & generous rate limits via Llama-3)
  if (groqKey) {
    try {
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

      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
    } catch (err) {
      console.error("Groq API error, attempting fallback", err);
    }
  }

  // 2. Fallback smart analysis when no API key is configured
  const languagesCount: Record<string, number> = {};
  let totalStars = 0;
  repos.forEach((r) => {
    totalStars += r.stargazers_count;
    if (r.language) {
      languagesCount[r.language] = (languagesCount[r.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(languagesCount)
    .sort(([, a], [, b]) => b - a)
    .map(([lang]) => lang);

  const topLanguagesText = sortedLangs.slice(0, 3).join(", ") || "General Software Engineering";

  return `### Executive Summary
${user.name || user.login} is an active GitHub contributor with ${user.public_repos} public repositories and ${totalStars} total stars. Primary expertise is focused around ${topLanguagesText}.

### Key Technical Strengths
* **Primary Technologies:** ${topLanguagesText}
* **Open Source Footprint:** ${repos.length} repositories analyzed
* **Community Activity:** ${user.followers} followers

### Portfolio Highlights
${topRepos
  .slice(0, 3)
  .map(
    (r) =>
      `* **${r.name}** (${r.language || "General"} | ⭐ ${r.stars}): ${
        r.description || "Active open-source project"
      }`
  )
  .join("\n")}`;
}
