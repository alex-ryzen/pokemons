import { useState, useCallback, useEffect, useRef } from 'react';

export function useModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const open = useCallback(() => 
        setIsOpen(true), []
    );
    const close = useCallback(() => 
        setIsOpen(false), []
    );

    useEffect(() => {
        const overlay = overlayRef.current;
        const handler = () => close();
        const keyDown = (e: KeyboardEvent) => (e.key === "Escape" && isOpen ? close() : null);
        
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", keyDown);
        } else {
            document.body.style.overflow = "";
            overlay?.addEventListener("transitionend", handler);
        }
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", keyDown);
            overlay?.removeEventListener("transitionend", handler);
        };
    }, [isOpen, open, close]);

    return { isOpen, open, close, overlayRef};
};
