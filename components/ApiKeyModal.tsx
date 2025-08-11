"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/lib/hooks/useApiKey";

export function ApiKeyModal() {
  const [apiKey, setApiKey] = useState("");
  const { exists, setApiKey: saveApiKey, isLoading, error } = useApiKey();
  console.log("API Key Modal Rendered", { exists, isLoading, error });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveApiKey({ apiKey });
      setApiKey(""); // Clear input after successful save
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={!exists} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter ElevenLabs API Key</DialogTitle>
          <DialogDescription>
            Please enter your ElevenLabs API key to use the text-to-speech
            features. You can find your API key in your ElevenLabs dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="apiKey"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            disabled={isLoading}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </DialogFooter>
          <a
            href="https://elevenlabs.io/app/settings/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center block mt-2"
          >
            Don&apos;t have an API key? Get one here
          </a>
        </form>
      </DialogContent>
    </Dialog>
  );
}
