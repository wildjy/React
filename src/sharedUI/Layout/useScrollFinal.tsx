// useScrollSpySectionFinal >>> useScrollIO >>> 개량버전
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import { ScrollSpySectionType } from './model/main.type';
import { throttle } from 'lodash';

type ScrollActiveAnchor = 'top' | 'center' | 'bottom';
interface UseScrollSpySwiperParams {
  slides: ScrollSpySectionType;
  swiperRef?: React.MutableRefObject<SwiperClass | null>;
  headerHeight?: number;
  navRef?: React.RefObject<HTMLElement | null>;
  activeAnchor?: 'top' | 'center' | 'bottom';
  disabled?: boolean;
}

interface UseScrollSpySwiperReturn {
  activeId: string;
  fixedBannerId: string | null;
  navHeight?: number;
  isFixed: boolean;
  isScroll: boolean;
  sectionProps: (
    id: string,
    enabled: boolean
  ) => { id?: string; ref?: (el: HTMLDivElement | null) => void };
  bannerProps: (
    id: string
  ) => { ref: (el: HTMLDivElement | null) => void };
  moveToSection: (id: string, force?: boolean) => void;
}

const getAnchorY = (type: ScrollActiveAnchor) => {
  switch (type) {
    case 'top':
      return 0;
    case 'center':
      return window.innerHeight / 2;
    case 'bottom':
      return window.innerHeight;
  }
};

export function useScrollFinal({
  slides,
  swiperRef,
  headerHeight = 0,
  navRef,
  disabled,
  activeAnchor = 'center',
}: UseScrollSpySwiperParams): UseScrollSpySwiperReturn {

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

  /* =======================
   * Refs
   ======================= */
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeIdRef = useRef<string>(slides[0]?.id);
  const isProgrammatic = useRef(false);
  const hasScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const bannerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* =======================
   * State
   ======================= */
  const [activeId, setActiveId] = useState<string>(slides[0]?.id);
  const [fixedBannerId, setFixedBannerId] = useState<string | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  /* =======================
   * Section & Banner Register
   ======================= */
  const registerSection = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const registerBanner = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      bannerRefs.current[id] = el;
    },
    []
  );

  const sectionProps = (id: string, enabled: boolean) =>
    enabled ? { id, ref: registerSection(id) } : {};

  const bannerProps = (id: string) => ({
    ref: registerBanner(id),
  });

  const sections = Object.values(sectionRefs.current).filter(
    Boolean
  ) as HTMLDivElement[];

  /* =======================
   * Swiper Sync
   ======================= */
  const syncSwiper = useCallback(
    (id: string) => {
      if (!swiperRef?.current) return;
      const index = slides.findIndex((s) => s.id === id);
      if (index !== -1) swiperRef.current.slideTo(index);
    },
    [slides, swiperRef]
  );


  /* =======================
   * Active Recompute (CORE)
   ======================= */
  const recomputeActive = useCallback(() => {
    if (disabled || isProgrammatic.current) return;

    if (!sections.length) return;

    const anchorY = getAnchorY(activeAnchor);

    const candidate = sections
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.id,
          distance: Math.abs(rect.top - anchorY),
        };
      })
      .sort((a, b) => a.distance - b.distance)[0];

    if (!candidate) return;

    if (activeIdRef.current !== candidate.id) {
      activeIdRef.current = candidate.id;
      setActiveId(candidate.id);
      syncSwiper(candidate.id);
    }
  }, [activeAnchor, disabled, syncSwiper]);

  /* =======================
   * Fixed Banner 계산 (⭐ 핵심)
   ======================= */
  const recomputeFixedBanner = useCallback(() => {
    if(!isMobile) return;
    if (!isFixed) {
      setFixedBannerId(null);
      return;
    }

    const anchorY = headerHeight + (navRef?.current?.offsetHeight ?? 0);

    let current: string | null = null;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      const section = sectionRefs.current[slide.id];
      if (!section) continue;

      const rect = section.getBoundingClientRect();

      console.log(slide)
      const nextSlide = slides[i + 1];
      const nextBanner = nextSlide
        ? bannerRefs.current[nextSlide.id]
        : null;
      const nextRect = nextBanner?.getBoundingClientRect();

      const isCurrent =
        rect.top <= anchorY &&
        (!nextRect || nextRect.top > anchorY);

      if (isCurrent) {
        current = slide.id;
        break; // ⭐ 중요
      }
    }

    setFixedBannerId(current);

  }, [headerHeight, isFixed, isMobile, navRef, slides]);

  /* =======================
   * Scroll Detect
   ======================= */
  useEffect(() => {
    if (disabled) return;

    // 디바이스 변경 시 현재 위치 기준 재계산
    requestAnimationFrame(() => {
      recomputeActive();
    });

    // activeId 기준 swiper 강제 동기화
    if (activeIdRef.current) {
      syncSwiper(activeIdRef.current);
    }
  }, [disabled, recomputeActive, syncSwiper]);

  /* =======================
   * Scroll Detect
   ======================= */
  useEffect(() => {
    if (disabled) return;

    const onScroll = throttle(() => {
      hasScrolledRef.current = true;
      setIsScroll(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScroll(false);
      }, 1200);

      recomputeActive();
      recomputeFixedBanner();
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      onScroll.cancel();
    };
  }, [disabled, recomputeActive, recomputeFixedBanner]);

  /* =======================
   * Mobile Reset
   ======================= */
  useEffect(() => {
    if (isMobile) {
      setIsScroll(false);
      hasScrolledRef.current = false;
    }
  }, [isMobile]);

  /* =======================
   * Click Move
   ======================= */
  const moveToSection = useCallback(
    (id: string, force = false) => {
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

      const CLICK_OFFSET = isSmallSection
        ? window.innerHeight * 0.25
        : -50;

      const offset = !isMobile
        ? headerHeight + CLICK_OFFSET
        : navHeight;

      const targetTopRaw =
        rect.top + window.scrollY - offset;

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
          window.removeEventListener('scroll', checkEnd);
          recomputeActive();
          recomputeFixedBanner();
        }
      };

      window.addEventListener('scroll', checkEnd);
    },
    [headerHeight, isMobile, navRef, recomputeActive, syncSwiper]
  );

  /* =======================
   * QuickNav Fixed
   ======================= */
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef?.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setIsFixed(rect.top - headerHeight < 0);
      setNavHeight(rect.height);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight, navRef]);

  /* =======================
   * Init Active
   ======================= */
  useEffect(() => {
    if (!slides.length) return;
    if (hasScrolledRef.current) return;

    const firstId = slides[0].id;
    activeIdRef.current = firstId;
    setActiveId(firstId);
    swiperRef?.current?.slideTo(0, 0);
  }, [slides, swiperRef]);

  return {
    activeId,
    fixedBannerId,
    navHeight,
    isFixed,
    isScroll,
    sectionProps,
    bannerProps,
    moveToSection,
  };
}
