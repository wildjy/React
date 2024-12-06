
import { createContext } from 'react';

interface ContextType {
  title?: string;
  sub_txt?: string;
  info_txt?: string;
}

export const MyContext = createContext<ContextType[] | null>(null);