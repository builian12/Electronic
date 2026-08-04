import React from "react";
import { Link } from "react-router-dom";

export default function FooterAdmin() {
  return (
    <>
      <footer className="block py-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12">
              <div className="text-sm text-blueGray-500 w-fit font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <span className="text-blueGray-500 font-semibold py-1">
                  Mi Sistema CRUD
                </span>
                {" | "}Desarrollado con ❤️
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Soporte
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Términos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
