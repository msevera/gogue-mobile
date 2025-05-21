import { Keyboard } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { LectureControls } from './LectureControls';
import { AudioStatus } from 'expo-audio';

export interface LectureDrawerRef {
  open: () => void;
  close: () => void;
}

// const closedSnapPoint = '190';
const closedSnapPoint = '190';
const activeInputSnapPoint = '505';

const LectureDrawer = forwardRef<LectureDrawerRef, {
  status: AudioStatus,
  onPlayPause: () => void
}>(({
  status,
  onPlayPause
}, ref) => {
  const [text, setText] = useState('');
  const [drawerSettings, setDrawerSettings] = useState({
    snapPoints: [closedSnapPoint],
    // snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      showDrawer();
    },
    close: () => {
      hideDrawer();
    }
  }));

  const showDrawer = () => {
    setDrawerSettings({
      ...drawerSettings,
      snapPoints: [closedSnapPoint],
      backdrop: false,
    })
  }

  const hideDrawer = () => {
    setDrawerSettings({
      ...drawerSettings,
      snapPoints: ['0'],
      backdrop: false,
    })
  }

  return (
    <BottomSheet
      customBackground
      gesturesEnabled={false}
      snapPoints={drawerSettings.snapPoints}
      index={drawerSettings.index}
      backdrop={drawerSettings.backdrop}
      backdropClassName='bg-white/80'
      onBackdropPress={() => {
        Keyboard.dismiss();
        showDrawer();
      }}
    >
      <LectureControls
        onInputFocus={() => {
          setDrawerSettings({
            ...drawerSettings,
            snapPoints: [activeInputSnapPoint],
            backdrop: true,
          })
        }}
        onInputBlur={() => {
          Keyboard.dismiss();
          showDrawer();
        }} text={text} status={status} onPlayPause={onPlayPause} />
    </BottomSheet>
  );
});

LectureDrawer.displayName = 'LectureDrawer';

export default LectureDrawer; 