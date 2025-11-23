import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(onOutside: () => void) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (el && !el.contains(e.target as Node)) onOutside();
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [onOutside]);

    return ref;
}
