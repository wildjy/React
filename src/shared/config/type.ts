export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export type ViewportDeviceState = {
  isSmallMobile: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isPC: boolean;
};

export const VIEWPORT_BREAKPOINTS = {
  smallMobileMax: 480,
  mobileMax: 768,
  tabletMax: 1024,
};