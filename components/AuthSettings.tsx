import { View } from 'react-native'
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootSettingsAuth } from './RootSettingsAuth';

export const AuthSettings = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const inset = useSafeAreaInsets();
  const [authMeta, setAuthMeta] = useState({ title: '', showBack: false, allowClose: true, gesturesEnabled: true });
  const [resetAuthKey, setResetAuthKey] = useState(0);

  // Auth validation and flow moved into RootSettingsAuth

  const resetRootSettingsState = () => {
    setAuthMeta({ title: '', showBack: false, allowClose: true, gesturesEnabled: true });      
    setResetAuthKey(prev => prev + 1); // Force reset of child component
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      resetRootSettingsState();
    }
  }, [visible]);


  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: authMeta.gesturesEnabled,
    closeByGestureEnabled: authMeta.gesturesEnabled
  }), [visible, authMeta.gesturesEnabled]);


  return (
    <GlobalDrawer
      name='authSettingsDrawer'
      title={authMeta.title}
      headerBorder={false}
      showCloseButton={authMeta.allowClose}
      drawerSettings={drawerSettings}
      onBackdropPress={onClose}
      headerContainerClassName='bg-white'
      headerContentClassName='pb-0'
      headerLeft={authMeta.showBack ? (
        <Button sm ghost icon={{ component: 'Ionicons', name: 'chevron-back' }} onPress={resetRootSettingsState} />
      ) : undefined}
    >
      <View className={`flex-1 bg-white`}>
        <View className="flex-1" style={{ paddingBottom: inset.bottom }}>
          <RootSettingsAuth key={resetAuthKey} onClose={onClose} onMetaChange={(meta) => setAuthMeta(meta)} />
        </View>
      </View>
    </GlobalDrawer>
  )
}