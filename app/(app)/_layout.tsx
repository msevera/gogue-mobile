import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { authUser, isLoading } = useAuth();
 

  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    }

    if (!isLoading) {
      hideSplashScreen();
    }
  }, [isLoading]);


  if (isLoading) {
    return null;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again. 
  // if (!authUser) {
  //   // On web, static rendering will stop here as the user is not authenticated
  //   // in the headless Node process that the pages are rendered in.
  //   return <Redirect href="(onboarding)/emailInput" />;
  // }

  // if (!authUser.firstName || !authUser.lastName) {
  //   return <Redirect href="(onboarding)/setProfile" />;
  // }

  // if (!authUser?.topics?.length) { 
  //   return <Redirect href="(onboarding)/setTopics" />;
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
      }} />
  );
}
