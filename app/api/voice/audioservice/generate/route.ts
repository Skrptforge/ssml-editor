import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-audioservice-key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-audioservice-key header" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { voice_id, text } = body;

    if (!voice_id || !text) {
      return NextResponse.json({ error: "Missing 'voice_id' or 'text' in request body" }, { status: 400 });
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v2/text-to-speech/${voice_id}/with-timestamps`,
      { text },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": response.headers["content-type"] || "audio/mpeg",
        "Content-Length": response.headers["content-length"] || String(response.data.byteLength),
      },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const errData = error.response?.data ?? { error: "Unknown Axios error" };
      return NextResponse.json(errData, { status });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
