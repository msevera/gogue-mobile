import * as React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, PressableProps, StyleProp, TextStyle, View } from 'react-native';
import { Text } from './Text';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import * as VectorIcons from '@expo/vector-icons';

type IconComponentName = keyof typeof VectorIcons;

type ButtonProps = PressableProps & {
  loading?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  sm?: boolean;
  className?: string;
  textClassName?: string;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  loaderColor?: string;
  loaderSize?: number;
  icon?: {
    component: IconComponentName;
    name: string;
    size?: number;
    color?: string;
    className?: string;
    top?: boolean
  };
  loaderClassName?: string;
}

export const Button = React.forwardRef<View, ButtonProps>(({
  loaderClassName,
  icon,
  text,
  textClassName,
  className,
  disabled,
  loading,
  sm,
  secondary,
  ghost,
  loaderColor,
  loaderSize,
  onPress,
  textStyle,
  ...props
}, ref) => {
  const onPressHandler = useCallback((event: GestureResponderEvent) => {
    if (loading || disabled) return;
    onPress?.(event);
  }, [loading, onPress]);

  const IconComponent = React.useMemo(() => {
    if (!icon) return null;
    return VectorIcons[icon.component];
  }, [icon]);

  const getIconColor = () => {
    if (icon?.color) return icon.color;
    return ghost
      ? (secondary ? `${disabled ? '#9ca3af' : '#4B5563'}` : `${disabled ? '#9ca3af' : '#4B5563'}`)
      : (secondary ? `${disabled ? '#9ca3af' : '#3b82f6'}` : `${disabled ? '#fff' : '#fff'}`);
  };

  const getLoaderColor = () => {
    if (loaderColor) return loaderColor;
    return ghost ? (secondary ? '#3b82f6' : '#3b82f6') : '#fff';
  };

  return <Pressable
    // ref={ref}
    {...props}
    onPress={onPressHandler}
    className={cn(
      'flex items-center justify-center',
      icon?.top ? ['flex-col'] : ['flex-row'],
      sm ? ['rounded-3xl py-1.5', text ? ['px-3'] : ['px-1.5']] : ['rounded-4xl py-4', text ? ['px-8'] : ['px-4']],
      ghost ? [
        'bg-transparent',
        secondary ? ['text-blue-500', disabled && 'text-blue-200'] : ['text-blue-500', disabled && 'text-blue-200']
      ] : secondary ? [
        'bg-blue-100',
        loading && 'bg-blue-200',
        disabled && 'bg-blue-50'
      ] : [
        'bg-blue-500 text-white',
        loading && 'bg-blue-400',
        disabled && 'bg-blue-200'
      ],
      className
    )}
  >
    {
      loading ?
        <View className={cn([!sm && 'py-0.5'])}>
          <ActivityIndicator className={loaderClassName} size={'small'} color={getLoaderColor()} style={{ transform: [{ scale: loaderSize || 0.75 }] }} />
        </View> :
        <>
          {
            icon && IconComponent && (
              <View className={cn(
                text && !icon?.top && [sm ? ['mr-1'] : ['mr-2']],
                icon?.className
              )}>
                <IconComponent
                  name={icon.name}
                  size={icon.size ?? 20}
                  color={getIconColor()}
                />
              </View>
            )
          }
          {
            text && (
              <Text
                style={textStyle}
                className={cn(
                  'text-center font-medium',
                  sm ? ['text-sm'] : ['text-base'],
                  ghost ? [
                    secondary ? ['text-blue-500', disabled && 'text-blue-200'] : ['text-blue-500', disabled && 'text-blue-200']
                  ] : secondary ? [
                    'text-blue-500',
                    disabled && 'text-blue-200'
                  ] : [
                    'text-white',
                    disabled && 'text-white'
                  ],
                  textClassName,
                )}
              >
                {text}
              </Text>
            )
          }
        </>
    }
  </Pressable>
})

