import { Outlet, redirect, useLoaderData } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";

export interface User {
  name: string;
  avatar: string;
}

interface DashboardContextType {
  user: User | null;
  logoutUser: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const loader = async () => {
  try {
    const { data } = await customFetch("/users/current-user");
    return data;
  } catch (error) {
    return redirect("/login");
  }
};

const DashboardLayout: React.FC = () => {
  const { user } = useLoaderData();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const closeSidebar = (): void => setIsOpen(false);

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        logoutUser,
      }}
    >
      <div
        className="min-h-screen 
      bg-white
      text-black
      flex flex-col
    "
      >
        <Navbar setIsOpen={setIsOpen} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isOpen} onClose={closeSidebar} />

          <main className="flex-1">
            <div className="w-full max-w-4xl px-4 py-6 space-y-6">
              <Outlet context={{ user }} />
            </div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardContext.Provider"
    );
  }
  return context;
};

export default DashboardLayout;
