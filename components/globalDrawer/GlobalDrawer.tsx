import { Portal } from '@gorhom/portal';
import { BottomSheet } from '../BottomSheet';
import { Keyboard } from 'react-native';

type DrawerSettings = {
  snapPoints: (number | string)[],
  backdrop: boolean,
  index: number,
  gesturesEnabled: boolean,
  closeByGestureEnabled: boolean
}

export const GlobalDrawer = ({  children, title, headerBorder, drawerSettings, onBackdropPress, headerContainerClassName, headerContentClassName, showCloseButton = true }: { children: React.ReactNode, title: string, headerBorder: boolean, drawerSettings: DrawerSettings, onBackdropPress?: () => void, headerContainerClassName?: string, headerContentClassName?: string, showCloseButton?: boolean }) => {    
  return <Portal name={title} hostName="globalDrawer">    
    <BottomSheet
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
    >
      {children}
    </BottomSheet>    
  </Portal>
};