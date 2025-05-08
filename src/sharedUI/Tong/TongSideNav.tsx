'use client';
import { cn } from "../common/cn";

interface TongSideNavProps {
  children?: React.ReactNode;
}

export const TongSideNav: React.FC<TongSideNavProps> = ({  }) => {
  type mainNaviType = {
    menu: string;
    href?: string;
    active?: boolean;
    disabled?: boolean;
    new?: boolean;
    sub?: {
      sub_menu: string;
      href?: string;
      active?: boolean;
      disabled?: boolean;
      new?: boolean;
    }[];
  };

  const mainNavi: mainNaviType[] = [
    {
      menu: '메뉴 1',
      href: 'https://tong.jinhak.com/',
      active: true,
      new: true,
      sub: [
        { sub_menu: '학생기본정보보', href: '#/', new: true },
        { sub_menu: '학생부교과', href: '#/', active: true },
        { sub_menu: '학생부비교과', href: '#/' },
        { sub_menu: '서브 4', href: '#/' },
      ],
    },
    { menu: '메뉴 2', href: '#/' },
    {
      menu: '메뉴 3',
      href: '#/',
      sub: [
        { sub_menu: '서브 1', href: '#/', disabled: true },
        { sub_menu: '서브 2', href: '#/' },
        { sub_menu: '서브 3' },
        { sub_menu: '서브 4' },
        { sub_menu: '서브 5' },
      ],
    },
    { menu: '메뉴 4' },
    { menu: '메뉴 5', href: '#/' },
    { menu: '메뉴 6', href: '#/' },
    {
      menu: '메뉴 7',
      href: '#/',
      sub: [
        { sub_menu: '서브 1', href: '#/' },
        { sub_menu: '서브 2', href: '#/' },
        { sub_menu: '서브 3', href: '#/' },
        { sub_menu: '서브 4', href: '#/' },
        { sub_menu: '서브 1', href: '#/' },
        { sub_menu: '서브 2', href: '#/' },
        { sub_menu: '서브 3', href: '#/' },
        { sub_menu: '서브 4', href: '#/' },
      ],
    },
  ];

  return (
    <div className="h-full pt-6 overflow-y-auto scroll">
      <ul>
        {mainNavi.map((navi, index) => (
          <li key={index}>
            <a
              {...(navi.href && !navi.disabled ? { href: navi.href } : {})}
              className={`
                ${cn(
                  [
                    `flex
                    pl-3 py-1
                    text-lg text-[#0a2b6e] hover:underline
                    bg-no-repeat bg-[url("https://image.jinhak.com/jinhakImages/tong/ico_consult_lnb.png")]
                    border-b border-[#0a2b6e]
                    relative
                    after:ml-1 after:text-red-500 after:text-xs after:font-bold`,
                  ],
                  { 'font-bold': navi.active, 'after:content-["N"]': navi.new, 'text-disabled-text': navi.disabled || !navi.href }
                )}`}
              style={{
                backgroundPosition: '154px 50%',
              }}
            >
              {navi.menu}
            </a>
            {navi.sub && (
              <ul className="py-3 pl-4">
                {navi.sub.map((subNavi, index) => (
                  <li key={index}>
                    <a
                      {...(subNavi.href && !subNavi.disabled ? { href: subNavi.href } : {})}
                      className={`
                        ${cn(
                          [
                            `flex
                          py-1
                          text-md hover:underline
                          relative
                          before:content-['-'] before:mr-1
                          after:ml-1 after:text-red-500 after:text-xs after:font-bold`,
                          ],
                          {
                            'font-bold': subNavi.active,
                            'after:content-["N"]': subNavi.new,
                            'text-disabled-text cursor-default': subNavi.disabled || !subNavi.href,
                          }
                        )}`}
                    >
                      {subNavi.sub_menu}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p className="absolute bottom-0 text-white">sd</p>
    </div>
  );
};
