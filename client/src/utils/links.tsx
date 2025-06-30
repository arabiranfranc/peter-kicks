import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats, MdAdminPanelSettings } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import type { ReactElement } from "react";

type LinkItem = {
  text: string;
  path: string;
  icon: ReactElement;
};

export const links: LinkItem[] = [
  { text: "all trade", path: "trade", icon: <FaWpforms /> },
  { text: "all items", path: "shop", icon: <MdQueryStats /> },
];

export const adminLinks: LinkItem[] = [
  { text: "Shop", path: ".", icon: <FaWpforms /> },
  { text: "Trade", path: "all-items", icon: <MdQueryStats /> },
  { text: "Stats", path: "stats", icon: <IoBarChartSharp /> },
  { text: "Profile", path: "profile", icon: <ImProfile /> },
  { text: "Admin", path: "admin", icon: <MdAdminPanelSettings /> },
];
