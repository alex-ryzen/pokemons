

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

export type Item = {
  id: string;
  cellWidth: number;  
  cellHeight: number; 
  x: number;      
  y: number;
  name: string;
};

export type Cell = {
  itemId?: string;
};
