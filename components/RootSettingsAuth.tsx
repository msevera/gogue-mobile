import { View } from 'react-native'
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/Button';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import auth from '@react-native-firebase/auth';

type AuthMeta = {
  title: string;
  showBack: boolean;
  allowClose: boolean;
  gesturesEnabled: boolean;
};

export function RootSettingsAuth({
  onClose,
  onMetaChange,
}: {
  onClose: () => void,
  onMetaChange: (meta: AuthMeta) => void,
}) {
  const {
    authUser,
    signInWithGoogle,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setProfile,
  } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Form state
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

  const validateEmailFormat = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const resetAll = () => {
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
  };

  // Expose meta up to parent based on current local state
  useEffect(() => {
    const meta: AuthMeta = {
      title: !showAuthForm ? '' : (authMode === 'signup' ? (signupStep === 2 ? '' : 'Create account') : 'Sign in'),
      showBack: showAuthForm && !(authMode === 'signup' && signupStep === 2),
      allowClose: !(authMode === 'signup' && signupStep === 2),
      gesturesEnabled: !(authMode === 'signup' && signupStep === 2),
    };
    onMetaChange(meta);
  }, [showAuthForm, authMode, signupStep]);

  // If authenticated but missing names, force step 2 inline
  useEffect(() => {
    if (authUser && (!authUser.firstName || !authUser.lastName)) {
      setShowAuthForm(true);
      setAuthMode('signup');
      setSignupStep(2);
    }
  }, [authUser?.firstName, authUser?.lastName]);

  const validateStep1 = () => {
    let ok = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    if (!email.trim()) { setEmailError('Email is required'); ok = false; }
    else if (!validateEmailFormat(email)) { setEmailError('Please enter a valid email address'); ok = false; }
    if (!password.trim()) { setPasswordError('Password is required'); ok = false; }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); ok = false; }
    if (authMode === 'signup') {
      if (!confirmPassword.trim()) { setConfirmPasswordError('Please confirm your password'); ok = false; }
      else if (password !== confirmPassword) { setConfirmPasswordError('Passwords do not match'); ok = false; }
    }
    return ok;
  };

  const handleShowSignIn = () => { setAuthMode('signin'); setShowAuthForm(true); };
  const handleShowSignUp = () => { setAuthMode('signup'); setShowAuthForm(true); };
  const handleBack = () => { resetAll(); };

  const handleEmailAuth = async () => {
    if (!validateStep1()) return;
    setIsSigningIn(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(email, password);
        resetAll();
        onClose();
      } else {
        const methods = await auth().fetchSignInMethodsForEmail(email);
        if (methods && methods.length > 0) {
          setEmailError('An account with this email already exists');
          return;
        }
        await createUserWithEmailAndPassword(email, password);
        setSignupStep(2);
      }
    } catch (error: any) {
      let message = 'An error occurred during authentication';
      switch (error?.code) {
        case 'auth/user-not-found': message = 'No account found with this email address'; break;
        case 'auth/wrong-password': message = 'Incorrect password'; break;
        case 'auth/invalid-email': message = 'Invalid email address'; break;
        case 'auth/user-disabled': message = 'This account has been disabled'; break;
        case 'auth/too-many-requests': message = 'Too many failed attempts. Please try again later'; break;
        case 'auth/email-already-in-use': message = 'An account with this email already exists'; break;
        case 'auth/weak-password': message = 'Password is too weak. Please choose a stronger password'; break;
        case 'auth/operation-not-allowed': message = 'Email/password accounts are not enabled'; break;
        default: message = error?.message || message;
      }
      // Surface as inline helper via state already set (emailError/passwordError), no alert needed here
      if (!emailError) setEmailError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setEmailError('Email is required'); return; }
    if (!validateEmailFormat(email)) { setEmailError('Please enter a valid email address'); return; }
    try { await sendPasswordResetEmail(email); } catch { }
  };

  const handleGoogle = async () => {
    setIsSigningIn(true);
    try { await signInWithGoogle(); resetAll(); onClose(); } finally { setIsSigningIn(false); }
  };

  const handleFinalize = async () => {
    let ok = true;
    setFirstNameError(''); setLastNameError('');
    if (!firstName.trim()) { setFirstNameError('First name is required'); ok = false; }
    if (!lastName.trim()) { setLastNameError('Last name is required'); ok = false; }
    if (!ok) return;
    setIsSigningIn(true);
    try {
      await setProfile({ firstName, lastName });
      resetAll(); 
      onClose();
    } finally { setIsSigningIn(false); }
  };

  return (
    <View className="flex-1">
      {!showAuthForm ? (
        <>
          <View className="mt-4 flex-1 items-center justify-center">
            <View className="bg-white rounded-4xl mx-4 overflow-hidden">
              <View className="p-6 items-center">
                <Text className="text-blue-950 text-center text-3xl mb-4">Join Gogue</Text>
                <Text className="text-gray-950 text-center">Log in to create lectures and personalize your experience</Text>
              </View>
            </View>
          </View>
          <View className="mt-6 px-4 space-y-4 py-4">
            <Button loading={isSigningIn} text="Continue with Google" onPress={handleGoogle} className="w-full bg-transparent border border-blue-500 mb-2" textClassName="text-blue-500" loaderClassName='text-blue-500' icon={{ component: 'Ionicons', name: 'logo-google', color: '#3b82f6' }} />
            <Button disabled={isSigningIn} disabledClassName='opacity-40' text="Create an account" onPress={handleShowSignUp} className="w-full bg-transparent border border-blue-500 mb-2" textClassName="text-blue-500" icon={{ component: 'Ionicons', name: 'mail', color: '#3b82f6' }} />
            <Button secondary disabled={isSigningIn} text="Sign in" onPress={handleShowSignIn} className="w-full" />
          </View>
        </>
      ) : (
        <View className="mt-4 px-4 flex-1">
          {authMode === 'signin' ? (
            <>
              <View className="flex-1 items-center justify-center">
                <View className="mb-8">
                  <Text className="text-lg text-center text-gray-950">Sign in to continue your learning journey</Text>
                </View>
                <Input placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} status={emailError ? 'error' : undefined} helperText={emailError} containerClassName="mb-4" />
                <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} status={passwordError ? 'error' : undefined} helperText={passwordError} containerClassName="mb-4" />
              </View>
              <View>
                <Button loading={isSigningIn} text={'Sign In'} onPress={handleEmailAuth} className="w-full mb-2" />
                <Button ghost text="Forgot Password?" onPress={handleForgotPassword} className="w-full" textClassName="text-blue-500" />
              </View>
            </>
          ) : (
            <>
              {signupStep === 1 ? (
                <>
                  <View className="flex-1 items-center justify-center">
                    <View className="mb-8">
                      <Text className="text-lg text-center text-gray-950">Create a new account to get started</Text>
                    </View>
                    <Input placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} status={emailError ? 'error' : undefined} helperText={emailError} containerClassName="mb-4" />
                    <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} status={passwordError ? 'error' : undefined} helperText={passwordError} containerClassName="mb-4" />
                    <Input placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} status={confirmPasswordError ? 'error' : undefined} helperText={confirmPasswordError} containerClassName="mb-4" />
                  </View>
                  <View>
                    <Button loading={isSigningIn} text={'Continue'} onPress={handleEmailAuth} className="w-full mb-2" />
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-1 items-center justify-center">
                    <View className="mb-8">
                      <Text className="text-lg text-center text-gray-950">Tell us your name to finalize onboarding</Text>
                    </View>
                    <Input placeholder="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" autoCorrect={false} status={firstNameError ? 'error' : undefined} helperText={firstNameError} containerClassName="mb-4" />
                    <Input placeholder="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" autoCorrect={false} status={lastNameError ? 'error' : undefined} helperText={lastNameError} containerClassName="mb-4" />
                  </View>
                  <View>
                    <Button loading={isSigningIn} text={'Continue'} onPress={handleFinalize} className="w-full mb-2" />
                  </View>
                </>
              )}
            </>
          )}
          {/** Back button is handled by parent header using meta.showBack; provide a noop here via meta only */}
          {showAuthForm && !(authMode === 'signup' && signupStep === 2) ? (
            <View className="h-0" />
          ) : null}
        </View>
      )}
    </View>
  );
}


