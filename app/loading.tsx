import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* Minimalist Logo/Icon animation */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-b-2 border-primary/30 rounded-full animate-spin-slow"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary animate-pulse">
            Synchronizing
          </span>
          <span className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            Bhutan Developer Network
          </span>
        </div>
      </div>
    </div>
  );
}
