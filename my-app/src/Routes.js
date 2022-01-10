/*
Routes.js
Author: Derek Jeong
Description: Routes.js is a react hook component for routing page to page with link/url.
*/

import React from "react";
import { Route, Switch } from "react-router-dom";
import Error from "./customer/containers/404";
import Forbidden from "./customer/containers/403";
// customer side
import Menu from "./customer/containers/Menu";
import Home from "./customer/containers/Home";
import SelectedItem from "./customer/containers/SelectedItem";
// business side
import Login from "./business/containers/Login";
import Orders from "./business/containers/Orders";

export default function Routes() {

        return (
                <Switch>
                        <Route exact path="/">
                                <Home />
                        </Route>
                        <Route exact path="/business/login">
                                <Login />
                        </Route>
                        <Route exact path="/business/orders">
                                <Orders />
                        </Route>
                        <Route exact path="/menu">
                                <Menu />
                        </Route>
                        <Route exact path="/selectedItem">
                                <SelectedItem />
                        </Route>
                        <Route exact path="/403">
                                <Forbidden />
                        </Route>
                        <Route>
                                <Error />
                        </Route>
                </Switch>
        );
}