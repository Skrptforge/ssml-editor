import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-audioservice-key");
    if (!apiKey) {
      return NextResponse.json({ error: "No API key found" }, { status: 401 });
    }
    return NextResponse.json({ exists: true });
  } catch (error) {
    console.error("Error checking API key:", error);
    return NextResponse.json(
      { error: "Failed to check API key" },
      { status: 500 }
    );
  }
}
