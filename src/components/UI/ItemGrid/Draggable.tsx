import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import {
    CSSProperties,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import styles from "./itemGrid.module.css"

export type DraggableData = {
    //area: UniqueIdentifier | string;
    itemId: UniqueIdentifier;
    gridId: UniqueIdentifier;
    // size: number;
};

export interface IDraggableProps {
    id: UniqueIdentifier;
    data: DraggableData;
    draggableStyles?: CSSProperties;
    children?: ReactNode;
}

export const Draggable = ({ id, data, children, draggableStyles }: IDraggableProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id,
            data,
        });

    useEffect(() => console.log('DRAGGING: ', isDragging), [isDragging])

    const style = {
        ...draggableStyles,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 999 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            //onMouseDown={}
            data-draggable="true"
        >
            {children}
        </div>
    );
};
