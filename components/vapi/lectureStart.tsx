import React from 'react';
import { View } from 'react-native';
import { Button } from '../ui/Button';

export default function LectureStart({ isStarted, isPlaying, isLoading, onStartPress, onHoldStart, isHolding, onHoldEnd }: { isStarted: boolean, isPlaying: boolean, isLoading: boolean, onStartPress?: () => void, onHoldStart: () => void, isHolding: boolean, onHoldEnd: () => void }) {
  return (
    <View className='items-center justify-center'>
      {
        !isPlaying ? (
          <>
            <Button
              // className="w-16 h-16 p-0"
              icon={{
                component: 'Ionicons',
                name: 'sparkles-sharp',
                size: 24,
                color: 'white',
                className: 'left-[1] top-[1]',
              }}
              ghost={isLoading}
              onPress={onStartPress}
              loading={isLoading}
              loaderColor='#d1d5db'
              loaderSize={1}
              text={isStarted ? 'Continue' : 'Start lecture'}
            />
            {/* {
              !isLoading && (
                <>
                  {
                    !isStarted ? (
                      <Text className='text-sm text-gray-500 mt-2'>Tap to start</Text>
                    ) : (
                      <Text className='text-sm text-gray-500 mt-2'>Tap to continue</Text>
                    )
                  }
                </>
              )
            } */}
          </>
        ) : (
          <>
            <Button
              ghost
              className={`w-[170] border border-dashed border-gray-300 ${isHolding ? 'border-red-400' : 'border-gray-300'}`}
              textClassName={`${isHolding ? 'text-red-400' : 'text-gray-300'}`}
              onPressIn={onHoldStart}
              onPressOut={onHoldEnd}
              icon={{
                component: 'Ionicons',
                name: 'mic',
                size: 24,
                color: isHolding ? '#f87171' : '#d1d5db',
              }}
              text={!isHolding ? 'Hold to ask' : 'Speak'}
            />
          </>
        )
      }
    </View>
  );
}