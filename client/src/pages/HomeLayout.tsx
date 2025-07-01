import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";

type User = {
  name: string;
  avatar?: string;
};

export async function loader() {
  const isLoggedIn = document.cookie.includes("isLoggedIn=true");
  if (!isLoggedIn) return { user: null };

  try {
    const res = await customFetch.get("/users/current-user");
    return { user: res.data.user };
  } catch {
    return { user: null };
  }
}

const HomeLayout: React.FC = () => {
  const { user } = useLoaderData() as { user: User | null };
  console.log(user);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeSidebar = (): void => setIsOpen(false);

  const logoutUser = async () => {
    try {
      await customFetch.get("/auth/logout");
      toast.success("Logged out");
      window.location.href = "/";
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar
        setIsOpen={setIsOpen}
        isPublic={true}
        user={user}
        logoutUser={logoutUser}
      />

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
