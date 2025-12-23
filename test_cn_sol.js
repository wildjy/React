const { clsx } = require('clsx');
const { twMerge, extendTailwindMerge } = require('tailwind-merge');

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

console.log('Original:', cn('bg-gray-1000 bg-opacity-65'));
console.log('Arbitrary Opacity:', cn('bg-gray-1000 bg-opacity-[0.65]'));
console.log('Slash Opacity:', cn('bg-gray-1000/65'));
console.log('Slash Opacity custom:', cn('bg-gray-1000/65'));
console.log('Reordered:', cn('bg-opacity-65 bg-gray-1000'));
