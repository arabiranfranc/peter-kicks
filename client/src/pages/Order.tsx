import {
  useLoaderData,
  Form,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";

export const loader = async ({ params }: LoaderFunctionArgs): Promise<any> => {
  try {
    const { orderId } = params;
    const { data } = await customFetch.get(`/orders/${orderId}`);
    return data.order;
  } catch (error) {
    console.error("Single order loader error:", error);
    toast.error("Failed to load order.");
    return null;
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const newStatus = formData.get("status");

  try {
    await customFetch.patch(`/orders/${params.orderId}`, {
      status: newStatus,
    });
    toast.success(`Order marked as "${newStatus}"`);
    return redirect(`/dashboard/shop/orders/${params.orderId}`); // reload order page
  } catch (error) {
    console.error("Update order status failed:", error);
    toast.error("Failed to update status.");
    return null;
  }
};

const Order: React.FC = () => {
  const order = useLoaderData() as any;

  if (!order) {
    return <p className="text-center text-gray-500">Order not found.</p>;
  }

  const renderActions = () => {
    const status = order.status.toLowerCase();
    if (status === "pending") {
      return (
        <div className="flex gap-2 mt-4">
          <Form method="post">
            <button
              name="status"
              value="accepted"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
          </Form>
          <Form method="post">
            <button
              name="status"
              value="declined"
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Decline
            </button>
          </Form>
        </div>
      );
    }

    if (status === "accepted" || status === "declined") {
      return (
        <div className="flex gap-2 mt-4">
          <Form method="post">
            <button
              name="status"
              value="completed"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Complete
            </button>
          </Form>
          <Form method="post">
            <button
              name="status"
              value="cancelled"
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </Form>
        </div>
      );
    }

    return null; // if status is already "cancelled" or "completed"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Order #{order.orderId?.slice(-6)}
      </h1>

      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        <p>
          <strong>Customer:</strong> {order.user.name} ({order.user.email})
        </p>
        <p>
          <strong>Shipping:</strong> {order.shippingAddress}
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{order.status}</span>
        </p>
        <p>
          <strong>Total:</strong> ₱{order.totalPrice.toLocaleString()}
        </p>
      </div>

      {renderActions()}

      <h2 className="text-xl font-semibold mt-6 mb-3">Items</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {order.items.map((item: any) => (
          <div
            key={item.itemId}
            className="flex items-center border rounded-lg p-3 shadow-sm bg-gray-50"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500">₱{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
