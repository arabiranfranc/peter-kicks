import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";

const LogoutContainer: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logoutUser } = useUserContext();

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-center gap-2 btn"
        onClick={() => setShowLogout((prev) => !prev)}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-[25px] h-[25px] rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-6 h-6" />
        )}
        <span className="ml-2">{user?.name}</span>
        <FaCaretDown className="ml-1" />
      </button>

      <div
        className={`absolute top-[45px] left-0 w-full text-center rounded-md bg-primary-500 shadow-md ${
          showLogout ? "visible" : "invisible"
        }`}
      >
        <button
          type="button"
          className="w-full px-4 py-2 bg-transparent border-none text-white tracking-wide capitalize cursor-pointer"
          onClick={logoutUser}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default LogoutContainer;
