import { Item } from '../../types/app';
import BlockTitle from '../UI/BlockTitle/BlockTitle';
import ItemGrid from '../UI/ItemGrid/ItemGrid';
import styles from './inventory.module.css'


const initialItems1: Item[] = [
    {
        id: "item1",
        gridSpec: {
            cPos: {
                x: 3,
                y: 1,
            },
            cSize: {
                width: 2,
                height: 2,
            },
        },
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
    },
    {
        id: "item2",
        gridSpec: {
            cPos: {
                x: 2,
                y: 1,
            },
            cSize: {
                width: 1,
                height: 1,
            },
        },
        img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
    },
    {
        id: "item3",
        gridSpec: {
            cPos: {
                x: 0,
                y: 0,
            },
            cSize: {
                width: 1,
                height: 1,
            },
        },
        img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
    },
];

const Inventory = () => {
    return ( 
        <div className={styles.inventoryWrapper}>
            <div className={styles.inventory}>
                <BlockTitle style={{padding: "16px"}}>Inventory</BlockTitle>
                <div className={styles.itemGridWrapper}>
                    <ItemGrid prefix='inv' initItems={initialItems1}></ItemGrid>
                </div>
            </div>
        </div>
    );
}
 
export default Inventory;