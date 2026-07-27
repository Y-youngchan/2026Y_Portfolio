import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/2026Y_Portfolio" : "",
  assetPrefix: isGitHubPages ? "/2026Y_Portfolio/" : undefined,
  images: {
    unoptimized: true,
  },
  typescript: {
    tsconfigPath: isGitHubPages ? "tsconfig.github-pages.json" : "tsconfig.json",
  },
};

export default nextConfig;
