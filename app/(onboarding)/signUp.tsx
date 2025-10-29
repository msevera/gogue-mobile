import { Platform, View, Alert, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { AuthContext } from '@/contexts/authContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const { authUser, createUserWithEmailAndPassword } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Navigate to appropriate screen based on auth state
  useEffect(() => {
    if (!!authUser && (!authUser?.firstName || !authUser?.lastName)) {
      router.push(`/setProfile`);
    } else if (!!authUser && !!authUser?.firstName && !!authUser?.lastName) {
      router.push(`/(app)`);
    }
  }, [authUser?.firstName, authUser?.lastName]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(email, password);
      
      // Alert.alert(
      //   'Account Created!',
      //   'Please check your email to verify your account before signing in.',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => router.push('/signIn')
      //     }
      //   ]
      // );
    } catch (error: any) {
      console.log('Sign up error', error);
      
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 justify-center items-center px-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={16}
          className="flex-1 w-full justify-center items-center"
        >
          {/* Back Button */}
          <View className="absolute top-4 left-0 z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full bg-white"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 w-full justify-center items-center">
            <Text className="text-4xl mb-2 text-center font-semibold text-gray-800">
              Create account
            </Text>
            <Text className="text-lg text-center text-gray-600 mb-8">
              Create a new account to get started
            </Text>
          </View>
          
          <View className="w-full items-center space-y-4">
            <View className="w-full">
              <Input
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                status={emailError ? 'error' : undefined}
                helperText={emailError}
                containerClassName="mb-4"
              />
            </View>
            
            <View className="w-full">
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                status={passwordError ? 'error' : undefined}
                helperText={passwordError}
                containerClassName="mb-4"
              />
            </View>

            <View className="w-full">
              <Input
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                status={confirmPasswordError ? 'error' : undefined}
                helperText={confirmPasswordError}
                containerClassName="mb-4"
              />
            </View>

            <Button
              loading={loading}
              text="Create Account"
              onPress={handleSignUp}
              className="w-full"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
