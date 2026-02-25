import { EntityState } from "@reduxjs/toolkit";
import { entityAdapter } from "../store/selectors";
import { IDTYPE, IItem, InvItemCellPos } from "../types/app";
import { baseApi } from "./baseApi";
import { initInventoryItems } from "../mocks/data";

const invItemsAdapter = entityAdapter<IItem>();

export const inventoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInventoryItems: builder.query<EntityState<IItem, IDTYPE>, void>({
            // previously: Items[]
            queryFn: () => {
                const initialState = invItemsAdapter.getInitialState();
                const data = invItemsAdapter.setAll(initialState, initInventoryItems);
                return { data };
            },
            // query: () => "/inventory/items",
            // transformResponse: (response: IItem[]) =>
            //     invItemsAdapter.setAll(
            //         invItemsAdapter.getInitialState(),
            //         response,
            //     ),
            providesTags: ["Inventory"],
        }),
        updatePositions: builder.mutation<void, InvItemCellPos[]>({
            query: (updatedItems) => ({
                url: "/inventory/items/update", // approach: debounce batch-fetch
                method: "POST",
                body: { updates: updatedItems },
            }),
            invalidatesTags: (_res, _err, arg) => 
                arg.map(({ id }) => ({ type: 'Inventory', id })),
            async onQueryStarted(updates, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    inventoryApi.util.updateQueryData(
                        "getInventoryItems",
                        undefined,
                        (draft) => {
                            updates.forEach((upd) => {
                                invItemsAdapter.updateOne(draft, {
                                    id: upd.id,
                                    changes: {
                                        cPosX: upd.cPosX,
                                        cPosY: upd.cPosY,
                                    },
                                });
                            });
                        },
                    ),
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const { useGetInventoryItemsQuery, useUpdatePositionsMutation } =
    inventoryApi;
