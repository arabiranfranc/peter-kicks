import { Menu } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { links, adminLinks } from "../utils/links";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIDEBAR_LINKS = [
  { to: "/", label: "Shop" },
  { to: "/trade", label: "Trade" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1c1f26] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-700 flex justify-evenly items-center gap-4 h-20">
          <button
            onClick={onClose}
            className="md:hidden text-gray-300"
            aria-label="Open sidebar"
          >
            <Menu size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Peter Kicks
          </h2>
        </div>

        <nav
          className="flex flex-col items-center gap-6 text-gray-300 text-xl"
          style={{ marginTop: "20px" }}
        >
          {adminLinks.map(({ path, text, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 hover:text-white transition ${
                location.pathname === path ? "text-white" : ""
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{text}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
