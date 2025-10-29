import React, { useState, useEffect } from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useValidation from '@/hooks/useValidation';
import { limitCharsTo, required } from '@/lib/validationRules';
import { useIntl } from 'react-intl';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function SetProfileScreen() {
  const intl = useIntl();
  const { setProfile, authUser, signOut } = useAuth();
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
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 justify-center items-center px-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={16}
          className="flex-1 w-full justify-center items-center"
        >                    
          <View className="flex-1 w-full justify-center items-center">
            <Text className="text-4xl mb-2 text-center font-semibold text-gray-800">
              Complete your profile
            </Text>
            <Text className="text-lg text-center text-gray-600 mb-8">
              Tell us your name to get started
            </Text>
          </View>

          <View className="w-full items-center space-y-4">
            <View className="w-full">
              <Input
                placeholder="First name"
                value={firstName}
                onChangeText={(text) => {
                  remove('firstName');
                  setFirstName(text);
                }}
                onBlur={() => {
                  validate('firstName')
                }}
                {...register('firstName', firstName, [required(intl, 'Required'), limitCharsTo(20, intl, 'Must be less than 20 characters')])}
                containerClassName="mb-4"
              />
            </View>

            <View className="w-full">
              <Input
                placeholder="Last name"
                value={lastName}
                onChangeText={(text) => {
                  remove('lastName');
                  setLastName(text);
                }}
                onBlur={() => {
                  validate('lastName')
                }}
                {...register('lastName', lastName, [required(intl, 'Required'), limitCharsTo(20, intl, 'Must be less than 20 characters')])}
                containerClassName="mb-4"
              />
            </View>
            <Button
              loading={loading}
              onPress={(e) => {
                formSubmit(e, handleSetProfile);
              }}
              className="w-full"
              text="Continue"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
} 