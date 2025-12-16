import React, { useCallback, useEffect } from "react";
import { Route, Routes } from "react-router";
import { useAppSelector } from "./hooks";
import { privateRoutes, publicRoutes, RouteLayoutProps } from "./router";
import './App.css'

function handleRoute(route: RouteLayoutProps) {
  const preparedLayoutContent = Object.fromEntries(
    Object.entries(route.layoutContent ?? {}).map(([key, Comp]) => [
      key,
      Comp ? React.createElement(Comp) : undefined
    ])
  );
  return (
    <Route key={route.path} element={<route.layout {...preparedLayoutContent} />}>
      <Route path={route.path} element={React.createElement(route.component)} />
    </Route>
  );
}

function App() {
  const isAuth = useAppSelector((state) => state.user);
  // useEffect(() => {
  //   console.log('app rerender')
  // })
  return (
    <Routes>
      {publicRoutes.map((route) => handleRoute(route))}
      {isAuth && privateRoutes.map((privateRoute) => handleRoute(privateRoute))}
    </Routes>
  );
}

export default App;
