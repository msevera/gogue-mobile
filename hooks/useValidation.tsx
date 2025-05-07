import { useState, useEffect } from 'react';

const useValidation = () => {
  const mutatedState = {};
  const [isValid, setIsValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [init, setInit] = useState(false);
  // eslint-disable-next-line
  let [validationItems, setValidationItems] = useState({});
  const _invalidItems = Object.keys(validationItems)
    .filter(key => !validationItems[key].isValid)
    .map(key => validationItems[key].errors.join('_'))
    .join('.');

  const validateItemByObject = (item, key, value) => {
    const errors = [];
    let isValid = true;
    const mutatedItem = mutatedState[key];

    mutatedItem.rules.forEach(rule => {
      const ruleResult = rule.test(value || mutatedItem.value);
      if (!ruleResult.isValid) {
        isValid = false;
        errors.push(ruleResult.message);
      }
    });

    return {
      errors,
      isValid,
    };
  };

  const validateForm = validateSilently => {
    let validationItemsCopy = {
      ...validationItems,
    };

    Object.keys(validationItemsCopy).forEach(key => {
      const itemToValidate = validationItemsCopy[key];
      validationItemsCopy = {
        ...validationItemsCopy,
        [key]: {
          ...itemToValidate,
          ...validateItemByObject(itemToValidate, key),
          pristine: itemToValidate.pristine ? !!validateSilently : itemToValidate.pristine,
        },
      };
    });

    const isFormValid = !Object.keys(validationItemsCopy).find(key => !validationItemsCopy[key].isValid);
    const formErrors = Object.keys(validationItemsCopy)
      .filter(key => !validationItemsCopy[key].isValid)
      .map(key => ({ key, messages: validationItemsCopy[key].errors }))
      .flat();

    setValidationItems(validationItemsCopy);
    setSubmitted(!submitted ? !validateSilently : submitted);
    setIsValid(isFormValid);
    setErrors(formErrors.reverse());

    return { isFormValid, formErrors };
  };

  const validateItemByKey = key => {
    const item = validationItems[key];
    const mutatedItem = mutatedState[key];
    if (item) {
      const { errors, isValid } = validateItemByObject(item, key, mutatedItem.value);
      setValidationItems({
        ...validationItems,
        [key]: {
          ...validationItems[key],
          errors,
          isValid,
          pristine: item.pristine ? mutatedItem.value === item.initial : item.pristine,
        },
      });
    }
  };

  const mapItemToInputWrapper = ({ errors, isValid, pristine }, { info, success } = {}) => {
    const showError = !isValid && !pristine && errors.length > 0;
    const [errorMessage] = errors;
    const showInfo = info;
    const showSuccess = !showError && success && !pristine;

    return {
      // eslint-disable-next-line
      helperText: showError ? errorMessage : showSuccess ? success : showInfo ? info : undefined,
      // eslint-disable-next-line
      status: showError ? 'error' : showSuccess ? 'success' : showInfo ? 'info' : undefined,
    };
  };

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    validateForm(true);
  }, [_invalidItems]);

  return {
    submit: (e, handler) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const { isFormValid, formErrors } = validateForm();
      setTimeout(() => {
        handler({ isValid: isFormValid, errors: formErrors, submitted: true });
      });
    },
    register: (key, value, rules, { disabled = false, ...options } = {}) => {
      if (disabled || !init) return {};

      mutatedState[key] = {
        value,
        rules,
      };

      if (!validationItems[key]) {
        const item = {
          initial: value,
          isValid: true,
          pristine: true,
          errors: [],
        };
        const { errors, isValid } = validateItemByObject(item, key, value);

        const validatedItem = {
          ...item,
          errors,
          isValid,
        };

        setValidationItems({
          ...validationItems,
          [key]: {
            ...validatedItem,
          },
        });

        return mapItemToInputWrapper(validatedItem, options);
      }

      const item = validationItems[key];
      return mapItemToInputWrapper(item, options);
    },
    remove: (key, { startsWith = false } = {}) => {    
      if (startsWith) {
        Object.keys(validationItems).forEach(vKey => {
          if (vKey.startsWith(key)) {
            delete validationItems[vKey];
          }
        });

        setValidationItems({ ...validationItems });
      } else if (validationItems[key]) {
        delete validationItems[key];        
        setValidationItems({ ...validationItems });
      }
    },
    validate: key => {
      validateItemByKey(key);
    },
    removeAll: () => {
      setValidationItems({});
    },
    isValid,
    errors,
    submitted,
  };
};

export default useValidation;
