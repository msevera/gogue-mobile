import { router, Slot, usePathname } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ButtonProps, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { CreateLecture } from '@/components/CreateLecture';

const TabBarButton = ({ icon, active, highlight, ...props }: ButtonProps) => {
  return <Button
    {...props}
    className='bg-gray-900 flex-1 h-full rounded-none bg-white'
    textClassName={cn(
      'text-xs text-gray-500',
      active && 'text-gray-900',
      highlight && 'text-blue-500'
    )}
    icon={{
      ...icon,
      top: true,
      size: 28,
      className: 'mb-1',
      color: highlight ? '#3b82f6' : active ? '#111827' : '#6b7280',
    }}
    sm
  />
}

const TabBar = ({ onCreatePress, navigation }: { onCreatePress: () => void, navigation: any }) => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return <View className='h-[90] bg-white border-t border-gray-100'>
    <View className='flex-row justify-between'>
      <TabBarButton
        text='Home'
        icon={{ component: 'MaterialCommunityIcons', name: 'home-variant' }}
        sm
        active={isActive('/lectures')}
        onPress={() => {
          navigation.navigate('lectures');
        }}
      />
      <TabBarButton
        text='Search'
        icon={{ component: 'Ionicons', name: 'search-outline' }}
        sm
        active={isActive('/search')}
        onPress={() => {
          navigation.navigate('search');
        }}
      />
      <TabBarButton
        text='Your library'
        icon={{ component: 'MaterialCommunityIcons', name: 'bookshelf' }}
        sm
        active={isActive('/library')}
        onPress={() => {
          navigation.navigate('library');
        }}
      />
      <TabBarButton
        text='Create'
        icon={{ component: 'Entypo', name: 'squared-plus' }}
        sm
        highlight
        onPress={onCreatePress}
      />
    </View>
  </View>
}

export default function TabsLayout() {
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const onNewLecturePressHandler = useCallback(() => {
    setNewLectureVisible(!newLectureVisible);
  }, [newLectureVisible]);

  return (
    <View className='flex-1'>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation }) => <TabBar onCreatePress={onNewLecturePressHandler} navigation={navigation} />}
      />
      <CreateLecture visible={newLectureVisible} onClose={onNewLecturePressHandler} />
    </View>
  )
}
