import { View, Dimensions } from 'react-native'
import { Text } from './ui/Text'
import { AudioStatus } from 'expo-audio';

const { width: screenWidth } = Dimensions.get('window');
const LINE_WIDTH = screenWidth - 2 - 32; // accounting for padding

export const PlayLine = ({ status }: { status: AudioStatus }) => {
  const isLoaded = status.duration > 0;
  const progress = isLoaded ? status.currentTime / status.duration : 0;

  // Calculate the position of the current time marker
  const markerPosition = LINE_WIDTH / 2;

  // Calculate the width of the played portion (from center to left)
  const playedWidth = Math.min(markerPosition, LINE_WIDTH * progress);

  // Calculate the width of the remaining portion (from center to right)
  const remainingWidth = Math.min(markerPosition, LINE_WIDTH * (1 - progress));

  return (
    <View className="w-full px-4">
      <View className="h-0.5 bg-gray-50  overflow-hidden relative">
        <View
          className="h-full bg-blue-400 absolute"
          style={{ width: playedWidth, right: markerPosition }}
        />
        {/* <View 
          className="w-1 h-full bg-black absolute z-10" 
          style={{ left: markerPosition, transform: [{ translateX: -1 }] }} 
        /> */}
        <View
          className="h-full bg-gray-300 absolute"
          style={{ left: markerPosition, width: remainingWidth }}
        />
      </View>
      <View className="flex-row items-center justify-center mt-2">
        <Text className="text-xs text-gray-950">
          {isLoaded ? formatTime(status.currentTime) : '--:--'}
        </Text>
        <View className='w-[1] h-[10] bg-gray-950 mr-1 ml-1' />
        <Text className="text-xs text-gray-400">
          {isLoaded ? formatTime(status.duration) : '--:--'}
        </Text>
      </View>
    </View>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};