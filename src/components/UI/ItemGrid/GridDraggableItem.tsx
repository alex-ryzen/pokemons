import React, { CSSProperties, ElementType, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from './gridItem.module.css'
import { Item } from "../../../types/app";




{/**
    
    
    
    BETA
    
    
    
    
*/}






export interface GridDraggableItemProps extends Item {
    isDragging: boolean;
    children: ReactNode;
    element?: ElementType;
    posStyles?: CSSProperties | null;
}

const GridDraggableItem: React.FC<GridDraggableItemProps> = ({isDragging, children, element, posStyles, ...props}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });
    const Element = element || "div"; //|| GridItem
    return (
        <Element 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            {...props}
            className={`${styles.gridItemDraggable} ${isDragging ? styles.gridItemDraggableDragging : ''}`}
            style={{
                posStyles,
                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined,
                cursor: isDragging ? "grabbing" : "grab",
            }}
        >
            {children}
        </Element>
    );
};

export default GridDraggableItem;
