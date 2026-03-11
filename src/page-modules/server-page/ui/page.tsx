import Image from "next/image";
import { fetchA1BannerData } from "@entities/banner/api/banner.api";
import { slides } from "@entities/banner/config/banner-urls";
import { BannerType, SlideType } from "@entities/banner/model";
import { BannerItemType } from "@entities/banner/model/banner.types";

// 서버 컴포넌트에서는 useEffect, useState 등 클라이언트 훅을 사용할 수 없습니다.

function fetchUser() {
  return new Promise((name) => {
    setTimeout(() => {
      name("Kim");
    }, 1000);
  });
}

export const NewServerPage = async () => {
  // 서버 컴포넌트에서는 useState, useEffect 등을 사용할 수 없으므로, 데이터를 직접 fetch하여 처리합니다.

  const user = await fetchUser();
  console.log(user); // 1초 후 "Kim"이 출력됩니다.

  const bannerUrl = await fetch('https://wads.jinhak.com/RealMedia/ads/adstream_sx.ads/U_jinhak/WmainBigA@x03', {
    next: { revalidate: 300 }, // 5분 캐시
  });

  const banner = await bannerUrl.text();
  console.log("TEST banner", banner);

  // a1_banner 값을 추출하여 bannerIds 배열을 생성합니다. 이때, a1_banner가 없는 슬라이드는 제외합니다.
  const slidesWithBannerOnly = slides.filter(
    (slide): slide is SlideType & { a1_banner: string } => Boolean(slide.a1_banner)
  );

  if(slidesWithBannerOnly.length === 0) {
    console.log("배너가 없는 슬라이드만 존재합니다.");
    return (
      <div className="container flex min-h-screen flex-col items-center py-2">
        <h1 className="mb-4 text-2xl font-bold text-center">
          <b className="block text-red-500">[Server 컴포넌트]</b>배너가 없는 슬라이드만 존재합니다.
        </h1>
      </div>
    );
  }

  // 4. 중복된 bannerId를 제거하여 고유한 bannerIds 배열을 생성합니다.
  const bannerIds = [
    ...new Set(slidesWithBannerOnly.map((slide) => slide.a1_banner)) // Set을 사용하여 중복 제거 (성능 향상 = 중복요청 X)
  ];

  console.log("slidesWithBannerOnly", slidesWithBannerOnly);
  console.log("bannerIds", bannerIds);

  // 서버 컴포넌트에서는 데이터를 직접 fetch(await)하여 처리합니다.
  const banners: BannerItemType[] = await fetchA1BannerData(bannerIds);
  console.log("bannerLists", banners);

  // fetch 성공한 a1_banner만 Set으로 보관
  const fetchedBannerSet = new Set(
    banners
      .map((b) => b.a1_banner)
      .filter((v): v is string => Boolean(v))
  );

  return (
    <div className="container flex min-h-screen flex-col items-center py-2">
      <h1 className="mb-4 text-2xl font-bold text-center">
        <b className="block text-red-500">[Server 컴포넌트]</b>slide의 a1_banner 값과 배너 ID 연결
      </h1>
      <div className="flex">
        {slides.map((slide, index) => {
           const hasBanner =
            !!slide.a1_banner && fetchedBannerSet.has(slide.a1_banner);
          // console.log("fetchedBannerSet", fetchedBannerSet.has(slide.a1_banner));
          return (
            <div key={index} className="m-2 flex flex-col items-center justify-center rounded border p-4">
              <p>{slide.name}</p>
              <p>{index}</p>
              <p>{hasBanner ? "배너 있음" : <span className="text-red-500">배너 없음</span>}</p>
            </div>
          )
        })}
      </div>
      <div className="flex">
        {banners.map((slide, index) => (
          <div key={index} className="m-2 flex flex-col items-center justify-center">
            <a href={slide.badge.clickUrl ?? '#/'}>
              <div>
                <Image
                  src={slide.badge?.imgPcUrl ?? ''}
                  alt=""
                  width={Number(slide.badge.imageWidth ?? '284')}
                  height={Number(slide.badge.imageHeight ?? '438')}
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
