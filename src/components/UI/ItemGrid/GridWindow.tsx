import React, {
    useRef,
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
    memo,
    CSSProperties,
} from "react";
import { GridWindowHandle, ScrollOffset } from "../../../types/app";
import styles from "./itemGrid.module.css"

interface GridWindowProps {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    gridGap: number;
    viewportWidth: number;
    viewportHeight: number;
    className?: string;
    containerStyles?: CSSProperties;
    children: (args: {
        cells: Array<{ x: number; y: number }>;
    }) => React.ReactNode;
    testid: string;
}

const GridWindow = forwardRef<GridWindowHandle, GridWindowProps>(
    (
        {
            gridWidth,
            gridHeight,
            cellSize,
            gridGap,
            viewportWidth,
            viewportHeight,
            className,
            containerStyles,
            children,
            testid
        },
        ref
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const [scroll, setScroll] = useState<ScrollOffset>({ top: 0, left: 0 });
        const [isPanning, setIsPanning] = useState(false);

        const rafId = useRef<number | null>(null);
        //const lastTime = useRef<number>(0);
        const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

        const history = useRef<Array<{ x: number; y: number; time: number }>>(
            []
        );

        const dragStart = useRef<{
            x: number;
            y: number;
            scrollLeft: number;
            scrollTop: number;
        } | null>(null);

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;
            const handleScroll = () => {
                setScroll({ top: el.scrollTop, left: el.scrollLeft });
            };
            el.addEventListener("scroll", handleScroll);
            return () => el.removeEventListener("scroll", handleScroll);
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                getScroll: () => scroll,
                container: containerRef.current,
            }),
            [scroll]
        );

        const applyInertia = () => {
            const friction = 0.96;
            const stopThreshold = 0.1;

            const step = (_time: number) => {
                if (!containerRef.current) return;

                let { x, y } = velocity.current;
                containerRef.current.scrollLeft -= x;
                containerRef.current.scrollTop -= y;
                x *= friction;
                y *= friction;
                velocity.current = { x, y };
                if (
                    Math.abs(x) > stopThreshold ||
                    Math.abs(y) > stopThreshold
                ) {
                    rafId.current = requestAnimationFrame(step);
                } else {
                    velocity.current = { x: 0, y: 0 };
                }
            };

            rafId.current = requestAnimationFrame(step);
        };

        // drag-to-scroll
        const onMouseDown = (e: React.MouseEvent) => {
            if (e.button !== 0) return;

            const target = e.target as HTMLElement;
            if (
                target.closest('[data-draggable="true"]') ||
                target.closest("button") ||
                target.closest("a")
            ) {
                return;
            }
            if (rafId.current) cancelAnimationFrame(rafId.current);
            const el = containerRef.current;
            if (!el) return;

            setIsPanning(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                scrollLeft: el.scrollLeft,
                scrollTop: el.scrollTop,
            };

            history.current = [
                { x: e.clientX, y: e.clientY, time: performance.now() },
            ];
            velocity.current = { x: 0, y: 0 };

            window.addEventListener("mousemove", onWindowMouseMove);
            window.addEventListener("mouseup", onWindowMouseUp);
        };

        const onWindowMouseMove = (e: MouseEvent) => {
            if (!dragStart.current || !containerRef.current) return;
            e.preventDefault();

            const now = performance.now();
            const x = e.clientX;
            const y = e.clientY;

            const dx = x - dragStart.current.x;
            const dy = y - dragStart.current.y;
            containerRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
            containerRef.current.scrollTop = dragStart.current.scrollTop - dy;

            history.current.push({ x, y, time: now });
            history.current = history.current.filter((p) => now - p.time < 100);
        };

        const onWindowMouseUp = () => {
            setIsPanning(false);
            dragStart.current = null;
            window.removeEventListener("mousemove", onWindowMouseMove);
            window.removeEventListener("mouseup", onWindowMouseUp);
            const now = performance.now();
            const lastPoints = history.current;

            if (lastPoints.length > 1) {
                const firstPoint = lastPoints[0];
                const lastPoint = lastPoints[lastPoints.length - 1];

                const dt = now - firstPoint.time;

                if (dt > 0 && now - lastPoint.time < 50) {
                    const vx = ((lastPoint.x - firstPoint.x) / dt) * 16;
                    const vy = ((lastPoint.y - firstPoint.y) / dt) * 16;
                    const maxV = 60;
                    velocity.current = {
                        x: Math.max(-maxV, Math.min(maxV, vx)),
                        y: Math.max(-maxV, Math.min(maxV, vy)),
                    };

                    applyInertia();
                }
            }
        };

        // virtualization
        const fullWidth = gridWidth * (cellSize + gridGap) - gridGap;
        const fullHeight = gridHeight * (cellSize + gridGap) - gridGap;
        const totalCellSize = cellSize + gridGap;

        const startRow = Math.floor(scroll.top / totalCellSize);
        const endRow = Math.min(
            gridHeight - 1,
            Math.ceil((scroll.top + viewportHeight) / totalCellSize)
        );
        const startCol = Math.floor(scroll.left / totalCellSize);
        const endCol = Math.min(
            gridWidth - 1,
            Math.ceil((scroll.left + viewportWidth) / totalCellSize)
        );

        const cells = [];
        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                cells.push({ x, y });
            }
        }

        return (
            <div
                ref={containerRef}
                data-testid={testid}
                onMouseDown={onMouseDown}
                className={`${styles.gridWindowScrollableWrapper} ${
                    isPanning ? styles.grabbingCursor : styles.grabCursor
                } ${styles[className || ""] || styles.gridWindowOverwrap}`}
                style={{
                    ...containerStyles,
                    width: viewportWidth,
                    height: viewportHeight,
                    overflowY: "auto",
                    overflowX: "hidden",
                    position: "relative",
                    background: "#fdfdfd",
                    userSelect: "none",
                    borderRadius: "4px",
                }}
            >
                <div
                    className={styles.gridWindowContentContainer}
                    style={{
                        width: fullWidth,
                        height: fullHeight,
                        position: "relative",
                    }}
                >
                    {children({ cells })}
                </div>
            </div>
        );
    }
);

export default memo(GridWindow);
