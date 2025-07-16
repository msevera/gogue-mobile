import { Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { router } from 'expo-router';

export const GlimpsesBlock = () => {
  return (
    <Pressable className='px-4 mb-5' onPress={() => {
      router.push('/glimpses');
    }}>
      <View className='flex-row items-center justify-between bg-blue-200 p-4 px-5 rounded-3xl'>
        <View>
          <Text className='text-blue-500 text-xl font-semibold'>Smarter in 5 minutes</Text>
          <Text className='text-blue-500 text-sm mt-0.5'>Personalized glimpses</Text>
        </View>
        <Button
          sm
          secondary
          className='w-[50px] h-[50px]'
          icon={{
            component: 'Ionicons',
            name: 'play',
            size: 24,
            className: 'left-[2]',
          }}
          onPress={() => { }}
          loaderColor='#374151'
          loaderClassName='top-[1]'
        />
      </View>
    </Pressable>
  );
};