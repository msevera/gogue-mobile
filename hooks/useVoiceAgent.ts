import { BotLLMTextData, BotTTSTextData, LogLevel, RTVIClient, RTVIMessage, TranscriptData, TransportState } from '@pipecat-ai/client-js';
// import { RNDailyTransport } from '@pipecat-ai/react-native-daily-transport';
import { WebRTCTransport } from '@/lib/webRTCTransport'
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const inCallStates = new Set(["authenticating", "connecting", "connected", "ready"])

export const useVoiceAgent = ({ onNoteCreated }: { onNoteCreated: (noteId: string) => void }) => {
  const { authUser } = useAuth();
  const [client, setClient] = useState<RTVIClient | undefined>();
  const [currentState, setCurrentState] = useState<TransportState>('disconnected');
  const [inCall, setInCall] = useState<boolean>(false);
  const [botReady, setBotReady] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  const createClient = useCallback(async ({ lectureId, noteId, noteTimestamp }: { lectureId: string, noteId?: string, noteTimestamp: number }) => {
    const client = new RTVIClient({
      transport: new WebRTCTransport({}),
      params: {
        baseUrl: process.env.EXPO_PUBLIC_WEBRTC_ENDPOINT,
        endpoints: { connect: '/connect' },
        requestData: {
          lecture_id: lectureId,
          user_id: authUser?.id,
          workspace_id: await AsyncStorage.getItem('workspaceId'),
          note_timestamp: noteTimestamp,
          note_id: noteId

        }
      },
      enableMic: true,
      customConnectHandler: () => Promise.resolve(),
      callbacks: {
        onTrackStarted: (track: MediaStreamTrack) => {
          console.log('onTrackStarted 123', track);
        },
        onTrackStopped: (track: MediaStreamTrack) => {
          console.log('onTrackStopped', track);
        },

      }
    });
    client.setLogLevel(LogLevel.WARN);

    return client;
  }, []);


  const connect = async ({ lectureId, noteId, noteTimestamp }: { lectureId: string, noteId?: string, noteTimestamp: number }) => {    
    try {
      setConnecting(true);
      const client = await createClient({ lectureId, noteId, noteTimestamp });
      setClient(client);
      await client.connect();
    } catch (e) {
      setConnecting(false);
      console.log('Failed to start the bot', e);
    }
  }

  const disconnect = async () => {
    try {
      if (client) {
        await client.sendMessage(
          new RTVIMessage('client_before_disconnect',
            {
              "message": 'disconnect'
            })
        );
        await client.disconnectBot();
        await client.disconnect();
        setClient(undefined);
      }
    } catch (e) {    
      console.log('Failed to disconnect', e);
    }
  }

  useEffect(() => {
    if (client) {
      client.on('transportStateChanged', (state: TransportState) => {
        setInCall(inCallStates.has(state))
        console.log('[VA]: transportStateChanged', state);
      });
      client.on('connected', () => {
        // setBotReady(true);
        setConnecting(false);
        console.log('[VA]: connected');
      });
      client.on('disconnected', () => {
        setBotReady(false);
        console.log('[VA]: disconnected');
      });
      client.on('botConnected', () => {
        console.log('[VA]: botConnected');
      });
      client.on('botDisconnected', () => {
        console.log('[VA]: botDisconnected');
      });
      client.on('botReady', () => {
       setBotReady(true);
       
        console.log('[VA]: botReady');
      });
      client.on('userStartedSpeaking', () => {
        console.log('[VA]: userStartedSpeaking');
      });
      client.on('userStoppedSpeaking', () => {
        console.log('[VA]: userStoppedSpeaking');
      });
      client.on('botStartedSpeaking', () => {
        console.log('[VA]: botStartedSpeaking');
      });
      client.on('botStoppedSpeaking', () => {
        console.log('[VA]: botStoppedSpeaking');
      });
      client.on('userTranscript', (transcript: TranscriptData) => {
        console.log('[VA]: userTranscript', transcript);
      });
      // client.on('botTranscript', (transcript: BotLLMTextData) => {
      //   console.log('[VA]: botTranscript', transcript);
      // });
      // client.on('botTtsText', (transcript: BotTTSTextData) => {
      //   console.log('[VA]: botTtsText', transcript);
      // });
      client.on('serverMessage', (message: any) => {
        const { payload } = message;
        if (message.type === 'tts-text') {
          console.log('[VA]: botTtsText', payload.role, payload.content);
        }

        if (message.type === 'note-created') {
          onNoteCreated(payload.noteId);
        }
      });
    }

    return () => {
      if (client) {
        client.removeAllListeners();
      }
    }
  }, [client]);

  const sendMessage = async (message: string) => {
    if (client) {
      try {
        await client.sendMessage(
          new RTVIMessage('client_text',
            {
              "message": message
            })
        );
      } catch (e) {
        console.log('[VA]: sendMessage', e);
      }
    }
  }


  return {
    connect,
    disconnect,
    currentState,
    inCall,
    sendMessage,
    botReady,
    connecting
  }
}