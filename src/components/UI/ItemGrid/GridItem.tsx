import { CSSProperties, forwardRef, memo, ReactNode, Ref, useEffect } from "react";
import { GRID_GAP, CELL_SIZE } from "../../../store/consts";
import { Item } from "../../../types/app";
import styles from './gridItem.module.css'
import { GridDraggableItemProps } from "./GridDraggableItem";
import { useDraggable } from "@dnd-kit/core";
import { getRandomInt } from "../../../utils/random";

export interface GridItemProps extends Item {
    isDragging: boolean;
    posStyles?: CSSProperties | null;
}

const GridItem: React.FC<GridItemProps> = memo((item) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id});
    return (
        <div
            data-item-id={item.id}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`${styles.gridItem} ${item.isDragging ? styles.gridItemDragging : ''}`}
            style={{
                ...item.posStyles,
                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined,
                cursor: item.isDragging ? "grabbing" : "grab",
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


// export interface GridItemProps {
//     //ref: Ref<HTMLDivElement> | undefined; //React.Ref<Element>
//     //transform?: Transform | null; import { Transform } from '@dnd-kit/utilities'
//     id: string;
//     img?: string | undefined;
//     children?: ReactNode;
// }

// const GridItem: React.FC<GridItemProps> = memo(({ id, img, children }) => {
//     return (
//         <div
//             className={styles.gridItem}
//         >
//             <img
//                 src={img}
//                 alt={`img_${id}`}
//                 className={styles.gridItemImg}>
//             </img>
//             {children}
//         </div>
//     );
// });

// export default GridItem;