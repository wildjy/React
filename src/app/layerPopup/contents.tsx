
const PopupContents = () => {

  const InfoText = [
    {
      info: 'AAABBDDCDER',
    },
    {
      info: '가나나다라바마바사아자가나나다라바마바사아자가나나다라바마바사아자가나나다라바마바사아자',
    }
  ]

  return (
    <>
      <div>
        <p>sub_title...</p>
        <ul className="">
          {
            InfoText.map((txt, index) => (
              <li key={index} className='before:content-["-"] before:mr-2'>{txt.info}</li>
            ))
          }
        </ul>
      </div>
    </>
  )
};

export default PopupContents;