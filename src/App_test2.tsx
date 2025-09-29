
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core'
import styles from './appTestTwo.module.css'
import { Item } from './types/app';


const initialItems1: Item[] = [
    {
        id: "item1",
        x: 3,
        y: 1,
        width: 2,
        height: 2,
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
    },
    {
        id: "item2",
        x: 2,
        y: 1,
        width: 1,
        height: 1,
        img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
    },
    {
        id: "item3",
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
    },
];



const cells = Array(5*100).fill(0)
const Grid = () => {
    useDroppable
    return (
        <div style={{
            display: "grid",
            width: "auto",
            gridTemplateColumns: `repeat(5, 48px)`,
            gap: 12,
            background: "#f0f0f0"
        }}>
            {cells.map((_, idx) => (
                    <div key={idx} className={styles.cell}>{idx}</div>
                )
            )}
        </div>
    )
}

const AppTestTwo = () => {
    return ( 
        <DndContext>
            <Grid></Grid>
        </DndContext>
    );
}
 
export default AppTestTwo;