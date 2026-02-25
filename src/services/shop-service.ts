import { ShopQueryParams } from "../components/Shop/Shop";
import { LIMIT } from "../consts";
import { IItem, IShopItem, ShopItemsResponse } from "../types/app";
import { baseApi } from "./baseApi";

export const shopApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getShopItems: builder.infiniteQuery<ShopItemsResponse, ShopQueryParams, number>({
            infiniteQueryOptions: {
                initialPageParam: 0,
                getNextPageParam: (lastPage, allPages) => {
                    const loaded = allPages.length * LIMIT;
                    if (loaded < lastPage.total) {
                        return loaded
                    } else {
                        return undefined
                    }
                },
            },
            query: ({queryArg, pageParam}) => ({
                url: '/shop/items',
                params: {
                    offset: pageParam,
                    limit: LIMIT,
                    filter: queryArg.filter,
                    sort: queryArg.sort,
                    search: queryArg.search
                } as ShopQueryParams,
            }),
            providesTags: ['Shop'],
        }),
        purchaseItem: builder.mutation<Partial<IItem>, Pick<IShopItem, "item_id">>({
            query: (id) => ({
                url: '/shop/purchase',
                method: 'POST',
                body: {item_id: id}
            }),
            invalidatesTags: ['Inventory'],
        })
    }),
})

export const {
    useGetShopItemsInfiniteQuery,
    usePurchaseItemMutation
} = shopApi;