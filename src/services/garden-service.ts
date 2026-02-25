import { EntityState } from "@reduxjs/toolkit";
import { entityAdapter } from "../store/selectors";
import { IBerry, IDTYPE, IGardenService, IItem } from "../types/app";
import { baseApi } from "./baseApi";
import { initGardenItems, initServices } from "../mocks/data";

const grdnBerriesAdapter = entityAdapter<IBerry>();

export const gardenApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGradenBerries: builder.query<EntityState<IBerry, IDTYPE>, void>({
            queryFn: () => {
                const initialState = grdnBerriesAdapter.getInitialState();
                const data = grdnBerriesAdapter.setAll(initialState, initGardenItems);
                return { data };
            },
            // query: () => "/garden/berries",
            // transformResponse: (response: IBerry[]) =>
            //     grdnBerriesAdapter.setAll(
            //         grdnBerriesAdapter.getInitialState(),
            //         response,
            //     ),
            providesTags: (result) =>
                result
                    ? [
                          ...result.ids.map((id) => ({
                              type: "GardenItem" as const,
                              id,
                          })),
                          { type: "Garden", id: "ITEMS" },
                      ]
                    : [{ type: "Garden", id: "ITEMS" }],
        }),
        getGradenServices: builder.query<Partial<IGardenService>[], void>({
            queryFn: () => {
                return {data: initServices}
            },
            //query: () => "/garden/services",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "GardenService" as const,
                              id,
                          })),
                          { type: "Garden", id: "SERVICES" },
                      ]
                    : [{ type: "Garden", id: "SERVICES" }],
        }),
        purchaseService: builder.mutation<void, IGardenService>({
            query: (service) => ({
                url: `/garden/services/${service.id}/purchase`,
                method: "POST",
                body: service,
            }),
            invalidatesTags: ["Garden"],
        }),
        plant: builder.mutation<IBerry, IItem>({
            // todo: add optimistic updates
            query: (item) => ({
                url: `/garden/berries/${item.id}/plant`,
                method: "POST",
                body: item,
            }),
            invalidatesTags: (_res, _err, { id }) => [{ type: "GardenItem", id }],
        }),
        harvest: builder.mutation<IItem, IBerry>({
            // harvest if completed, cancel if not - 2 in 1
            // todo: add optimistic updates
            query: (item) => ({
                url: `/garden/berries/${item.id}/harvest`,
                method: "POST",
                body: item,
            }),
            invalidatesTags: (_res, _err, { id }) => [{ type: "GardenItem", id }],
        }),
    }),
});

export const {
    useGetGradenBerriesQuery,
    useGetGradenServicesQuery,
    useHarvestMutation,
    usePlantMutation,
    usePurchaseServiceMutation,
} = gardenApi;
