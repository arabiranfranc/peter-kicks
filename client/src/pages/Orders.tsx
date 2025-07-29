import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";

type OrderItem = {
  itemId?: string;
  productId?: string;
  name: string;
  img?: string;
  price: number;
};

type Order = {
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<Order[]> => {
  try {
    const { data } = await customFetch.get("/orders");
    return data.orders;
  } catch (error) {
    console.error("Orders loader error:", error);
    toast.error("Failed to load orders.");
    return [];
  }
};

const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 border-yellow-500",
    shipped: "bg-blue-50 border-blue-300",
    completed: "bg-green-50 border-green-300",
    cancelled: "bg-gray-100 border-gray-300",
    accepted: "bg-emerald-50 border-emerald-300",
    declined: "bg-red-50 border-red-300",
  };
  return styles[status] || "bg-white border-gray-200";
};

const Orders: React.FC = () => {
  const orders = useLoaderData() as Order[];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <Link to={`/dashboard/shop/orders/${order.orderId}`}>
              <div
                key={order.orderId}
                className={`border-4 rounded-2xl p-4 shadow-sm mt-2 ${getStatusStyle(
                  order.status
                )}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-base font-semibold">
                    Order #{order.orderId.slice(-6)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-sm text-gray-700 flex flex-col sm:flex-row sm:justify-evenly sm:items-center gap-1 sm:gap-4">
                  <span>
                    👤 {order.user.name} ({order.user.email})
                  </span>
                  <span>📦 {order.shippingAddress}</span>
                  <span>💳 {order.paymentMethod}</span>
                  <span className="font-semibold text-indigo-600">
                    ₱{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
