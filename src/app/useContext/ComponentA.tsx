import { MyContext } from './context';
import { useContext } from "react";

const ComponentA = () => {
  const value = useContext(MyContext);
  console.log(value)
  if (!value) {
    return <p>No Data Available</p>;
  }

  return (
    <>
    <div className="mt-3">
      {
        value.map((txt, index) => (
          <div key={index}>
            <p className="text-blue-700">{txt.title}</p>
            <p className="text-green-700">{txt.sub_txt}</p>
          </div>
        ))
      }

      <p className="text-yellow-700">{value[2].info_txt}</p>
    </div>
    </>
  )
}

export default ComponentA;