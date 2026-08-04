import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Navbar from "components/Navbars/AuthNavbar";
import FooterSmall from "components/Footers/FooterSmall";
import Login from "views/auth/Login";
import Register from "views/auth/Register";

export default function Auth() {
  return (
    <>
      <main>
        <section className="relative w-full h-full min-h-screen bg-gray-50">
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </section>
      </main>
    </>
  );
}