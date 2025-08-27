import React from "react";
import { motion } from "motion/react";

const BlockSkeleton = () => {
  return (
    <motion.div
      className="group flex flex-col gap-4 px-6 py-4 rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-start gap-4">
        {/* Play button skeleton with pulse effect */}
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/60 border border-border/40 shadow-sm"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 1px 3px rgba(0,0,0,0.1)",
              "0 4px 12px rgba(0,0,0,0.15)",
              "0 1px 3px rgba(0,0,0,0.1)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content skeleton with text-like lines */}
        <div className="flex-1 space-y-2">
          <motion.div
            className="h-4 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-md"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            style={{ width: "85%" }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-md"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            style={{ width: "92%" }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-md"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            style={{ width: "78%" }}
          />
        </div>

        {/* Options menu skeleton with subtle animation */}
        <motion.div
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/60 border border-border/30"
          animate={{
            rotate: [0, 5, -5, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />
      </div>

      {/* Subtle bottom accent line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
};

const EditorSkeleton = () => {
  return (
    <div className="w-4xl mt-5 mx-auto px-4">
      {/* Multiple block skeletons to match the structure in the image */}
      {Array.from({ length: 5 }).map((_, index) => (
        <BlockSkeleton key={index} />
      ))}
    </div>
  );
};

export default EditorSkeleton;
