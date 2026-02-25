import { memo, useCallback, useRef, useState } from 'react';
import BlockTitle from '../UI/BlockTitle/BlockTitle';
import { ItemCardProps } from '../UI/ItemCard/ItemCard';
import styles from './shop.module.css'
import { FilterArgs } from '../../hooks/useFilter';
import Sort from '../UI/Sort/Sort';
import FilterBar from '../UI/Filter/FilterBar';
import { IShopItem, ListedData } from '../../types/app';
import Button from '../UI/Button/Button';
import { useObserver } from '../../hooks/useObserver';
import ItemList from '../UI/ItemList/ItemList';
import { returnByKey } from '../../utils/functions';
import { useGetShopItemsInfiniteQuery } from '../../services/shop-service';
import { LIMIT } from '../../consts';

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
 * Shop Template Generator
 */
const STG = {
    title: (name: string, level: number) => `${name} ${level} уровня`,
    buyButton: (price: string) => `Купить за ${price}`,
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
    const [applied, setApplied] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<string>(shopSortOptions[0].name);
    const { 
        data: shop, 
        isLoading, 
        isError,
        isFetching, 
        fetchNextPage, 
        hasNextPage 
    } = useGetShopItemsInfiniteQuery({
        filter,
        sort,
        limit: LIMIT
    });
    const blockRef = useRef<HTMLDivElement>(null);
    const tailRef = useRef<HTMLDivElement>(null);
    
    useObserver({
        tailRef: tailRef,
        canLoad: hasNextPage && !isFetching, 
        isLoading: isFetching,
        callback: fetchNextPage
    })

    const handleApplyClick = useCallback(() => {
        setApplied(true);
    }, [])

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
                            shop?.pages.flatMap(page => page.items).map((item) => {
                                const shopListItem: ItemCardProps = {
                                    title: STG.title(item.name, item.level || 0),
                                    description: returnByKey<typeof STG.description>(item.item_type, STG.description)(item),
                                    buttonTxt: STG.buyButton(item.price),
                                    img: item.image
                                }
                                return shopListItem
                            }) || []
                        }
                        tailRef={tailRef}
                        isLoading={isLoading || isFetching}
                        isError={isError}
                        wrapperStyles={{maxHeight: (blockRef.current?.clientHeight || 0)}} // - 2 * GENERAL_PADDING
                    ></ItemList>
                </div>
                {!applied && ( // todo: sync with RTKQ
                    <Button onClick={handleApplyClick} className={styles.applyButton}>
                        Применить
                    </Button>
                )}
            </div>
        </div> 
    );
});
 
export default Shop;