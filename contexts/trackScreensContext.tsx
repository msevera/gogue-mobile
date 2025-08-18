import { createContext, useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useGlobalSearchParams, usePathname, useSegments } from 'expo-router';

export const TrackScreensContext = createContext({

});

export const TrackScreensProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useGlobalSearchParams();
  const { screen } = useAnalytics();


  useEffect(() => {
    screen(segments.join('/'), {
      path: pathname,
      params,
    });
  }, [pathname, params]);

  return <TrackScreensContext.Provider value={{

  }}>
    {children}
  </TrackScreensContext.Provider>;
};
