import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { TextHighlighter2 } from '@/components/TextHighlighter2';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { useWebRTC } from '@/hooks/useWebRTC';

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
  const { muteMic, unmuteMic, isMuted, setupWebRTC, connected, isConnecting, stop } = useWebRTC();




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
              <Button text={`WebRTC ${connected ? 'connected' : 'not connected'} ${isConnecting ? 'connecting...' : ''}`} onPress={() => {
                setupWebRTC();
              }} />
              {
                connected && (
                  <View className='flex-row gap-2'>
                    <Button text="Disconnect" onPress={() => {
                      stop();
                    }} />
                    {
                      !isMuted ? (
                        <Button text="Mute" onPress={() => {
                          muteMic();
                        }} />
                      ) : (
                        <Button text="Unmute" onPress={() => {
                          unmuteMic();
                        }} />
                      )
                    }                    
                  </View>

                )
              }
              <ScrollView className='px-4 pt-6' onLayout={onLayoutHandler} ref={scrollViewRef}>
                <TextHighlighter2
                  text={content}
                  sections={lectureData.sections.map(section => section.title)}
                  alignments={alignments}
                  currentTime={currentTime}
                  onSelect={onTextSelect}
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
          onPlayPause={() => {
            if (isPlaying) {
              player.pause()
            } else {
              player.play()
            }
          }}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          alignments={alignments}
        />
      </ScreenLayout>
    </View>
  );
}
