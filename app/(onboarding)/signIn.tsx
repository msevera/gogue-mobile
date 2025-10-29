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

export default function SignInScreen() {
  const { authUser, signInWithEmailAndPassword, sendPasswordResetEmail } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(email, password);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.log('Sign in error', error);
      
      let errorMessage = 'An error occurred during sign in';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Reset Password',
      `Send password reset email to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await sendPasswordResetEmail(email);
              Alert.alert('Success', 'Password reset email sent!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to send reset email');
            }
          }
        }
      ]
    );
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
              Welcome back
            </Text>
            <Text className="text-lg text-center text-gray-600 mb-8">
              Sign in to continue your learning journey
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

            <Button
              loading={loading}
              text="Sign In"
              onPress={handleSignIn}
              className="w-full mb-4"
            />

            <Button
              ghost
              text="Forgot Password?"
              onPress={handleForgotPassword}
              className="w-full"
              textClassName="text-blue-500"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
