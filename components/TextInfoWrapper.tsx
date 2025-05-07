import { forwardRef, ReactNode, memo } from 'react';
import { View } from 'react-native';
import { Text } from './ui/Text';
export interface TextInfoWrapperProps {
  className?: string;
  helperText?: string;
  status?: 'alert' | 'success' | 'error' | '';
  children?: ReactNode;
  right?: ReactNode;
}

const TextInfoWrapper = ({
  className,
  helperText,
  status,
  children,
  right
}: TextInfoWrapperProps) => {
  return (
    <View
      className={`
        relative w-full              
        ${className}
      `}
    >
      <View>{children}</View>
      {(helperText || right) && (
        <View className={`mt-2 flex flex-row items-center justify-between text-sm ${!helperText ? 'justify-end' : ''}`}>
          {
            helperText && <View><Text
              className={`
              ${status === 'error' ? 'text-red-600' : ''}
              ${status === 'success' ? 'text-green-600' : ''}
              ${status === 'alert' ? 'text-yellow-600' : ''}
            `}
            >{helperText}</Text></View>
          }
          {right}
        </View>
      )}
    </View>
  );
};

export default memo(TextInfoWrapper);
