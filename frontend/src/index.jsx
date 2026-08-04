import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/index.css";

import Admin from "layouts/Admin";
import Auth from "layouts/Auth";
import Landing from "views/Landing";
import Profile from "views/Profile";
import ProtectedRoute from "components/Auth/ProtectedRoute";
import StoreView from "views/store/StoreView";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/dashboard" component={Admin} allowedRoles={["admin"]} />
        <ProtectedRoute path="/store" component={StoreView} allowedRoles={["admin", "cliente"]} />
        <Route path="/auth" component={Auth} />
        <Route path="/landing" exact component={Landing} />
        <Route path="/profile" exact component={Profile} />
        <Redirect from="/" exact to="/auth/login" />
        <Redirect from="*" to="/auth/login" />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
