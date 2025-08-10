import { decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only intercept API routes that need ElevenLabs API key
  if (!request.nextUrl.pathname.startsWith("/api/elevenlabs")) {
    return NextResponse.next();
  }

  try {
    // Get the encrypted API key from cookie
    const encryptedKey = request.cookies.get("elevenlabs-key")?.value;

    if (!encryptedKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 401 }
      );
    }

    // Decrypt the API key
    const apiKey = decrypt(encryptedKey);

    // Clone the headers to modify them
    const requestHeaders = new Headers(request.headers);
    
    // Add the decrypted API key to headers
    requestHeaders.set("x-elevenlabs-key", apiKey);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error processing API key:", error);
    return NextResponse.json(
      { error: "Invalid API key" },
      { status: 401 }
    );
  }
}

export const config = {
  // Only run middleware on API routes that need ElevenLabs key
  matcher: '/api/elevenlabs/:path*'
}
