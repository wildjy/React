import { VIEWPORT_BREAKPOINTS, ViewportDeviceState } from '@shared/config/type';
import { useMediaQuery } from 'react-responsive';

const { minSmallMobile, minMobile, minTablet, minPc } = VIEWPORT_BREAKPOINTS;

export const useViewportDevice = (): ViewportDeviceState => {
  // react-responsive는 window.matchMedia CSS 엔진을 사용하므로
  // DevTools 모바일 보기 수치와 정확히 일치합니다.
  const isSmallMobile = useMediaQuery({ maxWidth: minSmallMobile });
  const isMobile = useMediaQuery({ minWidth: minSmallMobile });
  const isTablet = useMediaQuery({ minWidth: minMobile });
  const isPC = useMediaQuery({ minWidth: minTablet });
  const isLargePC = useMediaQuery({ minWidth: minPc });

  return { isSmallMobile, isMobile, isTablet, isPC, isLargePC };
};