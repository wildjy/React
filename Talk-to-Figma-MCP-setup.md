# Talk to Figma MCP 설치/설정 기록

작성일: 2026-04-01
프로젝트: D:/React

## Quick Start (4단계)

1. Figma에서 MCP/플러그인 실행
2. 소켓 브리지 실행

```powershell
bunx cursor-talk-to-figma-socket
```

3. MCP 서버 실행

```powershell
pnpm run socket
```

4. Claude 실행 후 채널명 입력(채널 조인) -> Figma MCP 도구 사용

## 1) pnpm 확인

Windows에서 pnpm 사용 가능 여부 확인:

```powershell
pnpm -v
```

확인 결과:
- pnpm version: 9.15.3

## 2) Talk to Figma MCP 패키지 설치

프로젝트 루트(D:/React)에서 실행:

```powershell
pnpm add -D cursor-talk-to-figma-mcp
```

설치 결과:
- devDependencies에 cursor-talk-to-figma-mcp 추가됨

## 3) VS Code MCP 설정

파일: .vscode/mcp.json

```json
{
  "servers": {
    "talk-to-figma": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["exec", "cursor-talk-to-figma-mcp"]
    }
  }
}
```

## 4) 실행 순서 및 연결 점검

권장 실행 순서:

1. Figma에서 MCP/플러그인 실행
2. 소켓 브리지 실행

```powershell
bunx cursor-talk-to-figma-socket
```

3. MCP 서버 실행

```powershell
pnpm run socket
```

4. Claude 실행 후 채널명 입력(채널 조인)

- MCP 서버 로그에 `Please join a channel to start chatting` 메시지가 보이면 채널 조인 필요 상태
- Claude에서 채널명을 입력해 조인해야 Figma MCP 도구 호출이 가능함
- 예: `design-system`, `figma-main`

포트 리슨 확인(소켓 브리지 실행 후):

```powershell
Get-NetTCPConnection -LocalPort 3055 -State Listen
```

정상 연결 로그 예시:
- Connected to Figma socket server
- Please join a channel to start chatting
- Joined channel: <채널명>

## 5) 현재 상태

- pnpm 사용 환경: 완료
- MCP 패키지 설치: 완료
- VS Code MCP 설정: 완료
- 소켓 연결(3055): 정상
- 실사용 준비: 완료

## 6) 자주 발생하는 이슈

1. `error: Script not found "socket"`
- 원인: package.json scripts에 socket 스크립트가 없음
- 해결: package.json에 `"socket": "cursor-talk-to-figma-mcp"` 추가 후 `pnpm run socket` 실행

2. `Socket error: AggregateError`
- 원인: ws://localhost:3055 소켓 미기동
- 해결: Figma에서 MCP 실행 -> `bunx cursor-talk-to-figma-socket` 실행 -> `pnpm run socket` 순서로 재실행

3. `Failed to start server. Is port 3055 in use? (EADDRINUSE)`
- 원인: 이미 소켓 브리지 또는 다른 프로세스가 3055 포트를 사용 중
- 해결: 기존 3055 점유 프로세스를 종료하거나, 이미 브리지가 떠 있다면 `bunx cursor-talk-to-figma-socket` 단계는 생략하고 `pnpm run socket`만 실행

4. `Please join a channel to start chatting`
- 원인: Claude에서 채널 조인을 하지 않음
- 해결: Claude에서 채널명을 입력해 조인 후 MCP 도구 재호출

## 7) 빠른 점검 체크리스트

- [ ] pnpm 버전 확인 (`pnpm -v`)
- [ ] MCP 패키지 설치 확인 (`cursor-talk-to-figma-mcp`)
  - 확인 1: `pnpm list --depth -1 | findstr cursor-talk-to-figma-mcp`
  - 확인 2: `package.json`의 `devDependencies`에 `cursor-talk-to-figma-mcp` 존재 여부 확인
- [ ] `.vscode/mcp.json` 설정 확인
- [ ] Figma에서 MCP/플러그인 실행
- [ ] `bunx cursor-talk-to-figma-socket` 실행 (이미 3055 사용 중이면 생략)
- [ ] 포트 3055 리슨 확인
- [ ] `pnpm run socket` 실행 및 연결 로그 확인
- [ ] Claude 실행 후 채널명 입력(채널 조인) 완료
