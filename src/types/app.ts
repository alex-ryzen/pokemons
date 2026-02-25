import { DragCancelEvent, DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RefObject } from "react";

/**
 * types/app.ts - BASE
 */
export type IDTYPE = (string | number) | UniqueIdentifier;
export type GeneralType = {
    id: IDTYPE;
}

/**
 * types/app.ts - API
 */
export type ErrorResponse = {
    status: number | string;
    data: {
        message?: string;
        errors?: { path: string; message: string; code?: string }[] | Record<string, string[]>;
    },
    error: string,
} & FetchBaseQueryError

export type AuthResponse = {
    accessToken: string;
}
export type UserResponse = {
    user: IUser, 
    player: IPlayer
}
export type ShopItemsResponse = {
    items: IShopItem[];
    total: number;
}
export type PurchaseItemResponse = {

}
/**
 * types/app.ts - UI
 */

export type TabConfig = {
    key: string;
    label: string;
    content: React.ReactNode;
}

export type ListedData = {
    id?: string;
    name: string;
    label: string;
}
export type RangeData = { name: string; min: number | ""; max: number | "" }

export type ScrollOffset = { top: number; left: number };

/**
 * types/app.ts - User
 */

export type RegisterData = { 
    username: string; 
    email: string;
    password: string;
    password_confirmation: string;
};

export type LoginData = { 
    login: string; 
    password: string 
};

export enum UserRoles {
    User = "user",
    Admin = "admin",
}

export interface IUser {
    user_id: IDTYPE;
    uuid: string;
    username: string; // same as login
    fullname?: string;
    email?: string;
    regdate?: string;
    image?: string;
    role: UserRoles;
}

export interface IPlayer {
    player_id: number;
    balance: string; // decimal/numeric convert
    total_income: string;
    inventory_size: number;
    inventory_extention_price: string;
}

/**
 * types/app.ts - Grid
 */
export interface Grid extends GeneralType {
  data: GridAreaData;
}
export type GridTypes = "inv" | "grdn";
export type GridAreaData = {
    accepts?: GridTypes[];
};

/**
 * types/app.ts - Shop
 */

export type SpecsAllTypes = {
    size?: number,
    power?: number,
    smoothness?: number,
    growth_time?: number,
    max_harvest?: number,
    soil_dryness?: number,
    chance?: string,
}

export type ShopItemTypes = 'berry' | 'pokeball'

export interface IShopItem {
    item_id: string, //p1
    item_type: ShopItemTypes, //p2
    category?: string,
    name: string,
    price: string,
    level?: number,
    specs?: SpecsAllTypes,
    description?: string,
    image?: string,
}

/**
 * types/app.ts - Item - General instance /Grid instance / Tile instance
 */

export interface IItem extends GeneralType, Partial<IShopItem> { //Pick<ShopItem, "title" | "category" | "level">
    gridId: IDTYPE;
    itemId: IDTYPE;
    cSize: number; // because height = width
    cPosX: number;
    cPosY: number;
    image?: string;
}

export interface IGridItem extends IItem {
    cTargetX?: number;
    cTargetY?: number;
    absSize?: number; // because height = width
    absX?: number;
    absY?: number;
    absTargetX?: number;
    absTargetY?: number;
}

export type InvItemCellPos = Pick<IItem, "id" | "gridId" | "cPosX" | "cPosY">; //& Partial<Pick<IItem, "id">>

export interface GridAreaType {
    id: string;
    data: any;
    actualSize: number;
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
    grid_cell_w: number;
    // grid_cell_w_aclual: number;
    grid_cell_h: number;
    // grid_cell_h_aclual: number;
    grid_cell_view_w: number;
    grid_cell_view_h: number;
    wrapperRef?: RefObject<HTMLDivElement | null>;
    extentionPrice?: number | string;
    registerGridRef: (node: GridSpecs | null) => void;
}

export type GridWindowHandle = {
    getScroll: () => ScrollOffset;
    container: HTMLDivElement | null;
};

export type GridSpecs = {
    grid: Omit<GridAreaType, "activeItem" | "dropArea" | "wrapperRef" | "registerGridRef">,
    updPosStack: Map<IDTYPE, InvItemCellPos>,
    handle: GridWindowHandle | null,
}

export interface GridActionsType {
    registerGrid: (id: IDTYPE) => (grid: GridSpecs | null) => void;
    handleDragStart: (e: DragStartEvent) => void;
    handleDragMove: (e: DragMoveEvent) => void;
    handleDragEnd: (e: DragEndEvent) => void;
    handleDragCancel: (e: DragCancelEvent) => void;
}

export interface GridStateType {
    activeItem: IGridItem | null;
    dropArea: DropArea | null;
}

export type DropArea = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

// ITEMS

export interface IBerry extends IItem { // or Item & {...}
    isGrowing: boolean;
    bonus: number;
    status?: string; // for any cases 
    growStart: string | number; // timestamp
    growFinish?: string | number; // timestamp
    growthTime: number; // duration
    currentSize: number;
    grownSize: number;
}

export interface IPokeball extends IItem {
    chance: number;
}

/**
 * types/app.ts - Garden
 */

export interface IGarden {
    garden_size: number;
    growth_speed?: number;
}

export interface IGardenService extends GeneralType {
    title: string;
    name: string;
    price: number;
    category: string;
    type: 'single-use' | 'persistent';
    value: number | string; // bonus value
    isActive?: boolean;
    duration?: number | Date;
    startedAt?: Date;
}


/**
 * types/app.ts - Pokemons
 */

export interface IPokemon extends GeneralType {
    name: string,
    species: string,
    weight: number,
    income: number, // mps
    summary: number,
    age: number,
    image: string,
}

// export type MappedType<T> = {
//     id: IDTYPE,
//     data: T,
// }

// export type Size = {
//   // any w and h: absolute or cell
//   h: number;
//   w: number;
// };

// export type Coordinates = {
//   // any x and y: absolute or cell
//   x: number;
//   y: number;
// };

// export type DropAreaLocal = {
//   startPos: Coordinates;
//   endPos: Coordinates;
// };