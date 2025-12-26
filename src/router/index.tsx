import { createBrowserRouter } from "react-router";
import ErrorPage from "../pages/Error/ErrorPage";
import { privateRoutes, publicRoutes } from "./routes";
import { RootRedirect } from "../pages/Guards/RootRedirect";

export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                index: true,
                element: <RootRedirect/>
            },
            ...publicRoutes,
            ...privateRoutes,
            {
                path: "*",
                element: <ErrorPage/>
            }
        ]
    }
]);




// export type RouteLayoutProps = IRoute | IRoute<MainLayoutProps>;

// export interface IRoute<LProps = {}> {
//     path: string;
//     layout: React.ComponentType<LProps>; //  'main' | 'auth'
//     component: React.ComponentType; //| React.ReactElement
//     layoutContent?: Record<string, React.ComponentType>;
// }

// export enum RouteNames {
//     HOME = '/',
//     LOGIN = '/auth',
//     PROFILE = '/profile'
// }

// export const publicRoutes: Array<RouteLayoutProps> = [ //IRoute[]
//     {path: RouteNames.LOGIN, layout: AuthLayout, component: LoginPage}
// ]

// export const privateRoutes: Array<RouteLayoutProps> = [
//     {path: RouteNames.HOME, layout: MainLayout, component: HomePage, layoutContent: {
//         siderLContent: Inventory,
//         siderRContent: Shop
//     }},

// ]