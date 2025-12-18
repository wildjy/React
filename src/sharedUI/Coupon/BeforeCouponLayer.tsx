import Image from 'next/image';
import  LayerPopup  from '../LayerPopup/LayerPopup';
import { SwiperSlide } from 'swiper/react';
import { CouponSwiperSlider } from './CouponSwiperSlider';
import { ButtonLink } from '../Button/Link';
import { cn } from "../common/cn";

interface CouponLayerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  isTablet: boolean;
  coupons: {
    id: number;
    pCode: number | string | (number | string)[];
    infoText?: string | React.ReactNode;
    finalScore: boolean;
    exfire?: boolean;
    button?:
      | {
          show: boolean;
          label: string;
          href: string;
          disabled?: boolean;
        }
      | {
          show: boolean;
          label: string;
          href: string;
          disabled?: boolean;
        }[];
  }[];
}

export const CouponLayer: React.FC<CouponLayerProps> = ({
  coupons,
  isOpen,
  onClose,
  isMobile,
  isTablet,
}) => {
  const SusiPCode = [874, 875, 876, 877, 878]; // 수시
  const JungsiPCode = [879, 880, 881, 882, 883, 884, 885, 886]; // 정시

  const P_CODE_TEXT: Record<string | number, [string, string]> = {
    874: ['교과성적 입력하면 ', '5,000원'],
    875: ['수시 모의지원 저정하면 ', '10,000원'],
    876: ['교과성적 입력하면', ''],
    877: ['모평성적 입력하면', ''],
    878: ['수시 합격예측 ', '10,000원'],
    879: ['수능성적 입력하면 ', '3,000원'],
    880: ['수능+내신성적 입력하면 ', '5,000원'],
    881: ['정시 모의지원 저장하면', '10,000원'],
    882: ['정시 모의지원 저장하면', '10,000원'],
    883: ['가채점 성적입력 하면', ''],
    884: ['실채점 모의지원 하면', ''],
    885: ['정시 합격예측', '10,000원'],
  };

  const JUNGSI_IMG: Record<number, string> = {
    1: 'https://image.jinhak.com/jinhakImages/react/coupon/j_coupon_zip.svg',
    2: 'https://image.jinhak.com/jinhakImages/react/coupon/j_coupon_dc.svg',
    3: 'https://image.jinhak.com/jinhakImages/react/coupon/j_coupon_free.svg',
  };

  const DEFAULT_IMG =
    'https://image.jinhak.com/jinhakImages/react/coupon/coupon_default.svg';

  const classInfoTextFontSize = `text-base sm:text-lg md:text-xl lg:text-md`;
  const classInfoFontSizeSmall = `text-xs sm:text-md md:text-base lg:text-xs`;
  const classButton = `md:min-w-[12rem] lg:min-w-[6.875rem] lg:h-[2rem] lg:text-xs text-white bg-gray-800`;

  return (
    <LayerPopup
      type="plain"
      close={false}
      closeType="white"
      isOpen={isOpen}
      OpenEvent={onClose}
    >
      <LayerPopup.Body>
        <div
          className={`
            flex flex-col items-center justify-center
            px-6 sm:px-12 md:px-7 py-8 lg:px-8
            w-full md:w-[28.75rem] md:h-[40rem]
            lg:max-w-[59rem] lg:w-full lg:h-[28.75rem]
          `}
          style={{
            background: isMobile
              ? 'linear-gradient(180deg, #63CDFF -4.01%, #EDC9C9 49.49%)'
              : 'linear-gradient(180deg, #63CDFF 18.25%, #EDC9C9 76.52%)',
          }}
        >
          {/* header  */}
          <div
            className={`w-full lg:pb-4 text-center lg:text-left
            bg-[calc(100%-3.5rem)] bg-no-repeat bg-[length:auto_100%]
            ${
              coupons.length > 1
                ? 'lg:bg-[url(https://image.jinhak.com/jinhakImages/react/images/coupon_object.png)]'
                : ''
            }
            `}
          >
            <Image
              src="https://image.jinhak.com/jinhakImages/react/images/title_coupon.png"
              width={152}
              height={27}
              alt="COUPON"
            />
          </div>

          <div className="w-full">
            <CouponSwiperSlider
              freeMode={false}
              loop={false}
              slidesPerView={isTablet ? 1 : 'auto'}
              arrow={false}
              pager={{ show: true, addClass: '!bottom-0' }}
              addClass={'pb-5 md:pb-0 px-0 md:w-full lg:w-auto '}
            >
              {coupons.length > 0 ? (
                coupons.map((coupon, index) => {
                  const pCodes = Array.isArray(coupon.pCode)
                    ? coupon.pCode.map(Number)
                    : [Number(coupon.pCode)];

                  const textList = pCodes.map(
                    (code) => P_CODE_TEXT[code] || ['기타 쿠폰', '']
                  );
                  const labelText = textList.flatMap((text) => text[0]);
                  const priceText = textList.flatMap((text) => text[1]);

                  return (
                    <SwiperSlide
                      key={coupon.id}
                      style={{ width: isTablet ? '100%' : 'auto' }}
                      className="flex items-center justify-center w-auto lg:mr-3 last:mr-0"
                    >
                      <div
                        className={`w-full
                        h-[23rem] sm:h-[26rem] md:h-[30rem] lg:w-[17rem] lg:h-[21.75rem]
                        rounded-xl lg:bg-white/30
                      `} // coupon height control
                      >
                        <div
                          className={`${cn(
                            'py-[1rem] lg:p-5 w-full h-full flex flex-col items-center justify-center',
                            coupon.id === 1 && 'pt-1 lg:pt-1'
                          )}`}
                        >
                          <div
                            className={`${cn(
                              'pt-1 lg:pt-1 px-8 sm:px-10 lg:px-0', // image size control
                              coupon.id === 1 && 'px-10 sm:px-15 lg:px-0' // image size control
                            )}`}
                          >
                            <Image
                              src={JUNGSI_IMG[coupon.id] || DEFAULT_IMG}
                              width={
                                isTablet
                                  ? coupon.id === 1
                                    ? 340
                                    : 338
                                  : coupon.id === 1
                                  ? 180
                                  : 214
                              }
                              height={coupon.id === 1 ? 164 : 121}
                              alt={'쿠폰 이미지'}
                            />
                          </div>
                          {/* info text */}
                          <div className="flex flex-col items-center justify-center w-full mt-auto text-center">
                            {coupon.id === 3 ? (
                              <div className={`${classInfoTextFontSize}`}>
                                {/* 3번째 쿠폰 */}
                                <div
                                  className={`pb-2 mb-2 border-b border-[#E69292] lg:border-gray-300 border-dashed`}
                                >
                                  <p className="text-center">
                                    <b>가채점 수능성적 입력</b>하면 발급!
                                  </p>
                                  <p
                                    className={`mt-1 ${classInfoFontSizeSmall}`}
                                  >
                                    <span className="pr-3">발급/사용기간</span>
                                    2025.11.13 ~ 2025.12.04
                                  </p>
                                </div>
                                <div>
                                  <p className="text-center">
                                    <b>실채점 최초 모의지원</b>할 때 발급!
                                  </p>
                                  <p
                                    className={`mt-1 ${classInfoFontSizeSmall}`}
                                  >
                                    <span className="pr-3">발급/사용기간</span>
                                    2025.12.05 ~ 2025.12.31
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className={`${classInfoTextFontSize} `}>
                                {/* 1, 2번째 쿠폰 */}
                                <p
                                  className={`${
                                    coupon.id !== 1 &&
                                    'text-lg sm:text-xl md:text-2xl lg:text-md'
                                  }`}
                                >
                                  {labelText[0]} {coupon.id !== 1 && <br />}
                                  <b>{priceText[0]} 쿠폰</b>
                                  {Array.isArray(coupon.pCode) ? (
                                    <>
                                      ,
                                      <br />
                                      {labelText[1]} <b>{priceText[1]} 쿠폰</b>
                                      을 드립니다.
                                    </>
                                  ) : (
                                    '을 드립니다.'
                                  )}
                                </p>
                                {/* 발급 사용기간 */}
                                <div>
                                  <p
                                    className={`${cn(
                                      `mt-2 md:mt-5 lg:mt-2 ${classInfoFontSizeSmall}`,
                                      coupon.id !== 1 && 'mt-5'
                                    )}`}
                                  >
                                    <span className="pr-3">
                                      {coupon.id === 2
                                        ? '발급기간'
                                        : '발급/사용기간'}
                                    </span>
                                    {/* 실채점/가채점 구분 */}
                                    {coupon.finalScore
                                      ? '2025.12.05 ~ 2025.12.31'
                                      : '2025.11.13 ~ 2025.12.04'}
                                  </p>
                                  {/* 사용기간 */}
                                  {coupon.exfire && (
                                    <p
                                      className={`mt-2 ${classInfoFontSizeSmall}`}
                                    >
                                      <span className="pr-3">사용기간</span>
                                      <b className="text-red-800">
                                        발급 후 24시간
                                      </b>
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center w-full mt-auto gap-x-2">
                            {coupon.button &&
                              (Array.isArray(coupon.button) ? (
                                coupon.button.map((btn, idx) => (
                                  <ButtonLink
                                    key={idx}
                                    href={btn.href || '#/'}
                                    addClass={`${cn(
                                      `flex-1 min-w-[auto] ${classButton}`,
                                      btn.disabled && 'text-white bg-[#BFBEBE]'
                                    )}`}
                                    disabled={btn.disabled}
                                  >
                                    {btn.label}
                                  </ButtonLink>
                                ))
                              ) : (
                                <ButtonLink
                                  href={coupon.button.href || '#/'}
                                  addClass={`grow-0 min-w-[90%] ${classButton}`}
                                  disabled={coupon.button.disabled}
                                >
                                  {coupon.button.label}
                                </ButtonLink>
                              ))}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })
              ) : (
                <p>loading swiper-slide..</p>
              )}
            </CouponSwiperSlider>
          </div>
        </div>

        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-[1]">
          <button
            type="button"
            className={`
              w-8 h-8 md:w-9 md:h-9
              bg-center bg-no-repeat bg-[length:60%_60%]
              bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_close_white.svg')]
            `}
            onClick={onClose}
          >
            <span className="sr-only">팝업 닫기</span>
          </button>
        </div>
      </LayerPopup.Body>
    </LayerPopup>
  );
};
