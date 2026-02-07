/**
 * types/app.ts - UI
 */

import { UniqueIdentifier } from "@dnd-kit/core";

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

//export type UserStatus = "idle" | "loading" | "succeeded" | "failed";

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
    user_id: number;
    uuid: string;
    username: string; // same as login
    fullname?: string;
    email?: string;
    regdate?: Date;
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
export interface Grid {
  id: UniqueIdentifier;
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
    price: number,
    level?: number,
    specs?: SpecsAllTypes,
    description?: string,
    image?: string,
}

/**
 * types/app.ts - Item - General instance /Grid instance / Tile instance
 */

export interface IItem extends Partial<IShopItem> { //Pick<ShopItem, "title" | "category" | "level">
    id: UniqueIdentifier | string;
    gridId: UniqueIdentifier;
    itemId: string;
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

export type DropArea = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

export interface IBerry extends IItem { // or Item & {...}
    isGrowing: boolean;
    bonus: number;
    status?: string; // for any cases 
    growStart: Date; // timestamp
    growFinish?: Date; // timestamp
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

export interface IGardenService {
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

export type IPokemon = {
    name: string,
    species: string,
    weight: number,
    income: number, // mps
    summary: number,
    age: number,
    image: string,
}