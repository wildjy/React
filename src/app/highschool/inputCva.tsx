import { cva } from 'class-variance-authority';

const InputVariants = cva('px-3 py-2 border-gray-900', {
  variants: {
    size: {
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg',
    },
    color: {
      base: 'border',
      ghost: 'border-b',
      success: 'border border-success',
      warning: 'border border-warning',
      error: 'border border-error',
      disabled: 'bg-baseGray',
    },
  },
});

const TestInput = ({ type, size, color, disabled }) => {
  const className = InputVariants({size, color });
  return <input type={ type } className={ className } disabled={ disabled } />
}

export default TestInput;