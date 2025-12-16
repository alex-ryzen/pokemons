import { DragOverlay } from "@dnd-kit/core";
import { GridItem } from "./GridItem";
import { CELL_SIZE, GRID_GAP } from "../../../consts";
import { useGridState } from "../../../hooks/useGrid";
import { useEffect } from "react";

export const DragOverlayWrapper = () => {
    const { activeItem } = useGridState();
    useEffect(() => {
        if (activeItem) {
            document.body.classList.add("is-dragging");
        } else {
            document.body.classList.remove("is-dragging");
        }
    }, [activeItem]);
    return (
        <DragOverlay>
            {activeItem ? (
                <GridItem
                    text={`Move ${activeItem.id}`}
                    style={{
                        width:
                            activeItem.cSize * (CELL_SIZE + GRID_GAP) -
                            GRID_GAP,
                        height:
                            activeItem.cSize * (CELL_SIZE + GRID_GAP) -
                            GRID_GAP,
                        backgroundColor: "rgba(63, 81, 181, 0.8)",
                        color: "white",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                        cursor: "grab",
                    }}
                />
            ) : null}
        </DragOverlay>
    );
}
