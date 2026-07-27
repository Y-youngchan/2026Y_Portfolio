# Project Action Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every portfolio project card a GitHub button and a project-preview button that becomes a live external link as soon as its optional deployment URL is populated.

**Architecture:** Replace the single project link fields with `githubUrl` and nullable `projectUrl` fields in the shared data file. Keep the page as a server component and delegate the URL-or-popup behavior to one focused client component. Reuse the existing card style while adding a responsive two-button action row.

**Tech Stack:** React 19, Next.js 16 app router, TypeScript, Vinext/Vite, CSS, Node test runner

## Global Constraints

- The left action label is exactly `GitHub에서 프로젝트 보기`.
- The right action label is exactly `프로젝트 확인하기`.
- A missing project URL is represented by `null`.
- A missing project URL displays `프로젝트 페이지를 준비 중입니다.` when clicked.
- External links open in a new tab with `rel="noreferrer"`.
- The existing server-component page structure remains intact.
- No new package is added.

---

## File Structure

- Create `app/components/project-actions.tsx`: render the two project actions and own the client-only prepared-state popup.
- Modify `app/data/portfolio-data.ts`: provide `githubUrl` and nullable `projectUrl` for every project.
- Modify `app/page.tsx`: pass each project’s title and URLs into the action component.
- Modify `app/globals.css`: style the paired links/buttons and their mobile wrapping.
- Modify `tests/rendered-html.test.mjs`: verify all configured URLs, labels, safe external-link attributes, and the two preparing buttons.

### Task 1: Project Link Data Contract

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/data/portfolio-data.ts`

**Interfaces:**
- Produces: project objects with `githubUrl: string` and `projectUrl: string | null`.
- Produces values consumed by `ProjectActions` in Task 2.

- [ ] **Step 1: Write the failing URL assertions**

Update the safe project links test with these exact expectations:

```js
assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/Trading"/);
assert.match(html, /href="https:\/\/trading-lake-ten\.vercel\.app\/"/);
assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/movie_260407"/);
assert.match(html, /href="https:\/\/github\.com\/Drug2026\/Drug_main"/);
assert.match(
  html,
  /href="https:\/\/huggingface\.co\/spaces\/yyc1327\/DrugMain"/,
);
assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/bookstore"/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: FAIL because the Trading deployment URL and the new demand-forecast GitHub URL are not rendered.

- [ ] **Step 3: Replace the single-link data fields**

For each project in `app/data/portfolio-data.ts`, remove `href` and `linkLabel`, then add:

```ts
// Trading
githubUrl: "https://github.com/Y-youngchan/Trading",
projectUrl: "https://trading-lake-ten.vercel.app/",

// 영화 예매 사이트
githubUrl: "https://github.com/Y-youngchan/movie_260407",
projectUrl: null,

// 계절별 감기약 수요 예측
githubUrl: "https://github.com/Drug2026/Drug_main",
projectUrl: "https://huggingface.co/spaces/yyc1327/DrugMain",

// 북스토어
githubUrl: "https://github.com/Y-youngchan/bookstore",
projectUrl: null,
```

- [ ] **Step 4: Keep the test red for the correct integration reason**

Run the focused test again. Expected: build or render failure because `app/page.tsx` still consumes the removed `href` and `linkLabel` fields. This confirms Task 2 must wire the new interface.

- [ ] **Step 5: Commit the data contract and test**

```bash
git add app/data/portfolio-data.ts tests/rendered-html.test.mjs
git commit -m "test: define project action links"
```

### Task 2: Reusable Two-Button Action Component

**Files:**
- Create: `app/components/project-actions.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes:

```ts
type ProjectActionsProps = {
  title: string;
  githubUrl: string;
  projectUrl: string | null;
};
```

- Produces: `ProjectActions(props: ProjectActionsProps)` client component.

- [ ] **Step 1: Add failing markup assertions**

Add these assertions to the safe project links test:

```js
assert.equal((html.match(/GitHub에서 프로젝트 보기/g) ?? []).length, 4);
assert.equal((html.match(/프로젝트 확인하기/g) ?? []).length, 4);
assert.equal((html.match(/data-project-status="preparing"/g) ?? []).length, 2);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: FAIL because the paired labels and preparing buttons do not exist.

- [ ] **Step 3: Create the client component**

Create `app/components/project-actions.tsx`:

```tsx
"use client";

type ProjectActionsProps = {
  title: string;
  githubUrl: string;
  projectUrl: string | null;
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export function ProjectActions({
  title,
  githubUrl,
  projectUrl,
}: ProjectActionsProps) {
  const showPreparingMessage = () => {
    window.alert("프로젝트 페이지를 준비 중입니다.");
  };

  return (
    <div className="project-actions">
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${title} - GitHub에서 프로젝트 보기`}
      >
        GitHub에서 프로젝트 보기 <Arrow />
      </a>
      {projectUrl ? (
        <a
          href={projectUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${title} - 프로젝트 확인하기`}
        >
          프로젝트 확인하기 <Arrow />
        </a>
      ) : (
        <button
          type="button"
          data-project-status="preparing"
          aria-label={`${title} - 프로젝트 확인하기, 준비 중`}
          onClick={showPreparingMessage}
        >
          프로젝트 확인하기 <Arrow />
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Wire the component into the page**

Import the component at the top of `app/page.tsx`:

```tsx
import { ProjectActions } from "./components/project-actions";
```

Replace the existing single `<a>` at the bottom of each project card:

```tsx
<ProjectActions
  title={project.title}
  githubUrl={project.githubUrl}
  projectUrl={project.projectUrl}
/>
```

- [ ] **Step 5: Style the paired actions**

Replace `.project-card > a` with styles for the action row:

```css
.project-actions {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.project-actions a,
.project-actions button {
  min-height: 64px;
  padding: 14px 12px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 12px;
  background: rgba(255,255,255,.08);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font: inherit;
  font-size: .84rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
}

.project-actions a:hover,
.project-actions button:hover {
  background: rgba(255,255,255,.18);
}
```

Within the existing `@media (max-width: 760px)` block, add:

```css
.project-actions { grid-template-columns: 1fr; }
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: all rendered HTML tests PASS.

- [ ] **Step 7: Commit the component integration**

```bash
git add app/components/project-actions.tsx app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add project action buttons"
```

### Task 3: Full Regression and Static Export Verification

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes the complete project action implementation.
- Produces verification evidence for GitHub Pages deployment.

- [ ] **Step 1: Run all tests**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 2: Run the GitHub Pages static build**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" GITHUB_PAGES=true ./node_modules/.bin/next build --webpack
```

Expected: exit code 0 and route `/` reported as static.

- [ ] **Step 3: Check the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors. `pnpm-lock.yaml` remains untracked and is not staged.

- [ ] **Step 4: Commit any remaining verified implementation files**

Only if Tasks 1–2 were not committed separately:

```bash
git add app/components/project-actions.tsx app/data/portfolio-data.ts app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add project action buttons"
```
