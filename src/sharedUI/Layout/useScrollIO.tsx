// useScrollSpySectionFinal >>> 개량버전
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { ScrollSpySectionType } from "./model/main.type";
import { throttle } from "lodash";

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
  isScroll: boolean;
  sectionProps: (id: string, enabled: boolean) => { id?: string; ref?: (el: HTMLDivElement | null) => void };
  moveToSection: (id: string, force?: boolean) => void;
}

export function useScrollIO({
  slides,
  swiperRef,
  headerHeight = 0,
  navRef,
  threshold,
  rootMargin,
  disabled,
} : UseScrollSpySwiperParams): UseScrollSpySwiperReturn {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hasScrolledRef = useRef(false);
  const isProgrammatic = useRef(false);
  const activeIdRef = useRef<string | null>(null);

  const scrollTimeoutRef = useRef<number | null>(null);

  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>(slides[0]?.id);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDeskTop, setIsDeskTop] = useState(false);

  useEffect(() => {
    const handleResize = throttle(() => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      setIsDeskTop(w >= 1024);
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* section ref 등록 ...sectionProps(id, enabled) */
  const registerSection = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  // scroll 감지 여부 체크
  useEffect(() => {
    if(disabled) return;
    if(isMobile) return;

    const onScroll = () => {
      hasScrolledRef.current = true;
      //window.removeEventListener("scroll", onScroll);
      setIsScroll(true);

      // 이전 멈춤 타이머 취소
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 스크롤 멈춤 감지
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScroll(false);
      }, 3500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile, disabled]);

  useEffect(() => {
    if (!isMobile) return;

    // 모바일 진입 시 강제 초기화
    setIsScroll(false);
    if (scrollTimeoutRef.current !== null) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, [!isMobile]);


  // 초기 활성화 섹션 설정
  useEffect(() => {
    if (!swiperRef?.current) return;
    if (!slides.length) return;

    // 아직 스크롤 안 했으면
    if (!hasScrolledRef.current) {
      const firstId = slides[0].id;

      activeIdRef.current = firstId;
      setActiveId(firstId);

      // Swiper는 무조건 첫 슬라이드
      swiperRef.current.slideTo(0, 0);
    }
  }, [slides, swiperRef]);

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

  const recomputeActive = () => {
    const sections = Object.values(sectionRefs.current)
      .filter(Boolean) as HTMLDivElement[];

    const current = sections
      .map(el => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.id,
          top: rect.top,
          bottom: rect.bottom,
        };
      })
      .filter(v => v.bottom > 0 && v.top < window.innerHeight)
      .sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0];

    if (current && activeIdRef.current !== current.id) {
      activeIdRef.current = current.id;
      setActiveId(current.id);
      syncSwiper(current.id);
    }
  };

  /* 클릭 이동 */
  const moveToSection = (id: string, force = false) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    if (!force && activeIdRef.current === id) return;

    isProgrammatic.current = true;

    activeIdRef.current = id;
    setActiveId(id);
    syncSwiper(id);

    const navHeight = navRef?.current?.offsetHeight ?? 0;
    const rect = el.getBoundingClientRect();
    const isSmallSection = rect.height < window.innerHeight * 0.6;
    const CLICK_OFFSET =  isSmallSection
    ? window.innerHeight * 0.25
    : -50;
    console.log(el.getBoundingClientRect(), 'rect');
    console.log(rect.height, 'rect');
    console.log(navHeight, 'navHeight');

    // const PC_OFFSET = headerHeight + navHeight + CLICK_OFFSET;
    // const MOBILE_OFFSET = navHeight;

    // const targetTop =
    //   el.getBoundingClientRect().top + window.scrollY - (isMobile ? MOBILE_OFFSET : PC_OFFSET);

    // window.scrollTo({ top: targetTop, behavior: "smooth" });
    const PC_OFFSET = headerHeight + CLICK_OFFSET;
    const MOBILE_OFFSET = navHeight;

    const offset = isMobile ? MOBILE_OFFSET : PC_OFFSET;

    // 원래 계산값
    const targetTopRaw =
      el.getBoundingClientRect().top +
      window.scrollY -
      offset;

    // ✅ PC에서 마지막 섹션 대비 max scroll 보정
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const targetTop = Math.min(targetTopRaw, maxScroll);

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });

    const RELEASE_DISTANCE = 40;

    const checkEnd = () => {
      if (Math.abs(window.scrollY - targetTop) < RELEASE_DISTANCE) {
        isProgrammatic.current = false;
        window.removeEventListener("scroll", checkEnd);
        recomputeActive();
      }
    };
    window.addEventListener("scroll", checkEnd);
  };

  /* 스크롤 감지 */

  useEffect(() => {
    if (disabled) return;

    const sections = Object.values(sectionRefs.current).filter(
      Boolean
    ) as HTMLDivElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {

        if (disabled) return;
        if (isProgrammatic.current) return;

        const lastId = slides[slides.length - 1].id;
        const isBottom =
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 2;

        if (isBottom) {
          if (activeIdRef.current !== lastId) {
            activeIdRef.current = lastId;
            setActiveId(lastId);
            syncSwiper(lastId);
          }
          return;
        }

        const visible = isMobile
        ? entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        : entries
          .filter(e => e.isIntersecting)
          .sort((a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top)
          )[0];

        if (!visible) return;

        if (isMobile && visible.intersectionRatio < 0.15) return;

        const id = visible.target.id;
        if (!id || activeIdRef.current === id) return;

        activeIdRef.current = id;
        setActiveId(id);
        syncSwiper(id);

      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
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

      if (targetRect.top - headerHeight < 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight, navRef]);

  /* sentinel observer : section bottom 감지 */
  useEffect(() => {
    if (disabled) return;
    if (!isMobile) return;

    const sections = Object.values(sectionRefs.current).filter(
      Boolean
    ) as HTMLDivElement[];

    if (!sections.length) return;

    const sentinelObserver = new IntersectionObserver(
      (entries) => {
        // 클릭 이동 중에는 무시
        if (isProgrammatic.current) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId =
            (entry.target as HTMLElement).dataset.sectionId;

          if (!sectionId) return;

          if (activeIdRef.current === sectionId) return;

          // ✅ section 끝 도달
          activeIdRef.current = sectionId;
          setActiveId(sectionId);
          syncSwiper(sectionId);
        });
      },
      {
        threshold: 0,
        rootMargin: `-98% 0px 0px 0px`, // 👉 모바일: -98% 0px 0px 0px
      }
    );

    // section 내부 sentinel만 observe
    sections.forEach((sectionEl) => {
      const sentinel = sectionEl.querySelector(
        '.sentinel'
      ) as HTMLElement | null;

      if (sentinel) {
        sentinelObserver.observe(sentinel);
      }
    });

    return () => sentinelObserver.disconnect();
  }, [disabled, rootMargin, swiperRef, !isMobile]);

  return {
    activeId,
    isFixed,
    isScroll,
    sectionProps,
    moveToSection,
  };
}
