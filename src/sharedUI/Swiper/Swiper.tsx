import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface swiperProps {
  id?: number,
  slides: {
    active?: string,
    title?: string,
    sub_tit?: string,
    url?: string,
    imgUrl?: string
  }[],

  onSlideChange: (swiper: any) => void,
}

const SwiperComponent: React.FC<swiperProps> = ({ id, slides, onSlideChange }) => {
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRefs = useRef<SwiperClass[]>([]);

  useLayoutEffect(() => {
    const activeSlide = () => {
      const swiperWrap = document.querySelector(`.swipers-${id}`);
      if(swiperWrap) {
        console.log(swiperRefs);
        console.log(swiperWrap);
        console.log(swiperIndex);
        const slides = swiperWrap.querySelectorAll('.swiper-slide a');
        slides.forEach((slide, index) => {
          setActiveIndex(index);
          if (slide.classList.contains('active')) {
            swiperRefs.current[swiperIndex]?.slideTo(index, 100, false)
          }
        });
      }
    }
    activeSlide();
  }, [])

  const paginationRef = useRef(null);
  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index:number, className?: string) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };
  const multiOnSlideChange = (swiper: SwiperClass) => {
    onSlideChange(swiper);
    setSwiperIndex(swiper.realIndex);
  }
  return (
    <>
      <div className={`swipers-${id} relative`}>
        <Swiper
          modules={[FreeMode, Navigation, Pagination, Autoplay]}
          freeMode
          autoplay={false} // { delay: 2500 }
          loop={false}
          spaceBetween={0}
          slidesPerView={'auto'}
          className='visible !important'
          navigation= {{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={pagination} // {{type: 'fraction', clickable: true }}
          onSwiper= {(swiper: SwiperClass) => {
            // console.log(swiper)
            swiperRefs.current[swiperIndex] = swiper;
          }}
          onActiveIndexChange= {(swiper: SwiperClass) => {
            // console.log(swiper)
          }}
          onBeforeInit= {(swiper: SwiperClass) => {
            // console.log(swiper)
          }}
          onSlideChange= {multiOnSlideChange}
        >
          {
            slides.map((slide, index) => (
              <SwiperSlide
                key={index}
                style={{ width: 'auto' }}
                className="pr-5 last:pr-0 flex justify-center items-center w-auto border-slate-400 !important"
              >
                <a href={slide.url} className={`${slide.active} block py-2 font-bold ${slide.active ? 'text-blue-700 border-b-[0.313rem] border-blue-700 ' : ''}`}>
                  <img src={slide.imgUrl} alt="" />
                  <p>{slide.title}</p>
                  <p>{slide.sub_tit}</p>
                </a>
              </SwiperSlide>
            ))
          }
          {/* <SwiperSlide className="flex justify-center items-center px-5 w-auto h-10 bg-slate-400">Slide 1</SwiperSlide>
          <SwiperSlide className="flex justify-center items-center px-5 w-[300px] h-10 bg-slate-400">Slide 1</SwiperSlide>
          <SwiperSlide className="flex justify-center items-center px-[7rem] w-auto h-10 bg-slate-400">Slide 1</SwiperSlide>
          <SwiperSlide className="flex justify-center items-center px-5 w-auto h-10 bg-slate-400">Slide 1</SwiperSlide> */}

          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
        <div ref={paginationRef} className="swiper-pagination"></div>
        <p>swiper-slide-active index: {swiperIndex}</p>
        {/* <p>a Active index: {activeIndex}</p> */}
      </div>
    </>
  );
};

export default SwiperComponent;