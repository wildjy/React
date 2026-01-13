"use client";
import { cn } from "@/sharedUI/common/cn";
import { useScrollSpySection } from "@/sharedUI/Layout/useScrollSpySection";
import { useEffect, useRef, useState } from "react";
import { SwiperClass, SwiperSlide } from "swiper/react";
import { A1_BANNER_REPORT_BOTTOM_1003_PC, pcSection, QuicSwiperSlides } from "./mockData";
import { throttle } from "lodash";
import { SwiperSlider } from "@/sharedUI/Swiper/SwiperSlider";

export default function SectionScrollPage() {
  const headerHeight = 60;
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDeskTop, setIsDeskTop] = useState(false);

  useEffect(() => {
    const handleResize = throttle(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        setIsDeskTop(window.innerWidth >= 1024);
      }

      checkMobile();
    }, 10);

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isTablet]);
  // console.log('isMobile:', isMobile);
  // console.log('isTablet:', isTablet);
  // console.log('isDeskTop:', isDeskTop);
  // const isMobile = useIsMobile();

  const swiperRef = useRef<SwiperClass | null>(null);
  const quickNavRef = useRef<(HTMLDivElement | null)>(null);

  const {
    activeId,
    isFixed,
    sectionProps,
    moveToSection,
  } = useScrollSpySection({
    slides: isMobile ? QuicSwiperSlides : pcSection,
    swiperRef,
    headerHeight,
    navRef: quickNavRef,
    threshold: isMobile ? [0.7] : 0,
    rootMargin: isMobile ? `-${headerHeight}px 0px -40% 0px` :  `-100% 0px 0px 0px`,
    //disabled: isMinTablet, // 모바일 비활성화
  });

  return (
    <div className="relative">

      <div className="min-h-[400px] bg-gray-600">

      </div>

      {isMobile && (
        <MainContWrapper type='onlyMobile' addClass="pt-6 pb-3 ">
          {/* <div className="bg-green-100">
            [Mobile] 메인 퀵 메뉴 영역
          </div> */}
          <div ref={quickNavRef} className="h-[2.25rem]">
            <div className={`${isFixed ? 'fixed left-0 w-full z-[100]' : ''} `} style={{ top: headerHeight }}>
              <SwiperSlider
                id="quick-swiper-1"
                active={1}
                loop={false}
                centeredSlides={false}
                spaceBetween={8}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                {QuicSwiperSlides.map((slide) => {
                  const isActive = slide.id === activeId;
                  return (
                    <SwiperSlide
                      key={slide.id}
                      onClick={() => {
                        moveToSection(slide.id as string);
                      }}
                      className={`swiper-slide
                        ${isActive
                          ? 'bg-[#000] text-white'
                          : ''
                        }
                        flex items-center justify-center w-auto
                        bg-[#E1E6EB] text-gray-600 rounded-full
                      `}
                      // [&.swiper-slide-active]:bg-grayBlue-900 [&.swiper-slide-active]:text-white
                      style={{
                        width: 'auto'
                      }}
                    >
                      <div className="flex items-center justify-center px-7 py-2 text-sm sm:text-sm">
                        <p>
                          {slide.title}
                        </p>
                      </div>
                    </SwiperSlide>
                  )}
                )}
              </SwiperSlider>
            </div>
          </div>
        </MainContWrapper>
      )}


      <MainContWrapper addClass="pt-5 pb-[3.125rem] bg-transparent lg:bg-gray-50">
        메인 퀵 메뉴 영역
        {!isMobile && (
          <div className="fixed bottom-0 right-0 z-[1000]">
            {activeId}
            {pcSection.map((slide) => {
              console.log('slide.id:', activeId);
              console.log('slide.id:', slide.id);
              const activeIndex = pcSection.findIndex(s => s.id === activeId);
              const navActiveId = pcSection[activeIndex + 1]?.id ?? activeId;
              console.log('activeIndex:', activeIndex);
              console.log('navActiveId:', navActiveId);
              return (
                <div
                  key={slide.id}
                  onClick={() => moveToSection(slide.id as string)}
                  className={`${slide.id === navActiveId ? ' block bg-grayBlue-900 text-white' : 'hidden text-gray-800'} p-2  border border-gray-300 m-1`
                }>
                {slide.id}{slide.title}
                </div>
              )
            })}
          </div>
        )}
      </MainContWrapper>


      <MainContWrapper {...sectionProps('sectionPC1', !isMobile)} addClass="md:bg-orange-400">
        본문 영역 1
        <div className="md:flex">
          <div {...sectionProps('section1', isMobile)} className="grow min-h-[400px] odd:bg-gray-100 even:bg-gray-400">맞춤정보</div>
          <div {...sectionProps('section2', isMobile)} className="grow min-h-[400px] odd:bg-gray-100 even:bg-gray-400">합격예측</div>
          <div {...sectionProps('section3', isMobile)} className="grow min-h-[400px] odd:bg-gray-100 even:bg-gray-400">대입정보</div>
        </div>
      </MainContWrapper>

      <MainContWrapper type='onlyPc' addClass="lg:py-[3.4375rem]">
        PC 전용 A1 배너 영역
      </MainContWrapper>

      <MainContWrapper {...sectionProps('sectionPC2', !isMobile)} addClass="md:bg-green-400">
        본문 영역 2
        <div {...sectionProps('section4', isMobile)} className="min-h-[400px] bg-green-400">Shorts</div>
      </MainContWrapper>

      {isTablet && (
        <MainContWrapper>
          <div className="border border-gray-300">
            1024이상일때만 노출 A1 배너 영역
          </div>
        </MainContWrapper>
      )}

      <MainContWrapper {...sectionProps('sectionPC3', !isMobile)} type="bg" addClass="md:bg-red-400">
         본문 영역 3
        <div {...sectionProps('section5', isMobile)} className="min-h-[400px] bg-red-400">TOP트렌드</div>
      </MainContWrapper>

      <MainContWrapper {...sectionProps('sectionPC4', !isMobile)} addClass="md:bg-blue-400">
        본문 영역 4
        <div className="min-h-[400px]">

        </div>
      </MainContWrapper>

      <MainContWrapper addClass="min-h-[400px] bg-gray-600">

      </MainContWrapper>
    </div>
  );
}

export type MainContWrapperProps = {
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
  type?: 'onlyPc' | 'onlyMobile' | 'bg' | 'notice';
  addClass?: string;
  children?: React.ReactNode;
};

export const MainContWrapper = ({ id, ref, type, addClass, children }: MainContWrapperProps) => {
  return (
    <div className={
      cn('contents-body ',
      type === 'onlyPc' && 'hidden lg:block',
      type === 'onlyMobile' && 'block md:hidden ',
      type === 'bg' && 'bg-white lg:bg-gray-50',
      type === 'notice' && 'border-t border-gray-50',
    )}>
      <div id={id} ref={ref} className={cn('content-padding mx-auto max-w-screen-xl py-[2.625rem]', addClass)}>
        {children}
      </div>
    </div>
  )
}