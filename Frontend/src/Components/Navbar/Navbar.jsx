import {
  BuildingStorefrontIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const Navbar = () => {
  const toggleDarkMode = () => {
    const mode = document.body.parentElement.getAttribute("data-theme");
    if (mode === "dark") {
      document.body.parentElement.setAttribute("data-theme", "cupcake");
      localStorage.setItem("isDarkMode", "false");
    } else {
      document.body.parentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("isDarkMode", "true");
    }
  };
  return (
    <div className="navbar h-10  rounded-md shadow-md mb-16">
      <div className="md:w-[80%] md:mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="icon mx-2">
            <BuildingStorefrontIcon className="w-6 h-6" />
          </div>
          <a className="text-xl font-bold">Sales Management System</a>
        </div>

        <div className="flex items-center gap-2 px-2">
          <div
            onClick={toggleDarkMode}
            className="flex items-center gap-2 cursor-pointer dark:hidden"
          >
            <span className="text-sm text-gray-700">Light Mode</span>
            <SunIcon className="h-6 w-6" />
          </div>
          <div
            onClick={toggleDarkMode}
            className="hidden dark:flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm text-gray-200">Dark Mode</span>
            <MoonIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
