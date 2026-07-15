import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useScrollChrome } from '../hooks/useScrollChrome';

const ScrollChromeContext = createContext(false);

export function ScrollChromeProvider({ children }: { children: ReactNode }) {
  const hidden = useScrollChrome();
  return (
    <ScrollChromeContext.Provider value={hidden}>{children}</ScrollChromeContext.Provider>
  );
}

export function useChromeHidden() {
  return useContext(ScrollChromeContext);
}
