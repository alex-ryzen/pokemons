import { ComponentType, FC, ReactNode } from "react";

export interface ProviderProps<T> {
    children: ReactNode;
    value?: T
}

interface ProviderConfig<T = unknown> {
    provider: ComponentType<ProviderProps<T>>;
    value?: T;
}
const CTXProviderComposer = <T extends unknown>(providers: ProviderConfig<T>[]) => {
    return ({children}: {children: ReactNode}) => {
        return providers.reduceRight((acc, {provider: Provider, value}) => {
            if (value !== undefined) {
                return <Provider value={value}>{acc}</Provider>
            } else {
                return <Provider>{acc}</Provider>
            }
        }, children);
    }
}

export default CTXProviderComposer;