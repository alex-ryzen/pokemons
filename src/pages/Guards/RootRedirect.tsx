import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../hooks";
import { RouteNames } from "../../router/routes";

export const RootRedirect = () => {
    const { isAuth } = useAppSelector((state) => state.user);
    if (isAuth) {
        return <Navigate to={RouteNames.HOME} replace={true} />;
    } else {
        return <Navigate to={RouteNames.AUTH} replace={true} />;
    }
};
