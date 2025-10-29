import { View, Alert, TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/Button';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

export const RootSettings = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const {
    signOut,
    authUser,
    deleteAccount,
    signInWithGoogle,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setProfile
  } = useAuth();

  const inset = useSafeAreaInsets();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Validate confirm password for signup
    if (authMode === 'signup') {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError('Please confirm your password');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSigningIn(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(email, password);
        // Reset state after successful sign in
        resetRootSettingsState();
      } else {
        await createUserWithEmailAndPassword(email, password);
        // Don't reset here; will be reset after step 2 completion
      }
      // Don't close here; effect will handle name step or closing
    } catch (error: any) {
      console.error('Email auth error:', error);

      let errorMessage = 'An error occurred during authentication';

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
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
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

      Alert.alert('Authentication Failed', errorMessage);
    } finally {
      setIsSigningIn(false);
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

  const handleShowSignInForm = () => {
    setAuthMode('signin');
    setShowAuthForm(true);
  };

  const handleShowSignUpForm = () => {
    setAuthMode('signup');
    setShowAuthForm(true);
  };

  const resetRootSettingsState = () => {
    setShowAuthForm(false);
    setAuthMode('signin');
    setSignupStep(1);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFirstName('');
    setLastName('');
    setFirstNameError('');
    setLastNameError('');
    setIsSigningIn(false);
    setIsDeleting(false);
  };

  const handleBackToAuthOptions = () => {
    resetRootSettingsState();
  };

  const handleSignupStep1Continue = async () => {
    // Validate email/password/confirm locally
    if (!validateForm()) return;

    setIsSigningIn(true);
    try {
      const methods = await auth().fetchSignInMethodsForEmail(email);
      if (methods && methods.length > 0) {
        setEmailError('An account with this email already exists');
        return;
      }
      // Create account on step 1
      await createUserWithEmailAndPassword(email, password);
      setSignupStep(2);
    } catch (error: any) {
      console.error('fetchSignInMethodsForEmail error', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateAccountFinal = async () => {
    // Validate first and last name
    let valid = true;
    setFirstNameError('');
    setLastNameError('');
    if (!firstName.trim()) { setFirstNameError('First name is required'); valid = false; }
    if (!lastName.trim()) { setLastNameError('Last name is required'); valid = false; }
    if (!valid) return;

    setIsSigningIn(true);
    try {
      // Account already created in step 1; only set profile here
      await setProfile({ firstName, lastName });
      // Reset state after successful signup completion
      resetRootSettingsState();
      onClose();
    } catch (error: any) {
      console.error('Create account final error', error);
      Alert.alert('Sign Up Failed', error.message || 'Failed to create account');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // Reset state after successful Google sign in
      resetRootSettingsState();
      // Don't close here; effect will handle name step or closing
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        error.message || 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  // If authenticated but missing profile names, force step 2 inline
  useEffect(() => {
    if (authUser && (!authUser.firstName || !authUser.lastName)) {
      setShowAuthForm(true);
      setAuthMode('signup');
      setSignupStep(2);
    }
  }, [authUser?.firstName, authUser?.lastName]);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, lectures, and notes.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              // The user will be automatically signed out and redirected
            } catch (error: any) {
              console.error('Delete account error:', error);
              Alert.alert(
                'Error',
                error.message || 'Failed to delete account. Please try again.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };


  const showSettings = authUser && authUser.firstName && authUser.lastName;

  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: showSettings ? true : signupStep !== 2,
    closeByGestureEnabled: showSettings ? true : signupStep !== 2
  }), [visible, signupStep, showSettings]);
  
  
  return (
    <GlobalDrawer
      name='rootSettingsDrawer'
      title={showSettings ? 'Settings' : (showAuthForm ? (authMode === 'signup' ? (signupStep === 2 ? '' : 'Create account') : 'Sign in') : '')}
      headerBorder={showSettings ? true : false}
      showCloseButton={showSettings ? true : signupStep !== 2}
      drawerSettings={drawerSettings}
      onBackdropPress={onClose}
      headerContainerClassName={`${showSettings ? 'bg-gray-100' : 'bg-white'}`}
      headerContentClassName='pb-0'
      headerLeft={
        showAuthForm && !(authMode === 'signup' && signupStep === 2) ? (
          <Button sm ghost icon={{ component: 'Ionicons', name: 'chevron-back' }} onPress={handleBackToAuthOptions} />
        ) : undefined
      }
    >
      <View className={`flex-1 ${showSettings ? 'bg-gray-100' : 'bg-white'}`}>
        {showSettings ? (
          // Authenticated user content
          <>
            {/* Profile Section */}
            <View className="mt-4 flex-1">
              <View className="bg-white rounded-4xl mx-4 overflow-hidden">
                <View className="p-4 flex-row items-center">
                  <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                    <Text className="text-white text-xl font-semibold">
                      {authUser?.firstName?.[0]}{authUser?.lastName?.[0]}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold">{authUser?.firstName} {authUser?.lastName}</Text>
                    <Text className="text-gray-500">{authUser?.email}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Sign Out Button */}
            <View className="mt-6 px-4">
              <Button text='Sign Out' onPress={() => {
                signOut();
                resetRootSettingsState();
                onClose();
              }} />
            </View>

            {/* Delete Account Button */}
            <View className="mt-4 mb-6 px-4">
              <Button
                text='Delete Account'
                onPress={handleDeleteAccount}
                loading={isDeleting}
                disabled={isDeleting}
                ghost
                className="border border-red-500"
                textClassName="text-red-500"
                disabledClassName="border-red-200"
                disabledTextClassName="text-red-200"
              />
            </View>
          </>
        ) : (
          // Unauthenticated user content
          <View className="flex-1" style={{ paddingBottom: inset.bottom }}>
            {!showAuthForm && (
              <View className="mt-4 flex-1 items-center justify-center">
                <View className="bg-white rounded-4xl mx-4 overflow-hidden">
                  <View className="p-6 items-center">
                    <Text className="text-blue-950 text-center text-3xl mb-4">Join Gogue</Text>
                    <Text className="text-gray-950 text-center">To personalize your experience and track your progress</Text>
                  </View>
                </View>
              </View>
            )}

            {!showAuthForm ? (
              // Initial authentication options
              <View className="mt-6 px-4 space-y-4 py-4">
                <Button
                  loading={isSigningIn}
                  text="Continue with Google"
                  onPress={handleGoogleSignIn}
                  className="w-full bg-transparent border border-blue-500 mb-2"
                  textClassName="text-blue-500"
                  icon={{ component: 'Ionicons', name: 'logo-google', color: '#3b82f6' }}
                  loaderClassName='text-blue-500'
                />

                <Button
                  disabled={isSigningIn}
                  disabledClassName='opacity-40'
                  text="Create an account"
                  onPress={handleShowSignUpForm}
                  className="w-full bg-transparent border border-blue-500 mb-2"
                  textClassName="text-blue-500"
                  icon={{ component: 'Ionicons', name: 'mail', color: '#3b82f6' }}
                />

                <Button
                  secondary
                  disabled={isSigningIn}
                  text="Sign in"
                  onPress={handleShowSignInForm}
                  className="w-full"
                />
              </View>
            ) : (
            // Authentication forms - show only selected option
            <View className="mt-4 px-4 flex-1">               
              {/* Form Content */}
              <View className="space-y-4 flex-1">
                {authMode === 'signin' ? (
                  <>
                    <View className="flex-1 items-center justify-center">
                      {/* Title Section */}
                      <View className="mb-8">
                        <Text className="text-lg text-center text-gray-950">
                          Sign in to continue your learning journey
                        </Text>
                      </View>
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
                    <View>
                      <Button
                        loading={isSigningIn}
                        text={'Sign In'}
                        onPress={handleEmailAuth}
                        className="w-full mb-2"
                      />
                      <Button
                        ghost
                        text="Forgot Password?"
                        onPress={handleForgotPassword}
                        className="w-full"
                        textClassName="text-blue-500"
                      />
                    </View>
                  </>
                ) : (
                  // signup
                  <>
                    {signupStep === 1 ? (
                      <>
                        <View className="flex-1 items-center justify-center">
                          {/* Title Section */}
                          <View className="mb-8">
                            <Text className="text-lg text-center text-gray-950">
                              Create a new account to get started
                            </Text>
                          </View>
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
                        <View>
                          <Button
                            loading={isSigningIn}
                            text={'Continue'}
                            onPress={handleSignupStep1Continue}
                            className="w-full mb-2"
                          />
                        </View>
                      </>
                    ) : (
                      // Step 2: First and Last Name
                      <>
                        <View className="flex-1 items-center justify-center">
                          {/* Title Section */}
                          <View className="mb-8">
                            <Text className="text-lg text-center text-gray-950">
                              Tell us your name to finalize onboarding
                            </Text>
                          </View>
                          <Input
                            placeholder="First name"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                            autoCorrect={false}
                            status={firstNameError ? 'error' : undefined}
                            helperText={firstNameError}
                            containerClassName="mb-4"
                          />
                          <Input
                            placeholder="Last name"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                            autoCorrect={false}
                            status={lastNameError ? 'error' : undefined}
                            helperText={lastNameError}
                            containerClassName="mb-4"
                          />
                        </View>
                        <View>
                          <Button
                            loading={isSigningIn}
                            text={'Continue'}
                            onPress={handleCreateAccountFinal}
                            className="w-full mb-2"
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
            )}
          </View>
        )}
      </View>
    </GlobalDrawer>
  )
}