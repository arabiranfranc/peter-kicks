import React from "react";
import {
  Star,
  ShoppingCart,
  Repeat,
  CheckCircle,
  TrendingUp,
  ShoppingBag,
  User2,
} from "lucide-react";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";

type DashboardStats = {
  totalCompletedOrders: number;
  totalPendingOrders: number;
  totalRejectedOrders: number;
  totalEarnings: number;
  monthlyEarnings: any[];
  totalItemsCount: number;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { data } = await customFetch.get("/dashboard");
    return data;
  } catch (error) {
    console.error("Loader error:", error);
    toast.error("Failed to load dashboard stats.");
    return null;
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as DashboardStats;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Seller Rating (static) */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
        <Star className="text-yellow-500 w-8 h-8" />
        <div>
          <p className="text-sm text-gray-500">Seller Rating</p>
          <p className="text-2xl font-bold text-gray-800">4.8 / 5</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          onClick={() => navigate("/dashboard/shop/add-item")}
          icon={<ShoppingBag className="w-6 h-6" />}
          label="ShopItems"
        />
        <Card
          onClick={() => navigate("/dashboard/shop/orders")}
          icon={<ShoppingCart className="w-6 h-6" />}
          label="Orders"
          badge={data?.totalPendingOrders || 0}
        />
        <Card icon={<Repeat className="w-6 h-6" />} label="Trade" />
        <Card
          onClick={() => navigate("/dashboard/admin/users")}
          icon={<User2 className="w-6 h-6" />}
          label="Users"
        />
      </div>

      {/* Success Transactions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Total Success Transactions
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <SuccessCard
            label="Shop"
            transactions={data?.totalCompletedOrders || 0}
            items={data?.totalItemsCount || 0}
            icon={<CheckCircle className="text-green-600 w-6 h-6" />}
          />
          <SuccessCard
            label="Trade"
            transactions={0}
            items={0}
            icon={<CheckCircle className="text-green-600 w-6 h-6" />}
          />
        </div>
      </div>

      {/* Sales Market */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Market
        </h2>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <TrendingUp className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-xl font-bold text-gray-800">
              ₱{data?.totalEarnings.toLocaleString("en-PH") || "0.00"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
};

const Card: React.FC<CardProps> = ({ icon, label, onClick, badge }) => {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-200 flex flex-col items-center justify-center text-center gap-2"
    >
      <div className="relative">
        {icon}
        {badge && badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

type SuccessCardProps = {
  icon: React.ReactNode;
  label: string;
  transactions: number;
  items: number;
};

const SuccessCard: React.FC<SuccessCardProps> = ({
  icon,
  label,
  transactions,
  items,
}) => (
  <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 border border-gray-200">
    <div className="bg-green-100 p-2 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-md text-gray-700">
        Transactions: <span className="font-bold">{transactions}</span>
      </p>
      <p className="text-md text-gray-700">
        Items: <span className="font-bold">{items}</span>
      </p>
    </div>
  </div>
);

export default Dashboard;
