import React from 'react';

interface mapListProps {
  listProps: {name: string; value: boolean}[];
}

const Map: FC<mapListProps> = ({ listProps }) => {
  return (
    <>
      <ul>
        {
          listProps.map((item, index) => {
            console.log(item);
            return <li key={index}> {item.name}</li>
          })
        }
      </ul>
    </>
  )
}

export default Map;