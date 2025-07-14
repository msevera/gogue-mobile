import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserTopicsAgent } from '@/hooks/useUserTopicsAgent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parse } from 'best-effort-json-parser'
import React from 'react';

const gradientStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 100,
  zIndex: 0,
}

export const SetTopics = () => {
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategoriesInCurrentStep, setSelectedCategoriesInCurrentStep] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const onClose = () => {
    console.log('onClose');
  }
  const { authUser } = useAuth();
  const { conversationItems, stream } = useUserTopicsAgent({
    onStreamStart: () => {
      console.log('onStreamStart');
      setNextLoading(true);
    },
    onStreamEnd: () => {
      console.log('onStreamEnd');
      setNextLoading(false);
    },
    onTopicsStored: () => {
      setVisible(false);
    }
  });

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

  return (
    <GlobalDrawer title='Personalization' headerBorder drawerSettings={drawerSettings} onBackdropPress={onClose}>
      {
        loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1 px-4"
            >
              <View className="mt-4 mb-4">
                {
                  data?.text && (
                    <Text className="text-base text-gray-600">{data.text}</Text>
                  )
                }
              </View>
              <View className="flex-row flex-wrap">
                {
                  data?.newCategories?.map((category: any, idx: number) => {
                    const isSelected = selectedCategories.includes(category.name);

                    return (
                      <Pressable key={category.name} onPress={() => {
                        if (isSelected) {
                          // Remove category if already selected
                          setSelectedCategories(selectedCategories.filter(cat => cat !== category.name));
                          setSelectedCategoriesInCurrentStep(selectedCategoriesInCurrentStep.filter(cat => cat !== category.name));
                        } else {
                          // Add category if not selected
                          setSelectedCategories([...selectedCategories, category.name]);
                          setSelectedCategoriesInCurrentStep([...selectedCategoriesInCurrentStep, category.name]);
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
              <Button
                disabled={selectedCategoriesInCurrentStep.length === 0}
                text={step === 0 ? 'Continue' : 'Start learning'}
                loading={nextLoading}
                onPress={() => {
                  setStep(step + 1);
                  stream(selectedCategories, step >= 1);
                  setSelectedCategoriesInCurrentStep([]);
                }} />
            </View>
          </>
        )
      }
    </GlobalDrawer>
  )
}