import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the approved portfolio content", async () => {
  const response = await render();
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /<title>유영찬 \| Web Developer Portfolio<\/title>/);
  assert.match(
    html,
    /무에서 유를 창조하는<br\/><em>성취감을 알아버렸습니다\.<\/em>/,
  );
  assert.match(html, /Trading/);
  assert.match(html, /영화 예매 사이트/);
  assert.match(html, /계절별 감기약 수요 예측/);
  assert.match(html, /북스토어/);
  assert.match(html, /sunhama2000@naver\.com/);
  assert.match(html, /https:\/\/github\.com\/Y-youngchan/);
  assert.match(html, /© 2026 YU YOUNGCHAN/);
  assert.doesNotMatch(html, /YOO YOUNGCHAN/);
  assert.doesNotMatch(html, /class="button button-secondary"[^>]*>GitHub/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders accessible section navigation and safe project links", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  for (const id of ["about", "skills", "projects", "vision", "contact"]) {
    assert.match(html, new RegExp(`href="#${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /href="mailto:sunhama2000@naver\.com"/);
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/Trading"/);
  assert.match(html, /href="https:\/\/trading-lake-ten\.vercel\.app\/"/);
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/movie_260407"/);
  assert.match(html, /href="https:\/\/filmatique-vfst\.onrender\.com"/);
  assert.match(html, /href="https:\/\/github\.com\/Drug2026\/Drug_main"/);
  assert.match(
    html,
    /href="https:\/\/huggingface\.co\/spaces\/yyc1327\/DrugMain"/,
  );
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/bookstore"/);
  assert.equal(
    (documentHtml.match(/<a[^>]+aria-label="[^"]+GitHub에서 프로젝트 보기"/g) ?? []).length,
    4,
  );
  assert.equal(
    (documentHtml.match(/<(?:a|button)[^>]+aria-label="[^"]+프로젝트 확인하기[^"]*"/g) ?? []).length,
    4,
  );
  assert.equal((documentHtml.match(/data-project-status="preparing"/g) ?? []).length, 1);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
});

test("renders desktop sidebar and accessible mobile navigation", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  assert.match(documentHtml, /class="sidebar-edge-trigger"/);
  assert.match(documentHtml, /aria-controls="desktop-navigation"/);
  assert.match(documentHtml, /id="desktop-navigation"/);
  assert.match(documentHtml, /class="site-sidebar"/);
  assert.match(documentHtml, /class="mobile-menu-toggle"/);
  assert.match(documentHtml, /aria-controls="mobile-navigation"/);
  assert.match(documentHtml, /aria-expanded="false"/);
  assert.match(documentHtml, /id="mobile-navigation"/);
  assert.match(documentHtml, /class="mobile-menu-overlay"/);
  assert.doesNotMatch(documentHtml, /class="site-header"/);
});

test("renders flippable project cards with verified details", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  assert.equal((documentHtml.match(/project-card-front/g) ?? []).length, 4);
  assert.equal((documentHtml.match(/project-card-back/g) ?? []).length, 4);
  assert.equal((documentHtml.match(/class="project-card-toggle"/g) ?? []).length, 4);
  assert.equal((documentHtml.match(/class="project-actions"/g) ?? []).length, 4);
  assert.equal((documentHtml.match(/>CONTRIBUTION</g) ?? []).length, 4);

  for (const detail of [
    "React",
    "Vite",
    "Tailwind CSS",
    "OpenAI",
    "LangChain",
    "LangGraph",
    "Tool Calling",
    "KIS",
    "Toss",
    "Coinone",
    "Binance",
    "Naver News",
    "Finnhub",
    "DART",
    "Tavily",
    "HTML5",
    "CSS3",
    "JavaScript",
    "SQLite",
    "SQLAlchemy",
    "Flask-Migrate",
    "TMDB",
    "Toss Payments",
    "Docker",
    "Python",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Random Forest",
    "Ridge",
    "Grid Search",
    "Optuna",
    "혼합 앙상블",
  ]) {
    assert.match(documentHtml, new RegExp(detail));
  }

  assert.match(documentHtml, />CHATBOT</);
  assert.match(documentHtml, />API INTEGRATION</);
  assert.match(documentHtml, />DATABASE</);
  assert.match(documentHtml, />DEPLOYMENT</);
  assert.doesNotMatch(documentHtml, />TRADE HISTORY</);
  assert.doesNotMatch(documentHtml, /프로젝트 코드 확인 후 업데이트|기술 스택 정리 중/);
});

test("renders the verified portfolio skill groups", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  for (const skill of [
    "TypeScript",
    "FastAPI",
    "Vite",
    "Tailwind CSS",
    "XGBoost",
    "Optuna",
    "PostgreSQL",
    "Supabase",
    "Docker",
  ]) {
    assert.match(documentHtml, new RegExp(skill));
  }

  assert.match(documentHtml, />Database</);
  assert.match(documentHtml, />Deploy &amp; Tools</);
});

test("renders the first-phase motion system without hiding content semantics", async () => {
  const response = await render();
  const html = await response.text();
  const documentHtml = html.split('<script id="_R_">', 1)[0];

  assert.match(documentHtml, /class="hero[^"]*hero-sequence/);
  assert.ok((documentHtml.match(/data-reveal="up"/g) ?? []).length >= 12);
  assert.match(documentHtml, /class="[^"]*reveal-delay-1/);
  assert.match(documentHtml, /class="vision-highlight"/);
  assert.match(documentHtml, /data-reveal-root="true"/);
});

test("includes responsive and reduced-motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const color of [
    "#f3f6f8",
    "#172b3a",
    "#e86a33",
    "#183b56",
    "#d7e0e7",
    "#2563a6",
    "#d65f3c",
    "#b88332",
  ]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }

  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.reveal\.is-visible/);
  assert.match(css, /@keyframes\s+hero-reveal/);
  assert.match(css, /\.vision-highlight/);
  assert.match(css, /focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /\.site-sidebar[\s\S]*width:\s*220px/);
  assert.match(css, /\.site-content\s*\{[^}]*margin-left:\s*0/);
  assert.match(css, /\.sidebar-edge-trigger[\s\S]*width:\s*25px/);
  assert.match(css, /\.sidebar-edge-trigger:hover,[\s\S]*width:\s*32px/);
  assert.match(css, /\.site-sidebar[\s\S]*translateX\(-100%\)/);
  assert.match(css, /\.project-card\s*\{[^}]*min-height:\s*550px/);
  assert.match(css, /\.project-card-flip-zone\s*\{[^}]*min-height:\s*370px/);
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.project-card\s*\{[^}]*min-height:\s*530px/);
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.project-card-inner\s*\{[^}]*min-height:\s*350px/);
  assert.match(css, /@media \(max-width:\s*900px\)/);
  assert.match(css, /width:\s*min\(280px,\s*85vw\)/);
  assert.match(css, /translateX\(6px\)/);
});

test("publishes a site-specific social preview image", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(
    html,
    /property="og:image" content="https:\/\/yoo-youngchan-portfolio\.sunhama2000\.chatgpt\.site\/og-yu-youngchan\.png"/,
  );
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(
    html,
    /name="twitter:image" content="https:\/\/yoo-youngchan-portfolio\.sunhama2000\.chatgpt\.site\/og-yu-youngchan\.png"/,
  );
});
