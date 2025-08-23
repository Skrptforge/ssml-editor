"use client";

import React from 'react';
import Link from 'next/link';
import { GithubIcon, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useUser } from '@/lib/hooks/useAuthStatus';
import Image from 'next/image';

export function Navbar() {
  const { data: meta, isLoading } = useUser();

  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-foreground/90 font-semibold text-lg hover:text-foreground"
            >
              ScriptLab
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            <a
              href="https://github.com/yourusername/scriptlab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>

            {/* User profile */}
            {isLoading ? null : meta ? (
              <Link href="/settings" className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {meta.avatar_url ? (
                    <AvatarImage src={meta.avatar_url} alt={meta.full_name} />
                  ) : (
                    <AvatarFallback>{meta.full_name?.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-medium">{meta.full_name}</span>
                  <span className="text-xs text-muted-foreground">{meta.email}</span>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
