import { View } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/Button';

export const RootSettings = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const { signOut, authUser } = useAuth();
  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: true,
    closeByGestureEnabled: true
  }), [visible]);

  return (
    <GlobalDrawer 
      title='Settings' 
      headerBorder 
      drawerSettings={drawerSettings} 
      onBackdropPress={onClose}
      headerContainerClassName='bg-gray-100'
      headerContentClassName='pb-0'
    >
      <View className='flex-1 bg-gray-100'>
        {/* Profile Section */}
        <View className="mt-4 flex-1">
          <View className="bg-white rounded-4xl mx-4 overflow-hidden">
            <View className="p-4 flex-row items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                <Text className="text-white text-xl font-semibold">
                  {authUser?.firstName?.[0]}{authUser?.lastName?.[0]}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold">{authUser?.firstName} {authUser?.lastName}</Text>
                <Text className="text-gray-500">{authUser?.email}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Sign Out Button */}
        <View className="mt-6 mb-6 px-4">         
          <Button text='Sign Out' onPress={signOut} />
        </View>
      </View>
    </GlobalDrawer>
  )
}