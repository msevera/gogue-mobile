import { createContext } from "react";
import { PortalHost } from '@gorhom/portal';

export const GlobalDrawerContext = createContext({});

export const GlobalDrawerProvider = ({ children }: { children: React.ReactNode }) => {
  return <GlobalDrawerContext.Provider value={{}}>
    {children}
    <PortalHost name="globalDrawer" />   
  </GlobalDrawerContext.Provider>;
};
