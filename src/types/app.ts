/**
 * types/app.ts - UI
 */

export interface TabConfig {
    key: string;
    label: string;
    content: React.ReactNode;
}

/**
 * types/app.ts - User
 */

export type UserStatus = "idle" | "loading" | "succeeded" | "failed";

export enum UserRoles {
    User = "user",
    Admin = "admin",
}

export interface IUser {
    id: string;
    username: string;
    role: UserRoles;
    isAuth: boolean;
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

export interface Item {
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
