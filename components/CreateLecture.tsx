// import { TextInput, View } from 'react-native'
// import { Text } from '@/components/ui/Text';
// import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
// import { useMemo, useEffect, useRef, useState } from 'react';
// import { Button } from './ui/Button';
// import { Input } from './ui/Input';
// import { Keyboard } from 'react-native';
// import { limitCharsTo, required } from '@/lib/validationRules';
// import { useIntl } from 'react-intl';
// import useValidation from '@/hooks/useValidation';
// import { useRecording } from '@/hooks/useRecording';
// import { useCreateLecture } from '@/hooks/useCreateLecture';

// export const CreateLecture = ({ visible, initialDescription, onClose, onCreate }: { visible: boolean, initialDescription: string, onClose: () => void, onCreate?: () => void }) => {
//   const { isRecording, recognizedText, startRecording, stopRecording } = useRecording();
//   const { createLectureAsyncMut } = useCreateLecture();

//   const intl = useIntl();
//   const { register, validate, submit: formSubmit, remove } = useValidation();
//   const [description, setDescription] = useState('');
//   const inputRef = useRef<TextInput>(null);
//   const drawerSettings = useMemo(() => ({
//     snapPoints: visible ? ['100%'] : [0],
//     backdrop: visible,
//     index: 0,
//     gesturesEnabled: false,
//     closeByGestureEnabled: false
//   }), [visible]);

//   useEffect(() => {
//     if (!visible) {
//       Keyboard.dismiss();
//     }

//     if (visible) {
//       inputRef.current?.focus();
//     }
//   }, [visible]);

//   useEffect(() => {
//     if (typeof initialDescription === 'string') {
//       setDescription(initialDescription);
//       inputRef?.current?.setNativeProps({ text: initialDescription })
//     }
//   }, [initialDescription]);

//   useEffect(() => {
//     inputRef?.current?.setNativeProps({ text: recognizedText })
//   }, [recognizedText]);

//   const handleCreateLecture = async ({ isValid }: { isValid: boolean }) => {
//     if (!isValid) return;
    
//     createLectureAsyncMut(description);
//     setDescription('');
//     inputRef?.current?.setNativeProps({ text: '' })
//     onClose();
//     onCreate?.();
//   }

//   return (
//     <GlobalDrawer title='Create lecture' headerBorder drawerSettings={drawerSettings} onBackdropPress={onClose}>
//       <View className='flex-1 p-4'>
//         <View className='flex-1'>
//           <Text className='text-lg mb-2'>What would you like to learn?</Text>
//           <Input
//             ref={inputRef}
//             allowRecording
//             recordingActive={isRecording}            
//             multiline
//             staticHeight
//             placeholder='Describe your goal and topic'
//             inputClassName="h-[200]"
//             containerClassName='mb-8'
//             onChangeText={(text) => {
//               remove('description');
//               setDescription(text);
//             }}
//             onRecordingPress={() => {
//               if (isRecording) {
//                 stopRecording();
//               } else {
//                 startRecording(description);
//               }
//             }}
//             onBlur={() => {
//               validate('firstName')
//             }}
//             {...register('description', description, [required(intl, 'Please enter your goal and topic'), limitCharsTo(500, intl, 'Must be less than 500 characters')])}
//           />         
//         </View>
//         <Button
//           className='mb-4'
//           text='Create'
//           onPress={(e) => {
//             formSubmit(e, handleCreateLecture);            
//           }} />
//       </View>
//     </GlobalDrawer>
//   )
// }