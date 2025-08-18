import { TextInput, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Image } from "expo-image";
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { useCreate } from '@/hooks/useCreate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { useCreateLecture } from '@/hooks/useCreateLecture';
import { useCallback, useRef, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Screen() {
  const { track } = useAnalytics();
  const inputRef = useRef<TextInput>(null);
  const inset = useSafeAreaInsets();
  const [inputEditable, setInputEditable] = useState(false);
  const { input, setInput, source, setPreviewSource } = useCreate();
  const { createLectureAsyncMut } = useCreateLecture();
  const width = 120;
  const imageWidth = source?.image?.width;
  const imageHeight = source?.image?.height;
  const aspectRatio = imageHeight! / imageWidth!;
  const calculatedHeight = width * aspectRatio;

  const onEditInputPress = useCallback(() => {
    setInputEditable(true)
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  return <ScreenLayout
    screenOptions={{
      headerShown: true,
      header: () => <Header
        hideBorder
        title='Final step'
        showBack
      />,
    }}
    contentLoading={false}
    contentEmpty={false}
    contentEmptyText='Create your first lecture'
    bottomPadding={false}
  >
    <View className='flex-1 px-4 mt-2'>
      <View className='p-4 bg-blue-50 rounded-2xl mb-6'>
        <Text className="text-base text-gray-700">
          {
            source ?
              'We will personalize your lecture based on your input and the selected book' :
              'We will personalize your lecture based on your input and internet research'
          }
        </Text>
      </View>
      <View className='flex-1'>
        <View className='mb-6'>
          <View>
            <View className='flex-row items-center'>
              <Text className="text-base text-gray-700 mb-1">Input</Text>
              {
                !inputEditable && (
                  <Button sm text="Edit" ghost className='ml-3 p-0 top-[-1]' onPress={onEditInputPress} />
                )
              }
            </View>
            <View className={cn(inputEditable ? 'h-[200]' : 'h-auto')}>
              {
                inputEditable ? (
                  <Input
                    ref={inputRef}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    staticHeight
                    inputClassName="h-full"
                    submitBehavior='submit'
                    returnKeyType='done'
                    onSubmitEditing={() => {
                      setInputEditable(false);
                    }}
                  />
                ) : (
                  <Text className="text-lg">{input}</Text>
                )
              }
            </View>
          </View>

        </View>
        <View>
          <Text className={cn("text-base text-gray-700", source ? 'mb-2' : 'mb-1')}>{source ? 'Book' : 'Source'}</Text>
          <View>
            {
              source ? (
                <View className='flex-row'>
                  <Image
                    source={source?.image?.url}
                    contentFit="scale-down"
                    transition={1000}
                    style={{
                      width,
                      height: calculatedHeight,
                      borderRadius: 12
                    }}
                  />
                  <View className='flex-1 ml-4'>
                    <Text className="text-lg text-gray-950">{source?.title}</Text>
                    <Text className="text-base text-gray-700 mb-4" numberOfLines={3}>{source?.overview}</Text>
                    <Button text='Preview' ghost className='p-0 self-start'
                      onPress={() => {
                        setPreviewSource({
                          visible: true,
                          source
                        });
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text className='text-lg text-gray-950'>Internet research</Text>
                </View>
              )
            }
          </View>
        </View>
      </View>
      <View style={{ marginBottom: inset.bottom }}>
        <Button text='Create' onPress={() => {
          track('create_lecture_final', {
            input,
            source: {
              id: source?.id,
              title: source?.title,
              authors: source?.authors?.join(', '),
            }
          });
          createLectureAsyncMut(input, source?.id as string);
          router.dismissTo('/lectures');
        }} />
      </View>
    </View>
  </ScreenLayout>
}