import { Portal } from '@gorhom/portal';
import { BottomSheet } from '../BottomSheet';
import { Keyboard, KeyboardAvoidingViewProps } from 'react-native';

type DrawerSettings = {
  snapPoints: (number | string)[],
  backdrop: boolean,
  index: number,
  gesturesEnabled: boolean,
  closeByGestureEnabled: boolean,
  customBackground?: boolean
}

export const GlobalDrawer = ({ headerLeft, name, customKeyboardBehavior, children, title, headerBorder, drawerSettings, onBackdropPress, headerContainerClassName, headerContentClassName, showCloseButton = true }: { headerLeft?: React.ReactNode, name?: string, children: React.ReactNode, title?: string, headerBorder?: boolean, drawerSettings: DrawerSettings, onBackdropPress?: () => void, headerContainerClassName?: string, headerContentClassName?: string, showCloseButton?: boolean, customKeyboardBehavior?: KeyboardAvoidingViewProps['behavior'] | null }) => {    
  return <Portal name={name ||title} hostName="globalDrawer">    
    <BottomSheet
      headerLeft={headerLeft}
      customKeyboardBehavior={customKeyboardBehavior}
      title={title}   
      headerBorder={headerBorder}   
      snapPoints={drawerSettings.snapPoints}
      index={drawerSettings.index}
      backdrop={drawerSettings.backdrop}
      gesturesEnabled={drawerSettings.gesturesEnabled}
      onBackdropPress={onBackdropPress}
      closeByGestureEnabled={drawerSettings.closeByGestureEnabled}
      onSlideAnimationStarted={() => Keyboard.dismiss()}
      headerContainerClassName={headerContainerClassName}
      headerContentClassName={headerContentClassName}
      showCloseButton={showCloseButton}
      customBackground={drawerSettings.customBackground}
    >
      {children}
    </BottomSheet>    
  </Portal>
};