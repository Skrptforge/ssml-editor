import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-audioservice-key");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing x-audioservice-key header" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { voiceTexts } = body as {
      voiceTexts: { voice_id: string; text: string }[];
    };
    
    console.log(
      "POST request to /api/voice/audioservice/generate with API key:",
      apiKey
    );

    if (!Array.isArray(voiceTexts) || voiceTexts.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'voiceTexts' in request body" },
        { status: 400 }
      );
    }

    const audioBuffers: Buffer[] = [];
    console.log("Voice texts to process:", voiceTexts);

    for (const { voice_id, text } of voiceTexts) {
      try {
        const response = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/with-timestamps`,
          { text },
          {
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
            },
            responseType: "json", // ElevenLabs returns JSON with base64 audio
          }
        );

        console.log(`Audio generated for voice_id: ${voice_id}`);
        
        // Extract the base64 audio data from the response
        const { audio_base64 } = response.data;
        if (!audio_base64) {
          throw new Error(`No audio_base64 found in response for voice_id: ${voice_id}`);
        }

        // Convert base64 to buffer
        const audioBuffer = Buffer.from(audio_base64, 'base64');
        audioBuffers.push(audioBuffer);
        
      } catch (voiceError) {
        console.error(`Error generating audio for voice_id ${voice_id}:`, voiceError);
        throw voiceError; // Re-throw to be caught by outer try-catch
      }
    }

    // Concatenate all audio buffers
    const mergedBuffer = Buffer.concat(audioBuffers);

    return new NextResponse(mergedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(mergedBuffer.byteLength),
        "Cache-Control": "no-cache", // Prevent caching of generated audio
      },
    });

  } catch (error: unknown) {
    console.error("Error in audio generation:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const errData = error.response?.data ?? { error: "Unknown Axios error" };
      console.error("Axios error details:", {
        status,
        data: errData,
        message: error.message
      });
      return NextResponse.json(errData, { status });
    }
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}