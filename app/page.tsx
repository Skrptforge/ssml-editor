"use client";
import { Editor } from "@/components/editor/Editor";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-white/80">
      <Navbar />
      <main className="py-6">
        <Editor />
      </main>
    </div>
  );
}
