import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createAPI } from '../services/api.tsx'

import userReducer from './user-process/userSlice'
import pokemonReducer from './pokemon-process/pokemonSlice'
import inventoryReducer from './item-process/inventorySlice'
import shopReducer from './item-process/shopSlice'

// api init

const api = createAPI()

export const rootReducer = combineReducers({
    user: userReducer,
    inventory: inventoryReducer,
    shop: shopReducer,
    //garden: gardenReducer,
    pokemons: pokemonReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            thunk: {
                extraArgument: api
            }
        })
})  

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ThunkReturnType = void> = ThunkAction< // Define a reusable type describing thunk functions
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

// export type AppStore = typeof store // Get the type of our store variable

// export type RootState = ReturnType<AppStore['getState']> // Infer the `RootState` and `AppDispatch` types from the store itself

// export type AppDispatch = AppStore['dispatch'] // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

