// hooks/useInput.ts
import { useState, useCallback, useMemo, ChangeEvent } from 'react';

export interface UseInputOptions {
    defaultValue?: string;
    validate?: (value: string) => string | null;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export interface UseInputReturn {
    value: string;
    error: string | null;
    focused: boolean;
    isValid: boolean;
    onChange: (value: string, name?: string) => void;
    onBlur: () => void;
    onFocus: () => void;
    setValue: (value: string) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export function useInput (options: UseInputOptions = {}): UseInputReturn {
    const {
        defaultValue = '',
        validate,
        required = false,
        minLength,
        maxLength,
        pattern,
    } = options;

    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);

    const validateValue = useCallback((val: string): string | null => {
        if (required && !val.trim()) {
            setError('Это поле обязательно для заполнения');
        }

        if (minLength && val.length < minLength) {
            setError(`Минимальная длина: ${minLength} символов`);
        }

        if (maxLength && val.length > maxLength) {
            setError(`Максимальная длина: ${maxLength} символов`);
        }

        if (pattern && val && !pattern.test(val)) {
            setError('Неверный формат введенного значения');
        }

        if (validate) {
            return validate(val);
        }

        return null;
    }, [required, minLength, maxLength, pattern, validate]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        // Валидируем только если поле уже было touched
        if (touched) {
            const validationError = validateValue(newValue);
            setError(validationError);
        }
    }, [touched, validateValue]);

    // offFocus
    const onBlur = useCallback(() => { 
        setFocused(false);
        const validationError = validateValue(value);
        if (validationError) {
            setError(validationError);
        }
    }, [value, validateValue]);

    // onFocus
    const onFocus = useCallback(() => {
        setFocused(true)
        // focus logic
    }, []);

    const handleSetValue = useCallback((newValue: string) => {
        setValue(newValue);
        if (touched) {
            const validationError = validateValue(newValue);
            setError(validationError);
        }
    }, [touched, validateValue]);

    const handleSetError = useCallback((newError: string | null) => {
        setError(newError);
    }, []);

    const reset = useCallback(() => {
        setValue(defaultValue);
        setError(null);
        setFocused(false)
    }, [defaultValue]);

    const isValid = useMemo(() => {
        return error === null && value !== '';
    }, [error, value]);

    return {
        value,
        error,
        focused,
        isValid,
        onChange,
        onBlur,
        onFocus,
        setValue: handleSetValue,
        setError: handleSetError,
        reset,
    };
};
