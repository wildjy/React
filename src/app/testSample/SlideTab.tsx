import React from 'react';

interface slideProps {
  slide: {
    imgUrl?: string;
    url?: string;
    active?: string;
    title?: string;
    sub_txt?: string;
  }
  image: boolean;
  isActive: boolean;
}

const SlideTabs: React.FC<slideProps> = ({ slide, image, isActive }) => {
  return (
    <div className={`text-center ${ isActive ? '' : ''}`}>
      <a href="#self" className={`${slide.active} block py-2 font-bold ${slide.active ? 'text-blue-700 border-b-[0.313rem] border-blue-700 ' : ''}`}>
        { image ? (
          <>
            <img src={slide.imgUrl} alt="" />
            <p className=''>{slide.url}</p>
          </>
        ) : (
          <>
            <p className='text-xl'>{slide.title}</p>
            <p className='text-0'>{slide.sub_txt}</p>
          </>
        )}
      </a>
    </div>
  )
}

export default SlideTabs;