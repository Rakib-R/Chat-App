import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const runtime = "nodejs";

console.log("UPLOADTHING_TOKEN exists?", !!process.env.UPLOADTHING_TOKEN); // ← ADD THIS

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
  config: {
      logLevel: "Debug", // ← ADD THIS
    },
  // Apply an (optional) custom config:
  // config: { ... },
});
