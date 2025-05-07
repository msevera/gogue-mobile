import { useEffect, useState } from 'react';
import { Message, MessageRoleEnum, MessageTypeEnum, TranscriptMessageTypeEnum } from './conversation';
import vapi from './vapi';
import { GetLectureAgentQuery, GetLectureAgentQueryVariables, GetNoteAgentQuery, GetNoteAgentQueryVariables, LectureAgent } from '@/apollo/__generated__/graphql';
import { GET_LECTURE_AGENT } from '@/apollo/queries/lectures';
import { useLazyQuery } from '@apollo/client';
import { GET_NOTE_AGENT } from '@/apollo/queries/notes';
export enum CALL_STATUS {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  LOADING = 'loading',
}

export function useVapi(
  {
    onMessage,
    onError,
    onCallEnd,
    onSpeechStart,
    onSpeechEnd,
    lectureId,
    noteId
  }:
    {
      onMessage: (message: Message) => void,
      onError: (error: Error) => void,
      onCallEnd: () => void,
      onSpeechStart: () => void,
      onSpeechEnd: () => void,
      lectureId?: string,
      noteId?: string
    }
) {
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [tryingToPause, setTryingToPause] = useState<boolean>(false);
  const [tryingToRewind, setTryingToRewind] = useState<boolean>(false);
  const [tryingToCreateNote, setTryingToCreateNote] = useState<boolean>(false);
  const [firstMessageSaid, setFirstMessageSaid] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const [getLectureAgentQuery] = useLazyQuery<GetLectureAgentQuery, GetLectureAgentQueryVariables>(GET_LECTURE_AGENT, {
    fetchPolicy: 'network-only',
    variables: {
      id: lectureId as string,
    },
  });

  const [getNoteAgentQuery] = useLazyQuery<GetNoteAgentQuery, GetNoteAgentQueryVariables>(GET_NOTE_AGENT, {
    fetchPolicy: 'network-only',
    variables: {
      id: noteId as string,
    },
  });

  useEffect(() => {
    const onCallStartHandler = () => {
      setTryingToPause(false);
      setTryingToRewind(false);
      setTryingToCreateNote(false);
      // setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEndHandler = () => {
      setTryingToPause(false);
      setTryingToRewind(false);
      setTryingToCreateNote(false);
      setCallStatus(CALL_STATUS.INACTIVE);
      onCallEnd();
    };

    const onMessageUpdate = (message: Message) => {
      if (message?.role === 'user') {
        setIsPaused(false);
      }
      onMessage(message);
    };

    const onErrorHandler = (e: any) => {
      setTryingToPause(false);
      setTryingToRewind(false);
      setTryingToCreateNote(false);
      setCallStatus(CALL_STATUS.INACTIVE);
      onError(e);
    };

    const onSpeechStartHandler = () => {
      setTryingToPause(false);
      setTryingToRewind(false);
      setTryingToCreateNote(false);
      onSpeechStart();
    };

    const onSpeechEndHandler = () => {
      if (!firstMessageSaid) {
        setFirstMessageSaid(true);
        vapi.send({
          type: 'add-message',
          message: {
            role: 'user',
            content: "Let's start"
          }
        });
      }

      onSpeechEnd();
    };

    vapi.on('call-start', onCallStartHandler);
    vapi.on('call-end', onCallEndHandler);
    vapi.on('message', onMessageUpdate);
    vapi.on('error', onErrorHandler);
    vapi.on('speech-start', onSpeechStartHandler);
    vapi.on('speech-end', onSpeechEndHandler);

    return () => {
      vapi.off('call-start', onCallStartHandler);
      vapi.off('call-end', onCallEndHandler);
      vapi.off('message', onMessageUpdate);
      vapi.off('error', onErrorHandler);
      vapi.off('speech-start', onSpeechStartHandler);
      vapi.off('speech-end', onSpeechEndHandler);
    };
  }, [firstMessageSaid, callStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (callStatus === CALL_STATUS.ACTIVE) {
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (callStatus === CALL_STATUS.INACTIVE) {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [callStatus]);

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING);
    try {
      let agentConfig: any; 
      let agentData: any;
      if (noteId) {
        const { data: { noteAgent } = {} } = await getNoteAgentQuery();
        agentData = noteAgent as LectureAgent;      
      } else {
        const { data: { lectureAgent } = {} } = await getLectureAgentQuery();
        agentData = lectureAgent as LectureAgent;
      }

      agentConfig = JSON.parse(agentData?.config);

      await vapi.start({
        endCallFunctionEnabled: true,
        ...agentConfig
      });

      vapi.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: "Let's start"
        }
      });

      setTimeout(() => {
        setCallStatus(CALL_STATUS.ACTIVE);
        setMuted(true);
      }, 1500);
    } catch (e) {
      setCallStatus(CALL_STATUS.INACTIVE);
      console.error('error starting the call', e);
    }
  };

  const stop = () => {
    try {
      setCallStatus(CALL_STATUS.INACTIVE);
      vapi.stop();
    } catch (e) {
      console.log('error stopping the call', e);
    }
  };

  const setMuted = (value: boolean) => {
    try {
      vapi.setMuted(value);
      setTryingToPause(false);
      setTryingToRewind(false);
      setTryingToCreateNote(false);
      setIsMuted(value);
    } catch (e) {
      console.log('error setting the muted', e);
    }
  };

  const pause = () => {
    setIsPaused(true);
    setTryingToRewind(false);
    setTryingToPause(true);
    setTryingToCreateNote(false);


    console.log('pausing');

    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: "Pause lecture"
      }
    });
  }

  const unpause = () => {
    setIsPaused(false);
    setTryingToRewind(false);
    setTryingToPause(true);
    setTryingToCreateNote(false);

    console.log('unpausing');

    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: noteId ? "Let's continue note to the end" : "Let's continue lecture to the end"
      }
    });
  }

  const rewind = () => {
    setIsPaused(false);
    setTryingToPause(false);
    setTryingToRewind(true);
    setTryingToCreateNote(false);
    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: "Rewind for 25 words back and continue to the end from there (do not say about number of words)"
      }
    });
  }

  const sendMessage = (content: string) => {
    setIsPaused(false);
    setTryingToPause(false);
    setTryingToRewind(false);
    setTryingToCreateNote(false);
    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content
      }
    });

    setTimeout(() => {
      onMessage({
        transcriptType: TranscriptMessageTypeEnum.FINAL,
        role: MessageRoleEnum.USER,
        transcript: content,
        type: MessageTypeEnum.TRANSCRIPT
      });
    }, 1500);
  }


  const createNote = () => {
    setIsPaused(false);
    setTryingToPause(false);
    setTryingToRewind(false);
    setTryingToCreateNote(true);
    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: 'Create a note'
      }
    });
  }

  return {
    callStatus,
    start,
    stop,
    setMuted,
    isMuted,
    pause,
    unpause,
    isPaused,
    rewind,
    tryingToPause,
    tryingToRewind,
    tryingToCreateNote,
    sendMessage,
    createNote,
    elapsedTime
  };
}