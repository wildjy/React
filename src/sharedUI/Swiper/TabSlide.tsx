
interface TabProps {
  active?: string;
  title?: string;
}

const TabSlide: React.FC<TabProps> = ({ slide }) => {
  return (
    <>
      <a
        href={slide.url}
        className={`${slide.active} block py-2 font-bold ${
          slide.active
            ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
            : ''
        }`}
      >
        <p className="text-lg">{slide.title}</p>
        {/* <p className='text-md'>{slide.sub_txt}</p> */}
      </a>
    </>
  )
}

export default TabSlide;