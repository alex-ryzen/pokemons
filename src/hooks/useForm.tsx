import { useCallback, useMemo } from "react";
import { useInput, UseInputOptions, UseInputReturn } from "./useInput";

export const useForm = <T extends Record<string, UseInputOptions>>( fieldsConfig: T ) => {
    type FieldNames = keyof T;

    const fields = {} as Record<FieldNames, UseInputReturn>;

    for (const fieldName in fieldsConfig) {
        fields[fieldName] = useInput(fieldsConfig[fieldName]);
    }

    const isValid = useMemo(() => {
        return Object.values(fields).every(field => field.isValid);
    }, [fields]);

    const values = useMemo(() => {
        const result: Record<FieldNames, string> = {} as Record<FieldNames, string>;
        for (const fieldName in fields) {
            result[fieldName] = fields[fieldName].value;
        }
        return result;
    }, [fields]);

    const errors = useMemo(() => {
        const result: Record<FieldNames, string | null> = {} as Record<FieldNames, string | null>;
        for (const fieldName in fields) {
            result[fieldName] = fields[fieldName].error;
        }
        return result;
    }, [fields]);

    const resetAll = useCallback(() => {
        Object.values(fields).forEach(field => field.reset());
    }, [fields]);

    const validateAll = useCallback(() => {
        Object.values(fields).forEach(field => {
            field.onBlur();
        });
        return isValid;
    }, [fields, isValid]);

    return {
        fields,
        values,
        errors,
        isValid,
        resetAll,
        validateAll,
    };
};