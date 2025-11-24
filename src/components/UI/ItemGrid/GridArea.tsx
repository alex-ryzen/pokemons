import React, { useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import GridWindow, { GridWindowHandle } from "./GridWindow";
import { Draggable } from "./Draggable";
import { GridItem } from "./GridItem";
import { GridCell } from "./GridCell";
import { useAppSelector } from "../../../hooks/index";
import { ItemGridFuncs as IGF } from "../../../utils/handlers";
import {
    CELL_SIZE,
    GRID_GAP,
    GRID_CELL_W,
    GRID_CELL_H,
    VIEWPORT_W,
    VIEWPORT_H
} from "../../../consts";
import { shallowEqual } from "react-redux";
import { DropArea, IGridItem } from "../../../types/app";
import styles from "./itemGrid.module.css"

interface GridAreaProps {
    id: string;
    data: any;
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
    registerGridRef: (node: GridWindowHandle | null) => void;
}

export const GridArea: React.FC<GridAreaProps> = ({
    id,
    data,
    activeItem,
    dropArea,
    registerGridRef,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { type: "grid", accepts: data?.accepts },
    });

    const items = useAppSelector(
        (state) => state.items.items.filter((i) => i.gridId === id),
        shallowEqual
    );


    const windowRef = useRef<GridWindowHandle | null>(null);

    const setRefs = (node: GridWindowHandle | null) => {
        windowRef.current = node;
        registerGridRef(node);
        if (node?.container) {
            setNodeRef(node.container);
        }
    };

    const gridClass = isOver ? "grid-active-blink" : ""; //styles.gridActiveBlink 

    return (
        <GridWindow
            ref={setRefs}
            gridWidth={GRID_CELL_W}
            gridHeight={GRID_CELL_H}
            cellSize={CELL_SIZE}
            gridGap={GRID_GAP}
            viewportWidth={VIEWPORT_W}
            viewportHeight={VIEWPORT_H}
            className={gridClass}
        >
            {({ cells }) => (
                <>
                    {cells.map(({ x, y }) => {
                        const isTargetGrid = activeItem?.gridId === id;
                        const isCovered = isTargetGrid && isOver && IGF.isCovered(dropArea, x, y);
                        const isValid = IGF.isDroppable(items, activeItem, dropArea, x, y);
                        return (
                            <GridCell
                                key={`${id}-${x}-${y}`}
                                id={id}
                                x={x}
                                y={y}
                                isCovered={isCovered}
                                isValid={isValid}
                            />
                        );
                    })}
                    {items.map((item) => (
                        <Draggable
                            key={item.id}
                            id={item.id}
                            data={{ gridId: id, itemId: item.id }}
                            draggableStyles={{
                                position: "absolute",
                                left: item.cPosX * (CELL_SIZE + GRID_GAP),
                                top: item.cPosY * (CELL_SIZE + GRID_GAP),
                                width:
                                    item.cSize * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                                height:
                                    item.cSize * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                            }}
                        >
                            <GridItem text={item.category} />
                        </Draggable>
                    ))}
                </>
            )}
        </GridWindow>
    );
};
