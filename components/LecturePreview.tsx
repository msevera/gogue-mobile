import { Platform, ScrollView, SectionList, View, StyleSheet, Animated as RNAnimated, UIManager, findNodeHandle, ActivityIndicator } from 'react-native';
import { Text } from './ui/Text';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useGetLecture } from '@/hooks/useGetLecture';
import { Header } from './layouts/Header';
import { Image } from 'expo-image';
import { useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from './Tabs';
import { Topics } from './Topics';
import { coverBGHex, formatTime } from '@/lib/utils';
import { Button } from './ui/Button';
import { GET_LECTURE_PREVIEW } from '@/apollo/queries/lectures';

const tabs = [{ text: 'Overview', value: 'overview' }, { text: 'Sections', value: 'sections' }, { text: 'Sources', value: 'sources' }]

export const LecturePreview = () => {
  const insets = useSafeAreaInsets();
  const top = insets.top + 48;
  const rnScrollY = useRef(new RNAnimated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('overview');
  const { lectureId } = useLocalSearchParams();
  const { lecture, loading } = useGetLecture(lectureId as string, GET_LECTURE_PREVIEW);


  const stickyRef = useRef<View>(null);
  const [offsetTop, setOffsetTop] = useState(0); // element’s top position


  const opacityInterpolation = rnScrollY.interpolate({
    inputRange: [200, 300],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const titleInterpolation = rnScrollY.interpolate({
    inputRange: [100, 400],
    outputRange: [100, 0],
    extrapolate: 'clamp',
  })

  const titleOpacityInterpolation = rnScrollY.interpolate({
    inputRange: [350, 400],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })


  const categories = useMemo(() => {
    return lecture?.categories?.map((category) => {
      return {
        text: category.category.name,
        value: category.category.id,
      }
    })
  }, [lecture])


  const sources = useMemo(() => {
    const allAnnotations = lecture?.sections?.reduce((acc, section) => {
      return acc.concat(section.annotations || []);
    }, [] as any[]) || [];
    
    // Filter to only unique URLs
    const uniqueUrls = new Set();
    return allAnnotations.filter(annotation => {
      if (uniqueUrls.has(annotation.url)) {
        return false;
      }
      uniqueUrls.add(annotation.url);
      return true;
    });
  }, [lecture])

  return (
    <View className='flex-1'>
      {
        loading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <>
            <Header
              showBack
              title={lecture?.title}
              className='z-10 absolute'
              opacityInterpolation={opacityInterpolation}
              titleYInterpolation={titleInterpolation}
              titleOpacityInterpolation={titleOpacityInterpolation}
            />
            <RNAnimated.View className='flex-1' style={{
              backgroundColor: coverBGHex(lecture?.image?.color),
              opacity: rnScrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              })
            }}>


              <View className='h-[400] pt-24 flex-row items-center justify-center'>
                <View

                >
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
            </RNAnimated.View>
            <RNAnimated.ScrollView
              className='absolute top-0 left-0 right-0 bottom-0'
              onScroll={(() => {
                return RNAnimated.event(
                  [{ nativeEvent: { contentOffset: { y: rnScrollY } } }],
                  { useNativeDriver: true }
                )
              })()}
              scrollEventThrottle={16}
            >
              <View className='h-[400]'>

              </View>
              <View className='bg-white rounded-t-3xl'>
                <View className='pt-4'>
                  <View className='flex-row items-center justify-between px-4 mb-4'>
                    <View className='flex-row items-center'>
                      <Text className='text-gray-500 text-sm'>{formatTime(lecture?.audio?.duration!, true)}min</Text>
                      <Text className='text-gray-500 ml-1 mr-1'>•</Text>
                      <Text className='text-gray-500 text-sm'>{lecture?.sections?.length} sections</Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                      <Button secondary sm text="Add to library" />
                      <Button
                        sm
                        text="Start"
                        icon={{ component: 'Ionicons', name: 'play' }}
                        onPress={() => {
                          router.push(`/${lectureId}`);
                        }}
                      />
                    </View>
                  </View>
                  <View className='bg-white px-4'>
                    <Text className='text-2xl text-gray-950 font-semibold'>
                      {lecture?.title}
                    </Text>
                    <Text className='text-lg mt-2 text-gray-800'>
                      {lecture?.topic}
                    </Text>
                  </View>
                  <View className='mt-6'>
                    <Topics source={categories} />
                  </View>
                  <RNAnimated.View
                    ref={stickyRef}
                    onLayout={() => {
                      stickyRef.current?.measure((_x, _y, _w, _h, _pageX, pageY) => {
                        setOffsetTop(pageY - top); // element’s absolute Y minus desired 50px
                      });
                    }}
                    className='z-10 bg-white mb-4 mt-2 px-4'
                    // style={[stickyContainerStyle]}
                    style={{
                      transform: [{
                        translateY: RNAnimated.add(
                          rnScrollY.interpolate({
                            inputRange: [0, offsetTop],
                            outputRange: [0, 0],
                            extrapolate: 'clamp',
                          }),
                          rnScrollY.interpolate({
                            inputRange: [offsetTop, Number.MAX_SAFE_INTEGER],
                            outputRange: [0, Number.MAX_SAFE_INTEGER - offsetTop],
                            extrapolate: 'clamp',
                          })
                        )
                      }]
                    }}

                  >
                    <View className='pt-4'>
                      <Tabs
                        source={tabs}
                        value={activeTab}
                        onChange={setActiveTab}
                      />
                    </View>
                  </RNAnimated.View>
                </View>
                {
                  activeTab === 'overview' && (
                    <View className='bg-white px-4'>
                      <Text className='text-base text-gray-800'>
                        {lecture?.overview}
                      </Text>
                    </View>
                  )
                }
                {
                  activeTab === 'sections' && (
                    <View className='bg-white px-4'>
                      {
                        lecture?.sections?.map((section, index) => (
                          <View key={section.title} className='mb-4 border-b border-gray-100 pb-4'>
                            <Text className='text-base text-gray-800 mb-2'>{section.title}</Text>
                            <Text className='text-base text-gray-500'>{section.overview}</Text>
                          </View>
                        ))
                      }
                    </View>
                  )
                }
                  {
                  activeTab === 'sources' && (
                    <View className='bg-white px-4'>
                      {
                        sources?.map((section, index) => (
                          <View key={section.title + index} className='mb-4'>
                            <Text className='text-base text-gray-800'>{section.title}</Text>
                            <Link href={section.url}>
                              <Text className='text-base text-blue-500 underline'>{section.url}</Text>
                            </Link>
                          </View>
                        ))
                      }
                    </View>
                  )
                }
                {Platform.OS === 'ios' && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -200,       // same height as spacer
                      left: 0,
                      right: 0,
                      height: 200,
                      backgroundColor: `white`,  // bounce color at top
                    }}
                  />
                )}
              </View>
            </RNAnimated.ScrollView>
          </>
        )
      }

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