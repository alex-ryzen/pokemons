import React, { useEffect, useRef, useState } from "react";
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
} from "@dnd-kit/core";

// function handleRoute(route: RouteLayoutProps) {
//   const preparedLayoutContent = Object.fromEntries(
//     Object.entries(route.layoutContent ?? {}).map(([key, Comp]) => [
//       key,
//       Comp ? React.createElement(Comp) : undefined
//     ])
//   );
//   return (
//     <Route key={route.path} element={<route.layout {...preparedLayoutContent} />}>
//       <Route path={route.path} element={React.createElement(route.component)} />
//     </Route>
//   );
// }

{/* <Routes>
  {publicRoutes.map((route) => handleRoute(route))}
  {isAuth && privateRoutes.map((privateRoute) => handleRoute(privateRoute))}
</Routes> */}

const GRID_WIDTH = 5; // cells
const GRID_HEIGHT = 3; // cells
const CELL_SIZE = 48; // px
const GRID_GAP = 12; // px

type Item = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX?: number;
  targetY?: number;
  color: string;
};

const initialItems: Item[] = [
  { id: "item1", x: 0, y: 0, width: 2, height: 2, color: "#81ecec" },
  { id: "item2", x: 3, y: 1, width: 1, height: 1, color: "#fab1a0" },
  { id: "item3", x: 3, y: 2, width: 2, height: 1, color: "#b2bec3" }
];

type DropArea = {
  startPos: {x: number, y: number},
  endPos: {x: number, y: number}
}  

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [dropArea, setDropArea] = useState<DropArea | null>(null);
  const draggedItem = useRef<Item | null>(null) //UniqueIdentifier || string
  
  function rectanglesIntersect(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ): boolean {
    return !( // - without ! -> positive case tha means absence of intersection
      x2 >= x1 + w1 ||
      x2 + w2 <= x1 ||
      y2 >= y1 + h1 ||
      y2 + h2 <= y1
    );
  }
  
  function canPlace(item: Item, x: number, y: number): boolean {
    if (
      x < 0 ||
      y < 0 ||
      x + item.width > GRID_WIDTH ||
      y + item.height > GRID_HEIGHT
    ) return false;
    return !items.some((other) => {
      if (other.id === item.id) return false;
      return rectanglesIntersect(
        x, y, item.width, item.height,
        other.x, other.y, other.width, other.height
      );
    });
  }

  function getDropArea(draggedItemObj: Item | null): DropArea | null {
    if (!draggedItemObj 
      || (!draggedItemObj.targetX && draggedItemObj.targetX !== 0)
      || (!draggedItemObj.targetY && draggedItemObj.targetY !== 0)) {return null};
    return {
      startPos: {
        x: draggedItemObj.targetX,
        y: draggedItemObj.targetY
      }, 
      endPos: {
        x: draggedItemObj.targetX + draggedItemObj.width - 1, 
        y: draggedItemObj.targetY + draggedItemObj.height - 1
      }
    }
  };

  function checkOver(dropArea: DropArea | null, x: number, y: number): boolean {
    // const [x, y] = id.split("-").map(Number);
    if (!dropArea) return false;
    return (
      x >= dropArea.startPos.x && y >= dropArea.startPos.y &&
      x <= dropArea.endPos.x && y <= dropArea.endPos.y
    )
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id;
    draggedItem.current = items.find(i => i.id === id) || null;
    document.body.style.cursor = 'grabbing';
  }

  function handleDragEnd(event: DragEndEvent) {
    const item = draggedItem.current
    if (!item) { return;}
    const targetX = draggedItem.current?.targetX || 0
    const targetY = draggedItem.current?.targetY || 0

    if (canPlace(item, targetX, targetY)) {
      setItems(items.map((i) =>
        i.id === item.id ? { ...i, x: targetX, y: targetY } : i
      ));
    }
    setDropArea(null);
    draggedItem.current = null;
    document.body.style.cursor = '';
  }

  function handleDragMove(e: DragMoveEvent) {
    const currentDraggedItem = draggedItem.current;
    if (currentDraggedItem) {
      const posX = (CELL_SIZE + GRID_GAP) * currentDraggedItem.x + (e.delta?.x ?? 0)
      const posY = (CELL_SIZE + GRID_GAP) * currentDraggedItem.y + (e.delta?.y ?? 0)
      const targetCX = Math.round(posX / (CELL_SIZE + GRID_GAP))
      const targetCY = Math.round(posY / (CELL_SIZE + GRID_GAP))
      //console.log(`posX: ${posX}, posY: ${posY}, ${JSON.stringify(dragOffset)}, current: ${JSON.stringify("g")}`)
      //console.log(`newCX: ${targetCX}, newCY: ${targetCY}`)
      currentDraggedItem.targetX = targetCX
      currentDraggedItem.targetY = targetCY
      setDropArea(getDropArea(currentDraggedItem));
    }
  }

  return (
    <DndContext
      onDragMove={handleDragMove}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      //onDragOver={(e) => setOverCell(e.over?.id?.toString() ?? null)}
      //onDragOver={handleDragOver}
    >
      <div style={{ display: "inline-block", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
            gap: `${GRID_GAP}px`,
          }}
        >
          {[...Array(GRID_WIDTH * GRID_HEIGHT)].map((_, idx) => {
            const x = idx % GRID_WIDTH;
            const y = Math.floor(idx / GRID_WIDTH);
            const id = `${x}-${y}`;
            const dragItem = draggedItem.current; // draggedId ? items.find(i => i.id === draggedId) : undefined;
            //const dropArea = getDropArea(); // ?? {startPos: {x: 0, y: 0}, endPos: {x: GRID_SIZE, y: GRID_SIZE}}
            const isCovered = checkOver(dropArea, x, y);
            const isDroppable = dragItem ? canPlace(dragItem, dropArea?.startPos.x!, dropArea?.startPos.y!) : false;
            return (
              <DroppableCell
                key={idx}
                id={id}
                isDroppable={isDroppable}
                isCovered={isCovered} // dropArea.includes(`${x}-${y}`)
              />
            );
          })}
        </div>
        {items.map(item => { 
          return (
          <DraggableItem
            key={item.id}
            item={item}
            isDragging={draggedItem.current?.id === item.id}
          />
        )})}
      </div>
    </DndContext>
  );
};

interface DroppableCellProps {
  id: string;
  isDroppable: boolean;
  isCovered?: boolean;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ id, isDroppable, isCovered }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        //border: "1px solid #dfe6e9",
        background: isCovered ? isDroppable ? "#d7fcffff" : "#fab1a0" : "#efefef",
        boxSizing: "border-box",
        borderRadius: "4px",
      }}
    >
      <span style={{
        fontSize: "12px",
        color: "#cecece",
        textAlign: "center"
      }}>{id}</span>
    </div>
  );
};

interface DraggableItemProps {
  item: Item;
  isDragging: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        position: "absolute",
        left: item.x * (CELL_SIZE + GRID_GAP),
        top: item.y * (CELL_SIZE + GRID_GAP),
        width: item.width * (CELL_SIZE + GRID_GAP) - GRID_GAP ,
        height: item.height * (CELL_SIZE + GRID_GAP) - GRID_GAP,
        zIndex: isDragging ? 2 : 1,
        background: item.color,
        opacity: isDragging ? 0.7 : 1,
        borderRadius: "4px",
        boxShadow: isDragging ? "0 2px 12px #636e72" : "0 1px 6px #b2bec3",
        transition: "box-shadow 0.3s, opacity 0.2s", //transform 0.25s cubic-bezier(.5,.01,0,1)
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "#333"
      }}
    >
      {item.id}
    </div>
  );
};

export default App;

// import React from "react";
// import { Route, Routes } from "react-router";
// import { useAppSelector } from "./hooks";
// import { privateRoutes, publicRoutes, RouteLayoutProps } from "./router";
// import './App.css'

// function handleRoute(route: RouteLayoutProps) {
//     const preparedLayoutContent = Object.fromEntries(
//       Object.entries(route.layoutContent ?? {}).map(([key, Comp]) => [
//         key,
//         Comp ? React.createElement(Comp) : undefined
//       ])
//     );
//     return (
//       <Route key={route.path} element={<route.layout {...preparedLayoutContent}/>}>  
//         <Route path={route.path} element={React.createElement(route.component)}/>
//       </Route>
//     );
// }

// function App() {
//     const isAuth = useAppSelector((state) => state.user);
//     return (
//         <Routes>
//             {publicRoutes.map((route) => handleRoute(route))}
//             {isAuth && privateRoutes.map((privateRoute) => handleRoute(privateRoute))}
//         </Routes>
//     );
// }

// export default App;


/**
 * VERSION 2
 */

// import React, { CSSProperties, useEffect, useRef, useState } from "react";
// import {
//     GRID_HEIGHT,
//     GRID_WIDTH,
//     GRID_GAP,
//     CELL_SIZE,
//     GENERAL_PADDING,
// } from "../../../store/consts";
// import { type Item, type DropArea } from "../../../types/app";
// import {
//     DndContext,
//     DragEndEvent,
//     DragMoveEvent,
//     DragOverlay,
//     DragStartEvent,
// } from "@dnd-kit/core";
// import GridCell, { GridCellProps } from "./GridCell";
// import GridItem from "./GridItem";
// import { ItemGridFuncs as IGF } from "../../../utils/itemGrid";
// import styles from "./itemGrid.module.css";
// import VirtualGridWrapper, { ScrollOffset, VGParentRefType } from "./VirtualGridWrapper";

// const initialItems: Item[] = [
//     {
//         id: "item1",
//         x: 3,
//         y: 1,
//         width: 2,
//         height: 2,
//         img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
//     },
//     {
//         id: "item2",
//         x: 2,
//         y: 1,
//         width: 1,
//         height: 1,
//         img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
//     },
//     {
//         id: "item3",
//         x: 0,
//         y: 0,
//         width: 1,
//         height: 1,
//         img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
//     },
// ];


// const ItemGrid: React.FC = () => {
//     const [items, setItems] = useState<Item[]>(initialItems);
//     const [dropArea, setDropArea] = useState<DropArea | null>(null);
//     const draggedItem = useRef<Item | null>(null); //UniqueIdentifier || string
//     const parentRef = useRef<VGParentRefType>(null);
    
//     const dropAnimationDuration = 200; //ms
//     const [scrollOffsets, setScrollOffsets] = useState<ScrollOffset>({ top: 0, left: 0 })
//     useEffect(() => {
//         console.log(JSON.stringify(dropArea));
//     }, [dropArea]);

//     function handleDragStart(e: DragStartEvent) {
//         const id = e.active.id;
//         draggedItem.current = items.find((i) => i.id === id) || null;
//     }

//     function handleDragEnd(e: DragEndEvent) {
//         const item = draggedItem.current;
//         if (!item) {
//             return;
//         }

//         const targetX = draggedItem.current?.targetX || 0;
//         const targetY = draggedItem.current?.targetY || 0;

//         if (IGF.canPlace(items, item)) {
//             setItems(
//                 items.map((i) =>
//                     i.id === item.id ? { ...i, x: targetX, y: targetY } : i
//                 )
//             );
//         }
//         const {top: scrollOffsetTop, left: scrollOffsetLeft} = parentRef.current?.getScroll() ?? { top: 0, left: 0 };
//         setScrollOffsets({top: scrollOffsetTop, left: scrollOffsetLeft})
//         setDropArea(null)
//         draggedItem.current = null
//     }

//     function handleDragMove(e: DragMoveEvent) {
//         const currentDraggedItem = draggedItem.current;
//         const {top: scrollOffsetTop, left: scrollOffsetLeft} = parentRef.current?.getScroll() ?? { top: 0, left: 0 };
//         console.log( "old scrolls: ", JSON.stringify(scrollOffsets),"\new scrolls: ", scrollOffsetLeft, scrollOffsetTop)
//         if (currentDraggedItem) {
//             const posX =
//                 (CELL_SIZE + GRID_GAP) * currentDraggedItem.x +
//                 (e.delta?.x ?? 0); /** - (scrollOffsetLeft - (scrollOffsets?.left ?? 0)) */
//             const posY =
//                 (CELL_SIZE + GRID_GAP) * currentDraggedItem.y +
//                 (e.delta?.y ?? 0); /** - (scrollOffsetTop - (scrollOffsets?.top ?? 0)) */
//             const targetCX = Math.round(posX / (CELL_SIZE + GRID_GAP));
//             const targetCY = Math.round(posY / (CELL_SIZE + GRID_GAP));

//             const newDropArea = IGF.getDropArea({
//                 ...currentDraggedItem,
//                 targetX: targetCX,
//                 targetY: targetCY,
//             });
//             if (
//                 newDropArea &&
//                 (!dropArea ||
//                     dropArea.startPos.x !== newDropArea.startPos.x ||
//                     dropArea.startPos.y !== newDropArea.startPos.y ||
//                     dropArea.endPos.x !== newDropArea.endPos.x ||
//                     dropArea.endPos.y !== newDropArea.endPos.y)
//             ) {
//                 setDropArea(newDropArea);
//             }
//             currentDraggedItem.targetX = targetCX;
//             currentDraggedItem.targetY = targetCY;
//         }
//     }
//     const getGridCellData = (
//         id: string,
//         x: number,
//         y: number
//     ): GridCellProps => {
//         const item = draggedItem.current;
//         return {
//             id,
//             isDroppable: IGF.isDroppable(items, item, dropArea, x, y),
//             isCovered: IGF.checkOver(dropArea, x, y),
//         };
//     };

//     const gridItemPosStyles = (item: Item | null): CSSProperties | null => {
//         if (item) {
//             return {
//                 position: "absolute",
//                 left: item.x * (CELL_SIZE + GRID_GAP),
//                 top: item.y * (CELL_SIZE + GRID_GAP),
//                 width: item.width * (CELL_SIZE + GRID_GAP) - GRID_GAP ,
//                 height: item.height * (CELL_SIZE + GRID_GAP) - GRID_GAP,
//                 background: item.color,
//             }
//         } else {
//             return {}
//         }
//     } 

//     return (
//         <DndContext
//             onDragMove={handleDragMove}
//             onDragStart={handleDragStart}
//             onDragEnd={handleDragEnd}
//             autoScroll={{layoutShiftCompensation: false}}
//         >
//             <div className={styles.itemGridContainer}>
//                 <VirtualGridWrapper
//                     parentRef={parentRef}
//                     gridWidth={GRID_WIDTH}
//                     gridHeight={GRID_HEIGHT}
//                     gridGap={GRID_GAP}
//                     cellSize={CELL_SIZE + GRID_GAP}
//                     viewportWidth={320 - GENERAL_PADDING}
//                     viewportHeight={400}
//                 >
//                     {({ visibleCells }) => (
//                         <>
//                             {visibleCells.map(({ x, y }) => {
//                                 const id = `${x}-${y}`;
//                                 const gcdata = getGridCellData(id, x, y);
//                                 return (
//                                     <GridCell
//                                         key={id}
//                                         id={id}
//                                         isDroppable={gcdata.isDroppable}
//                                         isCovered={gcdata.isCovered}
//                                         style={{
//                                             position: "absolute",
//                                             left: x * (CELL_SIZE + GRID_GAP),
//                                             top: y * (CELL_SIZE + GRID_GAP),
//                                         }}
//                                     />
//                                 );
//                             })}
//                             {items.map((item) => 
//                                 item.id !== draggedItem.current?.id && (
//                                     <GridItem
//                                         key={item.id}
//                                         isDragging={false}
//                                         posStyles={gridItemPosStyles(item)}
//                                         {...item}
//                                     />
//                                 )
//                             )};
//                         </>
//                     )}
//                 </VirtualGridWrapper>
//                 <DragOverlay 
//                     dropAnimation={{duration: dropAnimationDuration}}
//                     style={{willChange: "transform"}}
//                 >
//                     {draggedItem.current && 
//                         <GridItem
//                             isDragging={true}
//                             {...(items.find((i) => i.id === draggedItem.current?.id) ?? items[0])}
//                         />
//                     }
//                 </DragOverlay>
                
//             </div>
//         </DndContext>
//     );
// };


// export default ItemGrid;


// interface ItemGridCellsProps {
//     getGridCellProps: (id: string, x: number, y: number) => GridCellProps;
// }

// const ItemGridCells = memo(
//     ({ getGridCellProps }: ItemGridCellsProps) => {
//         console.log("RERENDERED OF ALL GRID")

//     }
// );

// {/* <div
//                     className={styles.itemGrid}
//                     style={{
//                         gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
//                         gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
//                         gap: `${GRID_GAP}px`,
//                     }}
//                 >
//                     {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map(
//                         (_, idx) => {
//                             const x = idx % GRID_WIDTH;
//                             const y = Math.floor(idx / GRID_WIDTH);
//                             const id = `${x}-${y}`;
//                             const gcdata = getGridCellData(id, x, y);
//                             return (
//                                 <GridCell
//                                     key={id}
//                                     id={id}
//                                     isDroppable={gcdata.isDroppable}
//                                     isCovered={gcdata.isCovered}
//                                 />
//                             );
//                         }
//                     )}
//                 </div> */}