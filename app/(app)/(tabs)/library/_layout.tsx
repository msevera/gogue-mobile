import { router, Stack } from 'expo-router';
import React from 'react';
import { Button } from '@/components/ui/Button';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
        headerLeft: () => {
          return (
            <Button
              sm
              className='p-0 left-[-7]'
              ghost
              icon={{ component: 'Ionicons', name: 'chevron-back', color: 'black', size: 24 }}
              onPress={() => {
                router.back();
              }}
            />
          )
        }
      }}>
    </Stack>
  );
}
