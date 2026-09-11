# Talk to Figma MCP 설치/설정 기록

작성일: 2026-04-01
프로젝트: D:/React

본 문서는 Figma와 Claude 간 MCP(Model Context Protocol) 연동을 위한 설치/실행 절차를 기록한다.

연결 구조: `Figma 플러그인` ⇄ `소켓 브리지(WebSocket, 3055 포트)` ⇄ `MCP 서버` ⇄ `Claude`

## 1) pnpm 확인

MCP 패키지를 설치하기 위한 패키지 매니저로 pnpm을 사용한다. 설치 여부 및 버전을 확인한다.

```powershell
pnpm -v
```

확인 기준:
- 정상 출력 예: `9.15.3`
- `command not found` 발생 시 pnpm 설치 필요: `npm i -g pnpm`

## 2) Talk to Figma MCP 패키지 설치

프로젝트 루트(D:/React)에서 dev 의존성으로 설치한다. 이 패키지는 MCP 서버 실행 파일(`cursor-talk-to-figma-mcp`)을 제공하며, 소켓 브리지를 통해 Figma 플러그인과 통신한다.

```powershell
pnpm add -D cursor-talk-to-figma-mcp
```

설치 후 확인:
- `package.json`의 `devDependencies`에 `cursor-talk-to-figma-mcp`가 추가되었는지 확인
- `package.json`의 `scripts`에 `"socket": "cursor-talk-to-figma-mcp"` 항목이 없으면 추가
  - 없을 경우 3) 단계에서 `error: Script not found "socket"` 발생

```json
{
  "scripts": {
    "socket": "cursor-talk-to-figma-mcp"
  }
}
```

설치 확인 명령:

```powershell
pnpm list --depth -1 | findstr cursor-talk-to-figma-mcp
```

## 3) 실행 순서 및 연결 점검

> 실행 순서가 중요하다. **Figma 플러그인 → 소켓 브리지 → MCP 서버 → 채널 조인** 순으로 진행해야 정상 연결된다.

### 3-1. Figma에서 MCP 플러그인 실행

- Figma 데스크탑 또는 웹에서 대상 파일을 연다
- 메뉴 → Plugins → `Cursor Talk To Figma MCP Plugin` 실행

### 3-2. 소켓 브리지 실행

새 PowerShell 창에서 실행한다. 3055 포트로 WebSocket 서버가 기동된다.

```powershell
bunx cursor-talk-to-figma-socket
```

포트 리슨 확인(다른 창에서):

```powershell
Get-NetTCPConnection -LocalPort 3055 -State Listen
```

- 이미 3055 포트가 사용 중(`EADDRINUSE`)이면 브리지가 이미 떠 있는 것이므로 이 단계는 생략하고 3-3으로 진행

### 3-3. MCP 서버 실행

또 다른 PowerShell 창에서 실행한다. MCP 서버가 `ws://localhost:3055`로 접속한다.

```powershell
pnpm run socket
```

정상 연결 로그:
- `Connected to Figma socket server`
- `Please join a channel to start chatting`

`Socket error: AggregateError`가 발생하면 3-2의 소켓 브리지가 기동되지 않은 상태다. 3-2부터 다시 실행한다.

### 3-4. Claude에서 채널 조인

Claude에서 다음과 같이 채널 조인을 요청한다. **조인하지 않으면 Figma MCP 도구를 호출할 수 없다.**

```
talk-to-figma - join_channel(channel: "채널명")
```

- 채널명 예: `design-system`, `figma-main` (Figma 플러그인에서 표시되는 채널명과 일치해야 함)
- 조인 성공 로그: `Joined channel: <채널명>`
- 조인 후 사용 가능: `get_document_info`, `read_my_design`, `get_selection`, `set_text_content` 등

> **처음 세팅하는 경우** — 위 3-4는 MCP 서버가 이미 Claude Code에 등록돼 있다고 가정한다. 처음이라면 아래 **4) Claude Code에 MCP 서버 등록** 섹션의 5단계 등록 순서를 먼저 따르는 걸 권장한다.

---

## 4) Claude Code에 MCP 서버 등록 (핵심 등록 순서)

> 앞의 1~3)에서 패키지 설치·소켓 브리지·MCP 서버 실행은 다뤘다.
> 이 섹션은 **Claude Code가 MCP 서버를 인식하도록 등록**하고 **채널을 연결**하기까지의 전체 5단계 순서를 정리한다.
> 한 번 등록해 두면 이후 Claude Code 세션마다 자동으로 MCP 도구가 로드된다.

### 4-1. WebSocket 소켓 서버 실행 (별도 터미널)

Claude ↔ Figma 플러그인을 중계하는 서버다. **별도 터미널 창**에서 실행하고 계속 켜둔다.

**A. 저장소를 클론해 로컬에서 실행하는 경우** (사용자가 제시한 방식):

```powershell
cd D:\cursor-talk-to-figma-mcp
bun socket
```

**B. 프로젝트 루트에서 pnpm 스크립트로** (3-3과 동일 · 이 프로젝트에 이미 설정됨):

```powershell
pnpm run socket
```

> ⚠️ **왜 별도 터미널인가?** 소켓 서버는 계속 떠 있어야 한다. Claude 대화 세션 안에서 `! bun socket` 형태로 실행하면 그 세션이 끝날 때 함께 죽는다. 하루 종일 켜두고 여러 세션에서 재사용하려면 전용 터미널 창을 하나 할당하는 게 낫다.

소켓 리슨 확인:

```powershell
Get-NetTCPConnection -LocalPort 3055 -State Listen
```

### 4-2. MCP 서버를 Claude Code에 등록

Claude Code CLI에 한 줄로 등록한다:

```powershell
claude mcp add TalkToFigma -- bunx cursor-talk-to-figma-mcp
```

각 부분의 의미:

| 조각 | 의미 |
| --- | --- |
| `claude mcp add` | Claude Code에 MCP 서버 등록 명령 |
| `TalkToFigma` | MCP 서버 별명 (도구 이름 접두어에 사용됨: `mcp__TalkToFigma__*`) |
| `--` | 이후는 실행 커맨드임을 알리는 구분자 |
| `bunx cursor-talk-to-figma-mcp` | 실제 MCP 서버 프로세스 실행 명령 |

등록 확인:

```powershell
claude mcp list
```

- 목록에 `TalkToFigma` 가 보이면 등록 성공
- 스코프별로 등록 위치가 다르니 필요 시 `--scope user` / `--scope project` 옵션 검토

### 4-3. Claude Code 재시작

등록 후 MCP 서버가 로드되려면 **Claude Code를 완전히 재시작**해야 한다. 실행 중인 세션은 등록 시점의 MCP 목록을 캐시하고 있어 새 서버를 못 본다.

재시작 후 사용 가능한 MCP 도구(대표):

- `mcp__TalkToFigma__join_channel`
- `mcp__TalkToFigma__get_document_info`
- `mcp__TalkToFigma__read_my_design`
- `mcp__TalkToFigma__get_selection`
- `mcp__TalkToFigma__set_text_content`
- `mcp__TalkToFigma__create_frame` / `create_rectangle` / `create_text`
- ... 총 40여 종 (스캔·읽기·생성·수정·주석·이동·리사이즈·styles)

도구 로딩 확인:

- Claude 대화 중 "지금 사용 가능한 MCP 도구 알려줘" 라고 물어 확인
- 또는 `/mcp` 슬래시 커맨드로 연결/도구 상태 확인

### 4-4. Figma 플러그인에서 채널 조인

Figma 데스크탑/웹에서:

1. 대상 파일 열기
2. `Cursor Talk To Figma` 플러그인 실행
3. 소켓 서버(4-1) 자동 감지 — 보통 `localhost:3055`
4. 플러그인이 **랜덤 채널명**을 자동 생성해 보여줌 — 예: `pxl9m50e`
5. Join 클릭

> 채널명은 Figma 플러그인 창 상단에 표시된다. 그대로 복사해 두고 4-5에서 사용.

### 4-5. Claude 쪽에서 채널 연결

Claude 세션에서 자연어로 요청:

```
pxl9m50e 채널에 연결해줘
```

Claude가 자동으로 `mcp__TalkToFigma__join_channel(channel: "pxl9m50e")` 를 호출한다. 연결 완료 후:

- 이후 대화에서 "선택된 요소 읽어줘" → `get_selection` 자동 사용
- "이 텍스트 '안녕하세요'로 바꿔줘" → `set_text_content`
- 문서 스캔·프레임 생성·컴포넌트 인스턴스 삽입 등 40여 도구 사용 가능

---

### 등록 순서 한 그림

```
[별도 터미널]  bun socket / pnpm run socket  ─────►  WebSocket :3055 계속 켜짐
                                                       ▲
                                                       │ (Figma 플러그인 자동 연결)
                                                       │
[Claude Code CLI]  claude mcp add TalkToFigma ─────────┴─►  MCP 서버 등록 (최초 1회)
        ↓
   Claude Code 재시작
        ↓
[Figma]  플러그인 실행 → 채널명(예: pxl9m50e) 자동 생성 → Join
        ↓
[Claude 대화]  "pxl9m50e 채널에 연결해줘"  →  join_channel 자동 호출
        ↓
Figma 도구 사용 가능 (get_document_info, set_text_content, create_frame, ...)
```

---

## 5) 자주 마주치는 문제 (트러블슈팅)

### "MCP 도구가 안 보여요" / `mcp__TalkToFigma__*` 가 없어요

- ❌ Claude Code를 재시작 안 함 → **4-3 재실행** (완전 종료 후 재기동)
- ❌ `claude mcp list` 에 TalkToFigma 없음 → **4-2 재실행** (등록이 안 됐거나 다른 scope에 저장됨)
- ❌ 소켓 서버가 안 떠 있음 → **4-1 재실행** (별도 터미널에서)
- 확인: `claude mcp list` 결과에 이름이 있는데 도구가 안 보이면 재시작 문제

### "채널 연결 실패" / `join_channel` 이 에러

- ❌ Figma 플러그인이 소켓 서버에 연결 안 됨 → 플러그인 창 우상단 연결 상태 확인, 필요 시 재접속
- ❌ 채널명이 다름 → **Figma 플러그인 창의 채널명을 정확히 복사**해 사용 (대소문자·오타 주의)
- ❌ 소켓 서버 재시작 후 Figma 플러그인은 옛 연결 유지 → 플러그인도 함께 재접속
- 확인: MCP 서버 콘솔에 `Joined channel: <채널명>` 로그가 뜨는지

### `Socket error: AggregateError` / `ECONNREFUSED`

- 소켓 서버(4-1)가 안 떠 있음. **먼저 소켓 서버 → 다음 MCP 서버** 순서로 켜야 함
- 이미 다른 프로세스가 3055 포트를 잡고 있음 → `Get-NetTCPConnection -LocalPort 3055` 로 확인 후 정리

### `EADDRINUSE: 0.0.0.0:3055`

- 3055 포트가 이미 사용 중 (소켓 서버가 이미 떠 있는 것) → 새로 켤 필요 없음
- 다른 프로세스가 점유 중이라면 종료 후 재시작

### "이 세션에서 실행"과 "별도 터미널" 차이

| 방법 | 장점 | 단점 |
| --- | --- | --- |
| Claude 세션 안 (`! bun socket`) | 한 창에서 관리 | 세션 끝나면 소켓도 죽음 → 다음 세션에서 다시 켜야 함 |
| **별도 터미널** (권장) | 하루 종일 켜두고 여러 세션에서 재사용 | 창을 하나 더 열어야 함 |

### 등록 스코프 (`claude mcp add --scope`)

기본은 project 스코프. 여러 프로젝트에서 같은 MCP를 쓰려면 `--scope user` 로 등록.

```powershell
claude mcp add TalkToFigma --scope user -- bunx cursor-talk-to-figma-mcp
```

- `--scope project` — 현재 프로젝트에서만
- `--scope user` — 모든 프로젝트에서 사용
- 사용자 스코프에 등록해 두면 프로젝트 이동 시 재등록 불필요
