"use client";

import React, { Profiler } from "react";

// Move your callback function here
const onRenderCallback = (
  id: string,
  phase: "mount" | "update" | "nested-update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  console.log(`[Profiler: ${id}] phase:${phase} actualDuration:${actualDuration}`);
};

export default function AuthProfiler({ children }: { children: React.ReactNode }) {
  return (
    <Profiler id="AuthLayout" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}