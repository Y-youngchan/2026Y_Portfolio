import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("configures a repository-scoped static export for GitHub Pages", async () => {
  const nextConfig = await readFile(
    new URL("next.config.ts", projectRoot),
    "utf8",
  );

  assert.match(nextConfig, /GITHUB_PAGES/);
  assert.match(nextConfig, /output:\s*isGitHubPages\s*\?\s*"export"/);
  assert.match(nextConfig, /basePath:\s*isGitHubPages\s*\?\s*"\/2026Y_Portfolio"/);
  assert.match(nextConfig, /tsconfigPath:\s*isGitHubPages\s*\?\s*"tsconfig\.github-pages\.json"/);
});

test("publishes the static export through the official Pages actions", async () => {
  const workflowUrl = new URL(
    ".github/workflows/deploy-pages.yml",
    projectRoot,
  );
  await access(workflowUrl);
  const workflow = await readFile(workflowUrl, "utf8");

  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pnpm exec next build --webpack/);
  assert.doesNotMatch(workflow, /pnpm exec vinext build/);
  assert.match(workflow, /path:\s*\.\/out/);
  assert.match(workflow, /GITHUB_PAGES:\s*"true"/);
});

test("uses a public absolute social image URL for static metadata", async () => {
  const layout = await readFile(new URL("app/layout.tsx", projectRoot), "utf8");

  assert.match(
    layout,
    /https:\/\/y-youngchan\.github\.io\/2026Y_Portfolio\/og-yu-youngchan\.png/,
  );
  assert.match(layout, /"\/2026Y_Portfolio\/favicon\.svg"/);
  assert.doesNotMatch(layout, /from "next\/headers"/);
});

test("does not include the unused request-time ChatGPT auth helper", async () => {
  await assert.rejects(
    access(new URL("app/chatgpt-auth.ts", projectRoot)),
    /ENOENT/,
  );
});

test("explicitly classifies the portfolio route as static", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.match(page, /export const dynamic = "force-static"/);
});

test("limits the GitHub Pages type check to the portfolio application", async () => {
  const config = JSON.parse(
    await readFile(new URL("tsconfig.github-pages.json", projectRoot), "utf8"),
  );

  assert.equal(config.extends, "./tsconfig.json");
  assert.deepEqual(config.include, [
    "next-env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    ".next/types/**/*.ts",
  ]);
});
