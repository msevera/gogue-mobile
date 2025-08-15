import { router, Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import { SourcePreview } from '@/components/SourcePreview';
import { useCreate } from '@/hooks/useCreate';
import { useCalendars } from 'expo-localization';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  const { previewSource, setPreviewSource } = useCreate();
  console.log('previewSource', previewSource);
  const onCloseHandler = useCallback(() => {
    setPreviewSource({
      visible: false,
      source: null
    });
  }, []);

  return (
    <View className='flex-1'>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
          },
        }}>
      </Stack>
      <SourcePreview source={previewSource.source} visible={previewSource.visible} onClose={onCloseHandler} />
    </View>
  );
}
