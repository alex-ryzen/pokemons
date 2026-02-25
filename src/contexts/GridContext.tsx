import {
    createContext,
    useRef,
    useState,
    useCallback,
    FC,
    ReactNode,
    useMemo,
} from "react";
import {
    UniqueIdentifier,
    DragStartEvent,
    DragMoveEvent,
    DragEndEvent,
} from "@dnd-kit/core";

import { ItemGridFuncs as IGF } from "../utils/handlers";
import { DropArea, GridActionsType, GridSpecs, GridStateType, GridWindowHandle, IDTYPE, IGridItem } from "../types/app";
import { useAppDispatch } from "../hooks";
import { CELL_SIZE, DEBOUNCE_INTERVAL, GRID_GAP, GRIDNAMES, SCROLL_MARGIN, SCROLL_SPEED } from "../consts";
import { inventoryApi, useUpdatePositionsMutation } from "../services/inventory-service";
import { RootState, store } from "../store/store";
import { gardenApi } from "../services/garden-service";

export const GridActionsCTX = createContext<GridActionsType | null>(null);
export const GridStateCTX = createContext<GridStateType | null>(null)

export const selectorRegistry = {
    [GRIDNAMES.inventory]: inventoryApi.endpoints.getInventoryItems.select(),
    [GRIDNAMES.garden]: gardenApi.endpoints.getGradenBerries.select(),
} as const;

export type GridSource = keyof typeof selectorRegistry;

export const selectAllDicts = (state: RootState) => [
    inventoryApi.endpoints.getInventoryItems.select()(state).data?.entities,
    gardenApi.endpoints.getGradenBerries.select()(state).data?.entities,
    // + extra grids
];

export const selectItemFromAnyDict = (state: RootState, id: IDTYPE): IGridItem | undefined => {
    const dictionaries = selectAllDicts(state);
    for (const dict of dictionaries) { // go through the grid dicts (inv and grdn)
        if (dict && dict[id]) return dict[id];
    }
    return undefined;
};

export const GridProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [ updatePositions ] = useUpdatePositionsMutation();

    const activeItem = useRef<IGridItem | null>(null)
    const [ dropArea, setDropArea ] = useState<DropArea | null>(null);
    
    const gridRefs = useRef<Record<UniqueIdentifier, GridSpecs | null>>({});
    const autoScrollTimer = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    const registerGrid = useCallback(
        (id: UniqueIdentifier) => (grid: GridSpecs | null) => {
            gridRefs.current[id] = grid;
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
            const state = store.getState();
            const itemId = e.active.id;
            const found = selectItemFromAnyDict(state, itemId)
            if (found) {
                activeItem.current = {
                    ...found,
                    cTargetX: found.cPosX,
                    cTargetY: found.cPosY,
                }
                setDropArea(IGF.getDropArea(activeItem.current));
            }
        },
        [store]
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
            const handle = gridRefs.current[gridId]?.handle;
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
            const state = store.getState();
            const finalItem = activeItem.current;
            activeItem.current = null;
            setDropArea(null);
            if (finalItem) {
                const targetGridId = finalItem.gridId;
                const targetItemsDict = selectorRegistry[targetGridId as GridSource](state).data?.entities 
                const targetItems = Object.values(targetItemsDict || {})
                const targetGrid = gridRefs.current[targetGridId];
                const grid_cell_w = targetGrid?.grid.grid_cell_w || 0
                const grid_cell_h = targetGrid?.grid.grid_cell_h || 0
                const actual_size = targetGrid?.grid.actualSize || 0
                const max_h_size = Math.round(actual_size / grid_cell_w)
                
                if (targetGrid && !(finalItem.gridId == GRIDNAMES.garden && targetGrid.grid.id == GRIDNAMES.garden)) { // cant move in the garden
                    if (IGF.canPlace(targetItems, finalItem, grid_cell_w, grid_cell_h, max_h_size)) { // todo: make a bitset mask
                        targetGrid.updPosStack.set(active.id, {
                            id: active.id,
                            gridId: targetGridId,
                            cPosX: finalItem.cTargetX!,
                            cPosY: finalItem.cTargetY!,
                        })
                    }
                    timerRef.current = setTimeout(() => {
                        const batch = Array.from(targetGrid.updPosStack).map(([_id, position]) => (position));
                        updatePositions(batch);
                        targetGrid.updPosStack.clear();
                    }, DEBOUNCE_INTERVAL);
                }
            }
        },
        [store, activeItem, dispatch]
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

    //useEffect(() => console.log("ACTIVE ITEM HAS CHANGED: ", activeItem.current), [activeItem.current])

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
