import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { VoicesFilter } from "./VoiceFilter";
import { VoicesGrid } from "./VoiceGrid";

export function VoiceList({
  onSelectVoice,
  currentVoiceId,
}: {
  onSelectVoice: (voiceId: string, voiceName: string) => void;
  currentVoiceId?: string;
}) {
  // Global filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  return (
    <DialogContent className="lg:min-w-6xl w-[95vw] h-[85vh] p-0 gap-0">
      <DialogHeader className="px-6 py-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Voice Library
            </DialogTitle>
          </div>
        </div>

        {/* Filter */}
        <VoicesFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
        />
      </DialogHeader>

      {/* Voices Grid */}
      <VoicesGrid
        onSelectVoice={onSelectVoice}
        searchQuery={searchQuery}
        genderFilter={genderFilter}
        currentVoiceId={currentVoiceId}
      />
    </DialogContent>
  );
}
