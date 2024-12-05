
import { createContext, useContext } from 'react';

import Title from './title';
import Contents from './b';
import Button from './c';

const MyContext = createContext();

const LayerPopup = ({children}) => {
  return (
    <>
      <div>
        <MyContext.Provider value="Hello. Hershey's Cat World">
          {children}
        </MyContext.Provider>
      </div>
    </>
  )
}

export default LayerPopup;
