import { CSSProperties, FC } from "react";
import styles from "./itemList.module.css"
import ItemCard, { ItemCardProps } from "../ItemCard/ItemCard";

interface ItemListProps {
    items: ItemCardProps[]
    wrapperStyles?: CSSProperties
    containerStyles?: CSSProperties
}

const ItemList: FC<ItemListProps> = ({items, wrapperStyles, containerStyles}) => {
    return ( 
        <div className={styles.itemsWrapper} style={wrapperStyles}>
            <div className={styles.itemsContainer} style={containerStyles}>
                {items.map((item, idx) => 
                    <ItemCard key={idx} {...item}></ItemCard>
                )}
            </div>
        </div>        
    );
}
 
export default ItemList;