# 유영찬 포트폴리오 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 유영찬의 소개, 기술, 업무 방식, 프로젝트 네 개, 포부와 연락처를 담은 반응형 React 한 페이지 포트폴리오를 제작하고 배포한다.

**Architecture:** Sites용 React 단일 페이지 앱으로 구현한다. 화면 섹션은 독립 컴포넌트로 나누고, 기술·프로젝트·내비게이션 콘텐츠는 `portfolio-data.ts`의 정적 데이터로 관리한다. 서버나 저장소 없이 외부 프로젝트, GitHub, 이메일 링크만 제공한다.

**Tech Stack:** React, TypeScript, CSS, Sites/vinext, Vitest, Testing Library

## Global Constraints

- 사이트 폴더는 `/Users/yycmac/Desktop/코드개발/Personal project/Portfolio`이며 `MyPace`는 수정하지 않는다.
- 한 개의 페이지 안에서 About, Skills, Projects, Vision, Contact 영역으로 이동한다.
- 사진을 사용하지 않는다.
- 연한 라벤더 배경, 짙은 네이비 글자, 선명한 블루 강조색을 사용한다.
- 첫 화면에는 사용자가 작성한 문구를 유지한다.
- 숙련도 점수 그래프와 확인되지 않은 프로젝트 성과는 추가하지 않는다.
- 외부 링크는 새 탭에서 안전하게 열고, 이메일은 `mailto:` 링크로 제공한다.
- PC와 모바일에서 가로 스크롤이나 잘림이 없어야 한다.
- 동작 줄이기 설정에서는 등장 애니메이션을 비활성화한다.

---

## 파일 구조

- `app/page.tsx`: 전체 섹션 조립과 페이지 진입점
- `app/layout.tsx`: 한국어 문서 설정과 사이트 메타데이터
- `app/globals.css`: 색상, 레이아웃, 반응형, 애니메이션, 접근성 스타일
- `app/components/Header.tsx`: 고정 내비게이션과 모바일 메뉴
- `app/components/Hero.tsx`: 이름, 직무, 대표 문구, 주요 링크
- `app/components/About.tsx`: 전환 계기와 세 가지 강점
- `app/components/Skills.tsx`: 분야별 기술 목록
- `app/components/Projects.tsx`: 프로젝트 카드 네 개
- `app/components/WorkStyle.tsx`: 학습과 협업 태도
- `app/components/Vision.tsx`: 포부
- `app/components/Contact.tsx`: 이메일과 GitHub
- `app/data/portfolio-data.ts`: 내비게이션, 기술, 강점, 프로젝트 정적 데이터
- `app/__tests__/portfolio.test.tsx`: 핵심 콘텐츠, 링크, 섹션 구조 테스트

---

### Task 1: React 프로젝트 기반과 핵심 콘텐츠 계약

**Files:**
- Create: `package.json`
- Create: `app/page.tsx`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/data/portfolio-data.ts`
- Create: `app/__tests__/portfolio.test.tsx`
- Create: `.openai/hosting.json`

**Interfaces:**
- Produces: `navigationItems`, `strengths`, `skillGroups`, `projects` 정적 배열
- Produces: 기본 `HomePage` React 컴포넌트
- Consumes: 승인된 디자인 문서의 사용자 문구와 링크

- [ ] **Step 1: Sites 초기화 도구로 `Portfolio` 폴더에 React 프로젝트를 한 번만 생성한다**

Run:

```bash
bash "/Users/yycmac/.codex/plugins/cache/openai-bundled/sites/0.1.31/scripts/init-site.sh" "$PWD"
```

Expected: `package.json`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `.openai/hosting.json`이 생성되고 의존성 설치가 완료된다.

- [ ] **Step 2: 테스트 환경과 핵심 콘텐츠 계약을 추가한다**

`app/__tests__/portfolio.test.tsx`에 다음 동작을 검증한다.

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

describe("portfolio home page", () => {
  it("shows the owner, projects, and contact links", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: /무에서 유를/ })).toBeInTheDocument();
    expect(screen.getByText("유영찬")).toBeInTheDocument();
    expect(screen.getByText("Trading")).toBeInTheDocument();
    expect(screen.getByText("영화 예매 사이트")).toBeInTheDocument();
    expect(screen.getByText("계절별 감기약 수요 예측")).toBeInTheDocument();
    expect(screen.getByText("북스토어")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /이메일/ })).toHaveAttribute(
      "href",
      "mailto:sunhama2000@naver.com",
    );
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/Y-youngchan",
    );
  });
});
```

- [ ] **Step 3: 테스트를 실행해 콘텐츠 미구현으로 실패하는지 확인한다**

Run: `npm test -- --run`

Expected: `HomePage`에 승인된 콘텐츠가 없어 FAIL.

- [ ] **Step 4: `portfolio-data.ts`에 승인된 데이터와 정확한 링크를 구현한다**

정확한 프로젝트 값:

```ts
export const projects = [
  {
    number: "01",
    title: "Trading",
    type: "개미핥기 팀 프로젝트",
    role: ["챗봇", "프론트엔드", "백엔드", "QA"],
    href: "https://github.com/Y-youngchan/Trading",
    linkLabel: "GitHub에서 프로젝트 보기",
  },
  {
    number: "02",
    title: "영화 예매 사이트",
    type: "매운짬뽕 팀 프로젝트",
    role: ["프론트엔드", "백엔드", "DB 연결"],
    href: "https://github.com/Y-youngchan/movie_260407",
    linkLabel: "GitHub에서 프로젝트 보기",
  },
  {
    number: "03",
    title: "계절별 감기약 수요 예측",
    type: "팀 프로젝트 · 팀장",
    role: ["머신러닝", "딥러닝", "AI 모델링"],
    href: "https://huggingface.co/spaces/yyc1327/DrugMain",
    linkLabel: "서비스 체험하기",
  },
  {
    number: "04",
    title: "북스토어",
    type: "첫 개인 프로젝트",
    role: ["HTML", "CSS", "JavaScript"],
    href: "https://github.com/Y-youngchan/bookstore",
    linkLabel: "GitHub에서 프로젝트 보기",
  },
] as const;
```

- [ ] **Step 5: 임시 `HomePage`에서 이름, 네 프로젝트, 연락처 링크를 렌더링한다**

- [ ] **Step 6: 테스트를 실행해 통과하는지 확인한다**

Run: `npm test -- --run`

Expected: PASS.

---

### Task 2: 페이지 섹션과 내비게이션 구현

**Files:**
- Create: `app/components/Header.tsx`
- Create: `app/components/Hero.tsx`
- Create: `app/components/About.tsx`
- Create: `app/components/Skills.tsx`
- Create: `app/components/Projects.tsx`
- Create: `app/components/WorkStyle.tsx`
- Create: `app/components/Vision.tsx`
- Create: `app/components/Contact.tsx`
- Modify: `app/page.tsx`
- Modify: `app/__tests__/portfolio.test.tsx`

**Interfaces:**
- Consumes: `navigationItems`, `strengths`, `skillGroups`, `projects`
- Produces: `Header`, `Hero`, `About`, `Skills`, `Projects`, `WorkStyle`, `Vision`, `Contact`

- [ ] **Step 1: 섹션과 내비게이션 테스트를 추가한다**

```tsx
it("provides navigation to every primary section", () => {
  render(<HomePage />);
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
  expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "#skills");
  expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
  expect(screen.getByRole("link", { name: "Vision" })).toHaveAttribute("href", "#vision");
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
});
```

- [ ] **Step 2: 테스트를 실행해 컴포넌트 분리 전 실패를 확인한다**

Run: `npm test -- --run`

Expected: 섹션 링크 부족으로 FAIL.

- [ ] **Step 3: 각 섹션 컴포넌트를 구현한다**

필수 ID:

```tsx
<section id="about" aria-labelledby="about-title" />
<section id="skills" aria-labelledby="skills-title" />
<section id="projects" aria-labelledby="projects-title" />
<section id="work-style" aria-labelledby="work-style-title" />
<section id="vision" aria-labelledby="vision-title" />
<section id="contact" aria-labelledby="contact-title" />
```

외부 링크 규칙:

```tsx
<a href={href} target="_blank" rel="noreferrer">
  {label}
</a>
```

- [ ] **Step 4: `page.tsx`에서 섹션을 의미 있는 순서로 조립한다**

순서: `Header → Hero → About → Skills → Projects → WorkStyle → Vision → Contact`.

- [ ] **Step 5: 테스트를 실행해 통과하는지 확인한다**

Run: `npm test -- --run`

Expected: PASS.

---

### Task 3: 반응형 편집 디자인과 접근성

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/__tests__/portfolio.test.tsx`

**Interfaces:**
- Consumes: 모든 섹션의 className과 ID
- Produces: 데스크톱 2열/모바일 1열 레이아웃, focus 스타일, 동작 줄이기 대응

- [ ] **Step 1: 문서 언어와 메타데이터 테스트를 추가한다**

`layout.tsx`의 메타데이터 값:

```ts
export const metadata = {
  title: "유영찬 | Web Developer Portfolio",
  description: "웹 개발, 프론트엔드, UI/UX 디자인과 웹서비스 기획 역량을 프로젝트로 보여주는 유영찬의 포트폴리오",
};
```

- [ ] **Step 2: 라벤더·네이비·블루 디자인 토큰을 정의한다**

```css
:root {
  --background: #f4f4ff;
  --surface: #ffffff;
  --ink: #080b3f;
  --muted: #5e6380;
  --accent: #3157ff;
  --line: #d9ddff;
  --radius: 24px;
}
```

- [ ] **Step 3: 섹션, 카드, 버튼, 태그, 고정 메뉴 스타일을 완성한다**

레이아웃 기준:

- 콘텐츠 최대 폭 `1200px`
- 기본 섹션 세로 여백 `clamp(5rem, 10vw, 9rem)`
- 데스크톱 프로젝트 카드 2열
- `760px` 이하 한 열
- 모든 interactive 요소에 `:focus-visible` 외곽선

- [ ] **Step 4: 동작 줄이기와 작은 화면 예외를 구현한다**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: 전체 테스트와 빌드를 실행한다**

Run: `npm test -- --run && npm run build`

Expected: 모든 테스트 PASS, 배포 빌드 성공.

---

### Task 4: 콘텐츠·링크·화면 최종 검증

**Files:**
- Modify: `app/data/portfolio-data.ts` only if a verified mismatch is found
- Modify: `app/globals.css` only if a verified responsive defect is found

**Interfaces:**
- Consumes: 완성된 사이트
- Produces: 정확한 콘텐츠와 배포 가능한 최종 빌드

- [ ] **Step 1: 개발 서버를 유지한 상태에서 정확한 Local URL로 사이트를 연다**

- [ ] **Step 2: 데스크톱에서 Hero, 메뉴, 프로젝트 네 개, 포부, 연락처를 확인한다**

- [ ] **Step 3: 모바일 폭에서 잘림과 가로 스크롤이 없는지 확인한다**

- [ ] **Step 4: 키보드로 메뉴와 모든 링크를 이동하며 focus 상태를 확인한다**

- [ ] **Step 5: 이메일, GitHub, GitHub 프로젝트 세 개, Hugging Face 링크 하나의 주소를 데이터와 대조한다**

- [ ] **Step 6: 최종 빌드를 다시 실행한다**

Run: `npm run build`

Expected: 성공.

---

### Task 5: Sites 배포

**Files:**
- Modify: `.openai/hosting.json`

**Interfaces:**
- Consumes: 성공한 최종 빌드와 정확히 일치하는 소스
- Produces: 배포된 포트폴리오 URL

- [ ] **Step 1: 새 Sites 프로젝트를 한 번만 생성하고 반환된 프로젝트 ID를 `.openai/hosting.json`에 저장한다**

- [ ] **Step 2: 검증된 소스 상태를 저장소에 반영하고 동일한 상태를 배포 패키지로 만든다**

- [ ] **Step 3: 배포 버전을 저장한 뒤 소유자 전용 배포를 우선 시도한다**

- [ ] **Step 4: 배포 상태가 성공이 될 때까지 확인한다**

- [ ] **Step 5: 배포된 URL을 앱 브라우저에서 열고 사용자에게 전달한다**
