"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mic, ChevronDown } from "lucide-react"

const VoiceSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setDefaultVoice } = useEditorStore((state) => state.actions)
  const { defaultVoice } = useEditorStore((state) => state)

  // Placeholder voices - this will be replaced with 11labs API data
  const voices = [
    { id: "voice-1", name: "Natural Voice 1", category: "Natural" },
    { id: "voice-2", name: "Natural Voice 2", category: "Natural" },
    { id: "voice-3", name: "Professional Voice", category: "Professional" },
    { id: "voice-4", name: "Casual Voice", category: "Casual" },
    { id: "voice-5", name: "Narrative Voice", category: "Storytelling" },
    { id: "voice-6", name: "Energetic Voice", category: "Dynamic" },
  ]

  const handleVoiceSelect = (voiceId: string, voiceName: string) => {
    setDefaultVoice(voiceId, voiceName)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-44 bg-transparent">
          <Mic className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-left truncate">{defaultVoice?.name || "Default Voice"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for text-to-speech generation. This will connect to 11labs API.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {voices.map((voice) => (
            <Button
              key={voice.id}
              variant={defaultVoice?.id === voice.id ? "default" : "ghost"}
              className="justify-start h-auto p-3"
              onClick={() => handleVoiceSelect(voice.id, voice.name)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{voice.name}</span>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {voice.category}
                  </Badge>
                </div>
                {defaultVoice?.id === voice.id && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VoiceSelector
