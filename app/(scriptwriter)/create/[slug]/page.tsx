"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import MainContent from "@/components/create/MainContent";
import ScriptSidebar from "@/components/create/ScriptSidebar";
import { useScript } from "@/lib/hooks";

const EditPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const { data, isLoading, error } = useScript(slug as string);
  return (
    <div className="flex">
      <ScriptSidebar />
    </div>
  );
};

export default EditPage;
