import { BotLLMTextData, BotTTSTextData, LogLevel, RTVIClient, RTVIMessage, TranscriptData, TransportState } from '@pipecat-ai/client-js';
// import { RNDailyTransport } from '@pipecat-ai/react-native-daily-transport';
import { WebRTCTransport } from '@/lib/webRTCTransport'
import { useCallback, useEffect, useState } from 'react';

const inCallStates = new Set(["authenticating", "connecting", "connected", "ready"])

export const useVoiceAgent = ({ lectureId }: { lectureId: string }) => {
  const [client, setClient] = useState<RTVIClient | undefined>();
  const [currentState, setCurrentState] = useState<TransportState>('disconnected');
  const [inCall, setInCall] = useState<boolean>(false);
  const [botReady, setBotReady] = useState<boolean>(false);

  const createClient = useCallback(() => {
    const client = new RTVIClient({
      transport: new WebRTCTransport({}),
      params: {
        baseUrl: process.env.EXPO_PUBLIC_WEBRTC_ENDPOINT,
        endpoints: { connect: '/connect' },
        requestData: {
          lecture_id: lectureId
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
    client.setLogLevel(LogLevel.DEBUG);

    return client;
  }, []);


  const connect = async () => {
    try {
      const client = createClient();
      setClient(client);
      await client.connect();
    } catch (e) {
      console.log('Failed to start the bot', e);
    }
  }

  const disconnect = async () => {
    try {
      if (client) {
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
      client.on('botTranscript', (transcript: BotLLMTextData) => {
        console.log('[VA]: botTranscript', transcript);
      });
      client.on('botTtsText', (transcript: BotTTSTextData) => {
        console.log('[VA]: botTtsText', transcript);
      });
      client.on('serverMessage', (message: any) => {
        console.log('[VA]: serverMessage', message);
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
    botReady
  }
}