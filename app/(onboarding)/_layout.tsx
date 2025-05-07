import {Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      headerBackButtonDisplayMode: 'minimal',
      title: '',
      headerShadowVisible: false,
      headerTransparent: true,
      contentStyle: {
        backgroundColor: 'white',
      },
    }} />
  );
}
