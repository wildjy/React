"use client";

import Image from "next/image";
import { fetchA1BannerData } from "@entities/banner/api/banner.api";
import { slides } from "@entities/banner/config/banner-urls";
import { BannerType, SlideType } from "@entities/banner/model";
import { BannerItemType } from "@entities/banner/model/banner.types";
import { useEffect, useState } from "react";
import {
  getUserDevice,
  isDesktop,
} from "@shared/lib/device-checker";
import { useViewportDevice } from "@shared/lib/hooks/useViewportDevice";


export const NewClientPage = () => {
  const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
  // console.log("userAgent", userAgent);
  const device = getUserDevice(userAgent);
  // console.log("device", device);
  // console.log("isDesktop", isDesktop(userAgent));

  const viewportDevice = useViewportDevice();

  console.log("isSmallMobile", viewportDevice.isSmallMobile);
  console.log("isMobile", viewportDevice.isMobile);
  console.log("isTablet", viewportDevice.isTablet);
  console.log("isPC", viewportDevice.isPC);
  console.log("isLargePC", viewportDevice.isLargePC);


  // 테스트용 더미 데이터 - 실제로는 fetchA1BannerData로 가져온 데이터를 사용해야 합니다.
  const bannerList: BannerType[] = [
    { bannerId: "B", title: "배너B" },
    { bannerId: "C", title: "배너C" },
    { bannerId: "A", title: "배너A" },
  ];

  // 1. bannerList의 bannerId를 키로 하는 Map을 생성하여 빠르게 조회할 수 있도록 합니다.
  const bannerMap = new Map(bannerList.map((banner) => [banner.bannerId, banner]));

  // 2. slides 배열을 순회하면서 a1_banner 값이 bannerId와 일치하는 배너 제목을 찾아서 새로운 배열을 만듭니다.
  const slidesWithBanner = slides.map((slide) => {
    const banner = bannerMap.get(slide.a1_banner ?? "");
    return {
      ...slide,
      bannerTitle: banner?.title || "배너 없음",
    };
  });

  // 3. a1_banner 값을 추출하여 bannerIds 배열을 생성합니다. 이때, a1_banner가 없는 슬라이드는 제외합니다.
  const slidesWithBannerOnly = slides.filter(
    (slide): slide is SlideType & { a1_banner: string } => Boolean(slide.a1_banner)
  );

  // 4. 중복된 bannerId를 제거하여 고유한 bannerIds 배열을 생성합니다.
  const bannerIds = [
    ...new Set(slidesWithBannerOnly.map((slide) => slide.a1_banner)) // Set을 사용하여 중복 제거 (성능 향상 = 중복요청 X)
  ];

  // useState, useEffect를 사용하여 클라이언트에서 데이터를 fetch하고 상태를 관리합니다.
  const [banners, setBanners] = useState<BannerItemType[]>([]);

  useEffect(() => {
    let active = true;

    (async () => {
      const data = await fetchA1BannerData(bannerIds);
      if (active) setBanners(data);
    })();

    return () => {
      active = false;
    };
  }, []);


  // fetch 성공한 a1_banner만 Set으로 보관
  const fetchedBannerSet = new Set(
    banners
      .map((b) => b.a1_banner)
      .filter((v): v is string => Boolean(v))
  );

  // console.log("bannerMap", bannerMap);
  // console.log("slidesWithBanner", slidesWithBanner);
  // console.log("slidesWithBannerOnly", slidesWithBannerOnly);
  // console.log("bannerIds", bannerIds);
  // console.log("bannerLists", banners);

  return (
    <div className="container flex min-h-screen flex-col items-center py-2">
      <h1 className="mb-4 text-2xl font-bold text-center">
        <b className="block text-blue-500">[Client 컴포넌트]</b>slide의 a1_banner 값과 배너 ID 연결
      </h1>

      <div>
        <p>
          {device} - {isDesktop(userAgent) === 'desktop' ? "데스크탑" : "모바일/태블릿"}
        </p>
        <p>
          {
            viewportDevice.isLargePC ?
            "현재 뷰포트: 라지 데스크탑" :
            viewportDevice.isPC ?
            "현재 뷰포트: 데스크탑" :
            viewportDevice.isTablet ? "현재 뷰포트: 태블릿" :
            viewportDevice.isMobile ? "현재 뷰포트: 모바일" :
            "현재 뷰포트: 작은 모바일"
          }
        </p>
      </div>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="m-2 flex flex-col items-center justify-center rounded border p-4">
            <p>{slide.name}</p>
            <p>{index}</p>
            <p>{!!slide.a1_banner && fetchedBannerSet.has(slide.a1_banner) ? "배너 있음" : <span className="text-red-500">배너 없음</span>}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        {banners.map((slide, index) => (
          <div key={index} className="flex relative gap-2">
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

            <div className="relative rounded-[32px] bg-[#dfeaf4]">
              <div className="absolute left-0 -bottom-[0px] z-10 flex h-[40px] w-[100px] items-center justify-center  rounded-tr-[32px] bg-white">
                <span className="absolute -left-[0px] top-[-48px] h-[48px] w-[48px] rounded-bl-[1.5rem] shadow-[0_1.5rem_0_0_#fff]"></span>
                <span className="absolute -right-[45px] bottom-[0px] h-[48px] w-[48px] rounded-bl-[1.5rem] shadow-[0_1.5rem_0_0_#fff]"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
