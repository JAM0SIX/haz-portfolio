import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Pin Turbopack to this app. If a lockfile exists higher in the tree (e.g.
// ~/package-lock.json), Next can infer the wrong root and produce bad dev
// bundles — which sometimes surfaces as a client-side SyntaxError in eval.
const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
};

export default nextConfig;
