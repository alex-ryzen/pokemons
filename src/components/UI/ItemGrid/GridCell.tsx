import { useDroppable } from "@dnd-kit/core";
import { CELL_SIZE } from "../../../store/consts";
import styles from './gridCell.module.css'
import { CSSProperties, memo, useEffect, useRef, useState } from "react";


export interface GridCellProps {
  id: string;
  isDroppable: boolean;
  isCovered?: boolean;
  style?: CSSProperties;
}

const GridCell: React.FC<GridCellProps> = memo(({ id, isDroppable, isCovered, style}) => {
  // const {setNodeRef} = useDroppable({id})
  // const cellData = useRef<string>(id);
  // useEffect(() => {console.log("rerendered")}, [isDroppable, isCovered])
  return (
    <div
      //ref={setNodeRef}
      data-cell-id={id}
      className={styles.gridCell}
      style={{
        ...style, 
        width: CELL_SIZE,
        height: CELL_SIZE,
        background: isCovered ? isDroppable ? "var(--secondary-active-op50)" : "var(--secondary-danger-op80)" : "var(--gray-100)",
        //background: isCovered ? isDroppable ? "#d7fcffff" : "#fab1a0" : "#efefef",
      }}
    >
      <span style={{
        fontSize: "12px",
        color: "#cecece",
        textAlign: "center"
      }}>{id}</span>
    </div>
  );
},
);

export default GridCell;