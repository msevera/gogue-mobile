import { useLocalSearchParams, ScreenProps } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { CreateNoteMutation, CreateNoteMutationVariables, DeleteNoteMutation, DeleteNoteMutationVariables, Lecture, Note, NoteCreatedSubscription, NoteCreatedSubscriptionVariables } from '@/apollo/__generated__/graphql';
import { PLAYBACK_STATUS_UPDATE, useAudioPlayer, useAudioPlayerStatus, createAudioPlayer, AudioPlayer, AudioStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useGetNotes } from '@/hooks/useGetNotes';
import { CREATE_NOTE, DELETE_NOTE, NOTE_CREATED_SUBSCRIPTION } from '@/apollo/queries/notes';
import { CurrentSentence, useSentence } from '@/hooks/useSentence';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useGetLecture } from '@/hooks/useGetLecture';

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
  const { items: notes, updateCreateNoteCache, updateDeleteNoteCache } = useGetNotes({ lectureId: lectureId as string });
  const { sentences, currentNote, currentSentence, selectNote } = useSentence({
    alignments,
    notes: notes as Note[],
    content,
    currentTime: status.currentTime,
    onSentenceChange: useCallback(() => {
      setNoteId(undefined);
    }, [])
  });

  const onNotes = useCallback(() => {
    console.log('onNotes');
  }, []);

  const { lecture, loading } = useGetLecture(lectureId as string);
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

  const [deleteNote, { loading: deleteNoteLoading }] = useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DELETE_NOTE, {
    onError: (error) => {
      console.log('DELETE_NOTE error', JSON.stringify(error, null, 2));
    },
    update: (cache, result, { variables }) => {
      const { id } = variables || {};
      updateDeleteNoteCache(id as string);
    }
  });

  const onCreateNote = useCallback(() => {
    createNote({
      variables: {
        lectureId: lectureId as string,
        timestamp: status.currentTime
      }
    });
  }, [lectureId, status.currentTime, createNote]);

  const onAgentCreateNote = useCallback((noteId: string) => {
    setNoteId(noteId);
  }, []);

  useEffect(() => {
    if (lecture) {
      setContent(lecture.sections.map(section => `${section.content}`).join('\n'));
      const alignments = JSON.parse(lecture.aligners?.mfa as string);
      setAlignments(alignments);
    }
  }, [lecture]);

  const player = useAudioPlayer({
    uri: lecture?.audio?.stream as string
  }, 1000);

  useEffect(() => {
    if (!player) return;

    const listener = (status: any) => {
      setStatus((oldStatus) => {
        let statusChanged = false;
        const time = Number(status.currentTime.toFixed(2));
        if (time !== oldStatus.currentTime) {
          lectureDrawerRef.current?.setPlayLineCurrentTime(time);
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

  const onSeek = useCallback((time: number) => {
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: time
      }
    })


  }, []);

  const onSeekEnd = useCallback((time: number) => {
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
  }, [wasPlaying, player]);

  const onSeekStart = useCallback(() => {
    setWasPlaying(player.playing)
    player.pause()
  }, [player]);

  const onTextSelect = useCallback((time: number) => {
    lectureDrawerRef.current?.setPlayLineCurrentTime(time);
    player.seekTo(time)
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: time
      }
    })
    textSelectedRef.current = true;
  }, [player]);

  const onLayoutHandler = useCallback((event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height - parseInt(lectureDrawerRef.current?.getControlsDrawerClosedSnapPoint() as string))
  }, []);

  const onPlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      player.pause()
    } else {
      setIsPlaying(true)
      player.play()
    }
  }, [isPlaying, player]);

  const onDeleteNote = useCallback(async (id: string) => {
    await deleteNote({
      variables: {
        id
      }
    });
  }, [deleteNote]);

  const onSelectNote = useCallback((note: Note) => {
    player.seekTo(note.timestamp)
    setStatus((oldStatus) => {
      return {
        ...oldStatus,
        currentTime: note.timestamp
      }
    })
  }, [selectNote]);

  const memoizedContent = useMemo(() => {
    if (!lecture) return null;
    return (
      <View className='flex-1'>
        <ScrollView className='px-4 pt-4' onLayout={onLayoutHandler} ref={scrollViewRef}>
          <TextHighlighter
            notes={notes as Note[]}
            text={content}
            sections={lecture.sections.map(section => section.title)}
            sentences={sentences}
            currentSentence={currentSentence as CurrentSentence}
            onSelect={onTextSelect}
            scrollViewRef={scrollViewRef}
            scrollViewHeight={scrollViewHeight}
          />
          <View className='h-[240]' />
        </ScrollView>
      </View>
    );
  }, [lecture, notes, content, sentences, currentSentence, scrollViewHeight, onLayoutHandler, onTextSelect]);

  return (
    <View className="flex-1">
      <ScreenLayout
        screenOptions={{
          headerLoading: loading,
          headerShown: false,
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          // transitionSpec: {
          //   open: {
          //     animation: 'timing',
          //     config: {
          //       duration: 1000,
          //     },
          //   },
          //   close: {
          //     animation: 'timing',
          //     config: {
          //       duration: 1000,
          //     },
          //   }
          // },
          
        }}
        contentLoading={loading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >
        <Header
          backClassName='left-[5]'
          icon={{
            component: 'Ionicons',
            name: 'chevron-down',
            color: 'black',
            size: 24
          }}
          title={lecture?.title || ''}
          loading={loading}
        />
        {lecture && memoizedContent}
        <LectureDrawer
          ref={lectureDrawerRef}
          duration={lecture?.audio?.duration as number}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          sentences={sentences}
          notes={notes as Note[]}
          notesCount={lecture?.metadata?.notesCount as number}
          noteId={noteId as string}
          lectureId={lectureId as string}
          onCreateNote={onCreateNote}
          onCreateNoteLoading={createNoteLoading}
          onDeleteNoteLoading={deleteNoteLoading}
          onNotes={onNotes}
          onAgentCreateNote={onAgentCreateNote}
          currentNote={currentNote as Note}
          currentSentence={currentSentence as CurrentSentence}
          onDeleteNote={onDeleteNote}
          onSelectNote={onSelectNote}
          bars={lecture?.audio?.bars as number[]}
        />
      </ScreenLayout>
    </View>
  );
}
