
interface valueA {
  title?: string;
}

const ComponentA: React.FC<valueA> = ({ title }) => {
  return (
    <>
      <p>{ title }</p>
    </>
  )
};

export default ComponentA;