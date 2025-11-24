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
    name: string;
    label: string;
}
export type RangeData = { name: string; min: number | ""; max: number | "" }

export type ScrollOffset = { top: number; left: number };
/**
 * types/app.ts - User
 */

//export type UserStatus = "idle" | "loading" | "succeeded" | "failed";

export enum UserRoles {
    User = "user",
    Admin = "admin",
}

export interface IUser {
    userId: number;
    isAuth: boolean;
    username: string; // same as login
    role: UserRoles;
    email?: string;
    fullname?: string;
    regdate?: Date;
    image?: string;
}

export interface IPlayer {
    playerId: number;
    balance: string; // decimal/numeric convert
    totalIncome: string;
    inventorySize: number;
    inventoryExtentionPrice: string;
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

export interface IShopItem {
    id: UniqueIdentifier | string;
    itemId: string,
    title: string,
    price: number,
    category: string,
    description?: string,
    level?: number,
    img?: string,
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
    img?: string;
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
    gardenSize: number;
    growthSpeed?: number;
}

export interface IGardenService {
    title: string;
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
    img: string,
}