import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useEffect, useState, useRef } from 'react';
import { Button } from './ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserTopicsAgent } from '@/hooks/useUserTopicsAgent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parse } from 'best-effort-json-parser'
import React from 'react';
import { useGetLecturesRecommended } from '@/hooks/useGetLecturesRecommended';
import { Input } from './ui/Input';

const gradientStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 100,
  zIndex: 0,
}

export const SetTopics = () => {
  const { refetchAuthUser } = useAuth();
  const { refetch } = useGetLecturesRecommended();
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();
  const [selectedCategoriesFirstStep, setSelectedCategoriesFirstStep] = useState<string[]>([]);
  const [selectedCategoriesSecondStep, setSelectedCategoriesSecondStep] = useState<string[]>([]);

  const [firstStepCategories, setFirstStepCategories] = useState<string[]>([]);
  const [firstStepText, setFirstStepText] = useState<string>('');
  const [firstStepInitialized, setFirstStepInitialized] = useState(false);

  const [secondStepCategories, setSecondStepCategories] = useState<string[]>([]);
  const [secondStepText, setSecondStepText] = useState<string>('');
  const [secondStepInitialized, setSecondStepInitialized] = useState(false);

  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [stepChangeIntention, setStepChangeIntention] = useState<boolean>(false);
  const [dataStreamingStarted, setDataStreamingStarted] = useState<boolean>(false);

  const [customCategoryEditable, setCustomCategoryEditable] = useState<boolean>(false);
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const customCategoryInputRef = useRef<TextInput>(null);

  const { authUser } = useAuth();
  const { conversationItems, stream } = useUserTopicsAgent({
    onStreamStart: () => {
      console.log('onStreamStart');
      setNextLoading(true);
    },
    onStreamEnd: () => {
      console.log('onStreamEnd');
      setNextLoading(false);
      setDataStreamingStarted(false);
    },
    onTopicsStored: async () => {
      await refetchAuthUser();
      await refetch();
      setVisible(false);     
    },
    onStream: () => {
      setDataStreamingStarted(true);
    }
  });


  useEffect(() => {
    if (stepChangeIntention && dataStreamingStarted && step === 0) {
      setStepChangeIntention(false);
      setStep(step + 1);
    }
  }, [stepChangeIntention, step, dataStreamingStarted]);

  useEffect(() => {
    if (!initialLoading && !authUser?.topics?.length) {
      setInitialLoading(true);
      setVisible(true);
      stream();
    }
  }, [authUser, initialLoading]);

  const data = useMemo(() => {
    // return { "newCategories": [{ "name": "Technology", "overview": "Explore the latest trends, innovations, and breakthroughs in the world of technology." }, { "name": "Health & Wellness", "overview": "Discover tips, research, and advice on maintaining a healthy lifestyle and mental well-being." }, { "name": "Business & Finance", "overview": "Stay updated on business strategies, market trends, and personal finance management." }, { "name": "Science", "overview": "Dive into the wonders of physics, biology, chemistry, and scientific discoveries." }, { "name": "Arts & Culture", "overview": "Experience the richness of global arts, literature, music, and cultural movements." }, { "name": "Travel & Adventure", "overview": "Find inspiration for your next journey and learn about destinations around the world." }, { "name": "Food & Cooking", "overview": "Get recipes, cooking tips, and culinary traditions from various cuisines." }, { "name": "Sports & Fitness", "overview": "Follow the latest in sports, training routines, and fitness advice." }, { "name": "History", "overview": "Uncover stories, events, and figures that shaped our world." }, { "name": "Education & Learning", "overview": "Access resources and insights for lifelong learning and academic growth." }, { "name": "Personal Development", "overview": "Enhance your skills, productivity, and mindset for personal growth." }, { "name": "Entertainment", "overview": "Stay in the loop with movies, TV shows, games, and celebrity news." }, { "name": "Environment & Nature", "overview": "Learn about sustainability, conservation, and the natural world." }, { "name": "Politics & Current Events", "overview": "Keep informed on global politics, policies, and current affairs." }, { "name": "Parenting & Family", "overview": "Get advice and stories on raising children and family life." }, { "name": "Fashion & Style", "overview": "Explore trends, tips, and inspiration in fashion and personal style." }, { "name": "Automotive", "overview": "Discover the latest in cars, motorcycles, and automotive technology." }, { "name": "Home & Garden", "overview": "Find ideas for home improvement, gardening, and interior design." }, { "name": "Relationships & Dating", "overview": "Gain insights and advice on building and maintaining relationships." }, { "name": "Philosophy & Spirituality", "overview": "Reflect on life's big questions, beliefs, and spiritual practices." }], "selectedCategories": [], "text": "Hi Michael, I'm Gogue, your AI assistant, and to personalize your experience, I'll start by showing you some broad categories to choose from so we can tailor the app to your interests." }
    const lastModelMessage = conversationItems.findLast(message => message.messages.find(m => m.type === 'model'));

    if (lastModelMessage) {
      const lastMessages = lastModelMessage.messages.filter(m => m.type === 'model');
      let { response_text, selected_categories, new_categories } = parse(lastMessages[lastMessages.length - 1]?.content);
      return {
        text: response_text,
        selectedCategories: selected_categories,
        newCategories: new_categories?.filter((category: any) => category?.name?.length > 0)
      }
    }
    return null;
  }, [conversationItems]);

  useEffect(() => {
    if (!firstStepInitialized && data?.text && !nextLoading && step === 0) {
      console.log('settings first step', data?.text);
      setFirstStepCategories(data?.newCategories || []);
      setFirstStepText(data?.text || '');
      setFirstStepInitialized(true);
    }
  }, [nextLoading, step, data, firstStepInitialized]);


  useEffect(() => {
    if (!secondStepInitialized && data?.text && !nextLoading && step === 1) {
      console.log('settings second step', data?.text);
      setSecondStepCategories(data?.newCategories || []);
      setSecondStepText(data?.text || '');
      setSecondStepInitialized(true);
    }
  }, [nextLoading, step, data, secondStepInitialized]);

  useEffect(() => {
    if (data?.text?.length) {
      setLoading(false);
    }
  }, [data?.text]);


  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: false,
    closeByGestureEnabled: false
  }), [visible]);


  const levelData = useMemo(() => {
    if (step === 0) {
      return {
        categories: firstStepCategories.length ? firstStepCategories : data?.newCategories,
        text: firstStepText || data?.text,
        selectedCategories: selectedCategoriesFirstStep,
        allSelectedCategories: [...selectedCategoriesFirstStep, ...selectedCategoriesSecondStep]
      }
    }
    if (step === 1) {
      return {
        categories: secondStepCategories.length ? secondStepCategories : data?.newCategories,
        text: secondStepText || data?.text,
        selectedCategories: selectedCategoriesSecondStep,
        allSelectedCategories: [...selectedCategoriesFirstStep, ...selectedCategoriesSecondStep]
      }
    }
    return null;
  }, [step, firstStepCategories, data, selectedCategoriesFirstStep, selectedCategoriesSecondStep]);


  useEffect(() => {
    if (customCategoryEditable) {
      setTimeout(() => {
        customCategoryInputRef.current?.focus();
      }, 100);
    }
  }, [customCategoryEditable]);

  return (
    <GlobalDrawer customKeyboardBehavior={null} showCloseButton={false} title='Personalization' headerBorder drawerSettings={drawerSettings}>
      {
        loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <>
            <ScrollView
              className="px-4"
            >
              <View className="mt-4 mb-4">
                {
                  levelData?.text && (
                    <Text className="text-base text-gray-600">{levelData.text}</Text>
                  )
                }
              </View>
              <View className="flex-row flex-wrap">
                {
                  levelData?.categories?.length > 0 && (
                    <Pressable onPress={() => {
                      setCustomCategoryEditable(true)
                    }}>
                      <View className={`py-1.5 px-4 rounded-full mb-3 mr-3 border-dotted border-blue-300 border-2`}>
                        {
                          customCategoryEditable ? (
                            <Input
                              ref={customCategoryInputRef}
                              value={customCategoryName}
                              onChangeText={setCustomCategoryName}
                              placeholder='Enter category name'
                              componentClassName='border-1 p-0.5 flex-none min-w-[160]'
                              inputClassName='placeholder:text-blue-400'
                              useWrapper={false}
                              submitBehavior='submit'
                              returnKeyType='done'
                              onSubmitEditing={() => {
                                if (customCategoryName.length === 0) {
                                  setCustomCategoryEditable(false);
                                  setCustomCategoryName('');
                                  return;
                                }
                                if (step === 0) {
                                  setFirstStepCategories([{ name: customCategoryName, overview: '' }, ...firstStepCategories]);
                                  setSelectedCategoriesFirstStep([customCategoryName, ...selectedCategoriesFirstStep]);
                                } else {
                                  setSecondStepCategories([{ name: customCategoryName, overview: '' }, ...secondStepCategories]);
                                  setSelectedCategoriesSecondStep([customCategoryName, ...selectedCategoriesSecondStep]);
                                }
                                setCustomCategoryEditable(false);
                                setCustomCategoryName('');
                              }}
                            />
                          ) : (
                            <Text className={`text-base text-blue-400`}>Add custom category</Text>
                          )
                        }
                      </View>
                    </Pressable>
                  )
                }
                {
                  levelData?.categories?.map((category: any) => {
                    const isSelected = levelData.allSelectedCategories.includes(category.name);

                    return (
                      <Pressable key={category.name} onPress={() => {
                        if (isSelected) {
                          // Remove category if already selected                         
                          if (step === 0) {
                            setSelectedCategoriesFirstStep(levelData.selectedCategories.filter(cat => cat !== category.name));
                            setSecondStepInitialized(false);
                            setSecondStepCategories([]);
                            setSecondStepText('');
                            setSelectedCategoriesSecondStep([]);
                          } else {
                            setSelectedCategoriesSecondStep(levelData.selectedCategories.filter(cat => cat !== category.name));
                          }

                        } else {
                          // Add category if not selected                      
                          if (step === 0) {
                            setSelectedCategoriesFirstStep([...selectedCategoriesFirstStep, category.name]);
                            setSecondStepInitialized(false);
                            setSecondStepCategories([]);
                            setSecondStepText('');
                            setSelectedCategoriesSecondStep([]);
                          } else {
                            setSelectedCategoriesSecondStep([...selectedCategoriesSecondStep, category.name]);
                          }
                        }
                      }}>
                        <View className={`py-2 px-4 rounded-full mb-3 mr-3 ${isSelected
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                          }`}>
                          <Text className={`text-base ${isSelected
                            ? 'text-blue-500'
                            : 'text-gray-600'
                            }`}>{category.name}</Text>
                        </View>
                      </Pressable>
                    );
                  })
                }
              </View>
              <View style={{ height: insets.bottom + 60 }} />
            </ScrollView>
            <View className="px-4 py-2 absolute bottom-0 left-0 right-0" style={{ paddingBottom: insets.bottom }}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
                locations={[0, 0.18, 1]}
                style={gradientStyle}
              />
              <View className='flex-row gap-2'>
                {
                  step > 0 && !nextLoading && !submitting && (
                    <Button
                      ghost
                      text='Back'
                      onPress={() => {
                        setStep(step - 1);
                      }} />
                  )
                }
                <Button
                  className='flex-1'
                  disabled={nextLoading || levelData?.selectedCategories?.length === 0 || submitting}
                  text={step === 0 ? 'Continue' : 'Start learning'}
                  loading={nextLoading || submitting}
                  onPress={() => {
                    if (step === 0) {
                      if (!secondStepInitialized) {
                        setStepChangeIntention(true);
                        stream(selectedCategoriesFirstStep, false);
                      } else {
                        setStep(step + 1);
                      }
                    }

                    if (step === 1) {
                      setSubmitting(true);
                      stream([...selectedCategoriesFirstStep, ...selectedCategoriesSecondStep], true);
                    }
                  }} />
              </View>
            </View>
          </>
        )
      }
    </GlobalDrawer>
  )
}