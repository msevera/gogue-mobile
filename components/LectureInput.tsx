import { View } from "react-native";
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export const LectureInput = ({
  onFocus,
  onBlur,
  onRecordPress,
  onTextSubmit,
  onPress,
  loading,
  agentMode
}: {
  onFocus: () => void,
  onBlur: () => void,
  onRecordPress: () => void,
  onTextSubmit: (text: string) => void,
  onPress: () => void,
  loading: boolean,
  agentMode: 'text' | 'voice' | null
}) => {
  const [text, setText] = useState('');

  const isDisabled = useMemo(() => {    
    return agentMode === 'text' && text.length === 0;
  }, [agentMode, text]);

  const isTextInput = useMemo(() => {
    return agentMode === 'text';
  }, [agentMode, text]);

  const isVoiceInput = useMemo(() => {
    return agentMode === 'voice';
  }, [agentMode]);

  return (
    <Input
      value={text}
      onChangeText={setText}
      placeholder='Ask anything'
      componentClassName='p-2 px-4 pr-2 rounded-4xl'
      onFocus={onFocus}
      onBlur={onBlur}
      right={<View className='flex-row items-center gap-2'>
        <Button
          secondary
          className={cn(
            `p-2 border-1`,
            agentMode === 'voice' && !loading ? 'bg-red-100' : 'bg-gray-100',
            isDisabled && 'bg-gray-100'
          )}
          textClassName={'text-gray-300'}
          onPress={() => {
            onPress();
            if (agentMode === 'text' && text.length > 0) {
              onTextSubmit(text);       
              setText('');
            } else {
              onRecordPress();
            }
          }}
          icon={{
            component: 'Ionicons',
            name: agentMode === 'text' ? 'arrow-up' : 'mic',
            size: 24,
            color: isDisabled ? '#9ca3af' : agentMode === 'voice' ? '#ef4444' : '#374151',
          }}
          loading={loading}          
          loaderColor='#374151'
          loaderSize={0.8}
          loaderClassName='w-[24] h-[20]'
          disabled={isDisabled}
        />
      </View>}
    />
  );
}