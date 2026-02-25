import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { Namespace } from './consts'
import { authProcess } from './store/auth-process/auth-process'
import { initAuth } from './mocks/data'

export const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            [Namespace.Auth]: authProcess.reducer,
        },
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }),
    });
};

export function renderWithProvider(
    ui: React.ReactElement,
    {
        preloadedState = {
            auth: initAuth,
        },
        store = createTestStore(preloadedState),
        ...renderOptions
    }: {
        preloadedState?: any;
        store?: ReturnType<typeof configureStore>;
    } & RenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren) {
        return (
            <Provider store={store}>
                {children}
            </Provider>
        );
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';