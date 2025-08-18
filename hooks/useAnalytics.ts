import { useAnalytics as useSegmentAnalytics } from '@segment/analytics-react-native';
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { User } from '@/apollo/__generated__/graphql';

const hasSegmentKey = Boolean(process.env.EXPO_PUBLIC_SEGMENT_WRITE_KEY);

export const useAnalytics = () => {
  const { authUser } = useAuth();
  const { identify, track, screen, reset } = hasSegmentKey ? useSegmentAnalytics() : {};

  const userData = useMemo(() => {
    return {
      workspaceId: authUser?.workspaces?.[0]?.workspaceId,
      userName: `${authUser?.firstName} ${authUser?.lastName}`,
      email: authUser?.email,
      timezone: authUser?.timezone
    }
  }, [authUser?.id])

  return {
    track: (name: string, data?: any) => {
      if (!hasSegmentKey) return;

      track(name, {
        ...data,
        user: {
          ...userData
        }
      });
    },
    screen: (name: string, data: any) => {
      // screen(name, {
      //   ...data,
      //   user: {
      //     ...userData
      //   }
      // });
    },
    identify: (user: User) => {
      if (!hasSegmentKey) return;

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