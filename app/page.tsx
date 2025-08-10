"use client";
import { Editor } from "@/components/editor/Editor";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="py-6">
        <Editor />
      </main>
    </>
  );
}
