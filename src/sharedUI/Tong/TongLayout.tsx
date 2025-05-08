
'use client';
import React from 'react';
import { cn } from "../common/cn";
import TongContents from './TongContents';

interface TongType {
  children?: React.ReactNode;
}

interface TopProps {
  children?: React.ReactNode;
}

interface HeaderProps {
  children?: React.ReactNode;
}

interface GnbProps {
  children?: React.ReactNode;
}

interface TopSelectProps {
  children?: React.ReactNode;
}

interface ContainerProps {
  children?: React.ReactNode;
  addClass?: string;
}

interface FooterProps {
  children?: React.ReactNode;
}

interface TongProps extends React.FC<TongType> {
  Top: typeof Top;
  Header: typeof Header;
  Gnb: typeof Gnb;
  TopSelect: typeof TopSelect;
  Container: typeof Container;
  Footer: typeof Footer;
}

const ContCenter = `mx-auto w-[72.5rem]`;

const Tong: TongProps = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

const Top: React.FC<TopProps> = ({ children }) => {
  return (
    <div className="bg-[#f4f5f9] border-b-[0.125rem] border-[#e5e7e9]">
      <div className={`${cn('mx-auto w-[72.5rem]', '')}`}>{children}</div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div>
      <div className={`${cn(ContCenter, '')}`}>{children}</div>
    </div>
  );
};

const Gnb: React.FC<GnbProps> = ({ children }) => {
  return (
    <div className="border-b-[0.125rem] border-[#0a2b6e]">
      <div className={`${cn(ContCenter, '')}`}>{children}</div>
    </div>
  );
};

const TopSelect: React.FC<TopSelectProps> = ({ children }) => {
  return (
    <div className="TopSelect">
      <div className={`${cn(ContCenter, '')}`}>{children}</div>
    </div>
  );
};

const Container: React.FC<ContainerProps> = ({ children, addClass }) => {
  const slots = React.Children.toArray(children);
  return (
    <div className={`min-h-[62.5rem]`}>
      <TongContents
        addClass={`${cn(
          `ContLayout
          border-t border-gray-200
          `,
          addClass
        )}`}
      >
        <div className="flex items-stretch ">
          {slots.length > 0 ? (
            slots.slice(0, 2).map((slot, index) =>
              index === 0 ? (
                <div key={index} className="w-[11.625rem] border-r border-gray-200">
                  {slot}
                </div>
              ) : (
                <div key={index} className={`grow `}>
                  {slot}
                </div>
              )
            )
          ) : (
            <div>No data.</div>
          )}
        </div>
      </TongContents>
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <div className="border-t border-gray-200 bg-white relative z-[1]">
      <div className={`${cn(ContCenter, '')}`}>
        <div>ss</div>
      </div>
    </div>
  );
};

Tong.Top = Top;
Tong.Header = Header;
Tong.Gnb = Gnb;
Tong.TopSelect = TopSelect;
Tong.Container = Container;
Tong.Footer = Footer;

export default Tong;
