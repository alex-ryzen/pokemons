import { FC, useEffect } from 'react';
import { ASIDE_CONTENT_GAP, ASIDE_CONTENT_PADDING, FILTER_FIELD_HEIGHT, GENERAL_GAP, GENERAL_PADDING, HEADER_HEIGHT } from '../../consts';
import { Item, RangeData } from '../../types/app';
import BlockTitle from '../UI/BlockTitle/BlockTitle';
import ItemCard, { ItemCardProps } from '../UI/ItemCard/ItemCard';
import ItemGrid from '../UI/ItemGrid/GridArea';
import ItemList from '../UI/ItemList/ItemList';
import Select from '../UI/Select/Select';
import styles from './shop.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchShopItems } from '../../services/api-actions';
import { getShopItems } from '../../store/item-process/itemSelectors';
import { FilterArgs, FilterContent, useFilter } from '../../hooks/useFilter';
import { SortData, SortOption, useSort } from '../../hooks/useSort';
import Filter from '../UI/Filter/Filter';
import Sort from '../UI/Sort/Sort';

const initialFilter: FilterArgs['content'] = {
    product: {
        type: "checkbox",
        value: {
            default: [
                {name: 'pokeballs', label: 'Покеболлы'}, 
                {name: 'berries', label: 'Ягоды'}
            ], 
            active: undefined
        }
    },
    price: {
        type: "range",
        value: { default: {
            name: 'price',
            min: 0,
            max: 1000
        }, active: undefined} 
    }   
}
const sortOptionList: Array<SortOption> = [
    {optionName: "date", optionLabel: "Дата добавления"},
    {optionName: "price", optionLabel: "Цена"}, 
    {optionName: "level", optionLabel: "Уровень"}
]
const initialSort: SortData = {sortOption: sortOptionList[0], sortOrderBy: 'asc'}

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

export interface ShopQueryParams {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string;
}

const Shop: FC = () => {
    const dispatch = useAppDispatch()
    const shopItems = getShopItems()

    const {filterStr, filterContent, setActiveValue} = useFilter({content: initialFilter})
    const {sortStr, sortData, setSortOption, toggleSortOrder} = useSort({initialSort: initialSort})

    useEffect(() => {
        
        const qdata: ShopQueryParams = {
            limit: 100,
            offset: 0,
            filter: filterStr,
            sort: sortStr
        }
        console.log(JSON.stringify(qdata))
        dispatch(fetchShopItems(qdata))
    }, [])

    return ( 
        <div className={styles.shopWrapper}>
            <div className={styles.shop}>
                <BlockTitle style={{padding: "16px"}}>Shop</BlockTitle>
                <Select mode='multiple' options={[
                    {name: "berries", label: "Ягоды"}, 
                    {name: "pokeballs", label: "Покеболлы"}
                ]}>
                    <Filter filterContent={filterContent} setActiveValue={setActiveValue}></Filter>
                </Select>
                <Sort options={sortOptionList} sortData={sortData} onChange={setSortOption} onToggle={toggleSortOrder}></Sort>
                {/* <ItemList
                    items={
                        shopItems.map((item) => {
                            const shopListItem: ItemCardProps = {
                                title: `${item.name} ${item.level} уровня`,
                                description: item.description || "",
                                buttonTxt: `Купить за ${item.price}`,
                                img: item.img
                            }
                            return shopListItem
                        })
                    }
                    containerStyles={{maxHeight: `calc(100vh - (2 + 2) * ${GENERAL_PADDING}px - ${GENERAL_GAP}px - ${HEADER_HEIGHT}px - ${ASIDE_CONTENT_GAP}px - ${FILTER_FIELD_HEIGHT}px - 2 * ${ASIDE_CONTENT_PADDING}px - 1em) `}}
                ></ItemList> */}
            </div>
        </div> 
    );
}
 
export default Shop;