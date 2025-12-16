import { RefObject, useEffect, useRef } from "react";

export interface ObserverArgs {
    tailRef: RefObject<HTMLDivElement | null>;
    canLoad: boolean;
    isLoading: boolean;
    callback: () => void;
}

export function useObserver({ tailRef, canLoad, isLoading, callback }: ObserverArgs) {
    const observer = useRef<IntersectionObserver>(undefined);
    useEffect(() => {
        if (isLoading) return;
        if (observer.current) {
            observer.current.disconnect();
        }
        const cb = (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
            if (entries[0].isIntersecting && canLoad) {
                callback()
            }
        }
        observer.current = new IntersectionObserver(cb);
        if (tailRef.current) observer.current.observe(tailRef.current)
    }, [tailRef, canLoad, isLoading, callback])
}