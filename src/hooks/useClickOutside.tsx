import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
    onOutside: () => void,
    isEnabled: boolean = true,
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (el && !el.contains(e.target as Node)) {
                console.log("CLICKED OUTSIDE", e)
                onOutside();
            }    
        };
        if (isEnabled) {
            document.addEventListener("mousedown", handler);
            document.addEventListener("touchstart", handler);
        }
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [onOutside, isEnabled]);

    return ref;
}
