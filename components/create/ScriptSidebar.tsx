"use client";

import React, { useState, useMemo } from "react";
import useScripts from "@/lib/hooks/useScripts";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  IconSearch,
  IconFileText,
  IconPlus,
  IconLogout,
  IconChevronLeft,
} from "@tabler/icons-react";
import ScriptCard from "./ScriptCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useSignOut, useAuthStatus } from "@/lib/hooks";
import { NavbarLogo } from "../ui/resizable-navbar";
import { ThemeToggle } from "@/components/theme-toggle";

export interface Script {
  id: string;
  name: string;
  date: string;
  category: string;
}

interface ScriptSidebarProps {
  onSelect?: (script: Script) => void;
}

export const ScriptSidebar: React.FC<ScriptSidebarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, fetchNextPage, hasNextPage } = useScripts();
  const router = useRouter();
  const scripts = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages
      .flat()
      .map((s: { id: string; title?: string; created_at?: string }) => ({
        id: s.id,
        name: s.title ?? "Untitled",
        date: s.created_at ?? "",
        category: "Script",
      })) as Script[];
  }, [data]);
  // Sidebar expansion is driven solely by the locked state.
  const [isLocked, setIsLocked] = useState(false);
  const pathname = usePathname();
  const showNew = pathname?.startsWith("/edit");

  const filteredScripts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return scripts.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [scripts, searchQuery]);

  const createNew = () => {
    router.push("/create");
  };
  return (
    <div className="relative flex-shrink-0">
      {/* Fixed width container that doesn't change */}
      <div className="w-14 h-screen">
        <aside
          role="navigation"
          className={`
            fixed left-0 top-0 h-screen z-50 
            border-r border-border bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm 
            flex flex-col overflow-hidden
            transition-all duration-300 ease-in-out
            ${isLocked ? "w-72 shadow-2xl" : "w-14"}
          `}
          aria-label="Scripts sidebar"
        >
          {/* Header */}
          <div className="pl-2 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <NavbarLogo hidename={!isLocked} />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 p-0 flex items-center justify-center ${
                    isLocked ? "bg-accent " : ""
                  }`}
                  aria-label={isLocked ? "Collapse Sidebar" : "Expand Sidebar"}
                  onClick={() => setIsLocked((v) => !v)}
                  title={isLocked ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <IconChevronLeft
                    className={`h-8 w-8 transition-transform  ${
                      isLocked ? "" : "rotate-180"
                    }`}
                  />
                </Button>
                {isLocked && <ThemeToggle />}
                {isLocked && <LogoutButton />}
              </div>
            </div>
          </div>

          {/* Expanded content */}
          <div
            className={`
              ${
                isLocked ? "flex" : "hidden"
              } flex-col flex-1 min-h-0 overflow-hidden
            `}
          >
            <div className="p-4 space-y-4 flex-shrink-0">
              <div className="relative">
                <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-md bg-neutral-100 dark:bg-zinc-800"
                  aria-label="Search scripts"
                />
              </div>

              {showNew && (
                <Button className="w-full" size="sm" onClick={createNew}>
                  <IconPlus className="h-4 w-4 mr-2" />
                  New Script
                </Button>
              )}
            </div>

            {/* Profile footer inside expanded sidebar */}

            <Separator />

            <ScrollArea className="flex-1 px-3 overflow-auto">
              <div className="space-y-2 py-3">
                {filteredScripts.length > 0 ? (
                  filteredScripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      onClick={onSelect}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <IconFileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isLoading
                        ? "Loading..."
                        : searchQuery
                        ? "No scripts found"
                        : "No scripts yet"}
                    </p>
                  </div>
                )}

                {hasNextPage && (
                  <div className="flex justify-center py-2">
                    <Button size="sm" onClick={() => fetchNextPage()}>
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Collapsed quick actions */}
          <div
            className={`
              ${
                isLocked
                  ? "hidden"
                  : "flex flex-1 flex-col items-center justify-start py-4 space-y-4"
              }
            `}
          >
            {showNew && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={createNew}
              >
                <IconPlus className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <IconSearch className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <IconFileText className="h-5 w-5" />
            </Button>
          </div>
          {isLocked ? (
            <div className="mt-auto p-4">
              <ProfileFooter />
            </div>
          ) : null}

          {/* Hover-expanded profile (when collapsed) shown at bottom */}
          {!isLocked ? (
            <div className="absolute bottom-4  left-0 right-0 flex items-center justify-center">
              <CollapsedProfile />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default ScriptSidebar;

function ProfileFooter() {
  const { data: session } = useAuthStatus();
  const { data } = useUser();
  const meta = data ?? null;
  const router = useRouter();

  if (!session)
    return (
      <div className="px-1">
        <Button
          className="w-full"
          size="sm"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </div>
    );

  if (!meta) return null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {meta.avatar_url ? (
            <AvatarImage src={meta.avatar_url} alt={meta.full_name} />
          ) : (
            <AvatarFallback>{meta.full_name?.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="text-sm font-medium">{meta.full_name}</div>
          <div className="text-xs text-muted-foreground">{meta.email}</div>
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  const { mutateAsync, isPending: isLoading } = useSignOut();
  const { data: session } = useAuthStatus();
  if (!session) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-auto flex items-left gap-2 "
      aria-label="Sign out"
      onClick={() => mutateAsync()}
      disabled={isLoading}
      title={isLoading ? "Signing out..." : "Sign out"}
    >
      <IconLogout className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
    </Button>
  );
}

function CollapsedProfile() {
  const { data: session } = useAuthStatus();
  const { data } = useUser();
  const meta = data ?? null;
  const router = useRouter();

  if (!session)
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 p-0"
        onClick={() => router.push("/login")}
        aria-label="Login"
        title="Login"
      >
        <IconPlus className="h-5 w-5" />
      </Button>
    );

  if (!meta) return null;

  return (
    <button className="p-1 rounded-full hover:bg-muted/30">
      <Avatar className="h-8 w-8">
        {meta.avatar_url ? (
          <AvatarImage src={meta.avatar_url} alt={meta.full_name} />
        ) : (
          <AvatarFallback>{meta.full_name?.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
    </button>
  );
}
