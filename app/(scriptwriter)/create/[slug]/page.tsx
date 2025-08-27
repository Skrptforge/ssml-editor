"use client";

import React, { use } from "react";
import ScriptSidebar from "@/components/create/ScriptSidebar";
import ExpandingTextbox from "@/components/create/ExpandingTextbox";
import ScriptHeader from "@/components/create/ScriptHeader";
import { Editor } from "@/components/editor/Editor";
import LoadingSpinner from "@/components/create/LoadingSpinner";
import EditorSkeleton from "@/components/create/EditorSkeleton";
import ErrorState from "@/components/create/ErrorState";
import { useParams } from "next/navigation";
import useScriptWithBlocks from "@/lib/hooks/useScriptWithBlocks";

const EditPage = () => {
  return (
    <div className="flex relative">
      <ScriptSidebar />
      <MainContent />
    </div>
  );
};

export default EditPage;

const MainContent = () => {
  const handleTextboxSubmit = (value: string) => {
    console.log("Script modification:", value);
    // TODO: Implement script modification logic
  };

  const params = useParams();
  const { slug: scriptId } = params as Record<string, string | undefined>;
  
  const { 
    isGenerating, 
    isLoadingScript, 
    scriptError, 
    isErrorInCreatingScript 
  } = useScriptWithBlocks({ scriptId });

  // Show loading spinner while fetching script
  if (isLoadingScript) {
    return <LoadingSpinner />;
  }

  // Show error state if script loading failed
  if (scriptError) {
    return (
      <div className="border w-full">
        <ErrorState 
          error={scriptError as Error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  // Show error state if AI generation failed
  if (isErrorInCreatingScript) {
    return (
      <div className="border w-full">
        <ErrorState 
          error={new Error("Failed to generate script content")} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="border w-full">
      <ScriptHeader />
      {isGenerating ? (
        <EditorSkeleton />
      ) : (
        <Editor />
      )}
      <ExpandingTextbox
        placeholder="Modify script..."
        onSubmit={handleTextboxSubmit}
      />
    </div>
  );
};
