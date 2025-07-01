import { useHomeContext } from "../pages/HomeLayout";
import { useDashboardContext } from "../pages/DashboardLayout";

export const useUserContext = () => {
  try {
    return useDashboardContext();
  } catch {
    return useHomeContext();
  }
};
