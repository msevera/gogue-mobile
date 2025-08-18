import { useAnalytics as useSegmentAnalytics } from '@segment/analytics-react-native';
import { useGlobalSearchParams, usePathname, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { User } from '@/apollo/__generated__/graphql';

export const useAnalytics = () => {
  const pathname = usePathname();
  const router = useSegments()
  const params = useGlobalSearchParams();
  const { authUser } = useAuth();
  const { identify, track, screen, reset } = useSegmentAnalytics();

  console.log('route', pathname, router)

  useEffect(() => {
    // segmentClient.screen(route.name, {
    //   path: pathname,
    //   params,
    // });
  }, [pathname, params]);



  const userData = useMemo(() => {
    return {
      workspaceId: authUser?.workspaces?.[0]?.workspaceId,
      userName: `${authUser?.firstName} ${authUser?.lastName}`,
      email: authUser?.email,
      timezone: authUser?.timezone
    }
  }, [authUser?.id])

  return {
    track: (name: string, data: any) => {
      track(name, {
        ...data,
        user: {
          ...userData
        }
      });
    },
    screen: (name: string, data: any) => {
      track(name, {
        ...data,
        user: {
          ...userData
        }
      });
    },
    identify: (user: User) => {
      identify(user?.id as string, {
        workspaceId: user?.workspaces?.[0]?.workspaceId,
        userName: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        timezone: user?.timezone
      })
    },
    reset: () => {
      reset();
    }
  }

}