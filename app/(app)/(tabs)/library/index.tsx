import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { RootHeader } from '@/components/layouts/RootHeader';

export default function Screen() {
  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <RootHeader title='Library' />,
        }}
        contentLoading={false}
        contentEmpty={false}        
        bottomPadding={false}
      >
        <View className='flex-1'>
          
        </View>
      </ScreenLayout>
    </View>
  );
}