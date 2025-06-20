import { TextInput, View } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useEffect, useRef, useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Keyboard } from 'react-native';
import Slider from './Slider';
import { limitCharsTo, required } from '@/lib/validationRules';
import { useIntl } from 'react-intl';
import useValidation from '@/hooks/useValidation';
import { useRecording } from '@/hooks/useRecording';
import { useCreateLecture } from '@/hooks/useCreateLecture';

export const CreateLecture = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const { isRecording, setIsRecording, recognizedText, setRecognizedText, startRecording, stopRecording } = useRecording();
  const { createLectureAsyncMut } = useCreateLecture();

  const intl = useIntl();
  const { register, validate, submit: formSubmit, remove } = useValidation();
  const [duration, setDuration] = useState(5);
  const [description, setDescription] = useState('');
  const inputRef = useRef<TextInput>(null);
  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: false,
    closeByGestureEnabled: false
  }), [visible]);

  useEffect(() => {
    if (!visible) {
      Keyboard.dismiss();
    }

    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    Keyboard.dismiss();
  }, [duration]);

  useEffect(() => {
    inputRef?.current?.setNativeProps({ text: recognizedText })
  }, [recognizedText]);

  const handleCreateLecture = async ({ isValid }: { isValid: boolean }) => {
    if (!isValid) return;
    
    createLectureAsyncMut(description, duration);
    setDescription('');
    inputRef?.current?.setNativeProps({ text: '' })
    setDuration(15);
    onClose();          
  }

  return (
    <GlobalDrawer title='Create lecture' headerBorder drawerSettings={drawerSettings} onBackdropPress={onClose}>
      <View className='flex-1 p-4'>
        <View className='flex-1'>
          <Text className='text-lg mb-2'>What would you like to learn?</Text>
          <Input
            ref={inputRef}
            allowRecording
            recordingActive={isRecording}            
            multiline
            staticHeight
            placeholder='Describe your goal and topic'
            inputClassName="h-[150]"
            containerClassName='mb-8'
            onChangeText={(text) => {
              remove('description');
              setDescription(text);
            }}
            onRecordingPress={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording(description);
              }
            }}
            onBlur={() => {
              validate('firstName')
            }}
            {...register('description', description, [required(intl, 'Please enter your goal and topic'), limitCharsTo(500, intl, 'Must be less than 500 characters')])}
          />
          <Text className='text-lg mb-2'>How much time do you have?</Text>
          <Slider value={duration} values={[5, 10, 15]} labelTemplate='{value} min' onChange={(value) => setDuration(value)} />
        </View>
        <Button
          className='mb-4'
          text='Create'
          onPress={(e) => {
            formSubmit(e, handleCreateLecture);            
          }} />
      </View>
    </GlobalDrawer>
  )
}