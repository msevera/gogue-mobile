import { View } from 'react-native';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';

export default function Screen() {
  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <Header title='Search' />,
        }}
        contentLoading={false}
        contentEmpty={false}
        bottomPadding={false}
      >

      </ScreenLayout>
    </View>
  )
}