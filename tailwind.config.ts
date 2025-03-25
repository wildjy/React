import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sharedUI/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts ,jsx,tsx}",
  ],
  // important: true,
  theme: {
    extend: {
      screens: {
        portrait: { raw: '(orientation: portrait)' }, // 세로 화면
        landscape: { raw: '(orientation: landscape)' }, // 가로 화면
        'max-950': { max: '950px' }, // 360px
        // min-width 기준임
        sm: '480px', // mobile
        md: '768px', // tablet
        lg: '1024px', // laptop
        xl: '1280px', //  desktop
        '2xl': '1440px', // full
      },
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '4xs': '0.583rem', // 10px
        '3xs': '0.688rem', // 11px
        '2xs': '0.75rem', // 12px
        xs: '0.813rem', // 13px
        s: '0.875rem', // 14px
        md: '0.938rem', // 15px
        // smMobile: '4.166vw', // ~  480 : 20px = 4.166vw
        // mobile: '3.125vw', // ~  768 : 24px = 3.125vw
        // laptop: '1.75vw', // ~  1024 : 16px = 1.56, 18px = 1.75
        // desktop: '1.25vw', // ~ 1280 : 16px = 1.25, 18px = 1.4, 22px = 1.719vw, 24px = 1.875vw
        xsBase: '4.444vw', // ~ 360 : 16px
        smBase: '3.333vw', // 480 : 16px
        mdBase: '1rem', // 768 : 16px
        lgBase: '1rem', // 1024 : 16px
        base: '1rem', // base: 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px :2.77vw
        '2xl': '1.375rem', // 22px : 3.03vw
        '3xl': '1.5rem', // 24px
        '4xl': '1.625rem', // 26px
        '5xl': '2rem', // 32px
        '6xl': '2.375rem', // 38px
        '7xl': '2.625rem', // 42px
        '8xl': '2.875rem', // 46px
      },
      fontWeight: {
        thin: '100',
        exlight: '200',
        light: '300',
        normal: '400',
        md: '500',
        semi: '600',
        bold: '700',
        exbold: '800',
      },
      spacing: {
        1: '0.125rem', // 2px
        2: '0.25rem', // 4px
        3: '0.5rem', // 8px
        4: '0.75rem', // 12px
        5: '1rem', // 16px:base
        6: '1.25rem', // 20px
        7: '1.5rem', // 24px
        8: '1.75rem', // 28px
        9: '2rem', // 32px
        10: '2.25rem', // 36px
        11: '2.5rem', // 40px
        12: '2.75rem', // 44px
        13: '3rem', // 48px
        14: '3.25rem', // 52px
        15: '3.5rem', // 56px
        16: '3.75rem', // 60px
        17: '4rem', // 64px
        18: '4.25rem', // 68px
        19: '4.5rem', // 72px
        20: '4.75rem', // 76px
        21: '5rem', // 80px
      },
      width: {
        mobile: '768px',
        tablet: '1024px',
        laptop: '1280px',
        desktop: '1920px',
        content: '1280px',
      },
      margin: {
        center: '0 auto',
      },
      colors: {
        'disabled-text': '#C4C4C4',
        'disabled-line': '#C4C4C4',
        'disabled-bg': '#E0E0E0',
        baseGray: '#EEEEEE',
        success: '#07bc0c',
        warning: '#f1c40f',
        error: '#FF2361',
        blue: {
          50: '#eef6ff',
          100: '#bbe1ff',
          200: '#8dcfff',
          300: '#58bcff',
          400: '#25acff',
          500: '#009dff',
          600: '#008eff',
          700: '#007bf4',
          800: '#0069e2',
          900: '#0e49c3',
          1000: '#0C3176',
        },
        gray: {
          50: '#f2f2f2',
          100: '#e9e9e9',
          200: '#d9d9d9',
          300: '#c4c4c4',
          400: '#999999',
          500: '#666666',
          600: '#555555',
          700: '#434343',
          800: '#272727',
          900: '#272727',
          1000: '#000000',
        },
        grayBlue: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#abb7c2',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
          1000: '#070809',
        },
      },
      borderRadius: {
        full: '5rem',
      },
    },
  },
  plugins: [],
};

export default config;
