import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useVoices } from "@/lib/hooks/useVoices";
import { VoiceCard } from "./VoiceDialog";

interface VoicesGridProps {
  searchQuery: string;
  genderFilter: string;
  onSelectVoice: (voiceId: string, voiceName: string) => void;
  currentVoiceId?: string;
}

export function VoicesGrid({
  searchQuery,
  genderFilter,
  onSelectVoice,
  currentVoiceId,
}: VoicesGridProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useVoices();
  const allVoices = data?.pages.flatMap((page) => page.voices) || [];

  const filteredVoices = allVoices.filter((voice) => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (genderFilter === "all") return matchesSearch;
    if (genderFilter === "male")
      return matchesSearch && voice.labels?.gender === "male";
    if (genderFilter === "female")
      return matchesSearch && voice.labels?.gender === "female";
    return matchesSearch;
  });

  const handlePlayPause = (voiceId: string, previewUrl: string) => {
    if (currentlyPlaying === voiceId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      audioRef.current?.pause();
      audioRef.current = new Audio(previewUrl);
      audioRef.current.play().catch(console.error);
      setCurrentlyPlaying(voiceId);
      audioRef.current.onended = () => setCurrentlyPlaying(null);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { root: null, rootMargin: "10px", threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, [handleLoadMore]);

  useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading voices...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            Failed to load voices. Please try again.
          </div>
        ) : filteredVoices.length === 0 ? (
          <div className="text-center py-16">No voices found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVoices.map((voice) => (
                <VoiceCard
                  key={voice.voice_id}
                  voice={voice}
                  currentlyPlaying={currentlyPlaying}
                  onPlayPause={handlePlayPause}
                  onSelectVoice={onSelectVoice}
                  currentVoiceId={currentVoiceId}
                />
              ))}
            </div>

            <div ref={loadMoreRef}>
              {hasNextPage && (
                <div className="flex items-center justify-center py-8">
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-primary mr-3" />
                      <span className="text-sm text-muted-foreground">
                        Loading more voices...
                      </span>
                    </>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              )}

              {!hasNextPage && filteredVoices.length > 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {"You've"} explored all available voices
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
