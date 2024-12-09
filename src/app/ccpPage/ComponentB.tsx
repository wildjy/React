
interface valueB {
  infoTxt?: string;
}

const ComponentB: React.FC<valueB> = ({ infoTxt }) => {
  return (
    <>
      <p>{ infoTxt }</p>
    </>
  )
};

export default ComponentB;