"use client";
import SelectedPlayButton from "@/components/audio/SelectedPlayButton";
import { Editor } from "@/components/editor/Editor";
import { Navbar } from "@/components/Navbar";
import { useVoices } from "@/lib/hooks/useVoices";

export default function Home() {
  const { data } = useVoices();
  console.log("Voices data:", data);
  return (
    <>
      <Navbar />
       <SelectedPlayButton />
      <main className="py-6">
        <Editor />
      </main>
    </>
  );
}
