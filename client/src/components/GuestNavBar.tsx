import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { toast } from "sonner";

type NavbarProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type User = {
  name: string;
  avatar: string;
};

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/trade", label: "Trade" },
];

const GuestNavBar = ({ setIsOpen }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await customFetch.get("/users/current-user");
        setUser(res.data.user);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Unexpected error fetching user:", err);
        }
      }
    };

    fetchUser();
  }, []);

  const logoutUser = async () => {
    try {
      await customFetch.get("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

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

        {/* Right side: Authenticated Dropdown or Guest Links */}
        <div className="relative">
          {user ? (
            <div>
              <button
                type="button"
                className="flex items-center gap-2 text-white focus:outline-none"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6" />
                )}
                <FaCaretDown />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 text-black transition ${
                  showDropdown ? "block" : "hidden"
                }`}
              >
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Dashboard Profile
                </Link>
                <button
                  onClick={logoutUser}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white flex items-center gap-4 text-sm">
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GuestNavBar;
