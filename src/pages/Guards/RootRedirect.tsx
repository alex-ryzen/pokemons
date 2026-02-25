import { Navigate } from "react-router";
import { useAppSelector } from "../../hooks";
import { RouteNames } from "../../router/routes";

export const RootRedirect = () => {
    const { accessToken, isAuth } = useAppSelector((state) => state.auth);
    if (accessToken || isAuth) {
        return <Navigate to={RouteNames.HOME} replace={true} />;
    } else {
        return <Navigate to={RouteNames.AUTH} replace={true} />;
    }
};
