"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import { Voice } from "@/lib/types/voice";
import { VoiceList } from "./VoiceList";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface VoiceCardProps {
  voice: Voice;
  currentlyPlaying: string | null;
  onPlayPause: (voiceId: string, previewUrl: string) => void;
  onSelectVoice: (voiceId: string, voiceName: string) => void;
  currentVoiceId?: string;
}

export function VoiceCard({
  voice,
  currentlyPlaying,
  onPlayPause,
  onSelectVoice,
  currentVoiceId,
}: VoiceCardProps) {
  const isPlaying = currentlyPlaying === voice.voice_id;

  const handleCardClick = () => {
    onSelectVoice(voice.voice_id, voice.name);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`group ${
        currentVoiceId === voice.voice_id &&
        "border light:border-gray-950 dark:border-gray-200"
      } relative overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out hover:border-primary/30 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border border-border/50`}
    >
      <CardContent >
        {/* Compact Header Section */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            {/* Avatar */}
            <Avatar className="h-8 w-8 border border-border/50">
              <AvatarImage
                alt={voice.name}
              />
              <AvatarFallback>
                {voice.name?.[0]?.toUpperCase() || "V"}
              </AvatarFallback>
            </Avatar>

            {/* Voice Info */}
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300 ease-in-out">
                {voice.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {voice.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Compact Play/Pause Button */}
          <Button
            size="sm"
            variant={isPlaying ? "default" : "ghost"}
            className={`
              h-8 w-8 p-0 shrink-0 rounded-full transition-all duration-300 ease-in-out
              ${
                isPlaying
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-110"
                  : "hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/30"
              }
              group-hover:scale-125 hover:shadow-lg
            `}
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering select
              onPlayPause(voice.voice_id, voice.preview_url);
            }}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 transition-transform duration-200 ease-in-out" />
            ) : (
              <Play className="h-3 w-3 ml-0.5 transition-transform duration-200 ease-in-out" />
            )}
          </Button>
        </div>

        {/* Compact Labels Section */}
        <div className="flex flex-wrap gap-1 mt-2">
          {voice.labels?.gender && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span className="capitalize">{voice.labels.gender}</span>
            </Badge>
          )}
          {voice.labels?.age && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span className="capitalize">{voice.labels.age}</span>
            </Badge>
          )}
          {voice.labels?.accent && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span className="capitalize">{voice.labels.accent}</span>
            </Badge>
          )}
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-20 transition-all duration-500 ease-in-out pointer-events-none" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-20 transition-all duration-500 ease-in-out pointer-events-none blur-sm -z-10 group-hover:animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-20 transition-all duration-700 ease-in-out pointer-events-none transform -translate-x-full group-hover:translate-x-full" />
      </CardContent>
    </Card>
  );
}

export function VoicesDialog({
  onSelectVoice,
  currentVoiceId,
}: {
  onSelectVoice: (voiceId: string, voiceName: string) => void;
  currentVoiceId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Volume2 className="w-4 h-4" />
          Select Voice
        </Button>
      </DialogTrigger>

      <VoiceList
        currentVoiceId={currentVoiceId}
        onSelectVoice={onSelectVoice}
      />
    </Dialog>
  );
}
