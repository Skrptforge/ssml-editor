import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { AxiosError } from "axios";
import { VoiceData } from "@/lib/types/voice";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-audioservice-key");
    const nextPageToken = request.nextUrl.searchParams.get("nextPageToken");
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }
    const response = await axios.get<VoiceData>(
      `https://api.elevenlabs.io/v2/voices?next_page_token=${
        nextPageToken || ""
      }&page_size=20`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );
    const data: VoiceData = response.data;
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        error.response?.data || { error: "Request failed" },
        { status: error.response?.status || 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
