import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Swiper } from 'swiper/react';
import { SwiperProps } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface swiperProps {
  children?: React.ReactNode,
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

const SwiperSlider: React.FC<swiperProps> = ({ children, id, image = false, slides, arrow = false, pager, onSlideChange }) => {
  const [contentWidth, setContentWidth] = useState<number>(0);
	const swiperRef = useRef<SwiperClass | null>(null);
  const paginationRef = useRef(null);

  // pagination
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
    const timer = setTimeout(() => {
      swiperRef.current?.update();
    }, 50);

    const handleResize = () => {
      if (swiperRef.current) {
        const contWidth = document.querySelector(`.container`);
        setContentWidth(contWidth?.clientWidth || 0);
        swiperRef.current?.update();
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

  const multiOnSlideChange = (swiper: SwiperClass) => {
    if(onSlideChange){
      onSlideChange(swiper);
    }
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
      swiperRef.current = swiper;
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
          {children}
        </Swiper>

        <div className={`controller`}>
          <button
            className={`swiper-${id}-prev absolute top-[50%] transform -translate-y-1/2 left-3 z-10 bg-white rounded-full  ${
              arrow ? '' : 'hidden'
            }`}
          >
            <img src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg" className="rotate-180 w-7 md:w-8 lg:w-10" alt="" />
          </button>
          <div className={` ${pager ? '' : 'hidden'}`}>
            <div ref={paginationRef} className={`swiper-pagination !-bottom-6 md:!-bottom-9 !z-0`}></div>
          </div>
          <button
            className={`swiper-${id}-next absolute top-[50%] transform -translate-y-1/2 right-3 z-10 bg-white rounded-full ${
              arrow ? '' : 'hidden'
            }`}
          >
            <img src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg" className="w-7 md:w-8 lg:w-10" alt="" />
          </button>
        </div>

        {/* <p>swiper-slide-active index: {swiperIndex}</p> */}
        {/* <p>a Active index: {activeIndex}</p> */}
      </div>
    </>
  );
};

export default SwiperSlider;