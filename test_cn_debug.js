const { clsx } = require('clsx');
const { twMerge } = require('tailwind-merge');

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

console.log('1:', cn('bg-gray-1000'));
console.log('2:', cn('bg-gray-1000 bg-opacity-65'));
console.log('3:', cn('bg-red-500 bg-opacity-65'));
console.log('4:', cn('bg-gray-1000 bg-white')); // Should allow last to win
console.log('5:', cn('bg-white bg-gray-1000'));
