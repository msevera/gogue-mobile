import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabsLayout() {  
  return (
    <View className='flex-1'>
      <Slot />      
    </View>
  )
}
