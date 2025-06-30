import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type NavbarProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/trade", label: "Trade" },
];

const GuestNavBar = ({ setIsOpen }: NavbarProps) => {
  const location = useLocation();

  return (
    <header className="bg-[#1c1f26] shadow-sm sticky top-0 z-50">
      <div
        className="max-w-full w-full mx-auto flex items-center justify-between h-20"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex items-center gap-8">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-gray-300"
            aria-label="Open sidebar"
          >
            <Menu size={28} />
          </button>

          <Link to="/">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              Peter Kicks
            </h3>
          </Link>

          <nav className="hidden md:flex gap-6 text-lg font-medium text-gray-300">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`hover:text-white transition ${
                  location.pathname === to ? "text-white" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default GuestNavBar;
