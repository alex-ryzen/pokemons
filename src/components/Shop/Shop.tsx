import { memo, useCallback, useEffect, useRef, useState } from 'react';
import BlockTitle from '../UI/BlockTitle/BlockTitle';
import { ItemCardProps } from '../UI/ItemCard/ItemCard';
import styles from './shop.module.css'
import { useAppDispatch } from '../../hooks';
import { fetchShopItems } from '../../services/api-actions';
import { FilterArgs } from '../../hooks/useFilter';
import Sort from '../UI/Sort/Sort';
import FilterBar from '../UI/Filter/FilterBar';
import { IShopItem, ListedData } from '../../types/app';
import Button from '../UI/Button/Button';
import { useObserver } from '../../hooks/useObserver';
import ItemList from '../UI/ItemList/ItemList';
import { returnByKey } from '../../utils/functions';
import { getShop } from '../../store/item-process/shopSlice';

const shopFilter: FilterArgs['content'] = {
    product: {
        title: "Тип товара",
        type: "checkbox",
        value: {
            default: [
                {name: 'pokeball', label: 'Покеболлы'}, 
                {name: 'berry', label: 'Ягоды'}
            ], 
            active: []
        }
    },
    price: {
        title: "Цена",
        type: "range",
        value: { default: {
            name: 'price',
            min: 0,
            max: 1000
        }, active: undefined} 
    }   
}
const shopSortOptions: Array<ListedData> = [
    {id: "shopsort1", name: "updatedAt-ASC", label: "Дата добавления - возр."},
    {id: "shopsort2", name: "updatedAt-DESC", label: "Дата добавления - убыв."},
    {id: "shopsort3", name: "price-ASC", label: "Цена - возр."}, 
    {id: "shopsort4", name: "price-DESC", label: "Цена - убыв."}, 
    {id: "shopsort5", name: "level-ASC", label: "Уровень - возр."},
    {id: "shopsort6", name: "level-DESC", label: "Уровень - убыв."},
]

/**
 * this is Shop Template Generator
 */
const STG = {
    title: (name: string, level: number) => `${name} ${level} уровня`,
    buyButton: (price: number) => `Купить за ${price}`,
    description: {
        pokeball: (item: IShopItem) => `Во время охоты ловит покемона с шансом ${item.specs?.chance || "?"}%`,
        berry: (item: IShopItem) => `Накорми ей покемона для увеличения веса на ${item.specs?.power ? item.specs.power / 100 : "?"} кг`,
    }
}

export interface ShopQueryParams {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string;
    search?: string;
}

const Shop = memo(() => {
    const dispatch = useAppDispatch()
    const shop = getShop()
    
    const [applied, setApplied] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<string>(shopSortOptions[0].name);
    
    const limit = 100;
    const [page, setPage] = useState<number>(0)
    
    const blockRef = useRef<HTMLDivElement>(null);
    const tailRef = useRef<HTMLDivElement>(null);
    
    useObserver({
        tailRef: tailRef,
        canLoad: shop.count < shop.total, 
        isLoading: shop.isLoading,
        callback: () => {
            setPage((p) => p + 1)
        }
    })

    const fetchSI = () => {
        const qdata: ShopQueryParams = {
            limit: limit,
            offset: page * limit,
            filter: filter,
            sort: sort,
            search: undefined,
        }
        if (!shop.isLoading) {
            dispatch(fetchShopItems(qdata));
        }
    }

    useEffect(() => {
        fetchSI();
    }, [page])

    const handleApplyClick = useCallback(() => {
        if (page !== 0) { 
            setPage(0);
        } else {
            fetchSI();
            setApplied(true);
        } 
    }, [limit, page, filter, sort])

    return ( 
        <div className={styles.shopWrapper}>
            <div className={styles.shop}>
                <BlockTitle style={{padding: "16px"}}>Shop</BlockTitle>
                <FilterBar 
                    options={shopFilter}
                    filterBarName='shop_filter'
                    filterInnerName="product"
                    setFilter={f => setFilter(f)}
                    hasApplied={b => setApplied(b)}
                />
                <Sort 
                    options={shopSortOptions} 
                    sortName='shop_sort' 
                    setSort={s => setSort(s)}
                    hasApplied={b => setApplied(b)}
                />
                <div ref={blockRef} className={styles.itemsBlock}>
                    <ItemList
                        items={
                            shop.shopItems.map((item) => {
                                const shopListItem: ItemCardProps = {
                                    title: STG.title(item.name, item.level || 0),
                                    description: returnByKey<typeof STG.description>(item.item_type, STG.description)(item),
                                    buttonTxt: STG.buyButton(item.price),
                                    img: item.image
                                }
                                return shopListItem
                            })
                        }
                        tailRef={tailRef}
                        isLoading={shop.isLoading}
                        wrapperStyles={{maxHeight: (blockRef.current?.clientHeight || 0)}} // - 2 * GENERAL_PADDING
                    ></ItemList>
                </div>
                {!applied && (<Button onClick={handleApplyClick} className={styles.applyButton}>
                    Применить
                </Button>)}
            </div>
        </div> 
    );
});
 
export default Shop;


// /**
//  * this is Shop Template Generator
//  */
// const STG = {
//     title: (name: string, level: number) => `${name} ${level} уровня`,
//     buyButton: (price: number) => `Купить за ${price}`,
//     description: {
//         pokeball: (chance: number) => `Во время охоты ловит покемона с шансом ${chance}%`,
//         berry: (power: number, maxco: number) => `Накорми ей покемона для увеличения веса на ${power / 10} кг в макс. кол-ве ${maxco}`,
//     }
// }

// const initShopItems: ItemCardProps[] =  [
//     {
//         title: "Ягода 1 уровня",
//         description: "Накорми ей покемона для увеличения веса на 0.1 кг",
//         buttonTxt: "Купить за 1000",
//         img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png", 
//     },
//     {
//         title: "Покеболл 1 уровня",
//         description: "Во время охоты ловит покемона с шансом 7%",
//         buttonTxt: "Купить за 1000",
//         img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
//     },
//     {
//         title: "Покеболл 2 уровня",
//         description: "Во время охоты ловит покемона с шансом 15%",
//         buttonTxt: "Купить за 1000",
//         img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
//     }
// ]