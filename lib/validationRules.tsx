import { IntlShape } from 'react-intl'

const getMessage = (intl: IntlShape, message?: string, id?: string, options?: any) => {
  return message || (intl && id && intl.formatMessage({ id }, { ...options })) || undefined;
};

export const required = (intl: IntlShape, message?: string) => ({
  key: 'required',
  test: (value: string) => {    
    message = getMessage(intl, message, 'common.validation.required');
    if (!!(typeof value !== 'undefined') && value != null) {
      if (Array.isArray(value)) {
        return {
          isValid: value.length > 0,
          message,
        };
      }

      return {
        isValid: !!value.toString().trim().length,
        message,
      };
    }

    return { isValid: false, message };
  },
});


export const email = (intl: IntlShape, message: string) => ({
  key: 'email',
  test: (email: string) => {
    if (email === '') {
      return { isValid: true, message };
    }

    // eslint-disable-next-line
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
    const onlyLatinLetters = !/[^\u0000-\u007f]/.test(email); // eslint-disable-line
    return {
      isValid: emailRegex.test(email) && onlyLatinLetters,
      message: getMessage(intl, message, 'common.validation.email'),
    };
  },
});


const _limitCharsTo = (value: string, limit: number) => {
  if (!value) {
    return true;
  }
  return value.length <= limit;
};
export const limitCharsTo = (limit: number, intl: IntlShape, message: string) => ({
  key: 'limitCharsTo',
  test: (value: string) => {
    return {
      isValid: _limitCharsTo(value, limit),
      message: getMessage(intl, message, 'common.validation.limitCharsTo', { value: limit }),
    };
  },
});

const _limitCharsFrom = (value: string, limit: number) => {
  if (!value) {
    return true;
  }

  return value.length >= limit;
};

export const limitCharsFrom = (limit: number, intl: IntlShape, message: string) => ({
  key: 'limitCharsFrom',
  test: (value: string) => {
    return {
      isValid: _limitCharsFrom(value, limit),
      message: getMessage(intl, message, 'common.validation.limitCharsFrom', { value: limit }),
    };
  },
});

const _limitCharsFromTo = (value: string, from: number, to: number) => value && value.length >= from && value.length <= to;
export const limitCharsFromTo = (from: number, to: number, intl: IntlShape, message: string) => ({
  key: 'limitCharsFromTo',
  test: (value: string) => {
    return {
      isValid: _limitCharsFromTo(value, from, to),
      message: getMessage(intl, message, 'common.validation.limitCharsFromTo', { from, to }),
    };
  },
});

const _limitWordsFrom = (value: string, from: number) => {
  if (!value) {
    return false;
  }

  const words = value
    .trim()
    .split(' ')
    .filter(c => !!c);
  return words.length >= from;
};
export const limitWordsFrom = (from: number, intl: IntlShape, message: string) => ({
  key: 'limitWordsFrom',
  test: (value: string) => {
    return {
      isValid: _limitWordsFrom(value, from),
      message: getMessage(intl, message, 'common.validation.limitWordsFrom', { value: from }),
    };
  },
});
