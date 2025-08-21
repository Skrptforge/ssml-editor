"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface TrendData {
  id: string;
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const trendTopics: TrendData[] = [
  { id: "1", text: "The Secret History of Lost Civilizations", variant: "default" },
  { id: "2", text: "The Science of Time Travel Explained", variant: "outline" },
  { id: "3", text: "Reacting to the Weirdest Conspiracy Theories", variant: "default" },
  { id: "4", text: "The Hidden Messages in Popular Movies", variant: "outline" },
  { id: "5", text: "Explaining World War II in 15 Minutes", variant: "default" },
  { id: "6", text: "The Truth About the Moon Landing Hoax", variant: "outline" },
  { id: "7", text: "Black Holes Explained Simply", variant: "default" },
  { id: "8", text: "The Secret Experiments of Nikola Tesla", variant: "outline" },
  { id: "9", text: "The Science Behind Marvel Superpowers", variant: "default" },
  { id: "10", text: "The Conspiracy Behind Ancient Pyramids", variant: "outline" },
  { id: "11", text: "ChatGPT Predicts the Future of Humanity", variant: "default" },
  { id: "12", text: "Movie Ending Explained: Inception", variant: "outline" },
  { id: "13", text: "The Biggest Historical Mysteries Ever", variant: "default" },
  { id: "14", text: "The Secret Societies That Still Exist", variant: "outline" },
  { id: "15", text: "How Startups Changed Human History", variant: "default" },
  { id: "16", text: "The Science of Viral Marketing Explained", variant: "outline" },
  { id: "17", text: "Social Media’s Darkest Secrets", variant: "default" },
  { id: "18", text: "How Content Creators Manipulate Your Brain", variant: "outline" },
  { id: "19", text: "The Hidden Truth Behind Influencer Culture", variant: "default" },
  { id: "20", text: "10 Movie Theories That Might Be True", variant: "outline" },
];


interface MovingTrendBadgesProps {
  className?: string;
  rows?: number;
  speed?: "slow" | "medium" | "fast";
}

export const MovingTrendBadges: React.FC<MovingTrendBadgesProps> = ({
  className = "",
  rows = 3,
  speed = "medium",
}) => {
  const getAnimationDuration = (rowIndex: number) => {
    const baseSpeed = speed === "slow" ? 20 : speed === "fast" ? 30 : 150;
    return baseSpeed + rowIndex * 5; // Varying speeds for each row
  };

  const getDirection = (rowIndex: number) => {
    return rowIndex % 2 === 0 ? "scroll-left" : "scroll-right";
  };

  const renderBadgeRow = (rowIndex: number) => {
    const direction = getDirection(rowIndex);
    const duration = getAnimationDuration(rowIndex);
    
    // Create duplicated arrays for seamless scrolling
    const duplicatedTrends = [...trendTopics, ...trendTopics];
    
    return (
      <div
        key={rowIndex}
        className="flex whitespace-nowrap overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          className="flex gap-5"
          style={{
            animation: `${direction} ${duration}s linear infinite`,
          }}
        >
          {duplicatedTrends.map((trend, index) => (
            <Badge
              key={`${trend.id}-${index}`}
              variant={trend.variant}
              className="px-3 py-1 text-sm font-medium whitespace-nowrap cursor-pointer 
                         transition-all duration-300 ease-in-out
                         hover:scale-110 hover:shadow-lg hover:z-10
                         border shadow-sm
                         data-[variant=outline]:border-foreground/30 data-[variant=outline]:bg-background
                         hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {trend.text}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full overflow-hidden relative ${className}`}>
      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `
      }} />
      
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="flex flex-col gap-4 py-6">
        {Array.from({ length: rows }, (_, index) => renderBadgeRow(index))}
      </div>
    </div>
  );
};

export default MovingTrendBadges;
