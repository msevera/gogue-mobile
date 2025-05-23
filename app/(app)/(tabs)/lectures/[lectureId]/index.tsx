import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');
  const [wasPlaying, setWasPlaying] = useState(false);
  const lectureDrawerRef = useRef<LectureDrawerRef>(null);
  const textSelectedRef = useRef(false);


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
    if (player.playing) {
      player.pause()
    }
  }

  const onTextSelect = (time: number) => {
    player.seekTo(time)
    setCurrentTime(time)
    textSelectedRef.current = true;      
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
              <Pressable onPress={() => {
                // player.seekTo(10)
                // setCurrentTime(10)
                console.log('seekto', player.currentStatus)
                
              }}>
                <Text>Press me</Text>
              </Pressable>
              <ScrollView className='px-4 pt-6'>
                <TextHighlighter
                  text={content}
                  sections={lectureData.sections.map(section => section.title)}
                  alignments={alignments}
                  currentTime={currentTime}
                  onSelect={onTextSelect}
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
          isPlaying={status.playing}
          onPlayPause={() => {
            if (status.playing) {
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
