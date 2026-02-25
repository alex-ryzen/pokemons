import { CSSProperties, FC, RefObject } from "react";
import styles from "./itemList.module.css"
import ItemCard, { ItemCardProps } from "../ItemCard/ItemCard";
import Loader from "../Loader/Loader";

interface ItemListProps {
    items: ItemCardProps[],
    tailRef?: RefObject<HTMLDivElement | null>,
    isLoading?: boolean,
    isError?: boolean,
    wrapperStyles?: CSSProperties,
    containerStyles?: CSSProperties,
}

const ItemList: FC<ItemListProps> = ({items, tailRef, isLoading, isError = false, wrapperStyles, containerStyles}) => {
    return ( 
        <div className={styles.itemsWrapper} style={wrapperStyles}>
            <div className={styles.itemsContainer} style={containerStyles}>
                {items.map((item, idx) => 
                    <ItemCard key={idx} {...item}></ItemCard>
                )}
            </div>
            <div ref={tailRef} className={styles.lastElem}></div>
            {isLoading && <Loader imageProps={{style: {height: 48, width: 'auto'}}}/>}
            {isError && <p data-testid="error-msg">list fetch error</p>}
        </div>        
    );
}
 
export default ItemList;