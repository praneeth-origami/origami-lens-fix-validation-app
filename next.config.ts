import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project directory — without this,
  // Turbopack's root inference gets confused by an unrelated lockfile
  // that happens to live directly in the parent home directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
