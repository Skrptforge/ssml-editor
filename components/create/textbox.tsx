"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholder-and-vanish-input";
import { useRouter } from "next/navigation";
import { useAuthStatus, useCreateScript } from "@/lib/hooks";

export function TextBox() {
  const router = useRouter();
  const { data: session, isLoading } = useAuthStatus();
  const { mutateAsync: createScript } = useCreateScript();

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading && !session) {
      router.push("/login");
      return;
    }

    // extract a title from the form input if present
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement | null;
    const title = (input?.value && input.value.trim()) || "Untitled Script";

    try {
      const created = await createScript(title);
      // created should be the new script object (with id)
  const id = created?.id ?? null;
  if (id) router.push(`/create/${id}`);
    } catch (err) {
      console.error("Failed to create script", err);
    }
  };
  return (
    <div className=" min-w-6xl flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
