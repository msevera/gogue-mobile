import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { Lecture, Note } from '@/apollo/__generated__/graphql';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useGetNotes } from '@/hooks/useGetNotes';

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lectureDrawerRef = useRef<LectureDrawerRef>(null);
  const textSelectedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const { connect, disconnect, currentState, inCall, sendMessage, botReady } = useVoiceAgent({
    onNoteCreated: (noteId: string) => {
      setNoteId(noteId);
    }
  });

  const { items: notes, isLoading: notesLoading } = useGetNotes({ lectureId: lectureId as string });

  const { data: { lecture } = {}, loading } = useQuery(GET_LECTURE, {
    fetchPolicy: 'network-only',
    variables: {
      id: lectureId as string,
    },
    skip: !lectureId,
    onError: (error) => {
      console.log('GET_LECTURE error', error);
    }
  });

  const lectureData = lecture as Lecture;


  useEffect(() => {
    if (lectureData) {
      setContent(lectureData.sections.map(section => `${section.content}`).join('\n'));
      const alignments = JSON.parse(lectureData.aligners?.mfa as string);
      setAlignments(alignments);
    }
  }, [lectureData]);

  const player = useAudioPlayer({
    uri: lectureData?.audioPaths?.wav as string
  }, 1000);

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (textSelectedRef.current) {
      textSelectedRef.current = false;
      return;
    }

    setCurrentTime(status.currentTime)
  }, [status.currentTime])

  useEffect(() => {
    setIsPlaying(status.playing)
  }, [status.playing])

  useEffect(() => {
    if (status.didJustFinish) {
      setIsPlaying(false)
    }
  }, [status.didJustFinish])

  const onSeek = (time: number) => {
    setCurrentTime(time)
  }

  const onSeekEnd = (time: number) => {
    setCurrentTime(time)
    player.seekTo(time)
    if (wasPlaying) {
      player.play()
    }
  }

  const onSeekStart = () => {
    setWasPlaying(player.playing)
    player.pause()
  }

  const onTextSelect = (time: number) => {
    player.seekTo(time)
    setCurrentTime(time)
    textSelectedRef.current = true;
  }

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height - parseInt(lectureDrawerRef.current?.getControlsDrawerClosedSnapPoint() as string))
  }

  const onSentenceChange = (time: number) => {
    setNoteId(undefined);
  }

  const onPlayPause = () => {
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }

  return (
    <View className="flex-1">
      <ScreenLayout
        screenOptions={{
          headerLoading: loading,
          headerShown: false,
        }}
        contentLoading={loading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >

        <Header title={lectureData?.title} loading={loading} />
        {
          lectureData && (
            <View className='flex-1'>
              {
                botReady ? (
                  <View className='flex-row gap-2'>
                    <Button text="Disconnect" onPress={() => {
                      disconnect();
                    }} />
                    <Button text="Send Message" onPress={() => {
                      sendMessage('Tell me a long joke');
                    }} />
                  </View>
                ) : (
                  <Button text="Connect" onPress={() => {
                    connect({
                      lectureId: lectureId as string,
                      noteId,
                      noteTimestamp: currentTime
                    });
                  }} />
                )
              }
              <ScrollView className='px-4 pt-6' onLayout={onLayoutHandler} ref={scrollViewRef}>
                <TextHighlighter
                  notes={notes as Note[]}
                  text={content}
                  sections={lectureData.sections.map(section => section.title)}
                  alignments={alignments}
                  currentTime={currentTime}
                  onSelect={onTextSelect}
                  onSentenceChange={onSentenceChange}
                  scrollViewRef={scrollViewRef}
                  scrollViewHeight={scrollViewHeight}
                />
                <View className='h-[240]' />
              </ScrollView>
            </View>
          )
        }
        <LectureDrawer
          ref={lectureDrawerRef}
          currentTime={currentTime}
          duration={status.duration}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          alignments={alignments}
          notes={notes as Note[]}
        />
      </ScreenLayout>
    </View>
  );
}
