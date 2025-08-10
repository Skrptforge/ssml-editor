"use client";

import React from 'react';
import Link from 'next/link';
import { GithubIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
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
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link 
                  href="/templates" 
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm"
                >
                  Templates
                </Link>
                <Link 
                  href="/docs" 
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm"
                >
                  Docs
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="https://github.com/yourusername/scriptlab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <button className="bg-primary/10 hover:bg-primary/15 text-foreground/90 px-4 py-1.5 rounded-lg text-sm transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
