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
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders accessible section navigation and safe project links", async () => {
  const response = await render();
  const html = await response.text();

  for (const id of ["about", "skills", "projects", "vision", "contact"]) {
    assert.match(html, new RegExp(`href="#${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /href="mailto:sunhama2000@naver\.com"/);
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/Trading"/);
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/movie_260407"/);
  assert.match(
    html,
    /href="https:\/\/huggingface\.co\/spaces\/yyc1327\/DrugMain"/,
  );
  assert.match(html, /href="https:\/\/github\.com\/Y-youngchan\/bookstore"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
});

test("includes responsive and reduced-motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("publishes a site-specific social preview image", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(
    html,
    /property="og:image" content="http:\/\/localhost\/og-yu-youngchan\.png"/,
  );
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(
    html,
    /name="twitter:image" content="http:\/\/localhost\/og-yu-youngchan\.png"/,
  );
});
