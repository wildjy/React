import React from 'react';

interface slideProps {
  slide: {
    active: string;
    url: string;
    imgUrl: string;
  }
  isActive: boolean;
}

const SlideThumbs: React.FC<slideProps> = ({ slide, isActive }) => {
  return (
    <div className={`text-center ${ isActive ? '' : ''}`}>
      <a href={slide.url} className={`${slide.active} block py-2 font-bold ${slide.active ? '' : ''}`}>
        <img src={slide.imgUrl} alt="" />
      </a>
    </div>
  )
}

export default SlideThumbs;