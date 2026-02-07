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
import Button from "../Button/Button";
import Balance from "../Balance/Balance";

interface GridAreaProps {
    id: string;
    data: any;
    actualSize: number;
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
    grid_cell_w: number;
    // grid_cell_w_aclual: number;
    grid_cell_h: number;
    // grid_cell_h_aclual: number;
    grid_cell_view_w: number;
    grid_cell_view_h: number;
    wrapperRef?: RefObject<HTMLDivElement | null>;
    extentionPrice?: number | string;
    registerGridRef: (node: GridSpecs | null) => void;
}

export interface GridSpecs {
    grid: Omit<GridAreaProps, "activeItem" | "dropArea" | "wrapperRef" | "registerGridRef">,
    handle: GridWindowHandle | null,
}

export const GridArea: React.FC<GridAreaProps> = ({
    id,
    data,
    actualSize,
    activeItem,
    dropArea,
    grid_cell_w,
    // grid_cell_w_aclual,
    grid_cell_h,
    // grid_cell_h_aclual,
    grid_cell_view_w,
    grid_cell_view_h,
    wrapperRef,
    extentionPrice,
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
        registerGridRef({
            grid: {
                id,
                data,
                actualSize,
                grid_cell_w,
                // grid_cell_w_aclual,
                grid_cell_h,
                // grid_cell_h_aclual,
                grid_cell_view_w,
                grid_cell_view_h,
                extentionPrice,
            }, 
            handle: node
        });
        if (node?.container) {
            setNodeRef(node.container);
        }
    };

    const gridClass = isOver ? "grid-active-blink" : ""; //styles.gridActiveBlink 

    const handleExtBtnClick = () => {
        console.log("EXTENSION BTN WAS CLICKED! ID: ", id)
    }

    return (
        <GridWindow
            ref={setRefs}
            gridWidth={grid_cell_w}
            gridHeight={grid_cell_h}
            cellSize={CELL_SIZE}
            gridGap={GRID_GAP}
            viewportWidth={ grid_cell_view_w * (CELL_SIZE + GRID_GAP) }
            viewportHeight={ grid_cell_view_h * (CELL_SIZE + GRID_GAP) - 8}
            className={gridClass}
        >
            {({ cells }) => (
                <>
                    {cells.map(({ x, y }) => {
                        const isTargetGrid = activeItem?.gridId === id;
                        const isCovered = isTargetGrid && isOver && IGF.isCovered(dropArea, x, y);
                        const max_available_c_h = Math.round(actualSize / grid_cell_w);
                        const isValid = IGF.isDroppable(items, activeItem, dropArea, x, y, grid_cell_w, grid_cell_h, max_available_c_h);
                        const isAvailable = (y < max_available_c_h);
                        return (
                            <GridCell
                                key={`${id}-${x}-${y}`}
                                id={id}
                                x={x}
                                y={y}
                                isCovered={isCovered}
                                isValid={isValid}
                                isAvailable={isAvailable}
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
                    {
                        extentionPrice && 
                        <Button
                            onClick={handleExtBtnClick}
                            style={{
                                background: "transparent",
                                position: "absolute",
                                left: 0,
                                top: Math.round(actualSize / grid_cell_w) * (CELL_SIZE + GRID_GAP),
                                width:
                                    grid_cell_w * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                                height:
                                    1 * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                                borderRadius: 4,
                                border: "3px solid var(--secondary-color)"
                            }}
                        >
                            <Balance amount={extentionPrice}></Balance>
                        </Button>
                    }
                </>
            )}
        </GridWindow>
    );
};
