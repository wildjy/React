import React from 'react';

interface slideProps {
  slide: {
    active: string;
    title: string;
    sub_txt: string;
  }
  isActive: boolean;
}

const SlideTabs: React.FC<slideProps> = ({ slide, isActive }) => {
  return (
    <div className={`text-center ${ isActive ? '' : ''}`}>
      <a href="#self" className={`${slide.active} block py-2 font-bold ${slide.active ? 'text-blue-700 border-b-[0.313rem] border-blue-700 ' : ''}`}>
        <p className='text-xl'>{slide.title}</p>
        <p className='text-0'>{slide.sub_txt}</p>
      </a>
    </div>
  )
}

export default SlideTabs;