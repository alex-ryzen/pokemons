/**
 * types/app.ts - UI
 */

export interface TabConfig {
    key: string;
    label: string;
    content: React.ReactNode;
}

export type ListedData = {
    name: string;
    label: string;
}
export type RangeData = {name: string, min: number | "", max: number | ""}

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
 * types/app.ts - Item
 */

export type CellSize = {
    height: number;
    width: number;
};

export type Coordinates = {
    x: number;
    y: number;
};

export type GridPosition = {
    cPos: Coordinates;
    cSize: CellSize;
    cTarget?: Coordinates;
    coords?: Coordinates;
};

export interface Item extends Partial<ShopItem> {
    id: string;
    gridSpec: GridPosition;
    absPos?: Coordinates;
    color?: string;
    img?: string;
}

export type DropArea = {
    startPos: Coordinates;
    endPos: Coordinates;
};


/**
 * types/app.ts - Garden
 */

export interface GardenItem extends Item { // or Item & {...}
    growStart: string; // timestamp
    duration: number;
}
/**
 * types/app.ts - Shop
 */

export interface ShopItem {
    name: string,
    price: number,
    category: string,
    description?: string,
    level?: number,
    img?: string,
}


/**
 * types/app.ts - Pokemons
 */

export type Pokemon = {
    name: string,
    species: string,
    weight: number,
    income: number,
    summary: number,
    age: number,
    img: string,
}