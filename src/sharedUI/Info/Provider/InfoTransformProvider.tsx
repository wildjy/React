import React, { createContext, useContext } from 'react';

export type InfoTransformType = "rec" | "rec1" | "recBg" | "recCustom" | "recLine";

interface InfoTransformContextType {
  type: InfoTransformType;
}

const InfoTransformContext = createContext<InfoTransformContextType | undefined>(undefined);

export const useInfoTransformContext = () => {
  const ctx = useContext(InfoTransformContext);
  if(!ctx) throw new Error("useInfoTransformContext must be used within InfoTransformProvider");

  return ctx;
}

interface InfoTransformProviderProps {
  type: InfoTransformType;
  children: React.ReactNode;
}

export const InfoTransformProvider: React.FC<InfoTransformProviderProps> = ({ type, children }) => {
  return (
    <InfoTransformContext.Provider value={{ type }}>
      {children}
    </InfoTransformContext.Provider>
  )
}