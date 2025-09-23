import { useDraggable } from "@dnd-kit/core";
import { CSSProperties, memo, useEffect, useState } from "react";
import { GRID_GAP, CELL_SIZE } from "../../../store/consts";
import { Item } from "../../../types/app";
import styles from './gridItem.module.css'

export interface GridItemProps extends Item {
  isDragging: boolean;
  posStyles?: CSSProperties | null;
}

const GridItem: React.FC<GridItemProps> = memo((item) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  // const [pressed, setPressed] = useState<boolean>(false);
  return (
    <div
      ref={setNodeRef}
      // onPointerDown={() => {setPressed(true); console.log("PRESSED ONPOINTERDOWN")}}
      {...attributes}
      {...listeners}
      className={`${styles.gridItem} ${item.isDragging ? styles.gridItemDragging : ''}`}
      style={{
        ...item.posStyles,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: item.isDragging ? "grabbing" : "grab", //|| pressed
      }}
    >
      <img 
        src={item.img} 
        alt={item.id}
        className={styles.gridItemImg}></img>
    </div>
  );
});
 
export default GridItem;