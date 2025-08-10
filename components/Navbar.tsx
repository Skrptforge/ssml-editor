"use client";

import React from 'react';
import Link from 'next/link';
import { GithubIcon } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-white/90 font-semibold text-lg hover:text-white"
            >
              ScriptLab
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link 
                  href="/templates" 
                  className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm"
                >
                  Templates
                </Link>
                <Link 
                  href="/docs" 
                  className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm"
                >
                  Docs
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/scriptlab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <button className="bg-white/10 hover:bg-white/15 text-white/90 px-4 py-1.5 rounded-lg text-sm transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
