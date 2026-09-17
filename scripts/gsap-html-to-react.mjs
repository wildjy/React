#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
 * dev_gsap_template.html → React 세 파일
 *
 * 원본은 **html 하나**다. 거기서 이 셋을 만든다.
 *   <style>        → gsap-template.css
 *   <body> 마크업  → page.tsx
 *   구간 설정 구역 → gsapSections.ts
 *
 * 구간 설정 구역은 script 안에서 이렇게 잘라 낸다.
 *   시작 : `var mq = window.matchMedia(...)` 줄 다음
 *   끝   : `/* ═══ 여기부터는 손댈 일이 거의 없다 ... ═══ *␟/` 줄
 *   → 그 사이에 있는 것은 전부 간다 — 설명 주석도, SHOT_HOLD 같은 상수도, buildRoll 같은 보조 함수도.
 *     새 구간이 보조 함수를 데려와도 따로 손댈 것이 없다.
 *
 * 엔진(useGsapTemplate.ts)은 만들지 않는다 — React 로 옮기며 구조가 달라졌다(컨텍스트·정리·StrictMode).
 * 대신 html 쪽 엔진이 바뀌면 **경고를 찍는다.** 자동 변환에서 가장 조용히 어긋나는 곳이 거기다.
 *
 * 쓰는 법
 *   node scripts/gsap-html-to-react.mjs            한 번 변환
 *   node scripts/gsap-html-to-react.mjs --watch    html 을 지켜보며 저장할 때마다 변환
 *   node scripts/gsap-html-to-react.mjs <html경로>  다른 폴더(복사해서 만든 랜딩)를 변환
 *
 * ⚠ 옮기면서 손대는 곳은 아래 세 군데뿐이다. 그 밖은 원본 그대로 간다.
 *   ① 뼈대 css — `* { box-sizing }` 과 `body { }` 는 React 에서 쓸 수 없다(Tailwind preflight·전역).
 *      → .gt_page 로 옮기고, globals.css 를 무르는 html.gt_active 두 줄을 앞에 붙인다.
 *   ② dark → is_dark — Tailwind 의 dark 모드 클래스와 이름이 부딪힌다.
 *   ③ querySelector → q()/qa() — 돌려주는 타입이 Element|null 이라 strict 에서 그냥은 못 쓴다.
 *      같은 이유로 `var x = []` 와 `cloneNode()` 에도 타입을 붙인다.
 *
 * ⚠ 생성물은 tsc 를 통과해야 한다. html 에서 이런 것은 피한다 —
 *   `el.textContent = 숫자` (String() 으로 감싼다) · `el.style.x = 숫자` 처럼 타입이 어긋나는 대입.
 *   통과하지 못하면 next build 가 멈춘다. 조용히 어긋나는 것보다는 낫지만 손이 간다.
 * ═══════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, existsSync, watch } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_HTML = join(ROOT, "src/app/gsap/dev_gsap_template.html");

/** 구간 설정과 엔진의 경계. html 에 이미 있는 줄이다 — 이 글자가 바뀌면 변환이 멈춘다. */
const ENGINE_MARK = "/* ═══ 여기부터는 손댈 일이 거의 없다";

/* ── 잘라내기 ────────────────────────────────────────────────
 * ⚠ 못 찾으면 그 자리에서 멈춘다. 반쯤 만든 파일을 내보내는 것보다 낫다 —
 *   빈 마크업이나 빈 배열이 조용히 덮어써지면 무엇이 사라졌는지 알 길이 없다. */
function cut(src, startTok, endTok, what) {
  const a = src.indexOf(startTok);
  if (a < 0) throw new Error(`원본에서 ${what} 의 시작(${startTok})을 찾지 못했다`);
  const b = src.indexOf(endTok, a + startTok.length);
  if (b < 0) throw new Error(`원본에서 ${what} 의 끝(${endTok})을 찾지 못했다`);
  return src.slice(a + startTok.length, b);
}

/** 줄머리의 탭을 줄인다(원본은 탭으로 들여쓴다). */
function dedent(text, depth) {
  const pad = "\t".repeat(depth);
  return text
    .split("\n")
    .map((line) => (line.startsWith(pad) ? line.slice(depth) : line))
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\s+$/, "");
}

/* ───────────────────────────────────────────────────────────
 * ① 스타일
 * ─────────────────────────────────────────────────────────── */
const CSS_HEAD = `/* ═══════════════════════════════════════════════════════════
   GSAP 스크롤 기본 템플릿 — 스타일

   ⚠ 이 파일은 dev_gsap_template.html 의 <style> 에서 **자동 생성된다.**
      고칠 곳은 html 이다 (고친 뒤 : npm run gsap:sync).

   ⚠ 전역 css 다(클래스는 전부 gt_ 로 시작해 충돌하지 않는다).
      CSS Module 로 두지 않은 이유 — 엔진이 '.gt_tit' 같은
      **클래스 선택자로 요소를 찾는다**. 모듈은 이름을 해시로 바꿔 버려
      선택자가 전부 깨진다.
   ⚠ @media 경계는 gsapSections 의 MOBILE_MQ 와 같아야 한다 — 둘 다 html 에서 나온다.
   ═══════════════════════════════════════════════════════════ */

/* ── 이 페이지가 떠 있는 동안만 전역 설정을 무른다 ────────────
   ⚠ globals.css 의 두 줄이 ScrollTrigger 와 정면으로 부딪힌다.
      ① html { scroll-smooth } — 고정이 붙고 떨어질 때, 그리고 자리를
         되돌릴 때(window.scrollTo) 스크롤이 애니메이션돼 좌표가 어긋난다.
      ② body { overflow-x: hidden } — overflow-x 를 숨기면 overflow-y 가
         auto 로 계산돼 body 가 스크롤 컨테이너가 된다. 그러면 안쪽
         position: sticky 가 화면이 아니라 body 에 붙어 무용지물이 된다.
      가로로 넘치는 것들은 .gt_pin(clip) · .gt_hpin · .gt_marquee 가 이미 자른다. */
html.gt_active { scroll-behavior: auto; }
html.gt_active body { overflow-x: visible; }
`;

function toCss(style, warn) {
  let css = dedent(style, 2);

  // ⚠ 전역 뼈대 두 줄은 그대로 옮길 수 없다 — 아래에서 .gt_page 로 바꿔 심는다.
  const boxRe = /^\/\* ──.*─ \*\/\n\* \{ box-sizing: border-box; \}\n/m;
  const bodyRe = /^body \{([^}]*)\}\n/m;

  const bodyMatch = css.match(bodyRe);
  if (!bodyMatch) throw new Error("style 에서 `body { ... }` 한 줄을 찾지 못했다 (뼈대 규칙이 바뀌었나)");

  // body 의 선언을 그대로 물려받되 margin 은 뺀다(전역 리셋이 이미 잡는다).
  const decls = bodyMatch[1]
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .filter((d) => !/^margin\b/.test(d));
  // ⚠ Tailwind preflight 가 line-height·letter-spacing 을 바꿔 둔다 — 여기서 되돌린다.
  decls.push("line-height: normal", "letter-spacing: normal");

  const pageRule =
    "/* ── 뼈대 ─────────────────────────────────────────── */\n" +
    "/* ⚠ box-sizing 은 Tailwind preflight 가 이미 border-box 로 깔았다. */\n" +
    "/* ⚠ body 에는 손대지 않는다 — 이 페이지의 바깥은 앱이 쓴다. */\n" +
    ".gt_page {\n" +
    decls.map((d) => `\t${d};`).join("\n") +
    "\n}\n";

  css = css.replace(boxRe, "").replace(bodyRe, pageRule);

  // ② dark → is_dark (Tailwind 의 dark 모드 클래스와 부딪힌다)
  css = css.replace(/\.dark\b/g, ".is_dark");

  // 남은 전역 선택자가 있으면 알린다 — React 에서는 먹지 않거나 앱 전체를 건드린다.
  const strays = css.match(/^(?:html|body|\*)[ .:{]/gm);
  if (strays) warn(`전역 선택자가 남아 있다 (${strays.join(", ")}) — React 페이지에서는 위험하다`);

  return `${CSS_HEAD}\n${css}\n`;
}

/* ───────────────────────────────────────────────────────────
 * ② 마크업 → JSX
 * ─────────────────────────────────────────────────────────── */
function toJsx(markup, warn) {
  let s = dedent(markup, 1);

  // 주석 : <!-- --> 는 JSX 에서 그냥 글자로 찍힌다
  s = s.replace(/<!--([\s\S]*?)-->/g, (m, body) => `{/*${body}*/}`);

  // class → className, 그 안에서 dark → is_dark
  s = s.replace(/\bclass="([^"]*)"/g, (m, v) => `className="${v.replace(/\bdark\b/g, "is_dark")}"`);

  // for / tabindex 처럼 이름이 다른 속성
  s = s.replace(/\bfor="/g, "htmlFor=").replace(/\btabindex="/g, "tabIndex=");

  // 빈 요소는 닫는다 : <div ...></div> → <div ... />
  s = s.replace(/<([a-z][\w-]*)([^<>]*)><\/\1>/g, "<$1$2 />");
  // 닫는 짝이 없는 요소도 닫는다
  s = s.replace(/<(br|hr|img|input|meta|link|source)\b([^<>]*?)\s*\/?>/g, "<$1$2 />");

  // 손으로 손봐야 하는 것들 — 조용히 깨지느니 알린다
  if (/style="/.test(s)) warn("마크업에 style=\"...\" 가 있다 — JSX 는 객체를 받는다. 클래스로 옮겨라");
  if (/[{}]/.test(s.replace(/\{\/\*[\s\S]*?\*\/\}/g, ""))) warn("마크업 글자에 { } 가 있다 — JSX 에서는 &#123; 로 적어야 한다");

  // 탭 → 2칸, 그리고 return( ) 안쪽 깊이만큼 민다
  return s
    .split("\n")
    .map((line) => (line.trim() ? "      " + line.replace(/^\t+/, (t) => "  ".repeat(t.length)) : ""))
    .join("\n");
}

function pageFile(jsx) {
  return `"use client";

import { useRef } from "react";
import { useGsapTemplate } from "./useGsapTemplate";
import "./gsap-template.css";

/**
 * [개발 확인용] GSAP 스크롤 기본 템플릿
 *
 * ⚠ 이 파일은 dev_gsap_template.html 의 <body> 에서 **자동 생성된다.** 손으로 고치지 않는다.
 *    마크업을 고칠 곳은 html 이다 (고친 뒤 : npm run gsap:sync · 지켜보려면 npm run gsap:watch).
 *
 * 폴더 구성 — 새 랜딩은 **이 폴더를 통째로 복사해서** 이름을 바꿔 쓴다.
 *   dev_gsap_template.html — 원본 하나. 마크업·스타일·구간 설정이 여기 다 있다.
 *   page.tsx           — 마크업           (생성물)
 *   gsap-template.css  — 스타일           (생성물)
 *   gsapSections.ts    — 구간 설정        (생성물)
 *   gsapTypes.ts       — 구간 설정의 타입 (손으로 유지)
 *   useGsapTemplate.ts — 엔진             (손으로 유지 · html 쪽 엔진과 짝이다)
 */
export default function GsapTemplatePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // 구간을 짓는 일은 전부 이 훅이 한다. 첫 페인트 전에 돌고, 언마운트에서 전부 되돌린다.
  useGsapTemplate(rootRef);

  return (
    <div className="gt_page" ref={rootRef}>
${jsx}
    </div>
  );
}
`;
}

/* ───────────────────────────────────────────────────────────
 * ③ SECTIONS → TypeScript
 * ─────────────────────────────────────────────────────────── */
function toTs(body) {
  let s = dedent(body, 2);

  // 배열 하나가 통째로 나가는 것이 아니라 「구간 설정 구역」이 통째로 나간다.
  // 그 안에서 SECTIONS 만 export 로 바꾼다.
  if (!/\bvar SECTIONS\s*=\s*\[/.test(s)) throw new Error("구간 설정 구역에서 `var SECTIONS = [` 를 찾지 못했다");
  s = s.replace(/\bvar SECTIONS\s*=\s*\[/, "export const SECTIONS: SectionConf[] = [");

  // ③ 요소 찾기 — strict 에서 Element|null 을 그냥 쓸 수 없다. HTMLElement 로 돌려주는 q/qa 로 바꾼다.
  s = s.replace(
    /Array\.prototype\.slice\.call\(\s*([A-Za-z_$][\w$]*)\.querySelectorAll\((['"])(.*?)\2\)\s*\)/g,
    'qa($1, "$3")',
  );
  s = s.replace(/([A-Za-z_$][\w$]*)\.querySelectorAll\((['"])(.*?)\2\)/g, 'qa($1, "$3")');
  s = s.replace(/([A-Za-z_$][\w$]*)\.querySelector\((['"])(.*?)\2\)/g, 'q($1, "$3")');
  // 그 밖의 유사 배열
  s = s.replace(/Array\.prototype\.slice\.call\(([^()]*)\)/g, "(Array.from($1) as HTMLElement[])");

  // 이름 있는 지역 함수는 매개변수 타입이 없다 → noImplicitAny 에 걸린다.
  // (build 는 SECTIONS 의 타입에서 매개변수 타입을 물려받으므로 손대지 않는다)
  s = s.replace(/\bfunction (\w+)\(([^)]*)\)/g, (m, name, params) =>
    params.trim() ? `function ${name}(${params.split(",").map((p) => `${p.trim()}: any`).join(", ")})` : m,
  );

  // 빈 배열로 시작하는 변수 — 무엇이 담길지 TS 가 알 수 없다(`offs` 같은 정리 함수 목록).
  s = s.replace(/\bvar (\w+) = \[\];/g, "var $1: any[] = [];");
  // cloneNode 는 Node 를 돌려준다 — setAttribute·style 을 쓰려면 요소로 좁혀야 한다.
  s = s.replace(/\.cloneNode\(([^()]*)\)/g, ".cloneNode($1) as HTMLElement");

  // 구역은 통째로 모듈 바닥에 놓인다 — 탭만 2칸으로 바꾸고 더 밀지 않는다.
  return s
    .split("\n")
    .map((line) => (line.trim() ? line.replace(/^\t+/, (t) => "  ".repeat(t.length)) : ""))
    .join("\n");
}

function sectionsFile({ scrub, mq, sections }) {
  return `/* ═══════════════════════════════════════════════════════════════
 * 구간 설정
 *
 * ⚠ 이 파일은 dev_gsap_template.html 의 SECTIONS 배열에서 **자동 생성된다.** 손으로 고치지 않는다.
 *    연출을 고칠 곳은 html 이다 (고친 뒤 : npm run gsap:sync · 지켜보려면 npm run gsap:watch).
 *    여기서 고쳐 봐야 다음 변환 때 덮어써진다.
 *
 * 타입과 q/qa 는 gsapTypes.ts 에 있다 — 그쪽은 손으로 유지한다.
 * ═══════════════════════════════════════════════════════════════ */
/* eslint-disable */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { q, qa, type SectionConf } from "./gsapTypes";

export type { SectionConf, SectionCleanup } from "./gsapTypes";

/** 스크롤을 얼마나 느긋하게 따라갈지. true(=즉시) 대신 숫자를 주면 그만큼 지연되며 따라온다. */
export const SCRUB = ${scrub};

/**
 * 폭 경계.
 * ⚠ css 의 @media 와 같아야 한다 — 둘 다 html 한 곳에서 나오니 저절로 맞는다.
 */
export const MOBILE_MQ = "${mq}";

/**
 * html 의 모듈 스코프 mq 를 대신한다 — 구간 설정이 mq.matches 로 지금 폭을 묻는다.
 * ⚠ 물을 때마다 읽는다(게터). 모듈을 읽는 시점에 matchMedia 를 부르면
 *   서버에서 미리 그릴 때 window 가 없어 터진다.
 */
const mq = {
  get matches() {
    return typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches;
  },
};

${sections}
`;
}

/* ───────────────────────────────────────────────────────────
 * 변환
 * ─────────────────────────────────────────────────────────── */
function convert(htmlPath) {
  const warnings = [];
  const warn = (msg) => warnings.push(msg);

  const src = readFileSync(htmlPath, "utf8").replace(/\r\n/g, "\n");
  const outDir = dirname(htmlPath);

  const style = cut(src, "<style>", "</style>", "style 블록");
  const markup = cut(src, "<body>", "\t<script>", "body 마크업");

  const scrubMatch = src.match(/var SCRUB\s*=\s*([0-9.]+)\s*;/);
  if (!scrubMatch) throw new Error("html 에서 `var SCRUB = ...` 를 찾지 못했다");
  const mqMatch = src.match(/var mq = window\.matchMedia\(\s*'([^']+)'\s*\);/);
  if (!mqMatch) throw new Error("html 에서 `var mq = window.matchMedia('...');` 를 찾지 못했다");

  // 구간 설정 구역 — mq 줄 다음부터 엔진 머리말까지.
  const sectionLand = cut(src, mqMatch[0], ENGINE_MARK, "구간 설정 구역");

  const files = {
    "gsap-template.css": toCss(style, warn),
    "page.tsx": pageFile(toJsx(markup, warn)),
    "gsapSections.ts": sectionsFile({
      scrub: scrubMatch[1],
      mq: mqMatch[1],
      sections: toTs(sectionLand),
    }),
  };

  const written = [];
  for (const [name, content] of Object.entries(files)) {
    const path = join(outDir, name);
    // 바뀐 것만 쓴다 — 안 그러면 감시 모드가 Next 의 다시 굽기를 쉬지 않고 깨운다.
    const before = existsSync(path) ? readFileSync(path, "utf8").replace(/\r\n/g, "\n") : null;
    if (before !== content) {
      writeFileSync(path, content, "utf8");
      written.push(name);
    }
  }

  // ── 엔진이 바뀌었나 ───────────────────────────────────────
  // ⚠ 엔진은 생성하지 않는다(React 판은 구조가 다르다). 그래서 조용히 어긋날 수 있는 유일한 곳이다.
  //    html 쪽 엔진이 바뀌면 여기서 한 번 짖어 준다 — useGsapTemplate.ts 를 손으로 맞춰야 한다.
  const engine = src.slice(src.indexOf(ENGINE_MARK), src.lastIndexOf("</script>"));
  const engineHash = createHash("sha1").update(engine).digest("hex").slice(0, 12);
  const stampPath = join(outDir, ".gsap-sync.json");
  const stamp = existsSync(stampPath) ? JSON.parse(readFileSync(stampPath, "utf8")) : {};
  if (stamp.engineHash && stamp.engineHash !== engineHash) {
    warn(
      "html 의 엔진(SECTIONS 아래 script)이 바뀌었다 — useGsapTemplate.ts 는 자동 변환되지 않는다.\n" +
        "    두 엔진을 눈으로 맞춰라 : git diff 로 html 쪽 변경을 보고 훅에 같은 손질을 한다.",
    );
  }
  writeFileSync(stampPath, `${JSON.stringify({ engineHash, source: basename(htmlPath) }, null, 2)}\n`, "utf8");

  return { written, warnings };
}

function run(htmlPath) {
  const stamp = new Date().toTimeString().slice(0, 8);
  try {
    const { written, warnings } = convert(htmlPath);
    console.log(
      written.length
        ? `[gsap-sync ${stamp}] ${written.join(", ")} 갱신`
        : `[gsap-sync ${stamp}] 바뀐 것 없음`,
    );
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
    return true;
  } catch (err) {
    // ⚠ 감시 모드에서는 죽지 않는다. 오타 한 번에 감시가 끊기면 그다음 저장부터 조용히 안 바뀐다.
    console.error(`[gsap-sync ${stamp}] 변환 실패 — ${err.message}`);
    return false;
  }
}

const args = process.argv.slice(2);
const isWatch = args.includes("--watch");
const htmlPath = resolve(args.find((a) => !a.startsWith("--")) || DEFAULT_HTML);

if (!existsSync(htmlPath)) {
  console.error(`[gsap-sync] 원본을 찾지 못했다 : ${htmlPath}`);
  process.exit(1);
}

const ok = run(htmlPath);

if (isWatch) {
  console.log(`[gsap-sync] 지켜보는 중 : ${htmlPath}`);
  // ⚠ 저장 한 번에 이벤트가 여러 번 온다(편집기가 임시 파일로 바꿔치기한다) — 조금 모았다 한 번만 돈다.
  let timer = null;
  watch(htmlPath, () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => run(htmlPath), 120);
  });
} else if (!ok) {
  process.exit(1);
}
