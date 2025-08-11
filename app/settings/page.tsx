"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ArrowLeft, Loader2, Moon, Sun, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useApiKey } from "@/lib/hooks/useApiKey";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { removeApiKey, isRemovingKey } = useApiKey();

  const handleDeleteKey = async () => {
    try {
      await removeApiKey();
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-10 w-10" />
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme mode.
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Manage your API key and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">ElevenLabs API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Remove your stored API key from this device.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteKey}
                disabled={isRemovingKey}
              >
                {isRemovingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash className="h-4 w-4 mr-2" />
                )}
                Delete Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
