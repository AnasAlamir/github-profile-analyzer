import { NextResponse } from "next/server";
import { getAiProfileSummary } from "../../../../lib/ai";

export async function POST(req: Request) {
  try {
    const { user, repos } = await req.json();

    if (!user || !repos) {
      return NextResponse.json(
        { error: "User profile and repositories data are required." },
        { status: 400 }
      );
    }

    const summary = await getAiProfileSummary(user, repos);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("API AI Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI profile summary." },
      { status: 500 }
    );
  }
}
