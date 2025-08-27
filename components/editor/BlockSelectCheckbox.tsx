"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditorStore } from "@/lib/store";

interface BlockSelectCheckboxProps {
  blockId: string;
}

export function BlockSelectCheckbox({ blockId }: BlockSelectCheckboxProps) {
  const selectedBlocksId = useEditorStore((s) => s.selectedBlocksId);
  const addSelected = useEditorStore((s) => s.actions.setSelectedBlocksId);

  const isChecked = selectedBlocksId.includes(blockId);

  const toggle = () => {
    if (isChecked) {
      useEditorStore.setState((state) => ({
        selectedBlocksId: state.selectedBlocksId.filter((id) => id !== blockId),
      }));
    } else {
      addSelected(blockId);
    }
  };

  return <Checkbox checked={isChecked} onCheckedChange={toggle} />;
}
