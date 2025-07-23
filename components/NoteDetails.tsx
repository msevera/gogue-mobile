import { ActivityIndicator, LayoutChangeEvent, Pressable, View } from 'react-native'
import { Text } from './ui/Text'
import { Note } from '@/apollo/__generated__/graphql'
import { CurrentSentence } from '@/hooks/useSentence'
import { Message, useNoteChat } from '@/hooks/useNoteChat'
import { Chat } from './Chat'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Button } from './ui/Button'
import { LinearGradient } from 'expo-linear-gradient'
import Markdown from 'react-native-markdown-display';

type NoteDetailsProps = {
  currentNote: Note
  currentSentence?: CurrentSentence
  onDelete: () => void
  onDeleteNoteLoading: boolean
}

export type NoteDetailsRef = {
  addMessage: (message: Message) => void
}

export const NoteDetails = forwardRef<NoteDetailsRef, NoteDetailsProps>(({ currentNote, currentSentence, onDelete, onDeleteNoteLoading }, ref) => {
  const { messages, loading, addMessage, fetchMore } = useNoteChat({ noteId: currentNote?.id });
  const [localLoading, setLocalLoading] = useState(loading);
  const title = currentNote ? currentNote.title : currentSentence?.text;
  const [expanded, setExpanded] = useState({
    value: false,
    animated: false
  });
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    setExpanded({
      value: messages.length === 0,
      animated: false
    })
  }, [currentNote?.id, messages.length, loading])

  useImperativeHandle(ref, () => ({
    addMessage: (message: Message) => {
      addMessage(message);
    }
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== contentHeight) {
      setContentHeight(h);
    }
  };

  const onAnimationComplete = useCallback(() => {
    setLocalLoading(loading);
  }, [loading])

  const animatedStyle = useAnimatedStyle(() => {
    animatedHeight.value = expanded.value ?
      withTiming(contentHeight + 16, { duration: expanded.animated ? 150 : 0 }, runOnJS(onAnimationComplete)) :
      withTiming(43, { duration: expanded.animated ? 150 : 0 }, runOnJS(onAnimationComplete));
    return { height: animatedHeight.value };
  }, [contentHeight, expanded.value, loading]);

  return (
    <View className='flex-1'>
      {
        localLoading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <>
            <Pressable onPress={() => setExpanded((p) => ({
              value: !p.value,
              animated: true
            }))}>
              <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]} className='flex-row items-center justify-between bg-yellow-100 rounded-2xl mb-2 mx-4'>
                <View className='absolute top-0 left-0 right-0 mx-4' onLayout={onLayout}>
                  <Markdown style={{
                    body: {
                      color: '#030712',
                      fontSize: 18,
                      lineHeight: 28,                     
                    },
                  }}>
                    {title}
                  </Markdown>
                  {
                    currentNote && (
                      <View className='flex-row mt-2 left-[-5]'>
                        <Button
                          sm
                          secondary
                          text='Remove'
                          icon={{
                            component: 'Ionicons',
                            name: 'trash-bin',
                          }}
                          loading={onDeleteNoteLoading}
                          onPress={onDelete}
                          className='w-[110]'
                        />
                      </View>
                    )
                  }
                </View>
                <View className='absolute right-1 bottom-[1] w-10 h-10 items-center justify-center pointer-events-box-none'>
                  <LinearGradient
                    colors={['rgba(254, 249, 195, 0)', 'rgba(254, 249, 195, 0.9)', 'rgba(254, 249, 195, 1)']}
                    style={{
                      position: 'absolute',
                      left: -8,
                      top: -8,
                      right: -8,
                      bottom: -8,
                      borderRadius: 24,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  <Button
                    onPress={() => setExpanded((p) => ({
                      value: !p.value,
                      animated: true
                    }))}
                    secondary
                    sm
                    className="bg-yellow-100"
                    icon={{ size: 18, component: 'Ionicons', name: expanded.value ? 'chevron-up' : 'chevron-down', color: '#030712' }}
                  />
                </View>
              </Animated.View>
            </Pressable>
            <View className='flex-1'>
              <Chat messages={messages} onFetchMore={() => fetchMore()} />
            </View>
          </>
        )
      }
    </View>
  )
})