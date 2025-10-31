import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import auth, { getAuth, FirebaseAuthTypes, connectAuthEmulator } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useApolloClient, useMutation, useQuery, useLazyQuery } from '@apollo/client/react';
import { SIGN_IN, SET_PROFILE, GET_USER } from '@/apollo/queries/user';
import { GetUserQuery, GetUserQueryVariables, SetProfileMutation, SetProfileMutationVariables, SignInQuery, SignInQueryVariables, User } from '@/apollo/__generated__/graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { OneSignal } from 'react-native-onesignal';
import { useAnalytics } from '@/hooks/useAnalytics';


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
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (user: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  authUser?: User | null;
  isLoading: boolean;
  pendingDeepLink: string | null;
  setPendingDeepLink: (pendingDeepLink: string | null) => void;
  refetchAuthUser: () => Promise<void>;
  authSettingsVisible: boolean;
  setAuthSettingsVisible: (authSettingsVisible: boolean) => void;
}>({
  signInWithGoogle: async () => Promise.resolve(),
  signInWithEmailAndPassword: async () => Promise.resolve(),
  createUserWithEmailAndPassword: async () => Promise.resolve(),
  sendPasswordResetEmail: async () => Promise.resolve(),
  signOut: async () => Promise.resolve(),
  setProfile: async (user: Partial<User>) => Promise.resolve(),
  deleteAccount: async () => Promise.resolve(),
  authUser: null,
  isLoading: true,
  pendingDeepLink: null,
  setPendingDeepLink: () => { },
  refetchAuthUser: async () => Promise.resolve(),
  authSettingsVisible: false,
  setAuthSettingsVisible: () => { }
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [authSettingsVisible, setAuthSettingsVisible] = useState(false);
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);
  const uidRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apolloClient = useApolloClient();
  const { identify, reset } = useAnalytics();
  const url = Linking.useURL();
  const [idToken, setIdToken] = useState('');
  const [signInQuery, { data: { signIn } = {} }] = useLazyQuery<SignInQuery, SignInQueryVariables>(SIGN_IN);

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const fn = async () => {
      try {
        await signInQuery({
          variables: {
            idToken
          }
        });
        setIsLoading(false);
        await apolloClient.resetStore();
      } catch (error) {
        console.error('signIn error', JSON.stringify(error));
        await signOut();
      }
    }

    fn();
  }, [idToken]);

  const authUser = idToken ? signIn as User : null;

  const [refetchAuthUser] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GET_USER);

  useEffect(() => {
    const fn = async () => {
      try {
        if (authUser?.id) {
          const workspaceId = authUser?.workspaces?.[0]?.workspaceId;
          await AsyncStorage.setItem('workspaceId', workspaceId);

          try {
            OneSignal.login(authUser.id);
            OneSignal.User.addAlias('auth_context', `${authUser.workspaces?.[0]?.workspaceId}-${authUser.id}`)

            identify(authUser);

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

  // useEffect(() => {
  //   const handler = (event: NotificationWillDisplayEvent) => {
  //     const url = event.notification.launchURL as string;
  //     const { hostname, path } = Linking.parse(url);
  //     const eventPathname = `/${hostname}/${path}`;
  //     const { show_when_on_url } = event.notification.additionalData as NotificationCustomDataType;

  //     // do not display the notification if the user is already on the page, and if event says so
  //     if (!show_when_on_url && eventPathname === pathname) {
  //       return;
  //     }

  //     try {
  //       event.notification.display();
  //     } catch (error) {
  //       console.error('error displaying notification', error);
  //     }
  //   }


  //   OneSignal.Notifications.addEventListener('foregroundWillDisplay', handler);
  //   return () => {
  //     try {
  //       OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handler)
  //     } catch (error) {
  //       console.error('error removing listener', error);
  //     }
  //   };
  // }, [pathname]);

  // When the app is opened, check for a deep link
  useEffect(() => {
    if (url) {
      console.log('url', url);
      const { hostname, path, scheme } = Linking.parse(url);

      let link = path
      if (scheme !== 'https') {
        link = `${path}`;
        console.log('scheme', link);
      }

      setPendingDeepLink(link);

    }
  }, [url]);

  // When the user is logged in, check for a pending deep link
  useEffect(() => {
    if (authUser?.id && pendingDeepLink) {
      setPendingDeepLink(null);

      setTimeout(() => {
        console.log('navigate to', pendingDeepLink);
        router.navigate('/lectures');
        router.navigate(pendingDeepLink as any);
      }, 1000);
    }
  }, [authUser?.id, pendingDeepLink]);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('workspaceId');
      const auth = getAuth();
      uidRef.current = null;
      if (auth.currentUser) {
        await auth.signOut();

        try {
          await signInQuery({
            variables: {
              idToken: ''
            }
          });
        } catch (error) {
          console.error('signOut signInQuery', error);
        }
      }

      try {
        await apolloClient.resetStore();
      } catch (error) {
        console.error('signOut apolloClient.resetStore', error);
      }

      await AsyncStorage.removeItem('workspaceId');
      setIdToken('');
      OneSignal.logout();
      reset();
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
      // console.log('idToken', idToken);
      setIdToken(idToken);
    } else if (!user) {
      console.log('signOut because user is null');
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

  const deleteAccount = async () => {
    try {
      // Delete the Firebase user (this will trigger backend cleanup via Firebase functions)
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await currentUser.delete();
      }

      try {
        await signInQuery({
          variables: {
            idToken: ''
          }
        });
      } catch (error) {
        console.error('deleteAccount signInQuery', error);
      }

      // Clear all local data
      try {
        await apolloClient.resetStore();
      } catch (error) {
        console.error('deleteAccount apolloClient.resetStore', error);
      }

      await AsyncStorage.removeItem('workspaceId');
      setIdToken('');
      uidRef.current = null;
      OneSignal.logout();
      reset();
    } catch (error) {
      console.error('deleteAccount error', error);
      throw error;
    }
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
          try {
            await getAuth().signInWithCredential(googleCredential);
          } catch (error) {
            console.error('signInWithGoogle error', JSON.stringify(error));
            throw error;
          }

        },
        signInWithEmailAndPassword: async (email: string, password: string) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (error) {
            console.error('signInWithEmailAndPassword error', JSON.stringify(error));
            throw error;
          }
        },
        createUserWithEmailAndPassword: async (email: string, password: string) => {
          try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            // Send email verification
            await userCredential.user.sendEmailVerification();
          } catch (error) {
            console.error('createUserWithEmailAndPassword error', JSON.stringify(error));
            throw error;
          }
        },
        sendPasswordResetEmail: async (email: string) => {
          try {
            await auth().sendPasswordResetEmail(email);
          } catch (error) {
            console.error('sendPasswordResetEmail error', JSON.stringify(error));
            throw error;
          }
        },
        signOut: async () => {
          await signOut();
        },
        setProfile,
        deleteAccount,
        authUser: authUser ? {
          ...authUser,
        } : null,
        isLoading,
        pendingDeepLink,
        setPendingDeepLink,
        refetchAuthUser: async () => {
          if (authUser?.id) {
            try {
              await refetchAuthUser({
                variables: {
                  id: authUser.id
                }
              });
            } catch (error) {
              console.error('refetchAuthUser error', JSON.stringify(error));
            }
          }
        },
        authSettingsVisible,
        setAuthSettingsVisible,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
