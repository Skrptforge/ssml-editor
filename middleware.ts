import { decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Run Supabase session middleware first

  console.log("working till here");
  // Only intercept voice-related API routes that need audioservice API key
  if (request.nextUrl.pathname.startsWith("/api/voice")) {
    try {
      // Get the encrypted API key from cookie
      const encryptedKey = request.cookies.get("audioservice-key")?.value;

      // Decrypt the API key
      const apiKey = encryptedKey ? decrypt(encryptedKey) : null;

      // Clone the headers to modify them
      const requestHeaders = new Headers(request.headers);

      // Add the decrypted API key to headers
      if (apiKey) requestHeaders.set("x-audioservice-key", apiKey);
      const modifiedRequest = new NextRequest(request.url, {
        method: request.method,
        headers: requestHeaders,
        body: request.body,
      });
      // Return response with modified headers
      const sessionResponse = await updateSession(modifiedRequest);
      return sessionResponse;
    } catch (error) {
      console.error("Error processing API key:", error);
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }
  }

  // Default: continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for static/image/favicon/assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
