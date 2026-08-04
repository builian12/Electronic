/*eslint-disable*/
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { to: "/dashboard", icon: "fas fa-tv", label: "Panel principal" },
    { to: "/dashboard/productos", icon: "fas fa-box", label: "Productos" },
    { to: "/dashboard/ventas", icon: "fas fa-cash-register", label: "Ventas" },
    { to: "/dashboard/usuarios", icon: "fas fa-users", label: "Usuarios" },
  ];

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-slate-900 text-slate-100 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        <button
          className="cursor-pointer text-slate-300 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-slate-900 m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>

        <Link className="md:block text-left md:pb-2 text-slate-100 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/dashboard">
          Electronic Admin
        </Link>

        <div className={"md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " + collapseShow}>
          <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-slate-800">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link className="md:block text-left md:pb-2 text-slate-100 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/dashboard">
                  Electronic Admin
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <button type="button" className="cursor-pointer text-slate-300 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent" onClick={() => setCollapseShow("hidden")}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <hr className="my-4 md:min-w-full border-slate-800" />
          <h6 className="md:min-w-full text-slate-400 text-xs uppercase font-bold block pt-1 pb-4 no-underline">Módulos</h6>

          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {links.map((link) => (
              <li key={link.to} className="items-center">
                <Link
                  className={"text-xs uppercase py-3 font-bold block " + (path === link.to || path.startsWith(link.to) ? "text-sky-400" : "text-slate-300 hover:text-slate-100")}
                  to={link.to}
                >
                  <i className={link.icon + " mr-2 text-sm " + (path === link.to || path.startsWith(link.to) ? "opacity-75" : "text-slate-500")}></i>{" "}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
