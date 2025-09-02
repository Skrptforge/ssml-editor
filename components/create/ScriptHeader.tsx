"use client";

import React, { useState } from "react";
import useScript from "@/lib/hooks/useScript";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Database, ShieldCheck } from "lucide-react";
import { useCreateInitialScript } from "@/lib/hooks/useAiScript";
import { Button } from "@/components/ui/button";
import useFactCheck from "@/lib/hooks/useFactCheck";

interface ScriptHeaderProps {
  onTabChange?: (tab: "script" | "sources" | "analysis") => void;
}

const TABS = [
  { key: "script" as const, label: "Script" },
  { key: "analysis" as const, label: "Analysis" },
];

const ScriptHeader: React.FC<ScriptHeaderProps> = ({ onTabChange }) => {
  const params = useParams();
  const { slug: scriptId } = params as Record<string, string | undefined>;
  const { data, isLoading, error } = useScript(scriptId as string);
  const factCheckMutation = useFactCheck();
  const [active, setActive] = useState<"script" | "sources" | "analysis">(
    "script"
  );
  const title = data?.title ?? "Untitled";

  const handleTab = (tab: "script" | "sources" | "analysis") => {
    setActive(tab);
    onTabChange?.(tab);
  };

  const handleSearch = () => {
    factCheckMutation.mutate();
  };

  const renderIcon = (key: "script" | "sources" | "analysis") => {
    switch (key) {
      case "script":
        return <MessageSquare className="h-5 w-5 mr-3 inline-block" />;
      case "analysis":
        return <BarChart2 className="h-5 w-5 mr-3 inline-block" />;
      case "sources":
        return <Database className="h-5 w-5 mr-3 inline-block" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background mx-auto w-4xl">
      <div className="w-full px-6 border-b">
        <div className="py-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-normal tracking-normal whitespace-normal break-words">
              {isLoading ? (
                <span className="inline-block h-10 w-72 rounded-md bg-muted-foreground/10 animate-pulse" />
              ) : (
                title
              )}
            </h1>

            <Button
              onClick={handleSearch}
              disabled={factCheckMutation.isPending || isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              {factCheckMutation.isPending ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-muted-foreground/70 mt-2">
              Failed to load script
            </p>
          )}

          {factCheckMutation.error && (
            <p className="text-sm text-red-500/70 mt-2">
              Failed to search for facts
            </p>
          )}
        </div>

        <nav className="flex items-center gap-8 mt-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTab(tab.key)}
              className={`
                relative pb-3 cursor-pointer text-sm font-medium transition-colors duration-200
                ${
                  active === tab.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }
              `}
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-5 w-5 rounded bg-muted-foreground/10 animate-pulse mr-3" />
                  <span className="inline-block h-5 w-28 rounded-md bg-muted-foreground/10 animate-pulse" />
                </>
              ) : (
                <>
                  {renderIcon(tab.key)}
                  {tab.label}
                </>
              )}
              {active === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ScriptHeader;
