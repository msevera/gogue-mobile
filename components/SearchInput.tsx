import { Dimensions, Keyboard, View } from 'react-native';
import { Input } from "./ui/Input";
import { useEffect, useState } from "react";
import { Button } from './ui/Button';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

export const SearchInput = ({ value, setValue, onActive }: { value: string, setValue: (value: string) => void, onActive: (value: boolean) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const widthValue = useSharedValue(width - 32);

  useDerivedValue(() => {
    const widthWithoutPadding = width - 32;
    widthValue.value = isFocused || value.length > 0 ? withTiming(widthWithoutPadding - 70, { duration: 200 }) : withTiming(widthWithoutPadding, { duration: 200 });
  }, [isFocused, value])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthValue.value,
    }
  })

  useEffect(() => {
    if (isFocused || value.length > 0) {
      onActive(true);
    } else {
      onActive(false);
    }
  }, [isFocused, value])


  return <View className='flex-row items-center'>
    <Animated.View style={[animatedStyle]}>
      <Input
        placeholder='What would you like to learn?'
        containerClassName='flex-1'
        componentClassName={cn('px-4 pr-2 rounded-4xl', value.length > 0 && 'p-2.5 px-4 pr-2')}
        returnKeyType='search'
        value={value}
        onChangeText={setValue}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        right={
          value.length > 0 &&
          <Button className="p-2 border-1 bg-gray-100" sm secondary icon={{ component: 'Ionicons', name: 'close', size: 16, color: '#374151' }} onPress={() => {
            setValue('');
            Keyboard.dismiss();
          }} />
        }
      />
    </Animated.View>
    <View>
      <Button
        ghost
        sm
        text='Cancel'
        onPress={() => {
          setIsFocused(false);
          setValue('');
          Keyboard.dismiss();
        }}
        className='p-0 pl-4'
      />
    </View>
  </View>
}