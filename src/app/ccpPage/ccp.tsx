import React from "react";
// import ComponentA from './ComponentA';
// import ComponentB from './ComponentB';
// import ComponentC from './ComponentC';

interface CCPPatternType {
  children: React.ReactNode;
};

interface CCPPatternProps extends React.FC<CCPPatternType> {
  partA: typeof ComponentA;
  partB: typeof ComponentB;
  partC: typeof ComponentC;
};

const CcpPatternPage: CCPPatternProps = ({ children }) => {
  return (
    <>
      <div>
        { children }
        {/* <ComponentA />
        <ComponentB />
        <ComponentC /> */}
      </div>
    </>
  )
};


interface ComponentProps {
  children?: React.ReactNode;
  title?: string;
  sub_txt?: string;
}
interface itemProps {
  children?: React.ReactNode;
}

const ComponentA:React.FC<ComponentProps> = ({ children}) => {
  return (
    <>
      <div className="item ComponentA">
        { children }
      </div>
    </>
  );
};

const ComHeader = ({ children } : ComponentProps) => {
  return (
    <>
      <p className="item-header">{ children }</p>
    </>
  )
}

CcpPatternPage.item = ({ children } : ComponentProps) => {
  return (
    <>
      <ComHeader>
        {children}
      </ComHeader>
    </>
  )
}

const ComponentB = ({ children, title, sub_txt } : ComponentProps ) => {
  return (
    <>
      <div className="ComB">
        {/* <span className="text-red-700">{ title }</span>
        <span className="text-blue-700">{ sub_txt }</span> */}
        { children }
      </div>
    </>
  );
};

const ComponentC = ({ children, title, sub_txt } : ComponentProps ) => {
  return (
    <>
      <p>
        <span>{ title }</span>
        <span>{ sub_txt }</span>
      </p>
    </>
  );
};

CcpPatternPage.partA = ComponentA;
CcpPatternPage.partB = ComponentB;
CcpPatternPage.partC = ComponentC;

export default CcpPatternPage;