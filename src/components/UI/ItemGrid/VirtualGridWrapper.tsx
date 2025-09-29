import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, RefObject } from "react";
import { CELL_SIZE, GRID_GAP, GRID_HEIGHT } from "../../../store/consts";

//export type G = ReturnType<typeof GRID_GAP>

export type ScrollOffset = { top: number; left: number }

export type VGParentRefType = {
    getScroll: () => ScrollOffset;
    container: HTMLDivElement | null;
} | null;

export interface VirtualGridWrapperProps {
    gridWidth: number;
    gridHeight: number;
    gridGap: number;
    cellSize: number;
    viewportWidth: number;
    viewportHeight: number;
    parentRef: RefObject<VGParentRefType>;
    children: (args: {
        visibleCells: Array<{ x: number; y: number }>;
    }) => React.ReactNode;
}

// forwardRef is deprecated from React 19, so passing parent ref right in props
const VirtualGridWrapper: React.FC<VirtualGridWrapperProps> = ({
    parentRef,
    children,
    gridWidth,
    gridHeight,
    cellSize,
    viewportWidth,
    viewportHeight,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = useState<ScrollOffset>({ top: 0, left: 0 });

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                //console.log(`scrolled_ top cell: ${containerRef.current.scrollTop / (CELL_SIZE + GRID_GAP)} left: ${containerRef.current.scrollLeft / (CELL_SIZE + GRID_GAP)}`)
                //console.log(`scrolled top: ${containerRef.current.scrollTop} left: ${containerRef.current.scrollLeft}`)
                setScroll({
                    top: containerRef.current.scrollTop,
                    left: containerRef.current.scrollLeft,
                });
            }
        };
        const el = containerRef.current;
        el?.addEventListener("scroll", handleScroll);
        return () => el?.removeEventListener("scroll", handleScroll);
    }, []);

    useImperativeHandle(parentRef, () => ({
        getScroll: () => scroll,
        container: containerRef.current,
    }), [scroll]);

    const startRow = Math.floor(scroll.top / cellSize);
    const endRow = Math.min(
        gridHeight - 1,
        Math.ceil((scroll.top + viewportHeight) / cellSize)
    );
    const startCol = Math.floor(scroll.left / cellSize);
    const endCol = Math.min(
        gridWidth - 1,
        Math.ceil((scroll.left + viewportWidth) / cellSize)
    );

    const numRows = endRow - startRow + 1;
    const numCols = endCol - startCol + 1;

    const visibleCells = Array.from(
        { length: numRows * numCols },
        (_, idx) => ({
            x: startCol + (idx % numCols),
            y: startRow + Math.floor(idx / numCols),
        })
    );

    return (
        <div
            ref={containerRef}
            style={{
                width: viewportWidth,
                height: viewportHeight,
                overflowY: "auto",
                position: "relative",
                border: "none", //"1px solid #bbb"
            }}
        >
            <div
                style={{
                    width: gridWidth * cellSize - GRID_GAP,
                    height: gridHeight * cellSize - GRID_GAP,
                    position: "relative",
                }}
            >
                {children({ visibleCells })}
            </div>
        </div>
    );
};

export default VirtualGridWrapper;
