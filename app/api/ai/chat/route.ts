import { buildGroundedRepoPrompt } from "../../../../lib/ai";

export async function POST(req: Request) {
  try {
    const { repoName, userMessage, readme, contents, commits } = await req.json();

    if (!repoName || !userMessage) {
      return new Response(JSON.stringify({ error: "Missing repoName or userMessage" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const model = process.env.MODEL_NAME || "openai/gpt-oss-120b";

    if (!groqKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = buildGroundedRepoPrompt(
      repoName,
      userMessage,
      readme || "",
      contents || [],
      commits || []
    );

    // Call Groq API with stream: true
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful software engineering assistant grounded strictly in actual repository data.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
        temperature: 0.3,
      }),
    });

    if (!groqRes.ok || !groqRes.body) {
      return new Response(
        JSON.stringify({ error: `Groq API stream failed with status ${groqRes.status}` }),
        { status: groqRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(groqRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("AI Chat Stream Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
