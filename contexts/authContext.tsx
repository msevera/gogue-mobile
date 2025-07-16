import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import auth, { getAuth, FirebaseAuthTypes, connectAuthEmulator } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useApolloClient, useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { SIGN_IN, SET_PROFILE, GET_USER } from '@/apollo/queries/user';
import { GetUserQuery, GetUserQueryVariables, SetProfileMutation, SetProfileMutationVariables, SignInQuery, SignInQueryVariables, User } from '@/apollo/__generated__/graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { router, usePathname } from 'expo-router';
import { NotificationWillDisplayEvent, OneSignal } from 'react-native-onesignal';

GoogleSignin.configure();


if (__DEV__ && process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
  console.log('connecting to emulator', process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL as string);
  connectAuthEmulator(getAuth(), process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL as string);    
}

export type NotificationCustomDataType = {
  type: string,
  show_when_on_url: boolean,
}

export const AuthContext = createContext<{
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (user: Partial<User>) => Promise<void>;
  authUser?: User | null;
  isLoading: boolean;
  pendingDeepLink: string | null;
  setPendingDeepLink: (pendingDeepLink: string | null) => void;
  refetchAuthUser: () => Promise<void>;
}>({
  signInWithGoogle: async () => Promise.resolve(),
  signOut: async () => Promise.resolve(),
  setProfile: async (user: Partial<User>) => Promise.resolve(),
  authUser: null,
  isLoading: true,
  pendingDeepLink: null,
  setPendingDeepLink: () => { },
  refetchAuthUser: async () => Promise.resolve(),
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);
  const uidRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apolloClient = useApolloClient();
  const pathname = usePathname();

  const url = Linking.useURL();
  const [idToken, setIdToken] = useState('');

  const { data: { signIn } = {} } = useQuery<SignInQuery, SignInQueryVariables>(SIGN_IN, {
    onError: async (error) => {
      console.log('signIn error', JSON.stringify(error));
      await signOut();
    },
    onCompleted: async (data) => {
      console.log('signIn completed');
      setIsLoading(false);
    },
    skip: !idToken,
    variables: {
      idToken
    }
  });

  const authUser = signIn as User;

  const [refetchAuthUser] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GET_USER, {    
    variables: {
      id: authUser?.id
    },
    onError: (error) => {
      console.error('refetcAuthUser error', JSON.stringify(error));
    }
  });

  useEffect(() => {
    const fn = async () => {
      try {
        if (authUser?.id) {
          await AsyncStorage.setItem('workspaceId', authUser?.workspaces?.[0]?.workspaceId);

          try {
            OneSignal.login(authUser.id);
            OneSignal.User.addAlias('auth_context', `${authUser.workspaces?.[0]?.workspaceId}-${authUser.id}`)
          } catch (error) {
            console.error('One signal logging in error', error);
          }

        } else {
          await AsyncStorage.removeItem('workspaceId');
        }
      } catch (e) {
        console.error('Set workspaceId error', e);
      }
    }

    fn();

  }, [authUser?.id]);

  useEffect(() => {
    const handler = (event: NotificationWillDisplayEvent) => {
      const url = event.notification.launchURL as string;
      const { hostname, path } = Linking.parse(url);
      const eventPathname = `/${hostname}/${path}`;
      const { show_when_on_url } = event.notification.additionalData as NotificationCustomDataType;

      // do not display the notification if the user is already on the page, and if event says so
      if (!show_when_on_url && eventPathname === pathname) {
        return;
      }

      try {
        event.notification.display();
      } catch (error) {
        console.error('error displaying notification', error);
      }
    }


    OneSignal.Notifications.addEventListener('foregroundWillDisplay', handler);
    return () => {
      try {
        OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handler)
      } catch (error) {
        console.error('error removing listener', error);
      }
    };
  }, [pathname]);

  // When the app is opened, check for a deep link
  useEffect(() => {
    if (url) {
      const { hostname, path, scheme } = Linking.parse(url);

      let link = path
      if (scheme !== 'https') {
        link = `${hostname}/${path}`;
      }

      setPendingDeepLink(link);

    }
  }, [url]);

  // When the user is logged in, check for a pending deep link
  useEffect(() => {
    if (authUser?.id && pendingDeepLink) {
      setPendingDeepLink(null);

      setTimeout(() => {
        router.navigate(pendingDeepLink as any);
      }, 1000);
    }
  }, [authUser?.id, pendingDeepLink]);

  const signOut = async () => {
    try {
      const auth = getAuth();
      uidRef.current = null;
      if (auth.currentUser) {
        await auth.signOut();
      }
      await apolloClient.clearStore();
      setIdToken('');
    } catch (error) {
      console.error('signOut error', error);
    } finally {
      setIsLoading(false);
    }
  }


  const [setProfileMutation] = useMutation<SetProfileMutation, SetProfileMutationVariables>(SET_PROFILE);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {                    
    if (user && !uidRef.current) {
      uidRef.current = user.uid;
      const idToken = await user.getIdToken(true);
      console.log('idToken', idToken);
      setIdToken(idToken);
    } else if (!user) {
      await signOut();
    }
  };

  const setProfile = async (user: Partial<User>) => {
    await setProfileMutation({
      variables: {
        firstName: user.firstName!,
        lastName: user.lastName!,
      }
    });
  }

  useEffect(() => {
    return getAuth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider
      value={{       
        signInWithGoogle: async () => {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });          
          const signInResult = await GoogleSignin.signIn();        
          let idToken = signInResult.data?.idToken;                    
          if (!idToken) {
            console.log('signInResult.data', signInResult)
            throw new Error('No ID token found 2');
          }
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          console.log('googleCredential', googleCredential);
          try {
            await getAuth().signInWithCredential(googleCredential); 
          } catch (error) {
            console.error('signInWithGoogle error', JSON.stringify(error));
            throw error;
          }
          
        },
        signOut: async () => {
          await signOut();
        },
        setProfile,
        authUser: authUser ? {
          ...authUser,
        } : null,
        isLoading,
        pendingDeepLink,
        setPendingDeepLink,
        refetchAuthUser
      }}>
      {children}
    </AuthContext.Provider>
  );
}
