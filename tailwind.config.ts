import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sharedUI/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts ,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '360px', // 360px
        'md': '720px', // 720px : mobile
        'lg': '1024px', // 1024px
        'xl': '1440px',
        '2xl': '1920px',
      },
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '3xs': '0.688rem', // 11px
        '2xs': '0.75rem', // 12px
        xs: '0.813rem', // 13px
        s: '0.875rem', // 14px
        md: '0.938rem', // 15px
        base: '1rem', // base: 16px
        mobile: '2.22vw', // mobile: 16px 2.22vw, 24px=3.33vw
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
        'thin': '100',
        'exlight': '200',
        'light': '300',
        'normal': '400',
        'md': '500',
        'semi': '600',
        'bold': '700',
        'exbold': '800',
      },
      spacing: {
        '1': '0.125rem', // 2px
        '2': '0.25rem', // 4px
        '3': '0.5rem', // 8px
        '4': '0.75rem', // 12px
        '5': '1rem', // 16px:base
        '6': '1.25rem', // 20px
        '7': '1.5rem', // 24px
        '8': '2rem', // 32px
        '9': '2.5rem', // 40px
        '10': '5rem', // 80px
      },
      margin: {
        'center': '0 auto',
      },
      width: {
        'mobile': '720px',
        'tablet': '1080px',
        'laptop': '1440px',
        'desktop': '1920px',
      },
      colors: {
        'baseGray': '#EEEEEE',
        'success': '#07bc0c',
        'warning': '#f1c40f',
        'error': '#FF2361',
        'blue': {
          '50': '#E3F2FD',
          '100': '#BBDEFC',
          '200': '#90C9FA',
          '300': '#63B4F8',
          '400': '#41A4F7',
          '500': '#2094F5',
          '600': '#1B7DEE',
          '700': '#1B73D4',
          '800': '#005FC1',
          '900': '#1245A3',
          '1000': '#0C3176',
        },
        'gray': {
          '50': '#F7F7F7',
          '100': '#F2F2F2',
          '200': '#E9E9E9',
          '300': '#D9D9D9',
          '400': '#C4C4C4',
          '500': '#999999',
          '600': '#666666',
          '700': '#555555',
          '800': '#434343',
          '900': '#272727',
          '1000': '#000000',
        },
        'grayBlue': {
          '50': '#F8F9FA',
          '100': '#F1F3F5',
          '200': '#E9ECEF',
          '300': '#DEE2E6',
          '400': '#CED4DA',
          '500': '#ADB5BD',
          '600': '#868E96',
          '700': '#495057',
          '800': '#343A40',
          '900': '#212529',
          '1000': '#070809',
        },
      },
      borderRadius: {
        'full': '5rem'
      },
    },
  },
  plugins: [],
};
export default config;
