import { View } from 'react-native'
import { Text } from '../ui/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';
import { router } from 'expo-router';

export type RootHeaderProps = {
  onMenuPress?: () => void,
  title: string
}

export const RootHeader = ({ onMenuPress, title }: RootHeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View className='w-full border-b border-gray-100' style={{ paddingTop: insets.top }}>
      <View className="mb-3 px-3 mt-1 flex-row items-center justify-between w-full">
        <Button sm ghost icon={{ component: 'Ionicons', name: 'menu' }} onPress={onMenuPress} />
        <View className='absolute left-0 right-0 z-[-1]'>
          <Text className="w-full text-xl font-bold text-center">{title}</Text>
        </View>        
      </View>
    </View>
  )
}