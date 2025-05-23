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
import LectureDrawerOld from '@/components/vapi/lectureDrawerOld';
import { Header } from '@/components/layouts/Header';

// const audioSource = require('./assets/Hello.mp3');

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textSelectCalled, setTextSelectCalled] = useState(false);
  const lectureDrawerRef = useRef<LectureDrawerRef>(null);


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
    if (textSelectCalled) {
      setTextSelectCalled(false)
      return;
    }

    setCurrentTime(status.currentTime)    
  }, [status.currentTime, textSelectCalled])

  // console.log('status', status.currentTime)

  const onSeek = (position: number) => {
    setCurrentTime(position)
  }

  const onSeekEnd = (position: number) => {
    setCurrentTime(position)
    player.seekTo(position)
    if (wasPlaying) {
      player.play()
    }
  }

  const onSeekStart = (position: number) => {
    setWasPlaying(player.playing)
    if (player.playing) {
      player.pause()
    }
  }

  const onTextSelect = (time: number) => {
    setTextSelectCalled(true)
    console.log('onPlayFromTime', time)
    setCurrentTime(time)
    player.seekTo(time)

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
              setIsPlaying(false)
            } else {
              player.play()
              setIsPlaying(true)
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
