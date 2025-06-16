import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { CreateNoteMutation, CreateNoteMutationVariables, Lecture, Note, NoteCreatedSubscription, NoteCreatedSubscriptionVariables } from '@/apollo/__generated__/graphql';
import { PLAYBACK_STATUS_UPDATE, useAudioPlayer, useAudioPlayerStatus, createAudioPlayer, AudioPlayer, AudioStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useGetNotes } from '@/hooks/useGetNotes';
import { CREATE_NOTE, NOTE_CREATED_SUBSCRIPTION } from '@/apollo/queries/notes';
import { CurrentSentence, useSentence } from '@/hooks/useSentence';

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lectureDrawerRef = useRef<LectureDrawerRef>(null);
  const textSelectedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [status, setStatus] = useState<{
    playing: boolean;
    didJustFinish: boolean;
    duration: number;
    currentTime: number;
  }>({ playing: false, didJustFinish: false, duration: 0, currentTime: 0 })
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const { items: notes, isLoading: notesLoading, updateCreateNoteCache } = useGetNotes({ lectureId: lectureId as string });
  const { sentences, currentNote, currentSentence } = useSentence({
    alignments,
    notes: notes as Note[],
    content,
    currentTime: status.currentTime,
    onSentenceChange: (sentenceIndex: number, sentenceStartTime: number) => {
      setNoteId(undefined);
    }
  });

  const playerRef = useRef<AudioPlayer>(null);

  const onNotes = () => {
    console.log('onNotes');
  }

  const { data: { lecture } = {}, loading, refetch } = useQuery(GET_LECTURE, {
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

  useSubscription<NoteCreatedSubscription, NoteCreatedSubscriptionVariables>(NOTE_CREATED_SUBSCRIPTION, {
    variables: {
      lectureId: lectureId as string,
    },
    onData: async ({ data }) => {
      const note = data.data?.noteCreated as Note;
      updateCreateNoteCache(note);
    }
  });

  const [createNote, { loading: createNoteLoading }] = useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CREATE_NOTE, {
    onError: (error) => {
      console.log('CREATE_NOTE error', JSON.stringify(error, null, 2));
    }
  });

  const onCreateNote = () => {
    createNote({
      variables: {
        lectureId: lectureId as string,
        timestamp: status.currentTime
      }
    });
  }

  const onAgentCreateNote = (noteId: string) => {
    setNoteId(noteId);
  }

  useEffect(() => {
    if (lectureData) {
      setContent(lectureData.sections.map(section => `${section.content}`).join('\n'));
      const alignments = JSON.parse(lectureData.aligners?.mfa as string);
      setAlignments(alignments);
    }
  }, [lectureData]);

  const player = useAudioPlayer({
    uri: lectureData?.audioPaths?.stream as string
  }, 1000);

  useEffect(() => {
    if (!player) return;

    const listener = (status: any) => {
      setStatus((oldStatus) => {
        let statusChanged = false;
        const time = Number(status.currentTime.toFixed(2));
        if (time !== oldStatus.currentTime) {
          statusChanged = true;
        }

        if (status.playing !== oldStatus.playing) {
          statusChanged = true;
        }

        if (status.didJustFinish !== oldStatus.didJustFinish) {
          statusChanged = true;
        }

        if (status.duration !== oldStatus.duration) {
          statusChanged = true;
        }

        if (statusChanged) {
          return {
            ...oldStatus,
            currentTime: time,
            playing: status.playing,
            didJustFinish: status.didJustFinish,
            duration: status.duration
          };
        }

        return oldStatus;              
      })
    }
   
    player.addListener(PLAYBACK_STATUS_UPDATE, listener)
   
    return () => {
      player.removeAllListeners(PLAYBACK_STATUS_UPDATE)
    }
  }, [player?.id])

  useEffect(() => {
    setIsPlaying(status.playing)
  }, [status.playing])

  useEffect(() => {
    if (status.didJustFinish) {
      setIsPlaying(false)
    }
  }, [status.didJustFinish])

  const onSeek = (time: number) => {
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: time
      }
    })
  }

  const onSeekEnd = (time: number) => {
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: time
      }
    })
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
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: time
      }
    })
    textSelectedRef.current = true;
  }

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height - parseInt(lectureDrawerRef.current?.getControlsDrawerClosedSnapPoint() as string))
  }

  const onPlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      player.pause()
    } else {      
      setIsPlaying(true)
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
              <ScrollView className='px-4 pt-4' onLayout={onLayoutHandler} ref={scrollViewRef}>
                <TextHighlighter
                  notes={notes as Note[]}
                  text={content}
                  sections={lectureData.sections.map(section => section.title)}
                  sentences={sentences}
                  currentSentence={currentSentence as CurrentSentence}
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
          currentTime={status.currentTime}
          duration={status.duration}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          sentences={sentences}
          notes={notes as Note[]}
          notesCount={lectureData?.metadata?.notesCount as number}
          noteId={noteId as string}
          lectureId={lectureId as string}
          onCreateNote={onCreateNote}
          onCreateNoteLoading={createNoteLoading}
          onNotes={onNotes}
          onAgentCreateNote={onAgentCreateNote}
          currentNote={currentNote as Note}
          currentSentence={currentSentence as CurrentSentence}
        />
      </ScreenLayout>
    </View>
  );
}
