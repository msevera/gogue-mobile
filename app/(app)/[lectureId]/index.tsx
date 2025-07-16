import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useMutation, useSubscription } from '@apollo/client';
import { LayoutChangeEvent, View } from 'react-native';
import { GET_LECTURE_DETAILS, SET_PLAYBACK_TIMESTAMP, SET_STATUS } from '@/apollo/queries/lectures';
import { CreateNoteMutation, CreateNoteMutationVariables, DeleteNoteMutation, DeleteNoteMutationVariables, Lecture, LectureMetadataStatus, Note, NoteCreatedSubscription, NoteCreatedSubscriptionVariables, SetPlaybackTimestampMutation, SetPlaybackTimestampMutationVariables, SetStatusMutation, SetStatusMutationVariables } from '@/apollo/__generated__/graphql';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextHighlighter } from '@/components/TextHighlighter';
import LectureDrawer, { LectureDrawerRef } from '@/components/LectureDrawer';
import { Header } from '@/components/layouts/Header';
import { useGetNotes } from '@/hooks/useGetNotes';
import { CREATE_NOTE, DELETE_NOTE, NOTE_CREATED_SUBSCRIPTION } from '@/apollo/queries/notes';
import { CurrentSentence, useSentence } from '@/hooks/useSentence';
import { useGetLecture } from '@/hooks/useGetLecture';
import { useDebouncedCallback } from 'use-debounce';
import { useGetLecturesRecentlyPlayed } from '@/hooks/useGetLecturesRecentlyPlayed';
import * as WebBrowser from 'expo-web-browser';
import TrackPlayer, { State, useTrackPlayerEvents, Event, RepeatMode } from 'react-native-track-player';


export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const [alignments, setAlignments] = useState([]);
  const [content, setContent] = useState('');
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lectureDrawerRef = useRef<LectureDrawerRef>(null);
  const [savingPlaybackIsReady, setSavingPlaybackIsReady] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const { items: notes, updateCreateNoteCache, updateDeleteNoteCache } = useGetNotes({ lectureId: lectureId as string });
  const { lecture, loading } = useGetLecture(lectureId as string, GET_LECTURE_DETAILS);
  const { updateRecentlyPlayedLectureCache } = useGetLecturesRecentlyPlayed({ skip: true });
  const [setPlaybackTimestamp] = useMutation<SetPlaybackTimestampMutation, SetPlaybackTimestampMutationVariables>(SET_PLAYBACK_TIMESTAMP, {
    update: () => {
      updateRecentlyPlayedLectureCache(lecture as Lecture);
    },
    onError: (error) => {
      // console.log('SET_PLAYBACK_TIMESTAMP error', JSON.stringify(error, null, 2));
    }
  });

  const debouncedOnSentenceChange = useDebouncedCallback((playbackTimmestamp: number) => {
    setPlaybackTimestamp({
      variables: {
        id: lectureId as string,
        timestamp: playbackTimmestamp
      }
    })
  }, 1000);

  const { sentences, currentNote, currentSentence, selectNote } = useSentence({
    alignments,
    notes: notes as Note[],
    content,
    currentTime,
    onSentenceChange: useCallback((sentenceIndex: number, sentenceStartTime: number) => {
      setNoteId(undefined);
      if (savingPlaybackIsReady) {
        console.log('savingPlaybackIsReady', savingPlaybackIsReady, sentenceStartTime);
        debouncedOnSentenceChange(sentenceStartTime)
      }
    }, [savingPlaybackIsReady])
  });

  const onNotes = useCallback(() => {
    console.log('onNotes');
  }, []);


  useSubscription<NoteCreatedSubscription, NoteCreatedSubscriptionVariables>(NOTE_CREATED_SUBSCRIPTION, {
    variables: {
      lectureId: lectureId as string,
    },
    onData: async ({ data }) => {
      const note = data.data?.noteCreated as Note;
      updateCreateNoteCache(note);
    }
  });

  useEffect(() => {
    if (lecture?.id) {
      lectureDrawerRef.current?.setPlayLineCurrentTime(lecture.metadata?.playbackTimestamp || 0);
      TrackPlayer.seekTo(lecture.metadata?.playbackTimestamp || 0)
      setSavingPlaybackIsReady(true);
    }
  }, [lecture?.id])

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

  const [setLectureStatus] = useMutation<SetStatusMutation, SetStatusMutationVariables>(SET_STATUS, {
    onError: (error) => {
      console.log('SET_STATUS error', JSON.stringify(error, null, 2));
    }
  });

  const onCreateNote = useCallback(() => {
    createNote({
      variables: {
        lectureId: lectureId as string,
        timestamp: currentSentence?.sentence.start_time || 0
      }
    });
  }, [lectureId, currentSentence, createNote]);

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

  useEffect(() => {
    const configurePlayer = async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add([{
        url: lecture.audio?.stream as string,
        title: lecture.title as string,
        duration: lecture.audio?.duration as number,
        artwork: lecture.image?.webp as string,
      }])

      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    }
    if (lecture?.audio?.stream) {
      configurePlayer();
    }
  }, [lecture?.audio?.stream]);

  useEffect(() => {
    return () => {
      TrackPlayer.reset();
    }
  }, []);


  useTrackPlayerEvents([Event.PlaybackProgressUpdated, Event.PlaybackPlayWhenReadyChanged, Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackPlayWhenReadyChanged) {
      console.log('PlaybackPlayWhenReadyChanged', event.playWhenReady);
      setIsPlaying(event.playWhenReady)
    }

    if (event.type === Event.PlaybackProgressUpdated) {
      const time = Number(event.position.toFixed(2));
      console.log('PlaybackProgressUpdated', time, lecture.audio?.duration);
      lectureDrawerRef.current?.setPlayLineCurrentTime(time)
      setCurrentTime(time)
    }

    if (event.type === Event.PlaybackQueueEnded) {
      console.log('PlaybackQueueEnded', event.track);
      await setLectureStatus({
        variables: {
          id: lectureId as string,
          status: 'COMPLETED' as LectureMetadataStatus
        }
      })
      updateRecentlyPlayedLectureCache(lecture as Lecture, true);
    }
  })

  const onSeek = useCallback((time: number) => {
    setCurrentTime(time)
  }, []);

  const onSeekEnd = useCallback((time: number) => {
    TrackPlayer.seekTo(time)
    if (wasPlaying) {
      TrackPlayer.play()
    }
  }, [wasPlaying]);

  const onSeekStart = useCallback(async () => {
    setWasPlaying((await TrackPlayer.getPlaybackState()).state === State.Playing)
    TrackPlayer.pause()
  }, []);

  const onTextSelect = useCallback((time: number) => {
    lectureDrawerRef.current?.setPlayLineCurrentTime(time);
    TrackPlayer.seekTo(time)
  }, []);

  const onLayoutHandler = useCallback((event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height - parseInt(lectureDrawerRef.current?.getControlsDrawerClosedSnapPoint() as string))
  }, []);


  const onPlayPause = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }
  }, [isPlaying]);

  const onDeleteNote = useCallback(async (id: string) => {
    await deleteNote({
      variables: {
        id
      }
    });
  }, [deleteNote]);

  const onSelectNote = useCallback((note: Note) => {
    TrackPlayer.seekTo(note.timestamp)
  }, [selectNote]);

  const onConnectToAgent = useCallback(() => {
    TrackPlayer.pause();
  }, []);


  const onAnnotation = useCallback(async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  }, []);

  const memoizedContent = useMemo(() => {
    if (!lecture) return null;

    return (
      <View className='flex-1'>
        <View className='flex-1' onLayout={onLayoutHandler}>
          <TextHighlighter
            notes={notes as Note[]}
            text={content}
            sections={lecture.sections}
            sentences={sentences}
            currentSentence={currentSentence as CurrentSentence}
            onSelect={onTextSelect}
            onAnnotation={onAnnotation}
          />
        </View>
      </View>
    );
  }, [lecture, notes, content, sentences, currentSentence, scrollViewHeight, onLayoutHandler, onTextSelect]);

  return (<View className="flex-1">
    <ScreenLayout
      screenOptions={{
        headerLoading: loading,
        headerShown: false,
        animation: 'slide_from_bottom',
        gestureDirection: 'vertical',
      }}
      contentLoading={loading}
      contentEmpty={false}
      contentEmptyText='Create your first lecture'
      bottomPadding={false}
    >
      <Header
        backClassName='left-[5]'
        showBack
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
        onConnectToAgent={onConnectToAgent}
      />
    </ScreenLayout>
  </View>
  );
}
