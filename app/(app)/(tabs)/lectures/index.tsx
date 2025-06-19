import { View, FlatList } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useCallback, useState } from 'react';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Lecture, LectureCreatingSubscription, LectureCreatingSubscriptionVariables, Note, NoteCreatedSubscription, NoteCreatedSubscriptionVariables } from '@/apollo/__generated__/graphql';
import { useGetLectures } from '@/hooks/useGetLectures';
import { RootHeader } from '@/components/layouts/RootHeader';
import { RootSettings } from '@/components/RootSettings';
import { CreateLecture } from '@/components/CreateLecture';
import { Button } from '@/components/ui/Button';
import { useSubscription } from '@apollo/client';
import { LECTURE_CREATING_SUBSCRIPTION } from '@/apollo/queries/lectures';
import { LectureItem } from '@/components/LectureItem';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  LinearTransition,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

const AnimatedLectureItem = ({ item }: { item: Lecture }) => {
  return (
    <Animated.View 
      layout={LinearTransition.duration(300).springify()}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <LectureItem lecture={item} />
    </Animated.View>
  );
};

const keyExtractor = (item: Lecture) => item.id || 'temp';

export default function Screen() {  
  const { items, isLoading, updateCreatingLectureCache } = useGetLectures();
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  // const [testItems, setTestItems] = useState<Lecture[]>(items);

  useSubscription<LectureCreatingSubscription, LectureCreatingSubscriptionVariables>(LECTURE_CREATING_SUBSCRIPTION, {
    onData: ({ data }) => {
      const lecture = data.data?.lectureCreating as Lecture;
      updateCreatingLectureCache(lecture);
    }
  });

  const onMenuPressHandler = useCallback(() => {
    setSettingsVisible(!settingsVisible);
  }, [settingsVisible]);

  const onNewLecturePressHandler = useCallback(() => {
    setNewLectureVisible(!newLectureVisible);
  }, [newLectureVisible]);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <AnimatedLectureItem item={item} />;
  }, []);

  // useEffect(() => {
  //   const states = [
  //     {
  //       name: 'INIT',
  //       sections: []
  //     },
  //     {
  //       name: 'NORMALIZING_TOPIC',
  //       sections: []
  //     },
  //     {
  //       name: 'GENERATING_PLAN',
  //       sections: []
  //     },
  //     {
  //       name: 'GENERATING_CONTENT',
  //       sections: [
  //         {
  //           title: 'Section 1',
  //           hasContent: false
  //         }, {
  //           title: 'Section 2',
  //           hasContent: false
  //         }, {
  //           title: 'Section 3',
  //           hasContent: false
  //         }
  //       ]
  //     },
  //     {
  //       name: 'GENERATING_CONTENT',
  //       sections: [
  //         {
  //           title: 'Section 1',
  //           hasContent: true
  //         }, {
  //           title: 'Section 2',
  //           hasContent: false
  //         }, {
  //           title: 'Section 3',
  //           hasContent: false
  //         }
  //       ]
  //     },
  //     {
  //       name: 'GENERATING_CONTENT',
  //       sections: [
  //         {
  //           title: 'Section 1',
  //           hasContent: true
  //         }, {
  //           title: 'Section 2',
  //           hasContent: true
  //         }, {
  //           title: 'Section 3',
  //           hasContent: false
  //         }
  //       ]
  //     },
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

  //     const [firstLecture] = items;
  //     setTestItems([
  //       {
  //         ...firstLecture,
  //         creationEvent: {
  //           name: state.name,
  //         },
  //         sections: state.sections
  //       },
  //       ...items.slice(1)
  //     ]);

  //     if (currentStateIndex >= states.length) {
  //       clearInterval(interval);
  //     }
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [items]);

  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <RootHeader showMenu title='Home' onMenuPress={onMenuPressHandler} />,
        }}
        contentLoading={isLoading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >
        {
          items.length > 0 ? (
            <FlatList
              keyExtractor={keyExtractor}
              contentInsetAdjustmentBehavior="automatic"
              // data={testItems as Lecture[]}
              data={items as Lecture[]}
              renderItem={renderItem}
              ListFooterComponent={() => <View className='h-[60] w-full' />}
              ItemSeparatorComponent={() => <View className='px-5'><View className='h-[1] bg-gray-100 w-full ' /></View>}
            />
          ) : (
            <View className='flex-1 justify-center items-center px-4'>
              <View className='flex-1 justify-center items-center'>
                <Text className='text-gray-500 text-lg top-[-40]'>You don't have any lectures yet.</Text>
              </View>
            </View>
          )
        }
      </ScreenLayout>
      <RootSettings visible={settingsVisible} onClose={onMenuPressHandler} />
      <CreateLecture visible={newLectureVisible} onClose={onNewLecturePressHandler} />
    </View>
  );
}
