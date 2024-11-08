import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://image.jinhak.com/jinhakImages/svg/logo.svg"
          alt="Jinahk logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          {/* <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li> */}
          <li>진학닷컴 tailwindCss Toy Project</li>
          <li>
            Next.js + tailwindCSS 기반 프로젝트 임으로{" "}
            <a
              href="https://nextjs.org/docs/14/getting-started/installation"
              className="text-blue-700"
              target="_blank"
            >
              Next.js 공식문서
            </a>{" "}
            를
            <br />
            참고해서 개발하시면 좋습니다.
          </li>
          <li>
            app/[디렉토리명]/page.tsx 파일을 생성하면, 페이지 라우팅이 됨.{" "}
            <br />
            예를 들면, mockExam/page.tsx 이면 http://localhost:3000/mockExam 로
            접속 가능
          </li>
          <li>
            {" "}
            컴포넌트를 확인할 수 있는{" "}
            <a
              href="https://storybook.js.org/docs/get-started/install"
              className="text-blue-700"
              target="_blank"
            >
              Storybook
            </a>
            도 연결해놨으니,{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              npm run storybook
            </code>
            &nbsp;해당 명령어로 확인해주세요.
          </li>
        </ol>
      </main>
    </div>
  );
}
