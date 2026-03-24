import { DeviceType, VIEWPORT_BREAKPOINTS, ViewportDeviceState } from '@shared/config/type';
import { UAParser } from 'ua-parser-js';

export const getUserDevice = (userAgent: string): DeviceType => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice().type;
  console.log('parser', parser);
  console.log('device', device);
  return device === 'mobile' || device === 'tablet' ? device : 'desktop';
};

/**
 *
 * @param obj object | string | undefined
 * @returns boolean
 * 객체가 비어있는지 확인하는 함수
 */
export const isEmpty = (obj: object | string | undefined) => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  } else if (typeof obj === 'string') {
    return obj.length < 1 ? true : false;
  } else if (typeof obj === 'number') {
    return obj === 0 ? true : false;
  }
};

/**
 * 디바이스가 데스크탑인지 확인하는 함수
 * @param userAgent string
 * @returns 'desktop' | 'mobile' | 'tablet'
 */
export const isDesktop = (userAgent: string) => {
  if (isEmpty(userAgent)) {
    return 'desktop';
  }
  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type || 'desktop';
  return deviceType === 'desktop' ? 'desktop' : deviceType;
};

export const getViewportDeviceState = (width: number): ViewportDeviceState => {
  return {
    isSmallMobile: width < VIEWPORT_BREAKPOINTS.smallMobileMax,
    isMobile:
      width >= VIEWPORT_BREAKPOINTS.smallMobileMax &&
      width < VIEWPORT_BREAKPOINTS.mobileMax,
    isTablet:
      width >= VIEWPORT_BREAKPOINTS.mobileMax &&
      width < VIEWPORT_BREAKPOINTS.tabletMax,
    isPC: width >= VIEWPORT_BREAKPOINTS.tabletMax,
  };
};

export const getCurrentViewportDeviceState = (): ViewportDeviceState => {
  if (typeof window === 'undefined') {
    return {
      isSmallMobile: false,
      isMobile: false,
      isTablet: false,
      isPC: true,
    };
  }

  return getViewportDeviceState(window.innerWidth);
};
