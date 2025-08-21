"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconFileText,
  IconPlus,
} from "@tabler/icons-react";

export interface Script {
  id: number;
  name: string;
  date: string;
  category: string;
}

interface ScriptSidebarProps {
  onSelect?: (script: Script) => void;
}

const initialScripts: Script[] = [
  { id: 1, name: "Product Demo Script", date: "2024-01-15", category: "Demo" },
  { id: 2, name: "Welcome Message", date: "2024-01-14", category: "Greeting" },
  { id: 3, name: "Tutorial Narration", date: "2024-01-13", category: "Tutorial" },
  { id: 4, name: "Marketing Pitch", date: "2024-01-12", category: "Marketing" },
  { id: 5, name: "Customer Support", date: "2024-01-11", category: "Support" },
];

export const ScriptSidebar: React.FC<ScriptSidebarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [isHovered, setIsHovered] = useState(false);

  const filteredScripts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return scripts.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [scripts, searchQuery]);

  const createNew = () => {
    const newScript: Script = { 
      id: Date.now(), 
      name: `New Script ${scripts.length + 1}`, 
      date: new Date().toISOString().split("T")[0], 
      category: "Draft" 
    };
    setScripts((s) => [newScript, ...s]);
    onSelect?.(newScript);
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
            ${isHovered ? 'w-72 shadow-2xl' : 'w-14'}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Scripts sidebar"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFileText className="h-5 w-5 text-primary flex-shrink-0" />
                <h2 
                  className={`
                    font-semibold text-foreground whitespace-nowrap
                    transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  Scripts
                </h2>
              </div>
            </div>
          </div>

          {/* Expanded content */}
          <div 
            className={`
              ${isHovered ? 'flex' : 'hidden'} flex-col flex-1 min-h-0 overflow-hidden
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

              <Button className="w-full" size="sm" onClick={createNew}>
                <IconPlus className="h-4 w-4 mr-2" />
                New Script
              </Button>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-3 overflow-auto">
              <div className="space-y-2 py-3">
                {filteredScripts.length > 0 ? (
                  filteredScripts.map((script) => (
                    <Card
                      key={script.id}
                      className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors border-border"
                      onClick={() => onSelect?.(script)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm leading-tight truncate text-foreground">
                            {script.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {script.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {script.date}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <IconFileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? 'No scripts found' : 'No scripts yet'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Collapsed quick actions */}
          <div 
            className={`
              ${isHovered ? 'hidden' : 'flex flex-1 flex-col items-center justify-start py-4 space-y-4'}
            `}
          >
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={createNew}>
              <IconPlus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <IconSearch className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <IconFileText className="h-5 w-5" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ScriptSidebar;