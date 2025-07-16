import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useGetGlimpsesLatest } from '@/hooks/useGetGlimpsesLatest';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlimpsesItem } from '@/components/GlimpsesItem';
import { Glimpse } from '@/apollo/__generated__/graphql';
import React, { useCallback, useMemo, useState } from 'react';
import { GlimpsesProgress } from '@/components/GlimpsesProgress';

const colorPairs = [
  { "backgroundColor": "#dbeafe", "textColor": "#3b82f6" },
  { "backgroundColor": "#fef9c3", "textColor": "#ca8a04" },
  { "backgroundColor": "#ffedd5", "textColor": "#f97316" },
  { "backgroundColor": "#fef3c7", "textColor": "#d97706" },
  { "backgroundColor": "#ecfccb", "textColor": "#65a30d" },
  { "backgroundColor": "#dcfce7", "textColor": "#16a34a" },
  { "backgroundColor": "#e0f2fe", "textColor": "#0ea5e9" },
  { "backgroundColor": "#e0e7ff", "textColor": "#6366f1" },
  { "backgroundColor": "#ede9fe", "textColor": "#8b5cf6" },
  { "backgroundColor": "#fee2e2", "textColor": "#ef4444" },
  { "backgroundColor": "#ffe4e6", "textColor": "#f43f5e" }
]

const getRandomColorPair = () => {
  const randomIndex = Math.floor(Math.random() * colorPairs.length);
  return colorPairs[randomIndex];
}

export default function Screen() {
  const { items, isLoading } = useGetGlimpsesLatest();
  const inset = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const increaseCurrentIndex = useCallback(() => {
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex]);

  const decreaseCurrentIndex = useCallback(() => {
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  const {item, colorPair} = useMemo(() => {
    return {
      item: items[currentIndex],
      colorPair: colorPairs[currentIndex],
    };
  }, [currentIndex, items]);

  
  return (<View className="flex-1">
    <ScreenLayout
      screenOptions={{
        headerLoading: false,
        headerShown: false,
        animation: 'fade_from_bottom',
        gestureDirection: 'vertical',
      }}
      contentLoading={false}
      contentEmpty={false}
      contentEmptyText='Create your first lecture'
      bottomPadding={false}
    >
      <View className='absolute top-2 left-0 right-0 z-10 px-4' style={{ paddingTop: inset.top }}>
        <GlimpsesProgress currentIndex={currentIndex} onProgressComplete={increaseCurrentIndex} onAllComplete={() => { }} items={items as Glimpse[]} />
      </View>
      {
        item && (
          <GlimpsesItem key={item.id} item={item as Glimpse} backgroundColor={colorPair.backgroundColor} textColor={colorPair.textColor} />
        )
      }
    </ScreenLayout>
  </View>
  );
}
