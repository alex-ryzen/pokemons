import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    FC,
    ReactNode,
    useEffect,
    useMemo,
} from "react";
import {
    UniqueIdentifier,
    DragStartEvent,
    DragMoveEvent,
    DragEndEvent,
} from "@dnd-kit/core";

import { ItemGridFuncs as IGF } from "../utils/handlers";
import { GridWindowHandle } from "../components/UI/ItemGrid/GridWindow";
import { DropArea, IGridItem } from "../types/app";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CELL_SIZE, GRID_GAP, SCROLL_MARGIN, SCROLL_SPEED } from "../consts";
import { setPosition } from "../store/item-process/inventorySlice";

interface GridActionsType {
    registerGrid: (id: UniqueIdentifier) => (handle: GridWindowHandle | null) => void;
    handleDragStart: (e: DragStartEvent) => void;
    handleDragMove: (e: DragMoveEvent) => void;
    handleDragEnd: (e: DragEndEvent) => void;
    handleDragCancel: () => void;
}

interface GridStateType {
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
}

export const GridActionsCTX = createContext<GridActionsType | null>(null);
export const GridStateCTX = createContext<GridStateType | null>(null)

export const GridProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((s) => s.inventory.items);

    const activeItem = useRef<IGridItem | null>(null)
    //const [activeItem, setActiveItem] = useState<IGridItem | null>(null);
    const [dropArea, setDropArea] = useState<DropArea | null>(null);

    const gridRefs = useRef<Record<UniqueIdentifier, GridWindowHandle | null>>(
        {}
    );
    const autoScrollTimer = useRef<number | null>(null);

    useEffect(() => {
        if (activeItem.current) {
            document.body.classList.add("is-dragging");
        } else {
            document.body.classList.remove("is-dragging");
        }
    }, [activeItem]);

    const registerGrid = useCallback(
        (id: UniqueIdentifier) => (handle: GridWindowHandle | null) => {
            gridRefs.current[id] = handle;
        },
        []
    );

    const stopAutoScroll = () => {
        if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
            autoScrollTimer.current = null;
        }
    };

    const processAutoScroll = (handle: GridWindowHandle, pointerY: number) => {
        const container = handle.container;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        let speed = 0;

        if (pointerY < rect.top + SCROLL_MARGIN) speed = -SCROLL_SPEED;
        else if (pointerY > rect.bottom - SCROLL_MARGIN) speed = SCROLL_SPEED;

        if (speed !== 0) {
            if (!autoScrollTimer.current) {
                autoScrollTimer.current = window.setInterval(() => {
                    container.scrollTop += speed;
                }, 16);
            }
        } else {
            stopAutoScroll();
        }
    };

    const handleDragStart = useCallback(
        (e: DragStartEvent) => {
            const found = items.find((i) => i.id === e.active.id);
            if (found) {
                // setActiveItem({
                //     ...found,
                //     cTargetX: found.cPosX,
                //     cTargetY: found.cPosY,
                // });
                activeItem.current = {
                    ...found,
                    cTargetX: found.cPosX,
                    cTargetY: found.cPosY,
                }
            }
        },
        [items]
    );

    const handleDragMove = useCallback(
        (e: DragMoveEvent) => {
            const { active, over } = e;
            if (!activeItem.current) return;

            if (!over || over.data.current?.type !== "grid") {
                stopAutoScroll();
                setDropArea(null);
                return;
            }

            const gridId = over.id;
            const handle = gridRefs.current[gridId];
            //console.log("DRAG MOVE", gridRefs)
            const container = handle?.container;

            if (!container || !handle) return;

            const rect = container.getBoundingClientRect();

            const translated = active.rect.current.translated;
            if (!translated) return;

            const itemLeftX = translated.left;
            const itemTopY = translated.top;

            const itemCenterX = translated.left + translated.width / 2;
            const itemCenterY = translated.top + translated.height / 2;

            if (
                itemCenterX < rect.left ||
                itemCenterX > rect.right ||
                itemCenterY < rect.top ||
                itemCenterY > rect.bottom
            ) {
                stopAutoScroll();
                setDropArea(null);
                return;
            }

            processAutoScroll(handle, itemCenterY);

            const localX = itemLeftX - rect.left + container.scrollLeft;
            const localY = itemTopY - rect.top + container.scrollTop;
            const totalSize = CELL_SIZE + GRID_GAP;
            const cx = Math.round(localX / totalSize);
            const cy = Math.round(localY / totalSize);

            if (
                cx !== activeItem.current.cTargetX ||
                cy !== activeItem.current.cTargetY ||
                activeItem.current.gridId !== gridId
            ) {
                const newItemState = {
                    ...activeItem.current,
                    gridId: gridId,
                    cTargetX: cx,
                    cTargetY: cy,
                };
                //setActiveItem(newItemState);
                activeItem.current = newItemState
                setDropArea(IGF.getDropArea(activeItem.current));
            }
        },
        []
    );

    const handleDragEnd = useCallback(
        (e: DragEndEvent) => {
            stopAutoScroll();
            const { active } = e;

            const finalItem = activeItem.current;

            //setActiveItem(null);
            activeItem.current = null;
            setDropArea(null);

            if (finalItem) {
                const targetGridId = finalItem.gridId;
                const targetItems = items.filter(
                    (i) => i.gridId === targetGridId && i.id !== active.id
                );

                if (IGF.canPlace(targetItems, finalItem)) {
                    dispatch(
                        setPosition({
                            id: active.id,
                            pos: {
                                gridId: targetGridId,
                                cPosX: finalItem.cTargetX!,
                                cPosY: finalItem.cTargetY!,
                            },
                        })
                    );
                }
            }
        },
        [activeItem, items, dispatch]
    );

    const handleDragCancel = useCallback(() => {
        stopAutoScroll();
        //setActiveItem(null);
        activeItem.current = null;
        setDropArea(null);
    }, []);

    const actions = useMemo(() => ({
        registerGrid,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel
    }), [registerGrid, handleDragStart, handleDragMove, handleDragEnd, handleDragCancel]);

    const state = useMemo(() => ({
        activeItem: activeItem.current,
        dropArea
    }), [activeItem, dropArea]);
    return (
        <GridActionsCTX.Provider value={actions}>
            <GridStateCTX.Provider value={state}>
                {children}
            </GridStateCTX.Provider>
        </GridActionsCTX.Provider>
    );
};
