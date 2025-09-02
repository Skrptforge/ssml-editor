"use client";

import React, { useState, useMemo, memo } from "react";
import { AlertTriangle, Check, X, Info, ChevronDown, ChevronRight } from "lucide-react";
import { FactCheckCorrection } from "@/utils/parsing";
import { useEditorStore } from "@/lib/store";

interface CorrectionPanelProps {
  corrections: FactCheckCorrection[];
  blockId: string;
  onApplyCorrection: (correction: FactCheckCorrection) => void;
}

export const CorrectionPanel = memo<CorrectionPanelProps>(({ corrections, blockId, onApplyCorrection }: CorrectionPanelProps) => {
  const [showCorrections, setShowCorrections] = useState(false);

  // Memoize corrections for this block to avoid unnecessary re-renders
  const blockCorrections = useMemo(() => {
    return corrections.filter(correction => correction.blockId === blockId);
  }, [corrections, blockId]);

  // Get the highest severity correction to determine indicator color
  const highestSeverity = useMemo(() => {
    if (blockCorrections.length === 0) return null;
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return blockCorrections.reduce((highest, correction) =>
      severityOrder[correction.severity] > severityOrder[highest.severity] ? correction : highest
    );
  }, [blockCorrections]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return Info;
      default: return Info;
    }
  };

  const handleApplyCorrection = (correction: FactCheckCorrection) => {
    onApplyCorrection(correction);
    setShowCorrections(false);
  };

  const handleDismissCorrection = (correctionToRemove: FactCheckCorrection) => {
    // Remove this specific correction from the global store
    const { corrections: allCorrections, actions } = useEditorStore.getState();
    const updatedCorrections = allCorrections.filter(c => c !== correctionToRemove);
    actions.setCorrections(updatedCorrections);
  };

  if (blockCorrections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Correction Indicator */}
      <div className="flex items-center gap-2 px-6 py-1">
        <button
          onClick={() => setShowCorrections(!showCorrections)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getSeverityColor(
            highestSeverity?.severity || 'low'
          )} hover:shadow-md border`}
        >
          {React.createElement(getSeverityIcon(highestSeverity?.severity || 'low'), {
            className: "w-4 h-4"
          })}
          <span className="font-semibold">
            {blockCorrections.length} correction{blockCorrections.length > 1 ? 's' : ''}
          </span>
          {showCorrections ? (
            <ChevronDown className="w-4 h-4 ml-1" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-1" />
          )}
        </button>
      </div>

      {/* Correction Details Panel */}
      {showCorrections && (
        <div className="mx-6 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-4">
            {blockCorrections.map((correction, index) => (
              <div
                key={index}
                className="border-l-4 border-l-muted-foreground/30 pl-4 bg-muted/20 rounded-r-lg p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(getSeverityIcon(correction.severity), {
                        className: `w-5 h-5 flex-shrink-0 ${
                          correction.severity === 'high' ? 'text-red-500' :
                          correction.severity === 'medium' ? 'text-orange-500' :
                          'text-yellow-600'
                        }`
                      })}
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {correction.severity} priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {correction.justification}
                    </p>
                    <div className="bg-background/80 rounded-lg p-3 border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Suggested Change
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {correction.updatedContent}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApplyCorrection(correction)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                      title="Apply this correction"
                    >
                      <Check className="w-4 h-4" />
                      Apply
                    </button>
                    <button
                      onClick={() => handleDismissCorrection(correction)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                      title="Dismiss this correction"
                    >
                      <X className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if corrections for this block change
  const prevBlockCorrections = prevProps.corrections.filter(c => c.blockId === prevProps.blockId);
  const nextBlockCorrections = nextProps.corrections.filter(c => c.blockId === nextProps.blockId);

  return (
    prevProps.blockId === nextProps.blockId &&
    JSON.stringify(prevBlockCorrections) === JSON.stringify(nextBlockCorrections)
  );
});

CorrectionPanel.displayName = "CorrectionPanel";
