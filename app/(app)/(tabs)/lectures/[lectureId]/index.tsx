import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useAudioPlayer, createAudioPlayer, AudioStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';

// const audioSource = require('./assets/Hello.mp3');

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');

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
  }, 100);

  useEffect(() => {
    const fn = (data: AudioStatus) => {
      setCurrentTime(data.currentTime)
    }
    player.addListener('playbackStatusUpdate', fn)
    player.seekTo(0)
    return () => {
      player.removeListener('playbackStatusUpdate', fn)
    }
  }, [player])

  return (
    <View className="flex-1">
      <ScreenLayout
        screenOptions={{
          headerLoading: loading,
          headerTitle: lectureData?.title,
          headerShown: true,
        }}
        contentLoading={loading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >
        {
          lectureData && (
            <ScrollView>
              <View className='flex-row gap-2'>
                <Button text='Play' onPress={async () => {
                  
                  player.play();
                }} />
                <Button text="Stop" onPress={() => {
                  player.pause()
                }} />
              </View>
              <TextHighlighter text={content} alignments={alignments} currentTime={currentTime} />
            </ScrollView>
          )
        }
      </ScreenLayout>
    </View>
  );
}
