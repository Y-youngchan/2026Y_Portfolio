# English Name Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 방문자에게 보이는 영어 이름을 `Yu Youngchan`으로 통일하고 수정된 사이트를 검증해 다시 배포한다.

**Architecture:** 기존 한 페이지 React 구조를 유지한다. 렌더링 테스트로 이름 표기를 고정하고, 페이지 푸터와 소셜 공유 이미지만 최소 범위로 교체한 후 기존 Sites 프로젝트의 새 버전으로 배포한다.

**Tech Stack:** React, TypeScript, CSS, Node.js test runner, Vinext, OpenAI Sites

## Global Constraints

- 방문자용 영어 이름은 `Yu Youngchan`이며 대문자 영역에서는 `YU YOUNGCHAN`으로 쓴다.
- 실제 GitHub 계정 및 저장소 URL의 `Y-youngchan`은 변경하지 않는다.
- 한글 이름, 페이지 구성, 문구, 색상과 배포 프로젝트는 유지한다.

---

### Task 1: 화면 영어 이름 수정

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: 서버 렌더링된 포트폴리오 HTML
- Produces: 푸터에 `© 2026 YU YOUNGCHAN`을 포함하는 HTML

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/rendered-html.test.mjs`의 콘텐츠 검사에 아래 조건을 추가한다.

```js
assert.match(html, /© 2026 YU YOUNGCHAN/);
assert.doesNotMatch(html, /YOO YOUNGCHAN/);
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test tests/rendered-html.test.mjs`

Expected: `YU YOUNGCHAN`이 아직 렌더링되지 않아 FAIL

- [ ] **Step 3: 최소 구현**

`app/page.tsx`의 푸터 표기를 아래처럼 수정한다.

```tsx
<footer><span>© 2026 YU YOUNGCHAN</span><a href="#top">BACK TO TOP ↑</a></footer>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test tests/rendered-html.test.mjs`

Expected: 모든 테스트 PASS

### Task 2: 공유 이미지와 배포 갱신

**Files:**
- Create: `public/og-yu-youngchan.png`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: 기존 포트폴리오 색상과 타이포그래피, 정확한 이름 `YU YOUNGCHAN`
- Produces: 새 공유 이미지와 해당 이미지를 가리키는 Open Graph 및 X 메타데이터

- [ ] **Step 1: 실패하는 메타데이터 테스트 작성**

공유 이미지 검사에 새 파일명을 요구한다.

```js
assert.match(html, /og-yu-youngchan\.png/);
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test tests/rendered-html.test.mjs`

Expected: 기존 `og.png`를 참조하므로 FAIL

- [ ] **Step 3: 공유 이미지 생성 및 연결**

기존 카드의 밝은 라벤더, 네이비, 블루 색상과 한 페이지 포트폴리오 분위기를 유지하고 정확한 영어 이름 `YU YOUNGCHAN`을 포함하는 공유 이미지를 한 장 생성한다. 결과를 `public/og-yu-youngchan.png`에 저장하고 `app/layout.tsx`의 Open Graph 및 X 이미지 경로를 교체한다.

- [ ] **Step 4: 전체 검증**

Run: `pnpm run build && node --test tests/rendered-html.test.mjs`

Expected: 빌드 성공, 모든 테스트 PASS, GitHub 링크 유지

- [ ] **Step 5: 커밋 및 배포**

검증된 소스를 커밋하고 기존 Sites 프로젝트에 새 버전으로 저장한 뒤 배포 상태가 성공할 때까지 확인한다.
