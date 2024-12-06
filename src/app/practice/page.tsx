import { createContext } from 'react';

// const CounterContext = createContext();

// function CounterProvider({ children }) {
//   return <CounterContext.Provider>{children}</CounterContext.Provider>;
// }

function Value() {
  return <h1>1</h1>;
}

function Buttons() {
  return (
    <div>
      <button className='py-1 px-3 border'>+</button>
      <button className='py-1 px-3 border'>-</button>
    </div>
  );
}


const PracticePage = () => {
  return (
    <>
        <div>
          <Value />
          <Buttons />
        </div>
    </>
  )
}

export default PracticePage;