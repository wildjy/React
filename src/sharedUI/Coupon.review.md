# 🎨 코드 리뷰 피드백 (쿠폰 레이어 관련)

## 1️⃣ 데이터 구조 개선 (가독성 향상)

📍현재 코드

```js
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
```

위의 코드처럼 작성할시, 코드에서 해당 내용을 찾기 어렵기 때문에

```js
const textList = pCodes.map((code) => P_CODE_TEXT[code] || ['기타 쿠폰', '']);
const labelText = textList.flatMap((text) => text[0]);
const priceText = textList.flatMap((text) => text[1]);
```

이렇게 작성하게되면 배열의 어느순서에 뭐가 있는지 다시 위에 저 객체를 가서 파악해야됨.

🌟이렇게 작성하면 좋음 <br/>
밑에 코드처럼 객체로 선언하여, key, value 객체의 배열로 선언해주는 것이
직관적임

```js
export const couponList = [
  {
    couponId: 874,
    title: '교과성적 입력하면 5,000원 쿠폰',
    price: '5,000원',
  },
  {
    couponId: 875,
    title: '수시 모의지원 저정하면 10,000원 쿠폰',
    price: '10,000원',
  },
];
```

<br/>
<br/>

## 2️⃣ 상수 관리 위치 개선

📍현재 코드<br/>
컴포넌트 내부에 선언된 const

```js
const DEFAULT_IMG = 'https://image.jinhak.com/jinhakImages/react/coupon/coupon_default.svg';

const classInfoTextFontSize = `text-base sm:text-lg md:text-xl lg:text-md`;
const classInfoFontSizeSmall = `text-xs sm:text-md md:text-base lg:text-xs`;
const classButton = `md:min-w-[12rem] lg:min-w-[6.875rem] lg:h-[2rem] lg:text-xs text-white bg-gray-800`;
```

🌟개선코드 <br/>
해당 코드처럼 변하지 않는 상수값 ex) 이미지 URL, 클래스 string 같은 경우에는 컴포넌트 외부에 선언해주는것이 좋음.
컴포넌트 내부에 있을 경우 컴포넌트가 리렌더링 될때마다 다시 호출되기 때문

<br/><br/>

## 3️⃣ 타입 안정성 강화

📍현재 코드<br/>

```typescript
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
```

🌟개선점 <br/>

```typescript
type ButtonDataType =  {
          show: boolean;
          label: string;
          href: string;
          disabled?: boolean;
        }

 button?: ButtonDataType[];
```

쿠폰의 button 타입이 단일 객체와 객체의 배열의 혼합되어있어 타입안정성이 낮습니다.
어떤 때는 배열이고, 어떤 때는 객체 형식이라
현재 코드 구조상 배열로 통일하는 편이 더 일관되고 유지보수하기 좋습니다.

- 배열의 경우 길이가 1인 배열도 있기 때문
- 배열로 고정하면 `.map()`을 통한 렌더링이 일관되며, 단일 객체일 때 조건 분기를 없앨 수 있어 가독성과 타입 안정성이 동시에 높아진다.

<br/>

# 🛻전체 코드 리팩토링

## 4️⃣ UI 컴포넌트 구조화

중점으로 둔 부분

1. 각 쿠폰 컴포넌트의 독립적인 관리
2. 가독성
3. 불필요한 배열 삭제

코드를 몇개 봤을 때, 반복적인 부분이 생기면 배열로 생성해서 반복문으로 만들고 있는 것 같습니다 요소가 반복되면 반복문으로 처리하는게 좋지만,
<br/>
쿠폰의 경우는 쿠폰별로 약간씩 다 다르기 때문에
독립적인 컴포넌트로 생성해서 레이어에 각각 작성해주시는게 더더욱 가독성이 좋습니다.

```
📘 분리 기준
- UI 구조나 레이아웃이 동일하지만 데이터만 다르면 반복문 처리
- UI 구조 자체가 다르거나 배치/텍스트 스타일이 달라지면 독립 컴포넌트로 분리
```

```html
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
```

이런식으로 작은 단위로 예외 처리해주는 것이 아닌

```html
<div className="w-full">
  <CouponSwiperSlider
    freeMode={false}
    loop={false}
    slidesPerView={isTablet ? 1 : 'auto'}
    arrow={false}
    pager={{ show: true, addClass: '!bottom-0' }}
    addClass={'pb-5 md:pb-0 px-0 md:w-full lg:w-auto '}
  >
    <SwiperSlide
      style={{ width: isTablet ? '100%' : 'auto' }}
      className="flex items-center justify-center w-auto lg:mr-3 last:mr-0"
    >
    <!-- { 1번 쿠폰 } -->
      <CouponWrapper
        imgURL={JUNGSI_IMG['3kFreeCouponImg']}
        imgWidth={isTablet ? 340 : 180}
        imgHeight={164}
        addClass=" pt-1 lg:pt-1"
        isTablet={isTablet}
      >
        <DiscountCoupon3k5k
          isGradeNesin={false}
          isGradeRegularGrade={false}
          useDate={''}
        />
      </CouponWrapper>
    </SwiperSlide>

    <!-- { 2번 쿠폰 } -->
    <SwiperSlide
      style={{ width: isTablet ? '100%' : 'auto' }}
      className="flex items-center justify-center w-auto lg:mr-3 last:mr-0"
    >
      <CouponWrapper
        imgURL={JUNGSI_IMG['10kFreeCouponImg']}
        imgWidth={isTablet ? 338 : 214}
        imgHeight={121}
        isTablet={isTablet}
      >
        <DiscountCoupon10k
          isMockApplied={false}
          isExpired={false}
          usedDate={''}
        />
      </CouponWrapper>
    </SwiperSlide>

    <!-- { 3번 쿠폰 } -->
    <SwiperSlide
      style={{ width: isTablet ? '100%' : 'auto' }}
      className="flex items-center justify-center w-auto lg:mr-3 last:mr-0"
    >
      <CouponWrapper
        imgURL={JUNGSI_IMG['reportFreeOpenCouponImg']}
        imgWidth={isTablet ? 338 : 214}
        imgHeight={121}
        isTablet={isTablet}
      >
        <ReportFreeOpenCoupon
          isGradeRegularGrade={false}
          isMockApplied={false}
          isUsed={false}
          isExpired={false}
          notActualApplyuseDate={''}
          actualApplyuseDate={''}
        />
      </CouponWrapper>
    </SwiperSlide>
  </CouponSwiperSlider>
</div>
```

`<CouponWrapper>` `<ReportFreeOpenCoupon>` `<DiscountCoupon10k>` `<DiscountCoupon3k5k>`

등의 컴포넌트로 쪼개서 작성하는 것이 어떤 요소들이 있는지 명확하게 알수 있음.

<br/>
<br/>

## 🍀 리뷰를 통해 말씀드리고 싶은 점

지금 프론트 작업을 처음 하시는거라 props로 넘길 값,
컴포넌트 내부에서 처리 되어야 할 값이 아직 명확하게 정의가 안된 것 같습니다.

제 생각엔
UI 컴포넌트에서는 스타일 작성, 스타일 옵션에 관한 props 작성를 해주시고 데이터가 들어가야 될 자리에는 그냥 하드코딩으로 html 요소를 작성해주시는게 퍼블 -> 프론트 작업하기에는 작업하기엔 수월할 것 같습니다.

지금 방식은 매니저님이 컴포넌트를 짜놓은 데로 흘러가야 해서 다른 작업자분들도 확장성 있게 생각하긴 어려울 것 같아요~!

그래서 매니저님이 프론트엔드 작업 ( API 작업 까지 )하는 경우라면
지금 처럼 작성하셔도 괜찮은데,
퍼블 / 프론트 작업이 나뉘어져 있는 경우라면 데이터 들어가는 부분은 그냥 하드 코딩으로 넘겨주시는게 좋을 듯 싶습니다~!

다른 UI적 부분 작업은 지금처럼 해주셔도 되는데
데이터 들어간 부분까지 props로 잡아둘경우 api가 어떤 양식으로 response를 보내주냐에 따라서 매니저님이 작업한걸 뜯어서 다시 작업해야 되는 경우 or 데이터를 다시
가공해야 하는 작업이 발생해서요 ㅠ

이전에 저장소 할때 컴포넌트가 어떻게 변경되었는지 기록 및 공유를 못드린 것 같아서 이번에 쿠폰 작업할 때 작성하면서 작업해보았습니다~!

혹시 궁금하신거나 필요한게 있다면 언제든지 메신저 주세요~!
감사합니다 :)

<br/>
<br/>

## ✅ 핵심 요약

- 데이터 구조는 key-value 배열 형태로 직관적으로 관리
- 불변 상수는 컴포넌트 외부로 이동
- button 타입은 배열로 고정하여 타입 안정성 확보
- 쿠폰별 UI 구조가 다르면 독립 컴포넌트로 분리
- 반응형 여부(isMobile, isTablet)는 props 대신 내부 처리 권장
- 데이터 하드코딩 원칙: 퍼블리셔 → 프론트 분리 시 props 최소화

