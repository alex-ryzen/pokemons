import { ASIDE_CONTENT_GAP, ASIDE_CONTENT_PADDING, FILTER_FIELD_HEIGHT, GENERAL_GAP, GENERAL_PADDING, HEADER_HEIGHT } from '../../store/consts';
import { Item } from '../../types/app';
import BlockTitle from '../UI/BlockTitle/BlockTitle';
import ItemCard, { ItemCardProps } from '../UI/ItemCard/ItemCard';
import ItemGrid from '../UI/ItemGrid/ItemGrid';
import Select from '../UI/Select/Select';
import styles from './shop.module.css'


const initialItems2: Item[] = [
    {
        id: "item4",
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
        id: "item5",
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
        id: "item6",
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


const initShopItems: ItemCardProps[] =  [
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Купить за 1000",
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png", 
    },
    {
        title: "Покеболл 1 уровня",
        description: "Во время охоты ловит покемона с шансом 7%",
        buttonTxt: "Купить за 1000",
        img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
    },
    {
        title: "Покеболл 2 уровня",
        description: "Во время охоты ловит покемона с шансом 15%",
        buttonTxt: "Купить за 1000",
        img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
    }
]

const Shop = () => {
    return ( 
        <div className={styles.shopWrapper}>
            <div className={styles.shop}>
                <BlockTitle style={{padding: "16px"}}>Shop</BlockTitle>
                <Select></Select>
                <div className={styles.itemsWrapper}>
                    <div className={styles.itemsContainer}
                        style={{maxHeight: `calc(100vh - (2 + 2) * ${GENERAL_PADDING}px - ${GENERAL_GAP}px - ${HEADER_HEIGHT}px - ${ASIDE_CONTENT_GAP}px - ${FILTER_FIELD_HEIGHT}px - 2 * ${ASIDE_CONTENT_PADDING}px - 1em) `}}
                    >
                        {initShopItems.map((item, idx) => 
                            <ItemCard key={idx} {...item}></ItemCard>
                        )}
                        {/* <ItemCard title='title' description='description' buttonTxt='BUY'></ItemCard>
                        <ItemCard title='title' description='description' buttonTxt='BUY'></ItemCard>
                        <ItemCard title='title' description='description' buttonTxt='BUY'></ItemCard> */}
                    </div>
                </div>
                {/* <ItemGrid prefix='shop' initItems={initialItems2}></ItemGrid> */}
            </div>
        </div> 
    );
}
 
export default Shop;