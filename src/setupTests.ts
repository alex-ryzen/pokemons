import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
// import { server } from "./mocks/server";

// beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
// afterEach(() => {
//     server.resetHandlers();
//     cleanup();
// });
// afterAll(() => server.close());

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

class MockResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
}

class MockIntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds = [];
    scrollMargin = "";
    private callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
    }
    observe = jest.fn().mockImplementation((element: Element) => {
    this.callback([{
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
        }] as IntersectionObserverEntry[], this);
    });
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn().mockReturnValue([]);
}

global.ResizeObserver = MockResizeObserver as any;
global.IntersectionObserver = MockIntersectionObserver as any;
