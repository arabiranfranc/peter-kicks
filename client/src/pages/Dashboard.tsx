import React from "react";
import {
  Star,
  ShoppingCart,
  Repeat,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* User Rating */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
        <Star className="text-yellow-500 w-8 h-8" />
        <div>
          <p className="text-sm text-gray-500">Seller Rating</p>
          <p className="text-2xl font-bold text-gray-800">4.8 / 5</p>
        </div>
      </div>

      {/* Orders / Trade / History */}
      <div className="grid grid-cols-3 gap-4">
        <Card icon={<ShoppingCart className="w-6 h-6" />} label="Orders" />
        <Card icon={<Repeat className="w-6 h-6" />} label="Trade" />
      </div>

      {/* Success Transactions with Total Items */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Total Success Transactions
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <SuccessCard
            label="Trade"
            transactions={132}
            items={270}
            icon={<CheckCircle className="text-green-600 w-6 h-6" />}
          />
          <SuccessCard
            label="Market"
            transactions={89}
            items={145}
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
            <p className="text-xl font-bold text-gray-800">₱52,300.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  icon: React.ReactNode;
  label: string;
};

const Card: React.FC<CardProps> = ({ icon, label }) => (
  <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition">
    <div className="text-blue-600">{icon}</div>
    <span className="text-md font-medium text-gray-800">{label}</span>
  </div>
);

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
