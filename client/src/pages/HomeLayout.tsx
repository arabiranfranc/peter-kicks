import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/SideBar";
import GuestNavBar from "../components/GuestNavBar";

const HomeLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeSidebar = (): void => setIsOpen(false);

  return (
    <div
      className="min-h-screen 
      bg-white
      text-black
      flex flex-col
    "
    >
      <GuestNavBar setIsOpen={setIsOpen} />

      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} onClose={closeSidebar} />

        <main className="flex-1">
          <div className="w-full px-4 pt-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
