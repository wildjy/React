import { Meta, StoryFn } from '@storybook/react';
import { WrButton } from '../WrButton';

export default {
  title: 'UI/Button/WrButton',
  component: WrButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'utility', 'confirm', 'warning', 'delete', 'text'],
      description: '버튼 컬러 variant (WrButtonColors.ts 에서 색상 관리)',
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'text'],
      description: 'lg=48px / md=40px / sm=32px / text=링크형',
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} as Meta<typeof WrButton>;

const Template: StoryFn<typeof WrButton> = (args) => <WrButton {...args} />;

export const Default = Template.bind({});
Default.args = { variant: 'primary', size: 'md', children: 'Default' };

/* ── 전체 variant × size 매트릭스 ── */
export const AllVariants: StoryFn<typeof WrButton> = () => {
  const variants = ['primary', 'secondary', 'utility', 'confirm', 'warning', 'delete', 'text'] as const;
  const sizes = ['lg', 'md', 'sm'] as const;

  return (
    <div className="flex flex-col gap-6 p-6 bg-white">
      {sizes.map((size) => (
        <div key={size}>
          <p className="mb-2 text-sm font-bold text-gray-500 uppercase">{size}</p>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => (
              <WrButton key={variant} variant={variant} size={size}>
                {variant}
              </WrButton>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="mb-2 text-sm font-bold text-gray-500 uppercase">Text</p>
        <WrButton variant="text" size="text">텍스트 버튼</WrButton>
      </div>
    </div>
  );
};

export const DisabledStates: StoryFn<typeof WrButton> = () => {
  const variants = ['primary', 'secondary', 'utility', 'confirm', 'warning', 'delete', 'text'] as const;
  return (
    <div className="flex flex-wrap gap-3 p-6 bg-white">
      {variants.map((variant) => (
        <WrButton key={variant} variant={variant} size="md" disabled>
          {variant}
        </WrButton>
      ))}
    </div>
  );
};

export const WithIcons: StoryFn<typeof WrButton> = () => (
  <div className="flex flex-wrap gap-3 p-6 bg-white">
    <WrButton variant="primary" size="lg" startIcon={<span>📥</span>}>
      startIcon
    </WrButton>
    <WrButton variant="confirm" size="md" endIcon={<span>→</span>}>
      endIcon
    </WrButton>
    <WrButton variant="text" size="text" endIcon={<span>↗</span>}>
      텍스트 링크
    </WrButton>
  </div>
);
