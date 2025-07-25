import React from "react";
import { Route, Routes } from "react-router";
import { useAppSelector } from "../hooks";
import {privateRoutes, publicRoutes, RouteNames} from "../router";
import HomePage from "../pages/Home/HomePage";


const AppRouter = () => {
    const isAuth = useAppSelector(state => state.user);
    return ( 
        <Routes>
            {publicRoutes.map(route => 
                <Route path={route.path} element={React.createElement(route.component)}/>
            )}
            {isAuth && privateRoutes.map(privateRoute => 
                <Route path={privateRoute.path} element={React.createElement(privateRoute.component)}/>
            )}
        </Routes>
    );
}
 
export default AppRouter;