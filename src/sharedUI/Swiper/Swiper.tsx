import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperProps } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface swiperProps {
  id?: number,
  image?: boolean,
  arrow?: boolean,
  pager?: boolean,
  slides: {
    active?: string,
    title?: string,
    sub_txt?: string,
    url?: string,
    imgUrl?: string
  }[],
  onSlideChange?: (swiper: SwiperClass) => void,
}

const SwiperSlider: React.FC<swiperProps> = ({ id, image = false, slides, arrow = true, pager, onSlideChange }) => {
  //const [swiperIndex, setSwiperIndex] = useState(0);
  // const [isVisible, setIsVisible] = useState(false); // 처음 상태
  // const [isBeginning, setIsBeginning] = useState(true); // 처음 상태
  // const [isEnd, setIsEnd] = useState(false); // 마지막 상태
  const [contentWidth, setContentWidth] = useState<number>(0);
	const swiperRef = useRef<SwiperClass | null>(null);
  const paginationRef = useRef(null);
  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index: number, className?: string) {
      return (
        '<span class="' +
        className +
        '"><span class="sr-only">' +
        (index + 1) +
        '</span></span>'
      );
    }
  };


  useEffect(() => {
    // const activeButton = () => {
    //   const swiperWrap = document.querySelector(`.swipers-${id}`);
    //   if(swiperWrap) {
    //     const width = swiperWrap.querySelector('.swiper-slide')?.clientWidth || 0;
    //     const length = swiperWrap.querySelectorAll('.swiper-slide').length;
    //     const activeValue = contentWidth < width * length;
    //     setIsVisible(activeValue);
    //   };
    // }

    const timer = setTimeout(() => {
      swiperRef.current?.update();
    }, 50);

    const handleResize = () => {
      if (swiperRef.current) {
        const contWidth = document.querySelector(`.container`);
        setContentWidth(contWidth?.clientWidth || 0);
        swiperRef.current?.update();
        // activeButton();
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    }
  }, [contentWidth]);

  // active slide
	useLayoutEffect(() => {
		const activeSlide = () => {
			const swiperWrap = document.querySelector(`.swipers-${id}`);
			if (swiperWrap) {
				const slides = swiperWrap.querySelectorAll('.swiper-slide a');
				slides.forEach((slide, index) => {
					if (slide.classList.contains('active')) {
						swiperRef.current?.slideTo(index, 100, false)
					}
				});
			}
		}
		activeSlide();
	}, []);

  // const handleSwiperInit = (swiper: SwiperClass) => {
  //   setIsBeginning(swiper.isBeginning);
  //   setIsEnd(swiper.isEnd);
  // };

  // const updateNavigationState = (swiper: SwiperClass) => {
  //   setIsBeginning(swiper.isBeginning);
  //   setIsEnd(swiper.isEnd);
  // };

  // const handlePrev = () => {
  //   swiperRef.current?.slidePrev()
  // }

  // const handleNext = () => {
  //   swiperRef.current?.slideNext()
  // }

  const multiOnSlideChange = (swiper: SwiperClass) => {
    if(onSlideChange){
      onSlideChange(swiper);
    }
    // setSwiperIndex(swiper.realIndex);
    // updateNavigationState(swiper)
  }

  const swiperOption: SwiperProps = {
    freeMode: true,
    autoplay: false, // { delay: 2500 }
    loop: false,
    spaceBetween: 0,
    slidesPerView: 'auto',
    className: 'visible !important',
    watchOverflow: true,
    navigation : {
      nextEl: `.swiper-${id}-next`,
      prevEl: `.swiper-${id}-prev`,
    },
    pagination: pagination, // {{type: 'fraction', clickable: true }}
    onSwiper: (swiper: SwiperClass) => {
      // console.log(swiper)
      swiperRef.current = swiper;
      // handleSwiperInit(swiper);
    },
    onActiveIndexChange: (swiper: SwiperClass) => {
      console.log(swiper)
    },
    onBeforeInit: (swiper: SwiperClass) => {
      console.log(swiper)
    },
    onSlideChange: multiOnSlideChange,
    onResize: (swiper: SwiperClass) => {
      swiper.update()
    },
  }

  return (
    <>
      <div className={`swipers-${id} relative`}>
        <Swiper
          modules={[FreeMode, Navigation, Pagination, Autoplay]}
          {...swiperOption}
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              style={{width: 'auto'}}
              className="pr-5 last:pr-0 flex justify-center items-center w-auto border-slate-400 !important"
            >
              <a
                href={slide.url}
                className={`${slide.active} block py-2 font-bold ${
                  slide.active
                    ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
                    : ''
                }`}
              >
                {image ? (
                  <img src={slide.imgUrl} alt="" />
                ) : (
                  <>
                    <p className="text-lg">{slide.title}</p>
                    {/* <p className='text-md'>{slide.sub_txt}</p> */}
                  </>
                )}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`controller`}>
          <button
            className={`swiper-${id}-prev absolute y_center left-4 z-10 bg-white rounded-full  ${arrow ? '' : 'hidden'}`}
          >
            <img
              src="https://image.jinhak.com/jinhakImages/react/icon/arrow_off.svg"
              className="w-8 md:w-9"
              alt=""
            />
          </button>
          <div className={` ${pager ? '' : 'hidden'}`}>
            <div ref={paginationRef} className={`swiper-pagination`}></div>
          </div>
          <button
            className={`swiper-${id}-next absolute y_center right-4 z-10 bg-white rounded-full ${arrow ? '' : 'hidden'}`}
          >
            <img
              src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
              className="w-8 md:w-9"
              alt=""
            />
          </button>
        </div>

        {/* <p>swiper-slide-active index: {swiperIndex}</p> */}
        {/* <p>a Active index: {activeIndex}</p> */}
      </div>
    </>
  );
};

export default SwiperSlider;