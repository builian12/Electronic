import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import HeaderStats from "components/Headers/HeaderStats";
import FooterAdmin from "components/Footers/FooterAdmin";
import DashboardView from "views/admin/DashboardView";
import ProductView from "views/admin/ProductView";
import SalesView from "views/admin/SalesView";
import SuppliersView from "views/admin/SuppliersView";
import CategoriesView from "views/admin/CategoriesView";
import ClientsView from "views/admin/ClientsView";
import UsersView from "views/admin/UsersView";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-gray-50 min-h-screen">
        <AdminNavbar />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/dashboard" exact component={DashboardView} />
            <Route path="/dashboard/productos" exact component={ProductView} />
            <Route path="/dashboard/ventas" exact component={SalesView} />
            <Route path="/dashboard/proveedores" exact component={SuppliersView} />
            <Route path="/dashboard/categorias" exact component={CategoriesView} />
            <Route path="/dashboard/clientes" exact component={ClientsView} />
            <Route path="/dashboard/usuarios" exact component={UsersView} />
            <Redirect from="/admin" to="/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}