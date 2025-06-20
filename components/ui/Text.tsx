import * as React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { cn } from '@/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    
    return (
      <RNText
        className={cn('text-base text-foreground web:select-text', textClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
