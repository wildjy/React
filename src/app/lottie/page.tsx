"use client";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import sampleAnimation from "../../public/lottie/sample-animation.json";

export default function LottiePage() {
  const [lottieIcon, setLottieIcon] = useState<object[]>([]);
  const lottieOneRef = useRef<LottieRefCurrentProps | null>(null);
  const lottieMultipleRef = useRef<any[]>([]);

  useEffect(() => {
    // Lottie JSON 데이터를 비동기적으로 불러오는 예시
    const fetchLottieData = async () => {
      const loaded = await Promise.all([
        import("../../public/lottie/sample-animation.json"),
        import("../../public/lottie/sample-lottie2.json"),
      ]);
      setLottieIcon(loaded.map(m => m.default));
    };
    fetchLottieData();
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Lottie Animation Page</h1>
      <p className="text-lg text-center">
        This page demonstrates the integration of Lottie animations in a Next.js
        application.</p>
      <div>
        <Lottie
          lottieRef={lottieOneRef}
          animationData={sampleAnimation} // Lottie JSON 데이터 전달
          loop
          autoplay
        />
        <button onClick={() => lottieOneRef.current?.play()}>Play</button>
        <button onClick={() => lottieOneRef.current?.pause()}>Pause</button>
        <button onClick={() => lottieOneRef.current?.goToAndStop(0, true)}>Reset</button>
      </div>

      <div className="w-5 h-5">
        {/*

        3️⃣ map + ref 제어 (최후의 수단)
          const refs = useRef<any[]>([]);

          ✔ 가능은 함
          ❌ 타입/유지보수 지옥
          ❌ 실무에선 거의 안 씀
        */}
      {lottieIcon.map((data, index) => {
        console.log("animationData:", data);
        return (
          <div key={index} className="mb-8">
            <Lottie
              animationData={data} // Lottie JSON 데이터 전달
              loop
              autoplay
            />
          </div>
        );
      })}
      </div>
    </div>
  );
}