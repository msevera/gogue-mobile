import { Keyboard, View } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { LectureControls } from './LectureControls';
import { AudioStatus } from 'expo-audio';
import { Text } from './ui/Text';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export interface LectureDrawerRef {
  open: () => void;
  close: () => void;
}

const controlsDrawerClosedSnapPoint = '200';
const controlsDrawerActiveInputSnapPoint = '420';
const controlsDrawerOnlyInputSnapPoint = '90';

const LectureDrawer = forwardRef<LectureDrawerRef, {
  status: AudioStatus,
  onPlayPause: () => void
}>(({
  status,
  onPlayPause
}, ref) => {
  const [text, setText] = useState('');
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [controlsDrawerSettings, setControlsDrawerSettings] = useState({
    snapPoints: [controlsDrawerClosedSnapPoint],
    // snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  });

  const [notesDrawerSettings, setNotesDrawerSettings] = useState({
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
    setControlsDrawerSettings({
      ...controlsDrawerSettings,
      snapPoints: [isNotesDrawerOpen ? controlsDrawerOnlyInputSnapPoint : controlsDrawerClosedSnapPoint],
      backdrop: false,
    })
  }

  const hideDrawer = () => {
    setControlsDrawerSettings({
      ...controlsDrawerSettings,
      snapPoints: ['0'],
      backdrop: false,
    })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isNotesDrawerOpen ? 0 : 1, { duration: 500 }),
    };
  });


  return (
    <>
      <BottomSheet
        title='Ask AI'
        backdrop={notesDrawerSettings.backdrop}
        gesturesEnabled={false}
        snapPoints={notesDrawerSettings.snapPoints}
        index={notesDrawerSettings.index}
        onBackdropPress={() => {
          Keyboard.dismiss();
          showDrawer();
          setControlsDrawerSettings({
            ...controlsDrawerSettings,
            snapPoints: [controlsDrawerClosedSnapPoint],
          });

          setNotesDrawerSettings({
            ...notesDrawerSettings,
            snapPoints: ['0'],
            backdrop: false,
          });

          setIsNotesDrawerOpen(false);
        }}
      >
        <View className='flex-1'>
          <Text>Notes</Text>
        </View>
      </BottomSheet>
      <BottomSheet
        customBackground
        gesturesEnabled={false}
        snapPoints={controlsDrawerSettings.snapPoints}
        index={controlsDrawerSettings.index}
        backdrop={controlsDrawerSettings.backdrop}
        onBackdropPress={() => {
          Keyboard.dismiss();
          showDrawer();
        }}
      >
        <View className='mb-5 flex-row items-center justify-between px-4 gap-2 shadow-md shadow-gray-100'>
          <View className='flex-1'>
            <Input
              value={text}
              onChangeText={setText}
              placeholder='Ask anything'
              componentClassName='p-2 px-4 pr-2 rounded-4xl'
              onFocus={() => {
                setControlsDrawerSettings({
                  ...controlsDrawerSettings,
                  snapPoints: [controlsDrawerActiveInputSnapPoint],
                });

                setNotesDrawerSettings({
                  ...notesDrawerSettings,
                  snapPoints: ['100%'],
                  backdrop: true,
                });

                setIsNotesDrawerOpen(true);
              }}
              onBlur={() => {
                Keyboard.dismiss();
                showDrawer();
              }}
              right={<View className='flex-row items-center gap-2'>
                <Button
                  secondary
                  className={`p-2 border-1 bg-gray-100`}
                  textClassName={'text-gray-300'}
                  onPress={() => {
                    setControlsDrawerSettings({
                      ...controlsDrawerSettings,
                      snapPoints: [controlsDrawerOnlyInputSnapPoint],
                    });
    
                    setNotesDrawerSettings({
                      ...notesDrawerSettings,
                      snapPoints: ['100%'],
                      backdrop: true,
                    });
                    
                    setIsNotesDrawerOpen(true);
                  }}
                  icon={{
                    component: 'Ionicons',
                    name: 'mic',
                    size: 24,
                    color: '#374151',
                  }}
                // text={!isHolding ? 'Hold to ask' : 'Speak'}
                />
              </View>}
            />
          </View>
        </View>
        {/* <View className='absolute top-[28] h-[200] w-full left-0 right-0 bg-white z-[-1]' /> */}
        <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
            locations={[0, 0.18, 1]}            
            style={{
              // borderWidth: 1,
              // borderColor: 'red',
              position: 'absolute',
              top: -20,
              left: 0,
              right: 0,
              bottom: 0,
              height: 200,
              zIndex: -1,
            }}
          />
        <Animated.View className='flex-1' style={animatedStyle}>
          <LectureControls
            status={status}
            onPlayPause={onPlayPause}
            isCreatingNote={false}
            onNote={() => { }}
          />
        </Animated.View>
      </BottomSheet>

    </>
  );
});

LectureDrawer.displayName = 'LectureDrawer';

export default LectureDrawer; 