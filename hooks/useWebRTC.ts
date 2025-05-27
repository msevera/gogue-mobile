import axios from 'axios';
import { useRef, useState } from 'react';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

const offerEndpoint = `${process.env.EXPO_PUBLIC_WEBRTC_ENDPOINT}/webrtc/offer`;

export const useWebRTC = () => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localMediaStream = useRef<MediaStream | null>(null);
  const remoteMediaStream = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);


  const muteMic = () => {
    localMediaStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = false;
      setIsMuted(true);
    })
  }

  const unmuteMic = () => {
    localMediaStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = true;
      setIsMuted(false);
    })
  }

  const stop = () => {
    peerConnection.current?.close();
    localMediaStream.current?.getAudioTracks().forEach((track) => {
      track.stop();
    });
    remoteMediaStream.current?.getAudioTracks().forEach((track) => {
      track.stop();
    });
  }

  const setupWebRTC = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    });

    localMediaStream.current = await mediaDevices.getUserMedia({
      audio: true,
    });

    localMediaStream.current.getAudioTracks().forEach((track) => {
      try {
        peerConnection.current!.addTrack(track, localMediaStream.current!);
      } catch (error) {
        console.log('error', error);
      }

      muteMic();
    })



    peerConnection.current.addEventListener('connectionstatechange', event => {
      switch (peerConnection.current!.connectionState) {
        case 'connected':
          setConnected(true);
          setIsConnecting(false);
          break;
        case 'connecting':
          setIsConnecting(true);
          break;
        case 'disconnected':
          setConnected(false);
          setIsConnecting(false);
          break;
        case 'failed':
          setConnected(false);
          setIsConnecting(false);
          break;
        case 'closed':
          setConnected(false);
          setIsConnecting(false);
          break;
      };
    });

    let webrtc_id = Math.random().toString(36).substring(7)
    peerConnection.current.addEventListener('icecandidate', event => {
      // When you find a null candidate then there are no more candidates.
      // Gathering of candidates has finished.
      if (!event.candidate) { return; };

      // Send the event.candidate onto the person you're calling.
      // Keeping to Trickle ICE Standards, you should send the candidates immediately.
      // axios.post(offerEndpoint, {
      //   candidate: event.candidate.toJSON(),
      //   webrtc_id: webrtc_id,
      //   type: "ice-candidate",
      // })
    });

    peerConnection.current.addEventListener('track', event => {
      // Grab the remote track from the connected participant.
      remoteMediaStream.current = remoteMediaStream.current || new MediaStream();
      remoteMediaStream.current.addTrack(event.track!);
    });


    const dataChannel = peerConnection.current?.createDataChannel('text');
    dataChannel?.addEventListener('message', (event) => {
      const eventJson = JSON.parse(event.data as string);
      console.log('Message received:', eventJson);
      // if (eventJson.data === 'started_talking') {
      //   muteOutput();
      // }

      // if (eventJson.data === 'pause_detected') {
      //   unmuteOutput();
      // }

      // if (eventJson.data === 'response_starting') {
      //   unmuteOutput();
      // }

      if (eventJson.type === "error") {
        // showError(eventJson.message);
      }
    });

    const offer = await peerConnection.current.createOffer({});
    await peerConnection.current.setLocalDescription(offer);

    const response = await axios.post(offerEndpoint, {
      sdp: peerConnection.current.localDescription!.sdp,
      type: peerConnection.current.localDescription!.type,
      webrtc_id: webrtc_id
    });

    const serverResponse = await response.data;

    if (serverResponse.status === 'failed') {
      console.log('Failed to send offer');
      return;
    }

    await peerConnection.current.setRemoteDescription(serverResponse);
  }

  return {
    muteMic,
    unmuteMic,
    isMuted,
    setupWebRTC,
    stop,
    connected,
    isConnecting,
  }

};
