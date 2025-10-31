// import {
//   useState,  
// } from 'react';
// import {
//   ExpoSpeechRecognitionModule,
//   useSpeechRecognitionEvent,
// } from "expo-speech-recognition";

// export function useRecording() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [initialText, setInitialText] = useState('');

//   useSpeechRecognitionEvent("result", (event) => {
//     setRecognizedText(initialText ? initialText + ' ' + event.results[0]?.transcript : event.results[0]?.transcript);
//   });
//   useSpeechRecognitionEvent("error", (event) => {
//     console.log("error code:", event.error, "error message:", event.message);
//   });

//   const startRecording = async (initialText: string) => {
//     setIsRecording(true);
//     setInitialText(initialText);
//     const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
//     if (!result.granted) {
//       console.warn("Permissions not granted", result);
//       return;
//     }

//     ExpoSpeechRecognitionModule.start({
//       // lang: "uk-UA",
//       lang: "en-US",
//       interimResults: true,
//       maxAlternatives: 1,
//       continuous: true,
//       requiresOnDeviceRecognition: false,
//       addsPunctuation: true
//     });
//   };

//   const stopRecording = async () => {
//     ExpoSpeechRecognitionModule.stop()
//     setIsRecording(false);
//   };

//   return {
//     isRecording, setIsRecording, recognizedText, setRecognizedText, startRecording, stopRecording
//   }
// }