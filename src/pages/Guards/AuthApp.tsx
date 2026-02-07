import { Navigate, Outlet, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RouteNames } from "../../router/routes";
import { useEffect } from "react";
import { fetchUserData } from "../../services/api-actions";

const AuthApp = () => {
    const dispatch = useAppDispatch();
    const { isAuth } = useAppSelector(state => state.user);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            dispatch(fetchUserData())
        }
    }, [])

    useEffect(() => {
        console.log("AUTHed: ", isAuth)
    }, [isAuth])
    
    if (!isAuth) {
        return <Navigate to={RouteNames.AUTH} state={{ from: location }} replace={true} />;
    }
    return <Outlet />;
};

export default AuthApp;
