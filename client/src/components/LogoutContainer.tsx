import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  user: { name: string; avatar?: string };
  logoutUser?: () => void;
};

const LogoutContainer: React.FC<Props> = ({ user, logoutUser }) => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-white" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 hover:text-gray-300"
        onClick={() => setShowLogout((prev) => !prev)}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-[28px] h-[28px] rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-6 h-6" />
        )}
        <span className="ml-1">{user.name}</span>
        <FaCaretDown className="ml-1" />
      </button>

      {showLogout && (
        <div className="absolute right-0 mt-2 min-w-[160px] bg-black text-white border-2 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              navigate("/dashboard");
              setShowLogout(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-primary-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/inventory");
              setShowLogout(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-primary-600"
          >
            Inventory
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              setShowLogout(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-primary-600"
          >
            Profile
          </button>
          <button
            onClick={() => {
              logoutUser?.();
              setShowLogout(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-primary-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutContainer;
