

export type UserStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export enum UserRoles { 
  User = 'user' , 
  Admin = 'admin'
};

export interface IUser {
  id: string,
  username: string,
  role: UserRoles,
  isAuth: boolean,
};

/**
 * Item
 */
export type Item = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX?: number;
  targetY?: number;
  color?: string;
  img?: string;
};

export type DropArea = {
  startPos: {x: number, y: number},
  endPos: {x: number, y: number}
}  