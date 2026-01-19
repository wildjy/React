"use client";
import { cn } from "@/sharedUI/common/cn";
// import { useScrollSpySection } from "@/sharedUI/Layout/useScrollSpySection";
import { useEffect, useRef, useState } from "react";
import { SwiperClass, SwiperSlide } from "swiper/react";
import { A1_BANNER_REPORT_BOTTOM_1003_PC, pcSection, QuicSwiperSlides } from "./mockData";
import { throttle } from "lodash";
import { SwiperSlider } from "@/sharedUI/Swiper/SwiperSlider";
import { useScrollFinal } from "@/sharedUI/Layout/useScrollFinal";

export default function SectionScrollPage() {
  const headerHeight = 0;
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

  const swiperRef = useRef<SwiperClass | null>(null);
  const quickNavRef = useRef<(HTMLDivElement | null)>(null);

  const {
    activeId,
    isFixed,
    isScroll,
    sectionProps,
    moveToSection,
  } = useScrollFinal({
    slides: QuicSwiperSlides,
    swiperRef,
    headerHeight,
    navRef: quickNavRef,
    activeAnchor: isMobile ? 'top' : 'center', // 🔥 기본 추천
  });

  return (
    <div className="relative">

      <div className="min-h-[500px] bg-gray-600">
        <p className="fixed top-10 left-0 text-white bg-black">{isMobile ? `isMobile ${activeId}` : `isPc ${activeId}`}</p>
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
                {QuicSwiperSlides.map((slide, index) => {
                  const isActive = slide.id === activeId;
                  return (
                    <SwiperSlide
                      key={slide.id}
                      onClick={() => {
                        moveToSection(slide.id as string);
                      }}
                      className={`swiper-slide
                        ${isActive
                          ? 'bg-black text-white '
                          : ''
                        }
                        flex items-center justify-center w-auto
                        bg-[#E1E6EB] text-gray-600 rounded-full
                      `}
                      style={{
                        width: 'auto'
                      }}
                    >
                      <div className="flex items-center justify-center px-7 py-2 text-sm sm:text-sm">
                        <p>
                          {slide.id} {slide.title}
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
          <div className="fixed bottom-0 w-1/2 right-0 z-[1000]">
            {activeId}
            {QuicSwiperSlides.map((slide) => {
              const activeIndex = QuicSwiperSlides.findIndex(s => s.id === activeId);
              const navActiveId = QuicSwiperSlides[activeIndex + 1]?.id ?? activeId;
              const navActiveText = QuicSwiperSlides[activeIndex]?.title ?? activeId;
              return (
                <div
                  key={slide.id}
                  // onClick={() => moveToSection(slide.id as string)}
                  onClick={() => {
                    if (activeId) {
                      moveToSection(activeId, true);
                    }
                  }}
                  // className={`${slide.id === navActiveId ? ' block bg-grayBlue-900 text-white' : 'hidden text-gray-800'} p-2  border border-gray-300 m-1`
                  className={`
                    ${cn(`opacity-0 invisible absolute bottom-0 right-0 m-1 text-gray-800 p-2 border border-gray-300 bg-white transition-all duration-200 rounded-md cursor-pointer`,
                    isScroll && `text-red-400 ${slide.id === navActiveId && 'opacity-100 visible bg-grayBlue-900 text-white'}`,
                  )}`
                }>
                {navActiveText} {activeId}
                </div>
              )
            })}
          </div>
        )}
      </MainContWrapper>

      <MainContWrapper {...sectionProps('section1', true)}>
        Section 1
        <p>맞춤정보</p>
        <div className="md:flex">
          <div className="grow min-h-[300px] odd:bg-gray-100 even:bg-gray-400">BOX 1</div>
        </div>
        <div className="sentinel w-full h-[1px] bg-red-400" data-section-id="section1"> </div>
      </MainContWrapper>

      <MainContWrapper type='onlyPc'>
        PC 전용 A1 배너 영역
      </MainContWrapper>

      <MainContWrapper {...sectionProps('section2', true)}>

        <div className="min-h-[700px] bg-green-400">
          Section 2
          <p>합격예측</p>
        </div>
        <div className="sentinel w-full h-[1px] bg-red-400" data-section-id="section2"> </div>
      </MainContWrapper>

      {isTablet && (
        <MainContWrapper>
          <div className="border border-gray-300">
            1024이상일때만 노출 A1 배너 영역
          </div>
        </MainContWrapper>
      )}

      <MainContWrapper {...sectionProps('section3', true)} type="bg">

        <div className="min-h-[250px] bg-red-400">
          Section 3
          <p>대입정보</p>
        </div>
        <div className="sentinel w-full h-[1px] bg-red-400" data-section-id="section3"> </div>
      </MainContWrapper>

      <MainContWrapper {...sectionProps('section4', true)}>
        <div className="min-h-[850px] bg-purple-400">
          Section 4
          <p>Shorts</p>
        </div>
        <div className="sentinel w-full h-[1px] bg-red-400" data-section-id="section4"> </div>
      </MainContWrapper>

      <MainContWrapper {...sectionProps('section5', true)}>

        <div className="min-h-[600px] bg-orange-400">
          Section 5
          <p>TOP트렌드</p>
        </div>
        <div className="sentinel w-full h-[1px] bg-red-400" data-section-id="section5"> </div>
      </MainContWrapper>

      <div className="min-h-[300px] bg-gray-300">
        Footer
      </div>
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
      <div id={id} ref={ref} className={cn('content-padding mx-auto max-w-screen-xl py-0', addClass)}>
        {children}
      </div>
    </div>
  )
}