"use client";
import { useState, ChangeEvent } from "react";
import DivComponent from './cva';

const TailwindGuidePage: React.FC = () => {
  return (
    <>

      <div className="p-6 w-tablet m-center">

        <h1 className="mb-5 text-2xl"><b>tailwind Component Guide</b></h1>

        <div className="mb-5">
          <p className="mb-4">기본문법 (React + TypeScript)</p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
import React, { HTMLAttributes } from 'react';

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  customProp?: string; // 추가 속성
}

const DivComponent: React.FC<DivProps> = ({ customProp, children, ...props }) => {
  return (
    <div {...props}>
      {customProp && <p>{customProp}</p>}
      {children}
    </div>
  );
};

export default DivComponent;
                `}
              </pre>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-4">1. import </p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
  import { cn } from "../common/cn";
  import { cva, VariantProps } from "class-variance-authority";

  // cn = twMerge + clsx 조합 함수
  // VariantProps: class-variance-authority 라이브러리에서 제공하는 클래스 변이 관련 기능을 사용하기 위한 타입.
  // cva 함수를 사용할 때 클래스의 변이를 지정하기 위해 필요한 속성들을 정의.

                `}
              </pre>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-4">2. Variants(조건별) setting </p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
const DivVariants = cva(
  ' default Style css ',
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      color: {
        base: "base ",
      },
      // ...props
    },
    defaultVariants: {
      size: "",
      color: "",
    },
  }
);
                `}
              </pre>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-4">3. Interface setting </p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
interface DivProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof DivVariants> {
  addClass?: string;
  value?: string;
};

// Omit 사용 이유: HTML 기본 속성 중 특정 속성을 제거하여 커스터마이징하거나, 다른 인터페이스와의 충돌을 방지하기 위함.
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
VariantProps<typeof InputVariants> {
  addClass?: string;
  value?: string;
};
                `}
              </pre>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-4">4. Component setting </p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
const DivComponent: FC<DivProps> = ({
  size,
  color,
  addClass,
  name,
  value,
  ...props
}) => {

  const className = DivVariants ({
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    color: color as "sm" | "md" | "lg" | "full" | undefined,
  });

  return (
    <div
    className={cn(className, addClass)}
    {...props}
    >
      {name} {value}
    </div>
  );
};

export default DivComponent;
                `}
              </pre>
            </div>

          </div>
        </div>

        <div className="mb-5">
          <p className="mb-4">1. 조건별 Style </p>

          <DivComponent />

          <div className="p-6 border border-gray-400">
            <p className="mb-3"></p>
            <div>
              <pre>
                {`
const ParentStyle = cva('default css..', {
  variants: {
    status: {
      true: 'text-sm active',
      false: 'text-lg inactive',
    },
  },
});

const ChildrenStyle = 'p-4 border border-blue-700';

interface DivProps { }

const DivComponent: FC<DivProps> = ({ ...props }) => {
  return (
    <>
      <div className={ParentStyle()}> // default css..
        test. cva 개별 Style
      </div>
      <div className={ParentStyle({status: 'true'})}>  // default css.. text-sm active
        status : true
        <p className={ChildrenStyle}>Children Style : className={ ChildrenStyle }</p> // p-4 border border-blue-700
      </div>
      <div className={ParentStyle({status: 'false'})}>  // default css.. text-lg inactive
        status : false
      </div>
    </>
  );
};

export default DivComponent;
                `}
              </pre>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TailwindGuidePage;