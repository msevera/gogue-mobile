import * as React from 'react';
import { ActivityIndicator, NativeSyntheticEvent, TextInput, TextInputContentSizeChangeEventData, TextInputFocusEventData, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import TextInfoWrapper, { TextInfoWrapperProps } from '../TextInfoWrapper';
import { ReactNode, useState } from 'react';
import { Button } from './Button';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps & TextInfoWrapperProps & { allowRecording?: boolean, recordingActive?: boolean, staticHeight?: boolean, inputClassName?: string, componentClassName?: string, containerClassName?: string, renderOneLine?: boolean, useWrapper?: boolean, wrapperClassName?: string, bottomSheet?: boolean, loading?: boolean, helperRight?: ReactNode, left?: ReactNode, onRecordingPress?: () => void }>(
  ({ allowRecording, recordingActive, staticHeight, onContentSizeChange, onFocus, onBlur, value, style, multiline, containerClassName, inputClassName, componentClassName, placeholderClassName, useWrapper = true, helperText, status, right, left, helperRight, wrapperClassName, bottomSheet, loading, onChangeText, onRecordingPress, ...props }, ref) => {
    const [height, setHeight] = useState<Number>();
    const [isInFocus, setIsInFocus] = useState(false);
    const renderOneLine = !multiline || (!isInFocus && !value);
    const heightStyle = !renderOneLine ? { height: height as number } : undefined;

    const inputProps = {
      multiline,
      value,
      ref,
      className: cn(
        'text-base font-gray-950 placeholder:text-gray-400 w-full leading-[1.2]',      
        multiline ? 'leading-[1.5] p-4 py-3': 'leading-[1.2]',
        inputClassName,
      ),
      editable: props.editable,
      onChangeText: (text: string) => {
        if (loading) return;
        onChangeText?.(text);
      },
      onFocus: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (multiline && !staticHeight) {
          setIsInFocus(true);
          if (!value) {
            setHeight((height as number || 0) + 20);
          }
        }
        onFocus?.(event);
      },
      onBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (multiline && !staticHeight) {
          setIsInFocus(false);
          if (!value) {
            setHeight(20);
          }
        }
        onBlur?.(event);
      },
      onContentSizeChange: (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        if (multiline && !staticHeight) {
          const { height } = event.nativeEvent.contentSize;
          if (height < 100) {
            setHeight(height + (!isInFocus ? 0 : 20));
          }
        }

        // onContentSizeChange?.(event);
      },
      style: {
        ...(staticHeight ? {} : heightStyle),
        ...style,
      },
      ...props
    }

    const Component = (
      <View
        className={
          cn(
            'bg-white p-4 rounded-2xl border border-gray-200',
            multiline && 'p-0',
            'flex-row justify-between items-center',
            (props.editable === false || loading) && 'opacity-50 bg-gray-300',
            componentClassName
          )
        }>
        {left}
        <View className='flex-1'>
          <TextInput {...inputProps} />
        </View>
        {right}
        {
          allowRecording && !loading && (
            <Button
              secondary
              className={cn(
                `absolute right-[12] bottom-[12]`,
                recordingActive ? 'bg-red-100' : 'bg-gray-100',
              )}
              sm
              icon={{ component: 'Ionicons', name: 'mic', color: recordingActive ? '#ef4444' : '#374151' }}
              onPress={onRecordingPress}
            />
          )
        }
        {
          loading && (
            <ActivityIndicator
              className={cn(
                'absolute right-[16] bottom-[16]'
              )}
              size="small"
              color="#000"
            />
          )
        }
      </View>
    )

    return <View className={`${containerClassName} flex-row`}>
      {
        useWrapper ? (
          <TextInfoWrapper
            helperText={helperText}
            status={status}
            right={helperRight}
            className={wrapperClassName}
          >
            {Component}
          </TextInfoWrapper>
        ) : (
          Component
        )
      }
    </View>
  }
);

Input.displayName = 'Input';

export { Input };