import { router, Slot, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { CreateLecture } from '@/components/CreateLecture';
import { GetPendingLectureShowNotificationQuery, GetPendingLectureShowNotificationQueryVariables, Lecture, LectureCreatingSubscription, LectureCreatingSubscriptionVariables } from '@/apollo/__generated__/graphql';
import { useQuery, useSubscription, useMutation } from '@apollo/client/react';
import { GET_LECTURE_DETAILS, GET_PENDING_LECTURE, GET_PENDING_LECTURE_SHOW_NOTIFICATION, LECTURE_CREATING_SUBSCRIPTION } from '@/apollo/queries/lectures';
import { useGetLectures } from '@/hooks/useGetLectures';
import { PendingLecture } from '@/components/PendingLecture';
import { useGetLecturesAddedToLibrary } from '@/hooks/useGetLecturesAddedToLibrary';
import { useGetLecture } from '@/hooks/useGetLecture';
import { useNewLecture } from '@/hooks/useNewLecture';
import { SetTopics } from '@/components/SetTopics';
import { useCalendars } from 'expo-localization';
import { SET_TIMEZONE } from '@/apollo/queries/user';
import { SetTimezoneMutation, SetTimezoneMutationVariables } from '@/apollo/__generated__/graphql';
import { useAppState } from '@/hooks/useAppState';
import { useGetLecturePending } from '@/hooks/useGetLecturePending';
import { useAuth } from '@/hooks/useAuth';

const TabBarButton = ({ text, icon, active, highlight, onPress, disabled, ...props }: { text: string, icon: any, active?: boolean, highlight?: boolean, onPress: () => void, disabled?: boolean }) => {
  return <Button
    {...props}
    className='flex-1 h-full rounded-none bg-white'
    textClassName={cn(
      'text-xs text-gray-500',
      active && 'text-gray-900',
      highlight && 'text-blue-500',
      disabled && 'text-gray-400'
    )}
    icon={{
      ...icon,
      top: true,
      size: 28,
      className: 'mb-1',
      color: disabled ? '#9ca3af' : highlight ? '#3b82f6' : active ? '#111827' : '#6b7280',
    }}
    sm
    text={text}
    onPress={onPress}
    disabled={disabled}
  />
}

const rootPaths = {
  lectures: '/lectures',
  search: '/search',
  library: '/library'
}

const rootPathArray = Object.values(rootPaths);



const TabBar = ({ onCreatePress, disableCreation, navigation }: { onCreatePress: () => void, disableCreation: boolean, navigation: any }) => {
  const pathname = usePathname();
  const isActive = (rootPath: string) => pathname.startsWith(rootPath);
  return <View className='h-[90] z-[11] bg-white border-t border-gray-100'>
    <View className='flex-row justify-between'>
      <TabBarButton
        text='Home'
        icon={{ component: 'MaterialCommunityIcons', name: 'home-variant' }}
        active={isActive(rootPaths.lectures)}
        onPress={() => {
          navigation.navigate('lectures');
        }}
      />
      <TabBarButton
        text='Search'
        icon={{ component: 'Ionicons', name: 'search-outline' }}
        active={isActive(rootPaths.search)}
        onPress={() => {
          navigation.navigate('search');
        }}
      />
      <TabBarButton
        text='Your Library'
        icon={{ component: 'MaterialCommunityIcons', name: 'bookshelf' }}
        active={isActive(rootPaths.library)}
        onPress={() => {
          navigation.navigate('library');
        }}
      />
      <TabBarButton
        text='Create'
        icon={{ component: 'Entypo', name: 'squared-plus' }}
        highlight
        onPress={onCreatePress}
        disabled={disableCreation}
      />
    </View>
  </View>
}

export default function TabsLayout() {
  const { newLectureVisible, setNewLectureVisible, initialDescription, setInitialDescription, setCreatePressed } = useNewLecture();
  const [calendar] = useCalendars();
  const { authUser, setAuthSettingsVisible } = useAuth();

  const [setTimezone] = useMutation<SetTimezoneMutation, SetTimezoneMutationVariables>(SET_TIMEZONE, {
    onError: (error) => {
      console.log('SetTimezone error', error);
    },
  })

  useEffect(() => {
    if (calendar?.timeZone && authUser?.id) {
      setTimezone({
        variables: {
          timezone: calendar?.timeZone as string
        },
      });
    }
  }, [calendar?.timeZone, authUser?.id]);

  const { lecture: newLecture, refetch: refetchPendingLectureShowNotification, handleCache } = useGetLecturePending({ skip: !authUser?.id });

  useAppState({
    onForeground: async () => {
      if (!authUser?.id) {
        return;
      }

      console.log('refetching pending lecture');
      await refetchPendingLectureShowNotification();
    }
  }, [authUser?.id]);

  const onNewLecturePressHandler = useCallback(() => {
    if (!authUser?.id) {
      setAuthSettingsVisible(true);
      return;
    }

    if (newLecture && newLecture?.creationEvent?.name !== 'DONE') {
      return;
    }

    router.push('/create');
  }, [newLectureVisible, newLecture, authUser?.id]);

  const { updateLectureCache } = useGetLecturesAddedToLibrary({ skip: true });
  useSubscription<LectureCreatingSubscription, LectureCreatingSubscriptionVariables>(LECTURE_CREATING_SUBSCRIPTION, {
    skip: !authUser?.id,
    onData: ({ data }) => {
      const lecture = data.data?.lectureCreating as Lecture;
      console.log('lecture', lecture.creationEvent?.name)

      handleCache(lecture);

      setTimeout(() => {
        if (lecture.metadata?.addedToLibrary) {
          updateLectureCache(lecture, true);
        }
      }, 2000);
    }
  });

  // This is needed for testing purposes
  // const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // useEffect(() => {
  //   if (newLecture && newLecture?.creationEvent?.name !== 'DONE') {
  //     timeoutRef.current = setTimeout(() => {
  //       const updatedLecture = {
  //         ...newLecture,
  //         creationEvent: {
  //           ...newLecture.creationEvent,
  //           name: 'DONE',
  //           "__typename": "LectureCreationEvent",
  //         }
  //       }

  //       setNewLecture(updatedLecture);
  //       updateCreatingLectureCache(updatedLecture);

  //     }, 3000);
  //   }

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   }
  // }, [newLecture?.creationEvent?.name])

  // const { lecture } = useGetLecture('685aa30c1dd5623fccff2150' || '', GET_LECTURE_DETAILS);
  // useEffect(() => {
  //   const states = [
  //     // {
  //     //   name: 'INIT',
  //     //   sections: []
  //     // },
  //     // {
  //     //   name: 'NORMALIZING_TOPIC',
  //     //   sections: []
  //     // },
  //     // {
  //     //   name: 'GENERATING_PLAN',
  //     //   title: 'Advanced microlearning',
  //     //   sections: []
  //     // },
  //     // {
  //     //   name: 'GENERATING_CONTENT',
  //     //   sections: [
  //     //     {
  //     //       title: 'Section 1 very very long title which does not stop here',
  //     //       hasContent: false
  //     //     }, {
  //     //       title: 'Section 2',
  //     //       hasContent: false
  //     //     }, {
  //     //       title: 'Section 3',
  //     //       hasContent: false
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   name: 'GENERATING_CONTENT',
  //     //   sections: [
  //     //     {
  //     //       title: 'Section 1',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 2',
  //     //       hasContent: false
  //     //     }, {
  //     //       title: 'Section 3',
  //     //       hasContent: false
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   name: 'GENERATING_CONTENT',
  //     //   sections: [
  //     //     {
  //     //       title: 'Section 1',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 2',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 3',
  //     //       hasContent: false
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   name: 'GENERATING_OVERVIEW',
  //     //   sections: [
  //     //     {
  //     //       title: 'Section 1',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 2',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 3',
  //     //       hasContent: false
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   name: 'GENERATING_CATEGORIES',
  //     //   sections: [
  //     //     {
  //     //       title: 'Section 1',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 2',
  //     //       hasContent: true
  //     //     }, {
  //     //       title: 'Section 3',
  //     //       hasContent: false
  //     //     }
  //     //   ]
  //     // },
  //     {
  //       name: 'FINALIZING',
  //       sections: [
  //         {
  //           title: 'Section 1',
  //           hasContent: true
  //         }, {
  //           title: 'Section 2',
  //           hasContent: true
  //         }, {
  //           title: 'Section 3',
  //           hasContent: true
  //         }
  //       ]
  //     },
  //     {
  //       name: 'DONE',
  //       sections: [
  //         {
  //           title: 'Section 1',
  //           hasContent: true
  //         }, {
  //           title: 'Section 2',
  //           hasContent: true
  //         }, {
  //           title: 'Section 3',
  //           hasContent: true
  //         }
  //       ]
  //     }
  //   ];
  //   let currentStateIndex = 0;

  //   const interval = setInterval(() => {
  //     if (currentStateIndex >= states.length) {
  //       clearInterval(interval);
  //       return;
  //     }

  //     const state = states[currentStateIndex];
  //     currentStateIndex++;


  //     setNewLecture(
  //       {
  //         ...lecture,
  //         creationEvent: {
  //           name: state.name,
  //         },
  //         sections: state.sections,
  //       },
  //     );

  //     if (currentStateIndex >= states.length) {
  //       clearInterval(interval);
  //     }
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [lecture]);

  const pathname = usePathname();
  const rootPath = rootPathArray.find(rootPath => pathname.startsWith(rootPath));

  return (
    <View className='flex-1'>
      <PendingLecture tabHeight={90} lecture={newLecture!} parentPath={rootPath!} />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation }) => <TabBar disableCreation={!!newLecture && newLecture?.creationEvent?.name !== 'DONE'} onCreatePress={onNewLecturePressHandler} navigation={navigation} />}
      />
      {/* <CreateLecture visible={newLectureVisible} initialDescription={initialDescription} onClose={onNewLecturePressHandler} onCreate={onCreateLecturePressHandler} /> */}
      {/* <SetTopics /> */}
    </View>
  )
}


