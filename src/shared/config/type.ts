import { min } from "lodash";

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export type ViewportDeviceState = {
  isSmallMobile: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isPC: boolean;
  isLargePC?: boolean;
};

export const VIEWPORT_BREAKPOINTS = {
  minSmallMobile: 480,
  minMobile: 768,
  minTablet: 1024,
  minPc: 1280,
};