'use client';

interface ArrowProps {
  type?: boolean | string;
}

export const Arrow: React.FC<ArrowProps> = ({ type = false }) => {
  return (
    <span>
      {type ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M4 3.01992e-07L8 6L0 6L4 3.01992e-07Z" fill="#EC0045" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M4 6L8 0L0 0L4 6Z" fill="#0069e2" />
        </svg>
      )}
    </span>
  );
};
