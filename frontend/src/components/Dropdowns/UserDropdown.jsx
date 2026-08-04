import React from "react";
import { createPopper } from "@popperjs/core";
import { useHistory } from "react-router-dom";
import { logout } from "../../services/authService";

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const history = useHistory();

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = () => {
    logout();
    history.push('/auth/login');
  };

  const username = localStorage.getItem('username') || 'usuario';

  return (
    <>
      <a
        className="text-gray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md border-2 border-white">
            <i className="fas fa-user-circle text-lg"></i>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:inline-block">
            {username}
          </span>
          <i className="fas fa-chevron-down text-xs text-gray-400 ml-1 hidden lg:inline-block"></i>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded-xl shadow-lg min-w-48 border border-gray-100"
        }
      >
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-50"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-user mr-2 text-gray-400"></i> Mi perfil
        </a>
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-50"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-store mr-2 text-gray-400"></i> Ver tienda
        </a>
        <div className="h-0 my-2 border border-solid border-gray-100" />
        <button
          onClick={handleLogout}
          className="text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-red-500 hover:bg-red-50 text-left"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default UserDropdown;