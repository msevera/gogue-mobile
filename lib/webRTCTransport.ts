import Daily, {
  DailyCall,
  DailyEventObjectAvailableDevicesUpdated,
  DailyEventObjectLocalAudioLevel,
  DailyEventObjectTrack,
  RTCPeerConnection
} from "@daily-co/react-native-daily-js";

import {
  logger,
  RTVIClientOptions,
  RTVIError,
  RTVIMessage,
  Tracks,
  Transport,
  TransportState,
} from "@pipecat-ai/client-js";

const RENEGOTIATE_TYPE = "renegotiate";
class RenegotiateMessage {
  type = RENEGOTIATE_TYPE;
}

const PEER_LEFT_TYPE = "peerLeft";
class PeerLeftMessageMessage {
  type = PEER_LEFT_TYPE;
}

type OutboundSignallingMessage = TrackStatusMessage;

type InboundSignallingMessage = RenegotiateMessage | PeerLeftMessageMessage;

// Interface for the structure of the signalling message
const SIGNALLING_TYPE = "signalling";
class SignallingMessageObject {
  type: typeof SIGNALLING_TYPE = SIGNALLING_TYPE;
  message: InboundSignallingMessage | OutboundSignallingMessage;
  constructor(message: InboundSignallingMessage | OutboundSignallingMessage) {
    this.message = message;
  }
}

const AUDIO_TRANSCEIVER_INDEX = 0;

class TrackStatusMessage {
  type = "trackStatus";
  receiver_index: number;
  enabled: boolean;
  constructor(receiver_index: number, enabled: boolean) {
    this.receiver_index = receiver_index;
    this.enabled = enabled;
  }
}

export class WebRTCTransport extends Transport {
  public static SERVICE_NAME = "small-webrtc-transport";
  private _daily: DailyCall | undefined;

  // Trigger when the peer connection is finally ready or in case it has failed all the attempts to connect
  private _connectResolved: ((value: PromiseLike<void> | void) => void) | null = null;
  private _connectFailed: ((reason?: any) => void) | null = null;

  private pc: RTCPeerConnection | null = null;
  private dc: any | null = null;
  private audioCodec: string | null | "default" = null;
  private pc_id: string | null = null;

  private reconnectionAttempts = 0;
  private maxReconnectionAttempts = 3;
  private isReconnecting = false;
  private keepAliveInterval: number | null = null;
  private _iceServers: RTCIceServer[] = [];
  private readonly _waitForICEGathering: boolean;
  private _selectedMic: MediaDeviceInfo | Record<string, never> = {};
  private _selectedSpeaker: MediaDeviceInfo | Record<string, never> = {};


  constructor({
    iceServers = [],
    waitForICEGathering = false,
  }) {
    super();
    this._iceServers = iceServers;
    this._waitForICEGathering = waitForICEGathering;
  }

  public initialize(
    options: RTVIClientOptions,
    messageHandler: (ev: RTVIMessage) => void
  ) {
    console.log('initialize');
    this._options = options;
    this._callbacks = options.callbacks ?? {};
    this._onMessage = messageHandler;
    const existingInstance = Daily.getCallInstance();
    if (existingInstance) {
      void existingInstance.destroy();
    }

    this._daily = Daily.createCallObject({
      startVideoOff: !(options.enableCam == true),
      startAudioOff: options.enableMic == false,
      allowMultipleCallInstances: true,
      dailyConfig: {},
    });

    this.attachEventListeners();
    this.state = 'disconnected';

    console.debug('[RTVI Transport] Initialized');
  }

  private attachEventListeners() {
    this._daily!.on(
      'available-devices-updated',
      this.handleAvailableDevicesUpdated.bind(this)
    );

    this._daily!.on(
      // TODO, we need to add DailyEventObjectSelectedDevicesUpdated to types overrides inside react-ntive-daily-js
      // @ts-ignore
      'selected-devices-updated',
      this.handleSelectedDevicesUpdated.bind(this)
    );

    this._daily!.on('track-started', this.handleTrackStarted.bind(this));
    this._daily!.on('track-stopped', this.handleTrackStopped.bind(this));
    this._daily!.on('local-audio-level', this.handleLocalAudioLevel.bind(this));
    this._daily!.on('app-message', this.handleAppMessage.bind(this));
  }

  private handleAvailableDevicesUpdated(
    ev: DailyEventObjectAvailableDevicesUpdated
  ) {
    this._callbacks.onAvailableMicsUpdated?.(
      ev.availableDevices.filter((d) => d.kind === 'audio')
    );
  }

  // TODO, we need to add DailyEventObjectSelectedDevicesUpdated to types overrides inside react-ntive-daily-js
  private handleSelectedDevicesUpdated(
    // @ts-ignore
    ev: DailyEventObjectSelectedDevicesUpdated
  ) {
    if (this._selectedMic?.deviceId !== ev.devices.mic) {
      this._selectedMic = ev.devices.mic;
      this._callbacks.onMicUpdated?.(ev.devices.mic as MediaDeviceInfo);
    }
    if (this._selectedSpeaker?.deviceId !== ev.devices.speaker) {
      this._selectedSpeaker = ev.devices.speaker;
      this._callbacks.onSpeakerUpdated?.(ev.devices.speaker as MediaDeviceInfo);
    }
  }

  private handleTrackStarted(ev: DailyEventObjectTrack) {
    this._callbacks.onTrackStarted?.(ev.track);
  }

  private handleTrackStopped(ev: DailyEventObjectTrack) {
    this._callbacks.onTrackStopped?.(ev.track);
  }

  private handleLocalAudioLevel(ev: DailyEventObjectLocalAudioLevel) {
    this._callbacks.onLocalAudioLevel?.(ev.audioLevel);
  }

  private handleAppMessage(ev: any) {
    // Bubble any messages with rtvi-ai label
    if (ev.data.label === 'rtvi-ai') {
      this._onMessage({
        id: ev.data.id,
        type: ev.data.type,
        data: ev.data.data,
      } as RTVIMessage);
    }
  }

  async initDevices() {
    if (!this._daily) {
      throw new RTVIError('Transport instance not initialized');
    }

    this.state = 'initializing';
    await this._daily.startCamera();
    const { devices } = await this._daily.enumerateDevices();
    const mics = devices.filter((d) => d.kind === 'audio');

    this._callbacks.onAvailableMicsUpdated?.(mics);
    let inputDevices = await this._daily.getInputDevices();
    this._selectedMic = inputDevices.mic;
    this._callbacks.onMicUpdated?.(this._selectedMic as MediaDeviceInfo);

    // Instantiate audio observers
    if (!this._daily.isLocalAudioLevelObserverRunning())
      await this._daily.startLocalAudioLevelObserver(100);
    if (!this._daily.isRemoteParticipantsAudioLevelObserverRunning())
      await this._daily.startRemoteParticipantsAudioLevelObserver(100);

    this.state = 'initialized';
  }

  setAudioCodec(audioCodec: string | null): void {
    this.audioCodec = audioCodec;
  }

  async connect(
    authBundle: unknown,
    abortController: AbortController,
  ): Promise<void> {
    if (!this._daily) {
      throw new RTVIError('Transport instance not initialized');
    }

    if (abortController.signal.aborted) return;
    this.state = "connecting";
    await this.startNewPeerConnection();

    if (abortController.signal.aborted) return;

    // Wait until we are actually connected and the data channel is ready
    await new Promise<void>((resolve, reject) => {
      this._connectResolved = resolve;
      this._connectFailed = reject;
    });

    this.state = 'connected';
    this._callbacks.onConnected?.();
  }

  private syncTrackStatus() {
    // Sending the current status from the tracks to Pipecat
    this.sendSignallingMessage(
      new TrackStatusMessage(
        AUDIO_TRANSCEIVER_INDEX,
        this.isMicEnabled,
      ),
    );
  }

  sendReadyMessage() {
    this.state = "ready";    
    this.sendMessage(RTVIMessage.clientReady());
  }

  sendMessage(message: RTVIMessage) {
    if (!this.dc || this.dc.readyState !== "open") {
      console.log('message not sent', this.dc.readyState);
      logger.warn(`Datachannel is not ready. Message not sent: ${message}`);
      return;
    }
    this.dc?.send(JSON.stringify(message));
    console.log('message sent', JSON.stringify(message));
  }

  private sendSignallingMessage(message: OutboundSignallingMessage) {
    if (!this.dc || this.dc.readyState !== "open") {
      logger.warn(`Datachannel is not ready. Signalling message not sent: ${message}`);
      return;
    }
    const signallingMessage = new SignallingMessageObject(message);
    this.dc?.send(JSON.stringify(signallingMessage));
  }

  async disconnect(): Promise<void> {
    this.state = "disconnecting";
    await this.stop();
    this.state = "disconnected";
  }

  private createPeerConnection(): RTCPeerConnection {
    const config: RTCConfiguration = {
      iceServers: this._iceServers,
    };

    let pc = new RTCPeerConnection(config);

    pc.addEventListener("icegatheringstatechange", () => {
      logger.debug(`iceGatheringState: ${this.pc!.iceGatheringState}`);
    });
    logger.debug(`iceGatheringState: ${pc.iceGatheringState}`);

    pc.addEventListener("iceconnectionstatechange", () =>
      this.handleICEConnectionStateChange(),
    );

    logger.debug(`iceConnectionState: ${pc.iceConnectionState}`);

    pc.addEventListener("signalingstatechange", () => {
      logger.debug(`signalingState: ${this.pc!.signalingState}`);
      if (this.pc!.signalingState == "stable") {
        this.handleReconnectionCompleted();
      }
    });
    logger.debug(`signalingState: ${pc.signalingState}`);

    pc.addEventListener("track", (evt: any) => {
      logger.debug(`Received new track ${evt.track.kind}`);
      this._callbacks.onTrackStarted?.(evt.track);
    });

    return pc;
  }

  private handleICEConnectionStateChange(): void {
    if (!this.pc) return;
    logger.debug(`ICE Connection State: ${this.pc.iceConnectionState}`);

    if (this.pc.iceConnectionState === "failed") {
      logger.debug("ICE connection failed, attempting restart.");
      void this.attemptReconnection(true);
    } else if (this.pc.iceConnectionState === "disconnected") {
      // Waiting before trying to reconnect to see if it handles it automatically
      setTimeout(() => {
        if (this.pc?.iceConnectionState === "disconnected") {
          logger.debug("Still disconnected, attempting reconnection.");
          void this.attemptReconnection(true);
        }
      }, 5000);
    }
  }

  private handleReconnectionCompleted() {
    this.reconnectionAttempts = 0;
    this.isReconnecting = false;
  }

  private async attemptReconnection(
    recreatePeerConnection: boolean = false,
  ): Promise<void> {
    if (this.isReconnecting) {
      logger.debug("Reconnection already in progress, skipping.");
      return;
    }
    if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
      logger.debug("Max reconnection attempts reached. Stopping transport.");
      await this.stop();
      return;
    }
    this.isReconnecting = true;
    this.reconnectionAttempts++;
    logger.debug(`Reconnection attempt ${this.reconnectionAttempts}...`);
    // aiortc does not seem to work when just trying to restart the ice
    // so for this case we create a new peer connection on both sides
    if (recreatePeerConnection) {
      const oldPC = this.pc;
      await this.startNewPeerConnection(recreatePeerConnection);
      if (oldPC) {
        logger.debug("closing old peer connection");
        this.closePeerConnection(oldPC);
      }
    } else {
      await this.negotiate();
    }
  }

  private async negotiate(
    recreatePeerConnection: boolean = false,
  ): Promise<void> {
    console.log('negotiate');
    if (!this.pc) {
      return Promise.reject("Peer connection is not initialized");
    }

    try {
      // Create offer
      const offer = await this.pc.createOffer({});
      await this.pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      if (this._waitForICEGathering) {
        await new Promise<void>((resolve) => {
          if (this.pc!.iceGatheringState === "complete") {
            resolve();
          } else {
            const checkState = () => {
              if (this.pc!.iceGatheringState === "complete") {
                this.pc!.removeEventListener(
                  "icegatheringstatechange",
                  checkState,
                );
                resolve();
              }
            };
            this.pc!.addEventListener("icegatheringstatechange", checkState);
          }
        });
      }

      let offerSdp = this.pc!.localDescription!;
      logger.debug(`Will create offer for peerId: ${this.pc_id}`);

      const url = `${this._options.params.baseUrl}${this._options.params.endpoints?.connect || ""}`;     
      // Send offer to server
      const response = await fetch(url, {
        body: JSON.stringify({
          sdp: offerSdp.sdp,
          type: offerSdp.type,
          pc_id: this.pc_id,
          restart_pc: recreatePeerConnection,
          ...this._options.params.requestData
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const answer: RTCSessionDescriptionInit = await response.json();
      // @ts-ignore
      this.pc_id = answer.pc_id;
      // @ts-ignore
      logger.debug(`Received answer for peer connection id ${answer.pc_id}`);
      await this.pc!.setRemoteDescription(answer);
      logger.debug(
        `Remote candidate supports trickle ice: ${this.pc.canTrickleIceCandidates}`,
      );
    } catch (e) {
      logger.debug(
        `Reconnection attempt ${this.reconnectionAttempts} failed: ${e}`,
      );
      this.isReconnecting = false;
      setTimeout(() => this.attemptReconnection(true), 2000);
    }
  }

  private addInitialTransceivers() {
    // Transceivers always appear in creation-order for both peers
    this.pc!.addTransceiver("audio", { direction: "sendrecv" });
  }

  private getAudioTransceiver() {
    // Transceivers always appear in creation-order for both peers
    // Look at addInitialTransceivers
    return this.pc!.getTransceivers()[AUDIO_TRANSCEIVER_INDEX];
  }

  private async startNewPeerConnection(
    recreatePeerConnection: boolean = false,
  ) {
    this.pc = this.createPeerConnection();
    this.addInitialTransceivers();
    this.dc = this.createDataChannel("chat", { ordered: true });
    await this.addUserMedia();
    await this.negotiate(recreatePeerConnection);
  }

  private async addUserMedia(): Promise<void> {
    logger.debug(`addUserMedia this.tracks(): ${this.tracks()}`);

    let audioTrack = this.tracks().local.audio;
    logger.debug(`addUserMedia audioTrack: ${audioTrack}`);
    if (audioTrack) {
      await this.getAudioTransceiver().sender.replaceTrack(audioTrack);
    }
  }

  // Method to handle a general message (this can be expanded for other types of messages)
  handleMessage(message: string): void {
    try {
      const messageObj = JSON.parse(message); // Type is `any` initially
      logger.debug("received message:", messageObj);

      // Check if it's a signalling message
      if (messageObj.type === SIGNALLING_TYPE) {
        void this.handleSignallingMessage(
          messageObj as SignallingMessageObject,
        ); // Delegate to handleSignallingMessage
      } else {
        // Bubble any messages with rtvi-ai label
        if (messageObj.label === "rtvi-ai") {
          this._onMessage({
            id: messageObj.id,
            type: messageObj.type,
            data: messageObj.data,
          } as RTVIMessage);
        }
      }
    } catch (error) {
      console.error("Failed to parse JSON message:", error);
    }
  }

  // Method to handle signalling messages specifically
  async handleSignallingMessage(
    messageObj: SignallingMessageObject,
  ): Promise<void> {
    // Cast the object to the correct type after verification
    const signallingMessage = messageObj as SignallingMessageObject;

    // Handle different signalling message types
    switch (signallingMessage.message.type) {
      case RENEGOTIATE_TYPE:
        void this.attemptReconnection(false);
        break;
      case PEER_LEFT_TYPE:
        void this.disconnect();
        break;
      default:
        console.warn("Unknown signalling message:", signallingMessage.message);
    }
  }

  private createDataChannel(
    label: string,
    options: RTCDataChannelInit,
  ) {
    const dc = this.pc!.createDataChannel(label, options);

    dc.addEventListener("close", () => {
      logger.debug("datachannel closed");
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = null;
      }
    });

    dc.addEventListener("open", () => {
      logger.debug("datachannel opened", this._connectResolved);
      if (this._connectResolved) {
        this.syncTrackStatus();
        this._connectResolved();
        this._connectResolved = null;
        this._connectFailed = null;
      }
      // @ts-ignore
      this.keepAliveInterval = setInterval(() => {
        const message = "ping: " + new Date().getTime();
        dc.send(message);
      }, 1000);
    });

    dc.addEventListener("message", (evt: any) => {
      let message = evt.data;
      this.handleMessage(message);
    });

    return dc;
  }

  private closePeerConnection(pc: RTCPeerConnection) {
    pc.getTransceivers().forEach((transceiver) => {
      if (transceiver.stop) {
        transceiver.stop();
      }
    });

    pc.getSenders().forEach((sender) => {
      sender.track?.stop();
    });

    pc.close();
  }

  private async stop(): Promise<void> {
    if (!this.pc) {
      logger.debug("Peer connection is already closed or null.");
      return;
    }

    if (this.dc) {
      this.dc.close();
    }

    this.closePeerConnection(this.pc);
    this.pc = null;

    this._daily!.stopLocalAudioLevelObserver();
    this._daily!.stopRemoteParticipantsAudioLevelObserver();

    await this._daily!.leave();
    await this._daily!.destroy();

    // For some reason after we close the peer connection, it is not triggering the listeners
    this.pc_id = null;
    this.reconnectionAttempts = 0;
    this.isReconnecting = false;
    this._callbacks.onDisconnected?.();

    if (this._connectFailed) {
      this._connectFailed();
    }
    this._connectFailed = null;
    this._connectResolved = null;
  }

  async getAllMics(): Promise<MediaDeviceInfo[]> {
    const { devices } = await this._daily!.enumerateDevices();
    return devices.filter((d) => d.kind === 'audio') as MediaDeviceInfo[];
  }

  getAllCams(): Promise<MediaDeviceInfo[]> {
    logger.error("getAllCams not implemented for SmallWebRTCTransport");
    return Promise.resolve([]);
  }

  async getAllSpeakers(): Promise<MediaDeviceInfo[]> {
    const { devices } = await this._daily!.enumerateDevices();
    return devices.filter((d) => d.kind === 'audio') as MediaDeviceInfo[];
  }

  async updateMic(micId: string): Promise<void> {
    this._daily!.setAudioDevice(micId).then(async () => {
      let inputDevices = await this._daily!.getInputDevices();
      this._selectedMic = inputDevices.mic as MediaDeviceInfo;
    });
  }
  updateCam(camId: string): void {
    logger.error("updateCam not implemented for SmallWebRTCTransport");
    throw new Error("Not implemented");
  }
  updateSpeaker(speakerId: string): void {
    this._daily?.setAudioDevice(speakerId).then(async () => {
      const devicesInUse = await this._daily!.getInputDevices();
      this._selectedSpeaker = devicesInUse?.speaker;
    });
  }

  get selectedMic(): MediaDeviceInfo | Record<string, never> {
    return this._selectedMic;
  }
  get selectedCam(): MediaDeviceInfo | Record<string, never> {
    logger.error("selectedCam not implemented for SmallWebRTCTransport");
    throw new Error("Not implemented");
  }
  get selectedSpeaker(): MediaDeviceInfo | Record<string, never> {
    return this._selectedSpeaker;
  }
  set iceServers(iceServers: RTCIceServer[]) {
    this._iceServers = iceServers;
  }

  get iceServers() {
    return this._iceServers;
  }

  enableMic(enable: boolean): void {
    this._daily!.setLocalAudio(enable);
    this.sendSignallingMessage(
      new TrackStatusMessage(AUDIO_TRANSCEIVER_INDEX, enable),
    );
  }

  enableCam(enable: boolean): void {
    logger.error("enableCam not implemented for SmallWebRTCTransport");
    throw new Error("Not implemented");
  }

  get isCamEnabled(): boolean {
    logger.error("startScreenShare not implemented for SmallWebRTCTransport");
    return false;
  }

  get isMicEnabled(): boolean {
    return this._daily!.localAudio();
  }

  get state(): TransportState {
    return this._state;
  }

  set state(state: TransportState) {
    if (this._state === state) return;

    this._state = state;
    this._callbacks.onTransportStateChanged?.(state);
  }

  get expiry(): number | undefined {
    return this._expiry;
  }

  tracks(): Tracks {
    const participants = this._daily?.participants();

    const tracks: Tracks = {
      local: {
        audio: participants?.local?.tracks?.audio?.persistentTrack,
      },
    };

    return tracks;
  }

  enableScreenShare(enable: boolean): void {
    logger.error("startScreenShare not implemented for SmallWebRTCTransport");
    throw new Error("Not implemented");
  }

  public get isSharingScreen(): boolean {
    logger.error("isSharingScreen not implemented for SmallWebRTCTransport");
    return false;
  }
}

