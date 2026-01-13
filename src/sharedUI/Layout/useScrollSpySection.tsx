/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { ScrollSpySectionType } from "./model/main.type";

interface UseScrollSpySwiperParams {
  slides: ScrollSpySectionType;
  swiperRef?: React.MutableRefObject<SwiperClass | null>;
  headerHeight?: number;
  navRef?: React.RefObject<HTMLElement | null>;
  threshold?: number[] | number;
  rootMargin?: string;
  disabled?: boolean;
}

interface UseScrollSpySwiperReturn {
  activeId: string;
  isFixed: boolean;
  sectionProps: (id: string, enabled: boolean) => { id?: string; ref?: (el: HTMLDivElement | null) => void };
  moveToSection: (id: string) => void;
}

export function useScrollSpySection({
  slides,
  swiperRef,
  headerHeight = 0,
  navRef,
  threshold = [0.1, 1],
  rootMargin,
  disabled,
} : UseScrollSpySwiperParams): UseScrollSpySwiperReturn {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isProgrammatic = useRef(false);
  const lastActiveIdRef = useRef<string | null>(null);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>(slides[0]?.id);

  /* section ref 등록 ...sectionProps(id, enabled) */
  const registerSection = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  const sectionProps = (id: string, enabled: boolean) => {
    return enabled ? { id, ref: registerSection(id) } : {};
  };

  /* Swiper 동기화 */
  const syncSwiper = (id: string) => {
    if (!swiperRef?.current) return;

    const index = slides.findIndex((s) => s.id === id);
    if (index !== -1) {
      swiperRef.current.slideTo(index);
    }
  };

  /* 클릭 이동 */
  const moveToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    if (lastActiveIdRef.current === id) return;

    isProgrammatic.current = true;
    lastActiveIdRef.current = id;
    setActiveId(id);
    syncSwiper(id);

    // const slideIndex = slides.findIndex((s) => s.id === id);
    // if (slideIndex !== -1) {
    //   swiperRef.current?.slideTo(slideIndex);
    // }

    const navHeight = navRef?.current?.offsetHeight ?? 0;
    const y =
      el.getBoundingClientRect().top +
      window.scrollY -
      (navHeight === 0 ? 40 :  (headerHeight + navHeight))

    window.scrollTo({ top: y, behavior: "smooth" });

    setTimeout(() => {
      isProgrammatic.current = false;
    }, 500);
  };

  /* 스크롤 감지 */
  useEffect(() => {
    if (disabled) return;

    const sections = Object.values(sectionRefs.current).filter(
      Boolean
    ) as HTMLDivElement[];

    if (!sections.length) return;
    console.log('headerHeight', headerHeight);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammatic.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const id = visible.target.id;
        console.log(id, '=== observed id===');
        if (!id || lastActiveIdRef.current === id) return;

        lastActiveIdRef.current = id;
        setActiveId(id);
        syncSwiper(id);

        // const slideIndex = slides.findIndex((s) => s.id === id);
        // if(slideIndex !== -1) {
        //   swiperRef.current?.slideTo(slideIndex);
        // }
      },
      {
        // threshold: [0.7],
        // rootMargin: `-${headerHeight}px 0px -40% 0px`,
        threshold: threshold ?? [0, 1],
        rootMargin: rootMargin ?? `-${headerHeight}px 0px -40% 0px`,
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [disabled, headerHeight, swiperRef, syncSwiper]);

  // QuickNav fixed 처리
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef?.current) return;
      const targetRect = navRef.current.getBoundingClientRect();
      // console.log('targetRect.top', targetRect.top);

      if (targetRect.top - headerHeight < 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight, navRef]);

  return {
    activeId,
    isFixed,
    sectionProps,
    moveToSection,
  };
}
