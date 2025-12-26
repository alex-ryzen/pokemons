import { RouteObject } from "react-router";
import AuthLayout from "../components/UI/Layouts/AuthLayout";
import AuthApp from "../pages/Guards/AuthApp";
import MainLayout from "../components/UI/Layouts/MainLayout";

export enum RouteNames {
    HOME = '/home',
    AUTH = '/auth',
    PROFILE = '/profile'
}

export const publicRoutes: RouteObject[] = [
    {
        element: <AuthLayout/>,
        children: [
            {
                path: RouteNames.AUTH,
                lazy: async () => {
                    const LoginPage = await import('../pages/Login/LoginPage');
                    return {Component: LoginPage.default};
                }
            }
        ]
    },
];

export const privateRoutes: RouteObject[] = [
    {
        element: <AuthApp/>,
        children: [
            {
                element: <MainLayout/>,
                children: [
                    {
                        path: RouteNames.HOME,
                        lazy: async () => {
                            const HomePage = await import('../pages/Home/HomePage')
                            return {Component: HomePage.default}
                        }

                    },
                    {
                        path: RouteNames.PROFILE,
                        lazy: async () => {
                            const ProfilePage = await import('../pages/Profile/ProfilePage')
                            return {Component: ProfilePage.default}
                        }

                    },
                ]
            },
        ]
    },
];