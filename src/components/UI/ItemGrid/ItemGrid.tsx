import React, { CSSProperties, useEffect, useRef, useState } from "react";
import {
    GRID_HEIGHT,
    GRID_WIDTH,
    GRID_GAP,
    CELL_SIZE,
    GENERAL_PADDING,
} from "../../../store/consts";
import { type Item, type DropArea } from "../../../types/app";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverlay,
    DragStartEvent,
    useDndMonitor,
} from "@dnd-kit/core";
import GridCell, { GridCellProps } from "./GridCell";
import GridItem from "./GridItem";
import { ItemGridFuncs as IGF } from "../../../utils/itemGrid";
import styles from "./itemGrid.module.css";
import VirtualGridWrapper, { ScrollOffset, VGParentRefType } from "./VirtualGridWrapper";
import { createPortal } from "react-dom";
import { getRandomInt } from "../../../utils/random";

export interface ItemGridProps {
    prefix: string;
    initItems: Item[] | null;
}

const ItemGrid: React.FC<ItemGridProps> = (props) => {
    const [items, setItems] = useState<Item[]>(props.initItems ?? Array<Item>);
    const [dropArea, setDropArea] = useState<DropArea | null>(null);
    const draggedItem = useRef<Item | null>(null); //UniqueIdentifier || string
    const parentRef = useRef<VGParentRefType>(null);
    
    const dropAnimationDuration = 200; //ms
    //const [scrollOffsets, setScrollOffsets] = useState<ScrollOffset>({ top: 0, left: 0 })
    // useEffect(() => {
    //     console.log(JSON.stringify(dropArea));
    // }, [dropArea]);

    useDndMonitor({
        onDragMove: handleDragMove,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        //autoScroll: {layoutShiftCompensation: false},
    })

    function handleDragStart(e: DragStartEvent) {
        const id = e.active.id;
        draggedItem.current = items.find((i) => i.id === id) || null;
    }

    function handleDragEnd(e: DragEndEvent) {
        if (!draggedItem.current) {return;}
        const targetX = draggedItem.current.targetX || 0;
        const targetY = draggedItem.current.targetY || 0;

        if (IGF.canPlace(items, draggedItem.current)) {
            setItems(
                items.map((i) =>
                    i.id === draggedItem.current?.id ? { ...i, x: targetX, y: targetY } : i
                )
            );
        }
        //const {top: scrollOffsetTop, left: scrollOffsetLeft} = parentRef.current?.getScroll() ?? { top: 0, left: 0 };
        //setScrollOffsets({top: scrollOffsetTop, left: scrollOffsetLeft})
        setDropArea(null)
        draggedItem.current = null
    }

    function handleDragMove(e: DragMoveEvent) {
        const currentDraggedItem = draggedItem.current;
        //const {top: scrollOffsetTop, left: scrollOffsetLeft} = parentRef.current?.getScroll() ?? { top: 0, left: 0 };
        //console.log( "old scrolls: ", JSON.stringify(scrollOffsets),"\new scrolls: ", scrollOffsetLeft, scrollOffsetTop)
        if (currentDraggedItem) {
            const posX =
                (CELL_SIZE + GRID_GAP) * currentDraggedItem.x +
                (e.delta?.x ?? 0); /** - (scrollOffsetLeft - (scrollOffsets?.left ?? 0)) */
            const posY =
                (CELL_SIZE + GRID_GAP) * currentDraggedItem.y +
                (e.delta?.y ?? 0); /** - (scrollOffsetTop - (scrollOffsets?.top ?? 0)) */
            const targetCX = Math.round(posX / (CELL_SIZE + GRID_GAP));
            const targetCY = Math.round(posY / (CELL_SIZE + GRID_GAP));

            const newDropArea = IGF.getDropArea({
                ...currentDraggedItem,
                targetX: targetCX,
                targetY: targetCY,
            });
            if (
                newDropArea &&
                (!dropArea ||
                    dropArea.startPos.x !== newDropArea.startPos.x ||
                    dropArea.startPos.y !== newDropArea.startPos.y ||
                    dropArea.endPos.x !== newDropArea.endPos.x ||
                    dropArea.endPos.y !== newDropArea.endPos.y)
            ) {
                setDropArea(newDropArea);
            }
            currentDraggedItem.targetX = targetCX;
            currentDraggedItem.targetY = targetCY;
        }
    }
    const getGridCellData = (
        id: string,
        x: number,
        y: number
    ): GridCellProps => {
        const item = draggedItem.current;
        return {
            id,
            isDroppable: IGF.isDroppable(items, item, dropArea, x, y),
            isCovered: IGF.checkOver(dropArea, x, y),
        };
    };

    const gridItemPosStyles = (item: Item | null): CSSProperties | null => {
        if (item) {
            return {
                position: "absolute",
                left: item.x * (CELL_SIZE + GRID_GAP),
                top: item.y * (CELL_SIZE + GRID_GAP),
                width: item.width * (CELL_SIZE + GRID_GAP) - GRID_GAP ,
                height: item.height * (CELL_SIZE + GRID_GAP) - GRID_GAP,
                background: item.color,
                opacity: 1,
            }
        } else {
            return {}
        }
    } 

    return (

            <div className={styles.itemGridContainer}>
                <VirtualGridWrapper
                    parentRef={parentRef}
                    gridWidth={GRID_WIDTH}
                    gridHeight={GRID_HEIGHT}
                    gridGap={GRID_GAP}
                    cellSize={CELL_SIZE + GRID_GAP}
                    viewportWidth={320 - GENERAL_PADDING}
                    viewportHeight={400}
                >
                    {({ visibleCells }) => (
                        <>
                            {visibleCells.map(({ x, y }) => {
                                const id = `${props.prefix}${x}-${y}`;
                                const gcdata = getGridCellData(id, x, y);
                                return (
                                    <GridCell
                                        key={id}
                                        id={id}
                                        isDroppable={gcdata.isDroppable}
                                        isCovered={gcdata.isCovered}
                                        style={{
                                            position: "absolute",
                                            left: x * (CELL_SIZE + GRID_GAP),
                                            top: y * (CELL_SIZE + GRID_GAP),
                                        }}
                                    />
                                );
                            })}
                            {items.map((item) => 
                                item.id !== draggedItem.current?.id && (
                                    <GridItem
                                        key={item.id}
                                        isDragging={false}
                                        posStyles={gridItemPosStyles(item)}
                                        {...item}
                                    />
                                )
                            )};
                        </>
                    )}
                </VirtualGridWrapper>
                {createPortal(
                    <DragOverlay 
                        dropAnimation={{duration: dropAnimationDuration}}
                        style={{willChange: "transform"}}
                    >
                        {draggedItem.current && 
                            <GridItem
                                isDragging={true}
                                {...(items.find((i) => i.id === draggedItem.current?.id) ?? items[0])}
                            />
                        }
                    </DragOverlay>
                , document.body)}
            </div>
    );
};


export default ItemGrid;