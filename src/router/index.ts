import React from "react";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import MainLayout, { MainLayoutProps } from "../components/UI/Layouts/MainLayout";
import AuthLayout from "../components/UI/Layouts/AuthLayout";
import Inventory from "../components/Inventory/Inventory";
import Shop from "../components/Shop/Shop";

export type RouteLayoutProps = IRoute | IRoute<MainLayoutProps>;

export interface IRoute<LProps = {}> {
    path: string;
    layout: React.ComponentType<LProps>; //  'main' | 'auth'
    component: React.ComponentType; //| React.ReactElement
    layoutContent?: Record<string, React.ComponentType>;
}

export enum RouteNames {
    HOME = '/',
    LOGIN = '/auth',
}

export const publicRoutes: Array<RouteLayoutProps> = [ //IRoute[]
    {path: RouteNames.LOGIN, layout: AuthLayout, component: LoginPage}
]

export const privateRoutes: Array<RouteLayoutProps> = [
    {path: RouteNames.HOME, layout: MainLayout, component: HomePage, layoutContent: {
        siderLContent: Inventory,
        siderRContent: Shop
    }}
]