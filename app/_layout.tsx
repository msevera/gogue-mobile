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
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { splitLink } from '@/apollo/settings';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { PortalProvider } from '@gorhom/portal';
import { GlobalDrawerProvider } from '@/contexts/globalDrawerContext';
import { typePolicies } from '@/apollo/settings';
import { NewLectureProvider } from '@/contexts/newLectureContext';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '@/components/player/PlaybackService';
import { SetupService } from '@/components/player/SetupService';
import { useEffect } from 'react';

TrackPlayer.registerPlaybackService(() => PlaybackService);


OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
OneSignal.Notifications.requestPermission(true);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies,
  }),
});

// connectApolloClientToVSCodeDevTools(
//   client,
//   // the default port of the VSCode DevTools is 7095
//   "ws://localhost:7095",
// );

export default function RootLayout() {

  console.log('RootLayout');

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

  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <IntlProvider
            defaultLocale="en"
            locale="en"
            messages={en}
          >
            <AuthProvider>
              <PortalProvider>
                <GlobalDrawerProvider>
                  <NewLectureProvider>
                    <Slot />
                  </NewLectureProvider>
                </GlobalDrawerProvider>
              </PortalProvider>
            </AuthProvider>
          </IntlProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
