import { Keyboard, Platform, TextInput, View } from "react-native";
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useIntl } from 'react-intl';
import { useCreateLecture } from '@/hooks/useCreateLecture';
import { useRecording } from '@/hooks/useRecording';
import useValidation from '@/hooks/useValidation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { limitCharsTo, required } from '@/lib/validationRules';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Header } from '@/components/layouts/Header';
import { useCreate } from '@/hooks/useCreate';

export default function Screen() {
  const { isRecording, recognizedText, startRecording, stopRecording } = useRecording();
  const { input, setInput } = useCreate();
  const inset = useSafeAreaInsets();

  const intl = useIntl();
  const { register, validate, submit: formSubmit, remove } = useValidation();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const handleCreateLecture = async ({ isValid }: { isValid: boolean }) => {
    if (!isValid) return;

    router.push(`/create/source`);
  }

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return <ScreenLayout
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_bottom',
      gestureDirection: 'vertical',
      animationDuration: 300,
    }}
    contentLoading={false}
    contentEmpty={false}
    contentEmptyText='Create your first lecture'
    bottomPadding={false}
  >
    <Header
      backClassName='left-[5]'
      title='New lecture'
      right={
        <Button
          sm
          ghost
          icon={{ component: 'Ionicons', name: 'close' }}
          className="bg-gray-50"
          onPress={handleClose} />
      }
      hideBorder
      titleLeft
    />
    <View className='flex-1 px-4'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={92}
        className="flex-1 w-full justify-center items-center"
      >
        <View className='flex-1'>
          <Input
            ref={inputRef}
            // allowRecording
            value={input}
            // recordingActive={isRecording}
            multiline
            staticHeight
            placeholder='Describe your goal, topic or problem'
            inputClassName="h-full p-0 pt-4 text-xl"
            containerClassName='mb-8'
            componentClassName='border-1'
            onChangeText={(text) => {
              remove('description');
              setInput(text);
            }}
            // onRecordingPress={() => {
            //   if (isRecording) {
            //     stopRecording();
            //   } else {
            //     startRecording(description);
            //   }
            // }}
            onBlur={() => {
              validate('description')
            }}
            {...register('description', input, [required(intl, 'Please enter your goal and topic'), limitCharsTo(500, intl, 'Must be less than 500 characters')])}
          />
        </View>
        <Button
          className='w-full'
          style={{ marginBottom: inset.bottom }}
          text='Continue'
          disabled={!input}
          onPress={(e) => {
            formSubmit(e, handleCreateLecture);
          }} />
      </KeyboardAvoidingView>
    </View>
  </ScreenLayout >
}