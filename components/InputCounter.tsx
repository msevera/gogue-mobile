import React from 'react';
import { Text } from './ui/Text';

interface InputCounterProps {
  limit: number;
  value?: string;
  className?: string;
}

const InputCounter: React.FC<InputCounterProps> = ({ limit, value, className }) => {
  if (limit === 0) return null;

  return (
    <Text className={className}>
      {`${value ? value.length : 0}/${limit}`}
    </Text>
  );
};

export default InputCounter;
