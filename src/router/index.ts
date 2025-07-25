import React from "react";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";

export interface IRoute {
    path: string;
    component: React.ComponentType; //| React.ReactElement
}

export enum RouteNames {
    HOME = '/',
    LOGIN = '/auth',
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, component: LoginPage}
]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.HOME, component: HomePage}
]