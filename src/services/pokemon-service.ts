import { IItem, IPokemon } from "../types/app";
import { baseApi } from "./baseApi";

export const pokemonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPokemons: builder.query<IPokemon[], void>({
            query: () => '/pokemons',
            providesTags: (result) => 
                result
                ? [...result.map(({id}) => ({type: 'Pokemons' as const, id})), {type: 'Pokemons', id: 'LIST'}]
                : [{type: 'Pokemons', id: 'LIST'}] 
        }),
        getRandomPokemon: builder.query<IPokemon, void>({
            query: () => '/randomPokemon',
            providesTags: (res, _err, _arg) => [{type: 'Pokemons', id: res?.id}]
        }),
        updatePokemon: builder.mutation<IPokemon, Partial<IPokemon>>({
            query(pokemon) { // query style №1 (long - def func)
                const {id} = pokemon
                return {
                    url: `/pokemon/${id}/update/`,
                    method: 'PUT',
                    body: pokemon // data
                }
            },
            invalidatesTags: (_res, _err, {id}) => [{type: 'Pokemons', id}],
            async onQueryStarted({id, name}, {dispatch, queryFulfilled}) {
                const patchRes = dispatch(
                    pokemonApi.util.updateQueryData('getPokemons', undefined, (draft) => {
                        const pokemon = draft.find(p => p.id === id);
                        if (pokemon && name) pokemon.name = name;
                    })
                );
                try {
                    await queryFulfilled
                } catch {
                    patchRes.undo();
                }
            }
        }),
        deletePokemon: builder.mutation<void, Pick<IPokemon, "id">>({
            query: ({id}) => ({ // query style №2 (short - anon func)
                url: `/pokemon/${id}/delete`,
                method: 'DELETE',
                //body: { id }
            }),
            invalidatesTags: (_res, _err, {id}) => [
                {type: 'Pokemons', id}, 
                // {type: 'Pokemons', id: 'LIST'}
            ],
        }),
        feedPokemon: builder.mutation<Partial<IPokemon>, Pick<IPokemon, "id"> & Pick<IItem, "id">>({
            query: ({id: pokemon_id, id: inv_item_id}) => ({
                url: `/pokemon/${pokemon_id}/feed`,
                method: `PATCH`,
                body: {inv_item_id}
            }),
            invalidatesTags: (_res, _err, {id}) => [{type: 'Pokemons', id}],
        })
    })
})

export const {
    useGetPokemonsQuery,
    useGetRandomPokemonQuery,
    useUpdatePokemonMutation,
    useFeedPokemonMutation,
    useDeletePokemonMutation
} = pokemonApi;