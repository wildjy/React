import { useEffect, useState } from 'react';

/**
 * window.matchMedia 기반으로 미디어쿼리 구독 상태를 반환합니다.
 * CSS 엔진과 동일한 기준을 사용하므로 DevTools 모바일 보기 수치와 정확히 일치합니다.
 *
 * @param query - CSS 미디어쿼리 문자열 (예: "(max-width: 480px)")
 * @returns 현재 미디어쿼리 매칭 여부
 */
export const useMediaQueryStore = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);

    return () => {
      mql.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};
