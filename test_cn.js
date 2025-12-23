const { clsx } = require('clsx');
const { twMerge } = require('tailwind-merge');

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

const dimm = true;
const parentClass = undefined; // As in usage
const isPopupOpen = true;
const atAbsolute = false;

const result = cn('top-0 left-0', parentClass, {
    'opacity-100 visible z-[100] transition-all duration-200': isPopupOpen,
    'opacity-0 invisible z-[49] transition-all duration-200': !isPopupOpen,
    'fixed w-dvw h-dvh md:w-full flex justify-center items-center': !atAbsolute,
    'w-auto md:w-auto': atAbsolute,
    'bg-gray-1000 bg-opacity-65': dimm,
});

console.log('Result:', result);
