import { ActivityIndicator, View } from 'react-native'
import { Text } from '../ui/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';
import { router } from 'expo-router';

export type HeaderProps = {
  title?: string
  loading?: boolean
}

export const Header = ({ title, loading }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View className='w-full border-b border-gray-100 bg-white' style={{ paddingTop: insets.top }}>
      <View className="mb-3 px-3 mt-1 flex-row items-center justify-between w-full">
        <Button
          sm
          className='p-0 left-[-7]'
          ghost
          icon={{ component: 'Ionicons', name: 'chevron-back', color: 'black', size: 24 }}
          onPress={() => {
            router.back();
          }}
        />
        <View className='absolute left-0 right-0 z-[-1]'>
          {
            loading ? (
              <ActivityIndicator size='small' color="#000000" />
            ) : (
              <Text className="w-full text-lg font-semibold text-center">{title}</Text>
            )
          }
        </View>
      </View>
    </View>
  )
}