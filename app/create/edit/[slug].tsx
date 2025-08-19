"use client";
import { Editor } from "@/components/editor/Editor";
import { Navbar } from "@/components/Navbar";
import { useVoices } from "@/lib/hooks/useVoices";

export default function Home() {
  const { data } = useVoices();
  console.log("Voices data:", data);
  return (
    <>
      <Navbar />
      <main className="py-6">
        <Editor />
      </main>
    </>
  );
}
