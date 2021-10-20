import { useState } from "react";

import logo from "../assets/logo.png";
import NavBar from "./navbar";

export const Header = () => {
  const [togleMenu, setTogleMenu] = useState(false);

  const openMenu = () => {
    setTogleMenu(true);
  };

  const closeMenu = () => {
    setTogleMenu(false);
  };

  return (
    <header className="headerBase w-full bg-gray-100">
      <div className="flex items-center justify-between py-3 px-5 md:px-10">
        <a className="flex items-center gap-2" href="https://www.deadass.io/">
          <img src={logo} alt="logo" className="w-auto h-10 mt-3" />
        </a>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex">
            <NavBar />
          </div>
        </div>
      </div>
    </header>
  );
};
