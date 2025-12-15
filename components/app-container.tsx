"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AppContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function AppContainer({ className, children }: AppContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
