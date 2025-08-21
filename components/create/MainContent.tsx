import React from "react";
import { TextBox } from "./textbox";
import MovingTrendBadges from "./MovingTrendBadges";

const MainContent: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`flex-1 flex items-center justify-center w-full min-h-screen border ${className}`}
    >
      <div className="w-full flex flex-col items-center gap-8">
        <h1 className="text-6xl font-bold">Get Started.</h1>

        <TextBox />
        {/* Moving Trend Badges */}
        <div className="w-full max-w-4xl">
          <MovingTrendBadges rows={3} speed="medium" />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
