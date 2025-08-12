"use client";

import { useState } from "react";
import { Block } from "@/lib/types";
import { Timer, Bold, MoreVertical, Check, Volume2, Zap, Music, Speaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface SSMLOptionsMenuProps {
  block: Block;
  onChange: (updates: Partial<Omit<Block, "id">>) => void;
}

export function SSMLOptionsMenu({ block, onChange }: SSMLOptionsMenuProps) {
  const [breakTime, setBreakTime] = useState(block.break?.time || 0);
  const [phonemePh, setPhonemePh] = useState(block.phoneme?.ph || "");
  const [phonemeAlphabet, setPhonemeAlphabet] = useState(block.phoneme?.alphabet || "ipa");

  const handleBreakChange = (time: number) => {
    onChange({
      break: time > 0 ? { time } : undefined,
    });
  };

  const handleEmphasisChange = (level: "strong" | "moderate" | "reduced") => {
    // Toggle the emphasis - if it's already selected, remove it, otherwise set it
    const currentLevel = block.emphasis?.level;
    onChange({
      emphasis: currentLevel === level ? undefined : { level },
    });
  };

  const handleProsodyChange = (
    type: 'rate' | 'pitch' | 'volume',
    value: string
  ) => {
    const currentProsody = block.prosody || {};
    const currentValue = currentProsody[type];
    
    // Toggle the prosody - if it's already selected, remove it, otherwise set it
    const newProsody = {
      ...currentProsody,
      [type]: currentValue === value ? undefined : value,
    };

    // Remove undefined values
    Object.keys(newProsody).forEach(key => {
      if (newProsody[key as keyof typeof newProsody] === undefined) {
        delete newProsody[key as keyof typeof newProsody];
      }
    });

    onChange({
      prosody: Object.keys(newProsody).length > 0 ? newProsody : undefined,
    });
  };

  const handlePhonemeChange = (ph: string, alphabet: "ipa" | "x-sampa") => {
    setPhonemePh(ph);
    setPhonemeAlphabet(alphabet);
    
    onChange({
      phoneme: ph.trim() ? { ph: ph.trim(), alphabet } : undefined,
    });
  };

  const handlePhonemeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handlePhonemeChange(value, phonemeAlphabet);
  };

  const handleAlphabetChange = (alphabet: "ipa" | "x-sampa") => {
    handlePhonemeChange(phonemePh, alphabet);
  };

  const handleBreakInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBreakTime(value);
    handleBreakChange(value);
  };

  const rateOptions = ["x-slow", "slow", "medium", "fast", "x-fast"];
  const pitchOptions = ["x-low", "low", "medium", "high", "x-high"];
  const volumeOptions = ["silent", "x-soft", "soft", "medium", "loud", "x-loud"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-300 cursor-pointer"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Break (ms):</span>
          </div>

          <Input
            type="number"
            value={breakTime}
            onChange={handleBreakInputChange}
            min={0}
            step={100}
            className="h-6 w-20 text-xs"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Bold className="h-4 w-4" />
            <span>Emphasis</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {["strong", "moderate", "reduced"].map((level) => (
              <DropdownMenuItem
                key={level}
                className="flex items-center gap-2 cursor-pointer"
                onSelect={() =>
                  handleEmphasisChange(
                    level as "strong" | "moderate" | "reduced"
                  )
                }
              >
                <Check
                  className={`h-4 w-4 ${
                    block.emphasis?.level === level
                      ? "text-primary"
                      : "text-transparent"
                  }`}
                />
                <span className="capitalize">{level}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Rate</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {rateOptions.map((rate) => (
              <DropdownMenuItem
                key={rate}
                className="flex items-center gap-2 cursor-pointer"
                onSelect={() => handleProsodyChange('rate', rate)}
              >
                <Check
                  className={`h-4 w-4 ${
                    block.prosody?.rate === rate
                      ? "text-primary"
                      : "text-transparent"
                  }`}
                />
                <span className="capitalize">{rate}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Pitch</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {pitchOptions.map((pitch) => (
              <DropdownMenuItem
                key={pitch}
                className="flex items-center gap-2 cursor-pointer"
                onSelect={() => handleProsodyChange('pitch', pitch)}
              >
                <Check
                  className={`h-4 w-4 ${
                    block.prosody?.pitch === pitch
                      ? "text-primary"
                      : "text-transparent"
                  }`}
                />
                <span className="capitalize">{pitch}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span>Volume</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {volumeOptions.map((volume) => (
              <DropdownMenuItem
                key={volume}
                className="flex items-center gap-2 cursor-pointer"
                onSelect={() => handleProsodyChange('volume', volume)}
              >
                <Check
                  className={`h-4 w-4 ${
                    block.prosody?.volume === volume
                      ? "text-primary"
                      : "text-transparent"
                  }`}
                />
                <span className="capitalize">{volume}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Speaker className="h-4 w-4" />
            <span>Phoneme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <div className="p-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Alphabet:</span>
                <Select value={phonemeAlphabet} onValueChange={handleAlphabetChange}>
                  <SelectTrigger className="h-6 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ipa">IPA</SelectItem>
                    <SelectItem value="x-sampa">X-SAMPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Pronunciation:</span>
                <Input
                  type="text"
                  value={phonemePh}
                  onChange={handlePhonemeInputChange}
                  placeholder={phonemeAlphabet === "ipa" ? "ˈhɛloʊ" : "\"hE.loU"}
                  className="h-6 text-xs flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {block.phoneme && (
                <div className="text-xs text-muted-foreground">
                  Current: {block.phoneme.alphabet.toUpperCase()} - {block.phoneme.ph}
                </div>
              )}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}