import { View, Alert, TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/Button';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootSettingsAuth } from './RootSettingsAuth';

export const RootSettings = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const { signOut, authUser, deleteAccount } = useAuth();

  const inset = useSafeAreaInsets();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMeta, setAuthMeta] = useState({ title: '', showBack: false, allowClose: true, gesturesEnabled: true });
  const [resetAuthKey, setResetAuthKey] = useState(0);

  // Auth validation and flow moved into RootSettingsAuth

  const resetRootSettingsState = () => {
    setAuthMeta({ title: '', showBack: false, allowClose: true, gesturesEnabled: true });
    setIsSigningIn(false);
    setIsDeleting(false);
    setResetAuthKey(prev => prev + 1); // Force reset of child component
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      resetRootSettingsState();
    }
  }, [visible]);

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
    gesturesEnabled: showSettings ? true : authMeta.gesturesEnabled,
    closeByGestureEnabled: showSettings ? true : authMeta.gesturesEnabled
  }), [visible, authMeta.gesturesEnabled, showSettings]);
  
  
  return (
    <GlobalDrawer
      name='rootSettingsDrawer'
      title={showSettings ? 'Settings' : authMeta.title}
      headerBorder={showSettings ? true : false}
      showCloseButton={showSettings ? true : authMeta.allowClose}
      drawerSettings={drawerSettings}
      onBackdropPress={onClose}
      headerContainerClassName={`${showSettings ? 'bg-gray-100' : 'bg-white'}`}
      headerContentClassName='pb-0'
      headerLeft={!showSettings && authMeta.showBack ? (
        <Button sm ghost icon={{ component: 'Ionicons', name: 'chevron-back' }} onPress={resetRootSettingsState} />
      ) : undefined}
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
          <View className="flex-1" style={{ paddingBottom: inset.bottom }}>
            <RootSettingsAuth key={resetAuthKey} onClose={onClose} onMetaChange={(meta) => setAuthMeta(meta)} />
          </View>
        )}
      </View>
    </GlobalDrawer>
  )
}