import { FC, memo } from "react";
import styles from "./itemGrid.module.css"
import { UniqueIdentifier } from "@dnd-kit/core";
import { CELL_SIZE, GRID_GAP } from "../../../consts";

export interface IGridCellProps {
    id: UniqueIdentifier;
    x: number;
    y: number;
    isValid: boolean;
    isCovered: boolean;
    isAvailable: boolean;
}

export const GridCell: FC<IGridCellProps> = memo(
    ({ 
        id, 
        x, 
        y, 
        isValid, 
        isCovered, 
        isAvailable 
    }) => {
        return (
            <div
                className={styles.itemGridCell}
                data-cell-id={id}
                style={{
                    position: "absolute",
                    left: x * (CELL_SIZE + GRID_GAP),
                    top: y * (CELL_SIZE + GRID_GAP),
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    background: isCovered
                        ? isValid
                            ? "#59ff7d"
                            : "#eb546d"
                        : "#EFEFEF",
                    opacity: isAvailable ? 1 : 0.3
                }}
            >
                {`${id}-${y}-${x}`}
            </div>
        );
    }
);

//isCovered ? isDroppable ? "var(--secondary-active-op50)" : "var(--secondary-danger-op80)" : "var(--gray-100)"
