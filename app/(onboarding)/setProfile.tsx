import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import useValidation from '@/hooks/useValidation';
import { limitCharsTo, required } from '@/lib/validationRules';
import { useIntl } from 'react-intl';
import { useAuth } from '@/hooks/useAuth';

export default function SetProfileScreen() {
  const intl = useIntl();
  const { setProfile, authUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { register, validate, submit: formSubmit, remove } = useValidation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser?.firstName && authUser?.lastName) {
      router.push('/(app)');
    }
  }, [authUser?.firstName, authUser?.lastName]);

  const handleSetProfile = async ({ isValid }: { isValid: boolean }) => {
    if (!isValid) {
      return;
    }

    setLoading(true);
    await setProfile({
      firstName,
      lastName,
    });
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4">
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        className="flex-1 w-full justify-center items-center px-4"
      >
        <View className="mb-4 flex-col items-center justify-center w-full flex-1">
          <Text className="text-3xl mb-4">Your Name</Text>
          <Text className="text-lg mb-8 w-52 text-center">Enter your name</Text>
          <Input
            wrapperClassName="mb-4"
            placeholder="First name"
            onChangeText={(text) => {
              remove('firstName');
              setFirstName(text);
            }}
            onBlur={() => {
              validate('firstName')
            }}
            {...register('firstName', firstName, [required(intl, 'Required'), limitCharsTo(20, intl, 'Must be less than 20 characters')])}
          />
          <Input
            placeholder="Last name"
            onChangeText={(text) => {
              remove('lastName');
              setLastName(text);
            }}
            onBlur={() => {
              validate('lastName')
            }}
            {...register('lastName', lastName, [required(intl, 'Required'), limitCharsTo(20, intl, 'Must be less than 20 characters')])}
          />
        </View>
        <Button
          loading={loading}
          onPress={(e) => {
            formSubmit(e, handleSetProfile);
          }}
          className="w-full py-4 mb-4 mt-4"
          text="Continue"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 