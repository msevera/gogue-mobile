import {Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,      
      title: '',
      headerShadowVisible: false,
      headerTransparent: true,
      contentStyle: {
        backgroundColor: 'white',
      },
    }} />
  );
}
