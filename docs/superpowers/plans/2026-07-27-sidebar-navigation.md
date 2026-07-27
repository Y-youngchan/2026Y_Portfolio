# Sidebar Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desktop top header with a fixed 220px left sidebar and provide an accessible top-left hamburger drawer at 900px and below.

**Architecture:** Move all navigation markup and mobile open/close state into one client component while preserving the page as a server component. CSS owns desktop/sidebar layout, hover motion, the mobile drawer, and reduced-motion behavior. Existing navigation data remains the single source of section links.

**Tech Stack:** React 19, Next.js 16 app router, TypeScript, CSS, Vinext/Vite, Node test runner

## Global Constraints

- Desktop sidebar width is exactly `220px`.
- Mobile navigation starts at `900px` and below.
- Mobile drawer width is `min(280px, 85vw)`.
- Hamburger button stays at the top-left.
- Menu links retain About, Skills, Projects, Vision, and Contact destinations.
- Hover and focus move labels `6px` and use the existing accent color.
- Escape, overlay click, and link selection close the mobile drawer.
- Reduced-motion users receive no translate or scale animation.
- Existing project-button changes remain untouched.
- No new dependency is added.

---

## File Structure

- Create `app/components/site-navigation.tsx`: desktop sidebar, mobile toggle, drawer, overlay, and close behavior.
- Modify `app/page.tsx`: replace the top header and apply the main-content layout class.
- Modify `app/globals.css`: sidebar, hover, drawer, overlay, responsive, and reduced-motion styles.
- Modify `tests/rendered-html.test.mjs`: verify navigation structure and accessibility markup.

### Task 1: Navigation Structure and State

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Create: `app/components/site-navigation.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `navigationItems` from `app/data/portfolio-data.ts`.
- Produces: `SiteNavigation()` client component with `isMenuOpen: boolean`.

- [ ] **Step 1: Add failing navigation assertions**

Add a test named `renders desktop sidebar and accessible mobile navigation`:

```js
test("renders desktop sidebar and accessible mobile navigation", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  assert.match(documentHtml, /class="site-sidebar"/);
  assert.match(documentHtml, /class="mobile-menu-toggle"/);
  assert.match(documentHtml, /aria-controls="mobile-navigation"/);
  assert.match(documentHtml, /aria-expanded="false"/);
  assert.match(documentHtml, /id="mobile-navigation"/);
  assert.match(documentHtml, /class="mobile-menu-overlay"/);
  assert.doesNotMatch(documentHtml, /class="site-header"/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: FAIL because `site-sidebar` and mobile navigation markup do not exist.

- [ ] **Step 3: Create the navigation component**

Create `app/components/site-navigation.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { navigationItems } from "../data/portfolio-data";

const email = "sunhama2000@naver.com";

function Brand() {
  return (
    <a className="sidebar-brand" href="#top" aria-label="페이지 맨 위로 이동">
      <span>Y</span>
      <strong>YOUNGCHAN</strong>
    </a>
  );
}

export function SiteNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const navigationLinks = navigationItems.map((item) => (
    <a key={item.href} href={item.href} onClick={closeMenu}>
      <span aria-hidden="true" />
      {item.label}
    </a>
  ));

  return (
    <>
      <aside className="site-sidebar" aria-label="데스크톱 내비게이션">
        <Brand />
        <nav>{navigationLinks}</nav>
        <a className="sidebar-contact" href={`mailto:${email}`}>
          <span>LET&apos;S TALK</span>
          <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span /><span /><span />
      </button>

      <button
        className={`mobile-menu-overlay${isMenuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="메뉴 닫기"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        className={`mobile-navigation${isMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-label="모바일 내비게이션"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <Brand />
        <nav>{navigationLinks}</nav>
        <a className="sidebar-contact" href={`mailto:${email}`}>
          <span>LET&apos;S TALK</span>
          <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </>
  );
}
```

- [ ] **Step 4: Replace the page header**

Import `SiteNavigation` in `app/page.tsx`, replace the existing `<header className="site-header">...</header>` with:

```tsx
<SiteNavigation />
```

Add `className="site-content"` to `<main id="top">`.

- [ ] **Step 5: Rebuild and run the focused test**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" WRANGLER_LOG_PATH=.wrangler/wrangler.log ./node_modules/.bin/vinext build
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: the new navigation test passes.

### Task 2: Sidebar, Hover, and Mobile Drawer Styling

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes the class names produced by `SiteNavigation`.
- Produces a fixed 220px desktop layout and a 900px mobile drawer breakpoint.

- [ ] **Step 1: Add failing CSS assertions**

Extend the responsive test:

```js
assert.match(css, /\.site-sidebar[\s\S]*width:\s*220px/);
assert.match(css, /\.site-content[\s\S]*margin-left:\s*220px/);
assert.match(css, /@media \(max-width:\s*900px\)/);
assert.match(css, /width:\s*min\(280px,\s*85vw\)/);
assert.match(css, /translateX\(6px\)/);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: FAIL because the sidebar CSS does not exist.

- [ ] **Step 3: Implement desktop sidebar styles**

In `app/globals.css`, replace the old `.site-header`, `.brand`, header navigation, and `.header-contact` rules with fixed sidebar styles:

- `.site-sidebar`: fixed, inset left, width `220px`, height `100vh`, vertical flex layout.
- `.site-content`: `margin-left: 220px`.
- `.sidebar-brand`, sidebar navigation links, and `.sidebar-contact`: inherit current visual language.
- Link pseudo-elements expand and text translates `6px` on hover/focus.
- Brand color reverses and contact background fills with the accent color.

- [ ] **Step 4: Implement mobile navigation styles**

Add base hidden styles for `.mobile-menu-toggle`, `.mobile-menu-overlay`, and `.mobile-navigation`.

Inside `@media (max-width: 900px)`:

- Hide `.site-sidebar`.
- Reset `.site-content` margin to `0`.
- Display the top-left hamburger.
- Set drawer width to `min(280px, 85vw)` and animate from `translateX(-100%)`.
- Show `.is-open` drawer at `translateX(0)`.
- Show the overlay only when `.is-open`.
- Transform hamburger lines into an `X` while `aria-expanded="true"`.

- [ ] **Step 5: Extend reduced-motion styles**

Inside the existing reduced-motion media query, ensure sidebar links, logo, drawer, overlay, and hamburger lines have no transform transition.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/rendered-html.test.mjs
```

Expected: all rendered HTML tests pass.

### Task 3: Full Verification

**Files:**
- Verify only.

- [ ] **Step 1: Run all tests**

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 2: Run the GitHub Pages build**

```bash
PATH="/Users/yycmac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" GITHUB_PAGES=true ./node_modules/.bin/next build --webpack
```

Expected: exit code 0 and `/` reported as static.

- [ ] **Step 3: Inspect the final working tree**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors. The existing untracked `pnpm-lock.yaml` and `.superpowers/` directory are not staged.
