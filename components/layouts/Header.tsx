import { Animated, ActivityIndicator, View } from 'react-native'
import { Text } from '../ui/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';

export type HeaderProps = {
  title?: string
  loading?: boolean,
  icon?: any,
  backClassName?: string,
  showMenu?: boolean,
  onMenuPress?: () => void,
  showBack?: boolean,
  onBackPress?: () => void,
  className?: string,
  animated?: boolean,
  opacityInterpolation?: any,
  titleYInterpolation?: any,
  titleOpacityInterpolation?: any,
  right?: React.ReactNode,
}

export const Header = ({
  showMenu,
  onMenuPress,
  showBack,
  icon,
  title,
  loading,
  backClassName,
  className,
  opacityInterpolation,
  titleYInterpolation,
  titleOpacityInterpolation,
  right
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('w-full overflow-hidden', className)}
      style={{ paddingTop: insets.top }}
    >
      <Animated.View className="bg-white border-b border-gray-100 absolute top-0 left-0 right-0 bottom-0"
        style={{
          opacity: opacityInterpolation || 1
        }}
      ></Animated.View>
      <View className="mb-3 px-3 mt-1 flex-row items-center justify-between w-full h-[32]">
        {
          showMenu && (
            <Button className='z-10' sm ghost icon={{ component: 'Ionicons', name: 'menu' }} onPress={onMenuPress} />
          )
        }
        {
          showBack && (
            <Button
              sm
              className={cn('p-0 z-10 left-[-7]', backClassName)}
              ghost
              icon={icon || { component: 'Ionicons', name: 'chevron-back', color: 'black', size: 24 }}
              onPress={() => {
                router.back();
              }}
            />
          )
        }
        <View className='absolute left-0 right-0'>
          {
            loading ? (
              <ActivityIndicator size='small' color="#000000" />
            ) : (
              <Animated.View
                style={{
                  transform: [{
                    translateY: titleYInterpolation || 0
                  }],
                  opacity: titleOpacityInterpolation || 1
                }}
              >
                <Text className="w-full text-lg font-semibold text-center">{title}</Text>
              </Animated.View>
            )
          }
        </View>
        {
          right
        }
      </View>
    </View>
  )
}