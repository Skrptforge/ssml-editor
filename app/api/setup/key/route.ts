import { encrypt } from "@/lib/encryption";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Set the encrypted key in an HTTP-only cookie
    // Cookie expires in 30 days
    const response = NextResponse.json({ success: true });
    response.cookies.set("audioservice-key", encryptedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (error) {
    console.error("Error setting API key:", error);
    return NextResponse.json(
      { error: "Failed to set API key" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear the API key cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("audioservice-key", "", { maxAge: 0 });
  return response;
}
