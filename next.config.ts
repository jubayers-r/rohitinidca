import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In v16, 'experimental.turbo' is removed.
  // Use the top-level 'turbopack' key.
  turbopack: {
    resolveAlias: {
      // your aliases here
    },
  },
};

export default nextConfig;
