import { Platform, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { AuthContext } from '@/contexts/authContext';

export default function EmailInputScreen() {
  const { signInWithGoogle, authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log('HandleGoogleSignin error', error);
      setLoading(false);
    } finally {
      
    }
  }

  useEffect(() => {
    if (!!authUser && (!authUser?.firstName || !authUser?.lastName)) {
      router.push(`/setProfile`);
    } else if (!!authUser && !!authUser?.firstName && !!authUser?.lastName) {
      router.push(`/(app)`);
    }
  }, [authUser?.firstName, authUser?.lastName]);

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 justify-center items-center px-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          className="flex-1 w-full justify-center items-center"
        >
          <View className="flex-1 w-full justify-center items-center">
            <Text className="text-4xl mb-2 text-center font-semibold text-gray-800">Welcome to <Text className="text-4xl text-blue-500 font-semibold">Learnbud</Text></Text>
            <Text className="text-2xl text-center text-blue-500">Personalized AI lecturer</Text>
          </View>
          <View className="w-full items-center">           
            <Button              
              loading={loading}                            
              text="Sign in with Google"
              onPress={handleGoogleSignin}
              className="w-full"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}