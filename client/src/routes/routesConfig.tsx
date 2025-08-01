import { createBrowserRouter } from "react-router";
import {
  DashboardLayout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Register,
  PendingOffers,
  AllItems,
  Dashboard,
  Orders,
  AddItem,
  Order,
  AllTradeItems,
  TradeOffers,
  Users,
} from "../pages";
// import RootLayout from './RootLayout';
// import Home from '../pages/Home';
// import About from '../pages/About';
// import DashboardLayout from './DashboardLayout';
// import Dashboard from '../pages/Dashboard';
// import NotFound from './NotFound';
import { action as registerAction } from "../pages/Register";
import { action as loginAction } from "../pages/Login";
import { loader as dashboardLoader } from "../pages/DashboardLayout";
import { loader as allItemsLoader } from "../pages/AllItems";
import { loader as allTradeItemsLoader } from "../pages/AllTradeItems";
import { loader as OrdersLoader } from "../pages/Orders";
import { loader as SingleOrderLoader } from "../pages/Order";
import { action as allItemsOrderAction } from "../pages/AllItems";
import { action as addItemAction } from "../pages/AddItem";
import { action as SingleOrderAction } from "../pages/Order";
import { action as TradeOfferAction } from "../pages/AllTradeItems";
import { loader as TradeOffersLoader } from "../pages/TradeOffers";
import { loader as homeLayoutLoader } from "../pages/HomeLayout";
import { loader as userShopLoader } from "../pages/AddItem";
import { loader as allUsersLoader } from "../pages/Users";
import { loader as dashboardPageLoader } from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    loader: homeLayoutLoader,

    errorElement: <Error />,

    children: [
      { index: true, element: <Landing /> },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/shop",
        element: <AllItems />,
        loader: allItemsLoader,
        action: allItemsOrderAction,
      },
      {
        path: "/trade",
        element: <AllTradeItems />,
        loader: allTradeItemsLoader,
        action: TradeOfferAction,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    loader: dashboardLoader,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardPageLoader,
      },
      {
        path: "shop/add-item",
        element: <AddItem />,
        action: addItemAction,
        loader: userShopLoader,
      },
      {
        path: "trade/add-item",
        element: <AddItem />,
      },
      {
        path: "trade-offers",
        element: <TradeOffers />,
        loader: TradeOffersLoader,
      },
      {
        path: "shop/orders",
        element: <Orders />,
        loader: OrdersLoader,
      },
      {
        path: "shop/orders/:orderId",
        element: <Order />,
        loader: SingleOrderLoader,
        action: SingleOrderAction,
      },
      {
        path: "admin/users",
        element: <Users />,
        loader: allUsersLoader,
      },
    ],
  },
]);

export default router;
