import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useState } from "react";

type Props = {
  user: { name: string; avatar?: string };
  logoutUser?: () => void;
};

const LogoutContainer: React.FC<Props> = ({ user, logoutUser }) => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="relative text-white">
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setShowLogout((prev) => !prev)}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-[25px] h-[25px] rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-6 h-6" />
        )}
        <span className="ml-2">{user.name}</span>
        <FaCaretDown className="ml-1" />
      </button>

      <div
        className={`absolute top-[45px] left-0 w-full text-center text-white rounded-md bg-primary-500 shadow-md z-50 ${
          showLogout ? "block" : "hidden"
        }`}
      >
        <button
          type="button"
          className="w-full px-4 py-2 bg-transparent border-none text-white capitalize cursor-pointer"
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutContainer;
