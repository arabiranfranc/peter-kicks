import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Sidebar from "../components/SideBar";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";
import Navbar from "../components/NavBar";

export interface User {
  name: string;
  avatar: string;
}

interface HomeContextType {
  user: User | null;
  logoutUser: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export async function loader() {
  try {
    const res = await customFetch("/users/current-user");
    console.log(res);
    return { user: res.data.user };
  } catch {
    return { user: null };
  }
}

const HomeLayout: React.FC = () => {
  const { user } = useLoaderData() as { user: any | null };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const closeSidebar = (): void => setIsOpen(false);
  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };
  return (
    <HomeContext.Provider
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

        <div className="flex flex-1">
          <Sidebar isOpen={isOpen} onClose={closeSidebar} />

          <main className="flex-1">
            <div className="w-full px-4 pt-6 space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </HomeContext.Provider>
  );
};

export const useHomeContext = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error(
      "useHomeContext must be used within a HomeContext.Provider"
    );
  }
  return context;
};

export default HomeLayout;
