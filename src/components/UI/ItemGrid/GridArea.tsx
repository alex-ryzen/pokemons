import React, { RefObject, useEffect, useRef } from "react";
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
} from "../../../consts";
import { shallowEqual } from "react-redux";
import { DropArea, IGridItem } from "../../../types/app";

interface GridAreaProps {
    id: string;
    data: any;
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
    grid_cell_w: number;
    grid_cell_h: number;
    grid_cell_view_w: number;
    grid_cell_view_h: number;
    wrapperRef?: RefObject<HTMLDivElement | null>;
    registerGridRef: (node: GridWindowHandle | null) => void;
}

export const GridArea: React.FC<GridAreaProps> = ({
    id,
    data,
    activeItem,
    dropArea,
    grid_cell_w,
    grid_cell_h,
    grid_cell_view_w,
    grid_cell_view_h,
    wrapperRef,
    registerGridRef,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { type: "grid", accepts: data?.accepts },
    });

    const items = useAppSelector(
        (state) => state.inventory.items.filter((i) => i.gridId === id),
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
            gridWidth={grid_cell_w}
            gridHeight={grid_cell_h}
            cellSize={CELL_SIZE}
            gridGap={GRID_GAP}
            viewportWidth={grid_cell_view_w * (CELL_SIZE + GRID_GAP)}
            viewportHeight={ grid_cell_view_h * (CELL_SIZE + GRID_GAP) }
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
                            <GridItem img={item.image}/>
                        </Draggable>
                    ))}
                </>
            )}
        </GridWindow>
    );
};
