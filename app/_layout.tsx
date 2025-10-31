import { Slot } from 'expo-router';
import { AuthProvider } from '@/contexts/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { IntlProvider } from 'react-intl';
import en from '../i18n/en';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { errorLink, splitLink } from '@/apollo/settings';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { PortalProvider } from '@gorhom/portal';
import { GlobalDrawerProvider } from '@/contexts/globalDrawerContext';
import { typePolicies } from '@/apollo/settings';
import { NewLectureProvider } from '@/contexts/newLectureContext';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '@/components/player/PlaybackService';
import { SetupService } from '@/components/player/SetupService';
import { useEffect } from 'react';
import { CreateProvider } from '@/contexts/createContext';
import { createClient, AnalyticsProvider } from '@segment/analytics-react-native';
import { TrackScreensProvider } from '@/contexts/trackScreensContext';

const hasSegmentKey = Boolean(process.env.EXPO_PUBLIC_SEGMENT_WRITE_KEY);
const segmentClient = hasSegmentKey
  ? createClient({
    writeKey: process.env.EXPO_PUBLIC_SEGMENT_WRITE_KEY as string,
    trackAppLifecycleEvents: true,
    trackDeepLinks: true,
  })
  : undefined;

TrackPlayer.registerPlaybackService(() => PlaybackService);


OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
OneSignal.Notifications.requestPermission(true);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies,
  }),
  defaultOptions: {
    watchQuery: {
      notifyOnNetworkStatusChange: false,
    },
  },
});

// connectApolloClientToVSCodeDevTools(
//   client,
//   // the default port of the VSCode DevTools is 7095
//   "ws://localhost:7095",
// );

export default function RootLayout() {
  useEffect(() => {
    const fetchPlaybackState = async () => {
      try {
        await SetupService()
      } catch (error) {
        console.log('fetchPlaybackState error', error);
      }
    }
    fetchPlaybackState();
  }, []);

  const appTree = (
    <ApolloProvider client={client}>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <IntlProvider defaultLocale="en" locale="en" messages={en}>
            <AuthProvider>
              <TrackScreensProvider>
                <PortalProvider>
                  <GlobalDrawerProvider>
                    <NewLectureProvider>
                      <CreateProvider>
                        <Slot />
                      </CreateProvider>
                    </NewLectureProvider>
                  </GlobalDrawerProvider>
                </PortalProvider>
              </TrackScreensProvider>
            </AuthProvider>
          </IntlProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );

  return hasSegmentKey ? (
    <AnalyticsProvider client={segmentClient}>{appTree}</AnalyticsProvider>
  ) : (
    appTree
  );
}
