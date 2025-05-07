import { Keyboard } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BottomSheet } from '../BottomSheet';
import { LectureControls } from './lectureControls';

export interface LectureDrawerRef {
  open: () => void;
  close: () => void;
}

const closedSnapPoint = '120';
const activeInputSnapPoint = '450';

const LectureDrawer = forwardRef<LectureDrawerRef, {
  elapsedTime: number,
  isPausing: boolean,
  isRewinding: boolean,
  isCreatingNote: boolean,
  showPause: boolean,
  onPause: () => void,
  onRewind: () => void,
  onNote: () => void,
  onSubmit: (text: string) => void,
  isPaused: boolean
}>(({
  elapsedTime,
  isPausing,
  isRewinding,
  isCreatingNote,
  showPause,
  onPause,
  onRewind,
  onNote,
  onSubmit,
  isPaused = false
}, ref) => {
  const [text, setText] = useState('');
  const [drawerSettings, setDrawerSettings] = useState({
    // snapPoints: [closedSnapPoint],
    snapPoints: ['0'],
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
        elapsedTime={elapsedTime}
        text={text}
        setText={setText}
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
        }}
        onRewind={onRewind}
        isRewinding={isRewinding}
        isPaused={isPaused}
        showPause={showPause}
        isPausing={isPausing}
        isCreatingNote={isCreatingNote}
        onPause={onPause}
        onSubmit={onSubmit}
        onNote={onNote}
      />
    </BottomSheet>
  );
});

LectureDrawer.displayName = 'LectureDrawer';

export default LectureDrawer; 