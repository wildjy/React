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
