#!/usr/bin/env node
/* Claude Code PostToolUse 훅 — dev_gsap_template.html 을 고쳤으면 곧바로 React 로 옮긴다.
 *
 * 훅은 stdin 으로 JSON 을 받는다 : { tool_name, tool_input: { file_path }, ... }
 * 그 경로가 gsap 원본일 때만 변환기를 돌린다. 그 밖에는 아무것도 하지 않는다(조용히 끝낸다).
 *
 * ⚠ 어떤 경우에도 0 으로 끝난다 — 훅이 실패하면 편집까지 실패한 것처럼 보인다.
 *   변환이 잘못됐다면 그 메시지는 systemMessage 로 올려 보낸다. */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONVERTER = resolve(HERE, "gsap-html-to-react.mjs");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    const input = JSON.parse(raw || "{}");
    filePath = input.tool_response?.filePath || input.tool_input?.file_path || "";
  } catch {
    process.exit(0);
  }

  // 경로 구분자는 윈도우에서 역슬래시로 온다
  if (!/src\/app\/gsap\/dev_gsap_template\.html$/i.test(filePath.replace(/\\/g, "/"))) process.exit(0);

  const run = spawnSync(process.execPath, [CONVERTER], { encoding: "utf8" });
  const out = `${run.stdout || ""}${run.stderr || ""}`.trim();
  if (out) console.log(JSON.stringify({ systemMessage: out }));
  process.exit(0);
});
