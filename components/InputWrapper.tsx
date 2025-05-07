import React, { useState, forwardRef } from 'react';
import TextInfoWrapper from './TextInfoWrapper';
import InputCounter from './InputCounter';
import { type TextInputProps } from 'react-native';

type Status = 'alert' | 'success' | 'error';

interface InputWrapperProps {
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  helperText?: string;
  hideHelperText?: boolean;
  limit?: number;
  bytes?: boolean;
  cutOnLimit?: boolean;
  name?: string;
  type?: string;
  edi?: boolean;
  noContainer?: boolean;
  autoHeight?: boolean;
  active?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  skipSuffix?: boolean;
  dark?: boolean;
  transparent?: boolean;
  value?: string;
  counterValue?: string;
  status?: Status;
  empty?: boolean;
  children: React.ReactElement | ((props: { inputProps: InputProps }) => React.ReactElement);
  onBlur?: (e: React.FocusEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onWrapperClick?: (e: React.MouseEvent) => void;
  onWrapperBlur?: (e: React.FocusEvent) => void;
  onWrapperFocus?: (e: React.FocusEvent) => void;
}

const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  (
    {
      className,
      containerClassName,
      placeholder,
      helperText,
      hideHelperText = false,
      onChange = () => {},
      value = '',
      counterValue,
      status,
      onFocus = () => {},
      onBlur = () => {},
      name,
      type = 'text',
      prefix,
      suffix,
      skipSuffix = false,
      bytes = false,
      limit = 0,
      cutOnLimit = true,
      editable = false,
      active: activeContainer = false,
      autoHeight = false,
      noContainer = false,
      dark = false,
      transparent = false,
      empty,
      children,
      onWrapperClick = () => {},
      onWrapperBlur = () => {},
      onWrapperFocus = () => {},
    },
    ref
  ) => {
    const [active, setActive] = useState(false);

    const commonProps: TextInputProps = {
      editable,
      value,
      onFocus: e => {
        setActive(true);
        onFocus(e);
      },
      onBlur: e => {
        setActive(false);
        onBlur(e);
      },
      onChange: e => {
        if (cutOnLimit && limit !== 0 && e.target.value.length >= limit + 1) {
          e.target.value = e.target.value.slice(0, limit);
        }
        onChange(e);
      },
      placeholder,
    };

    const childElement = typeof children === 'function' ? children({ inputProps: commonProps }) : children;

    return (
      <div
        ref={ref}
        className={`
          relative w-full
          ${active || activeContainer ? 'ring-2 ring-blue-500' : ''}
          ${autoHeight ? 'h-auto' : 'h-10'}
          ${Array.isArray(value) ? (value.length ? 'ring-1 ring-gray-300' : '') : value ? 'ring-1 ring-gray-300' : ''}
          ${empty ? 'ring-1 ring-gray-200' : ''}
          ${noContainer ? 'bg-transparent' : 'bg-white'}
          ${editable ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          ${hideHelperText ? 'mb-0' : 'mb-6'}
          ${status === 'error' ? 'ring-2 ring-red-500' : ''}
          ${status === 'success' ? 'ring-2 ring-green-500' : ''}
          ${status === 'alert' ? 'ring-2 ring-yellow-500' : ''}
          ${className || ''}
        `}
        onFocus={onWrapperFocus}
        onClick={onWrapperClick}
        onBlur={onWrapperBlur}
      >               
        <TextInfoWrapper
          helperText={helperText}
          status={status}
          right={
            !!limit && (
              <InputCounter
                limit={limit}                
                value={counterValue !== undefined ? counterValue : value}
                className="text-sm text-gray-500"
              />
            )
          }
        >
          <div
            className={`
              flex items-center w-full rounded-md px-3 py-2
              ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              ${transparent ? 'bg-transparent' : ''}
              ${editable ? 'bg-gray-100' : ''}
              ${containerClassName || ''}
            `}
          >
            <div className="flex-1 flex items-center gap-2">
              {prefix && <div>{prefix}</div>}
              {React.cloneElement(childElement)}
            </div>
            {!skipSuffix && suffix && <div>{suffix}</div>}
          </div>
        </TextInfoWrapper>
      </div>
    );
  }
);

export default React.memo(InputWrapper);
