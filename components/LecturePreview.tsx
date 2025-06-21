import { Platform, ScrollView, SectionList, View, StyleSheet, Animated } from 'react-native';
import { Text } from './ui/Text';
import { ScreenLayout } from './layouts/ScreenLayout';
import { useLocalSearchParams } from 'expo-router';
import { useGetLecture } from '@/hooks/useGetLecture';
import { Header } from './layouts/Header';
import { Image } from 'expo-image';
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';

export const LecturePreview = () => {
  const scrollY2 = useRef(new Animated.Value(0)).current;

  const { lectureId } = useLocalSearchParams();
  const { lecture, loading } = useGetLecture(lectureId as string);

  // Shared value to track scroll position
  const scrollY = useSharedValue(0);

  // Scroll handler to update scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });


  const animatedRef = useAnimatedRef<rAnimated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);
  
  const stickyContainerStyle = useAnimatedStyle(() => {
    const height = scrollOffset.value > 100 ? 100 : 0
    return {
      // transform: [{
      //   translateY: scrollOffset.value
      // }]
      top: scrollOffset.value
    };
  });

  // Animated style for the image container
  const imageContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200], // Start fading at 0, fully faded at 200px scroll
      [1, 0],   // Start at full opacity, end at 0 opacity
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });


  return (
    <View className='flex-1'>
      <View className='flex-1' style={{
        backgroundColor: `${lecture?.image?.color}1A`,
      }}>
        <View className='h-[400] pt-24 flex-row items-center justify-center border border-red-500'>
          <Image
            source={lecture?.image?.webp}
            contentFit="scale-down"
            transition={1000}
            style={{
              // flex: 1,
              width: 1024 / 6,
              height: 1536 / 6,
              borderRadius: 4,
            }}
          />
        </View>
      </View>
      <Animated.ScrollView
        className='absolute top-0 left-0 right-0 bottom-0'
        ref={animatedRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY2 } } }],
          { useNativeDriver: true }
        )}
        //  onScroll={scrollHandler}
        // stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
      // contentInset={{ top: 50, left: 0, bottom: 0, right: 0 }}
      // contentOffset={{ x: 0, y: -50 }}

      >
        <View className='h-[400]'>

        </View>
        <View>
          <Animated.View
            className='bg-red-100 z-10'
            // style={[stickyContainerStyle]}
            style={{
              transform: [{
                translateY: scrollY2
              }]
            }}

          >
            <Text>Sticky header</Text>
          </Animated.View>
        </View>
        <View className='bg-red-200'>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
          </Text>
        </View>
        <View className='bg-red-300'>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
          </Text>
        </View>
        <View className='bg-red-400'>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  )
}


// return (
//   <View className='flex-1'>
//     {/* <View className="h-[120] w-[120] bg-red-500 absolute top-0 left-0 right-0 z-10"></View> */}
//     <ScrollView
//       className='flex-1 border'
//       // onScroll={scrollHandler}
//       // scrollEventThrottle={16}
//       stickyHeaderIndices={[1, 3]}
//     >
//       {Platform.OS === 'ios' && (
//         <View
//           style={{
//             position: 'absolute',
//             top: -200,       // same height as spacer
//             left: 0,
//             right: 0,
//             height: 200,
//             backgroundColor: `${lecture?.image?.color}1A`,  // bounce color at top
//           }}
//         />
//       )}
//       <View className='flex-1 w-full'
//       // style={
//       //   [stickyContainerStyle,
//       //     {
//       //       backgroundColor: `${lecture?.image?.color}1A`,
//       //       // height: 100
//       //     }
//       //   ]}
//       >
//         <View
//         // className="flex-1 py-8 pt-24"
//         >
//           {/* <View className='items-center justify-center'>

//             <Image
//               source={lecture?.image?.webp}
//               contentFit="scale-down"
//               transition={1000}
//               style={{
//                 flex: 1,
//                 width: 1024 / 6,
//                 height: 1536 / 6,
//                 borderRadius: 4,
//               }}
//             />

//           </View>*/}
//         </View>
//         <Text className="text-base text-gray-500 text-center">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
//         </Text>
//       </View>
//       <View className='flex-1 border bg-white'>
//         <Text className="text-lg text-gray-950 text-center mt-4">{lecture?.title}</Text>
//         <Text className="text-base text-gray-500 text-center" numberOfLines={2}>{lecture?.topic}</Text>
//         <Text className="text-base text-gray-500 text-center">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
//         </Text>
//       </View>
//       <View className='h-20 border bg-white z-10'>
//         <Text>
//           Sticky header #2
//         </Text>
//       </View>
//       <View className='flex-1 border bg-white z-10'>
//         <Text className="text-lg text-gray-950 text-center mt-4">{lecture?.title}</Text>
//         <Text className="text-base text-gray-500 text-center" numberOfLines={2}>{lecture?.topic}</Text>
//         <Text className="text-base text-gray-500 text-center">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et q.
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et q.
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et q.
//         </Text>
//       </View>

//     </ScrollView>
//   </View>
// )