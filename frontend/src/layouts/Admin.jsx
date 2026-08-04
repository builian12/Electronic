import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import HeaderStats from "components/Headers/HeaderStats";
import FooterAdmin from "components/Footers/FooterAdmin";

// views

import DashboardView from "views/admin/DashboardView";
import ProductView from "views/admin/ProductView";
import SalesView from "views/admin/SalesView";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/dashboard" exact component={DashboardView} />
            <Route path="/dashboard/productos" exact component={ProductView} />
            <Route path="/dashboard/ventas" exact component={SalesView} />
            <Redirect from="/admin" to="/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
