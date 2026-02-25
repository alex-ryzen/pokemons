import { Navigate, Outlet, useLocation } from "react-router";
import { useAppDispatch } from "../../hooks";
import { RouteNames } from "../../router/routes";
import { useEffect } from "react";
import { useGetUserDataQuery } from "../../services/user-service";
import { setIsAuth } from "../../store/auth-process/auth-process";
import Loader from "../../components/UI/Loader/Loader";

const AuthApp = () => {
    const dispatch = useAppDispatch();
    //const { accessToken, isAuth } = useAppSelector(state => state.auth);
    const { data, isSuccess, isError, isLoading, status } = useGetUserDataQuery(undefined) //{skip: !accessToken}
    const location = useLocation();

    useEffect(() =>  {
        console.log()
        console.log(isError, isSuccess, data)
        if (isSuccess) {
            dispatch(setIsAuth(true));
        }
    }, [data, isSuccess, isError, status, dispatch]);
    
    if (isLoading) {
        return <Loader containerProps={{style: {height: '100vh'}}}></Loader>
    }

    if (isError || !isSuccess) {
        return <Navigate to={RouteNames.AUTH} state={{ from: location }} replace={true} />;
    }

    return <Outlet />;
};

export default AuthApp;
