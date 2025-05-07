import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Text } from '../ui/Text';
import { View } from 'react-native';
import React from 'react';

export const ScreenLayout = ({ screenOptions: {
  headerTitle,
  headerLoading,
  ...screenOptionsProps
} = {}, hidden, skipStackScreen, children, contentLoading, contentEmpty, contentEmptyText = 'Empty.', bottomPadding = true }: { screenOptions?: any, hidden?: boolean, skipStackScreen?: boolean, children: React.ReactNode, contentLoading: boolean, contentEmpty: boolean, contentEmptyText?: string, bottomPadding?: boolean }) => {
  return <View className="flex-1">
    {
      !skipStackScreen && (
        <Stack.Screen
          options={{
            contentStyle: {
              borderTopColor: '#f3f4f6',
              borderTopWidth: 1,
              backgroundColor: 'white',
            },      
            headerShadowVisible: false, 
            headerTitle: headerTitle || (headerLoading ? (() => (
              <ActivityIndicator size="small" color="#000000" style={{ marginLeft: 10 }} />
            )) : (screenOptionsProps.title || '')),           
            ...screenOptionsProps,
          }}
        />
      )}
    {
      contentLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#000000" />
        </View>
      ) : (
        <>
          {
            hidden && (
              <View className="flex-1 items-center justify-center absolute z-10 bottom-0 left-0 right-0 top-0 bg-white">
                <ActivityIndicator size="small" color="#000000" />
              </View>
            )
          }
          {
            contentEmpty ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-lg text-center">{contentEmptyText}</Text>
              </View>
            ) : children
          }
          {
            bottomPadding ? (
              <View className={`h-[81] w-full`} />
            ) : null
          }
        </>
      )
    }
  </View>
};