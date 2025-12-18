import { ButtonLink } from '../Button/Link';
export const classButton = `md:min-w-[12rem] lg:min-w-[6.875rem] lg:h-[2rem] lg:text-xs text-white bg-gray-800`;

export const CouponButton = ({
  title,
  url,
  disabled,
}: {
  title: string;
  url: string;
  disabled: boolean;
}) => {
  return (
    <ButtonLink
      href={url}
      addClass={`grow-0 min-w-[90%] ${classButton}`}
      disabled={disabled}
    >
      {title}
    </ButtonLink>
  );
};
