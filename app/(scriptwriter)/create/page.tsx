import MainContent from "@/components/create/MainContent";
import ScriptSidebar from "@/components/create/ScriptSidebar";
import React from "react";

const Create = () => {
  return (
    <div className="flex">
      <ScriptSidebar />
      <MainContent />
    </div>
  );
};

export default Create;
