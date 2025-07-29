import { useLoaderData, useLocation, Form, redirect } from "react-router-dom";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import cart from "../assets/icons/cart.png";
import CartDropdown from "../components/CartDropdown";
import { useState } from "react";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";
import Modal from "../components/Modal";

type Item = {
  itemId: string;
  name: string;
  size: string;
  itemStatus: string;
  itemWear: {
    label: string;
    wearValue: number;
  };
  img: string;
  srp: number;
  price: number;
  discount: number;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<Item[]> => {
  try {
    const { data } = await customFetch.get("/shop");
    return Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error("Loader error:", error);
    toast.error("Failed to load items.");
    return [];
  }
};

// 👇 Uniform action using customFetch
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    const cartItems = JSON.parse(rawData.cartItems as string);
    const paymentMethod = rawData.paymentMethod;
    const address = rawData.address;

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty.");
      return null;
    }

    await customFetch.post("/orders", {
      cartItems,
      paymentMethod,
      shippingAddress: address,
    });

    toast.success("Order placed successfully");
    return redirect("/shop");
  } catch (error: any) {
    if (error?.response?.status === 401) {
      toast.error("Login to shop");
      return redirect("/login");
    }
    toast.error(error?.response?.data?.message || "Failed to place the order");
  }
};

const AllItems: React.FC = () => {
  const items = useLoaderData() as Item[];
  const { pathname } = useLocation();
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddToCart = (item: Item) => {
    setCartItems((prevItems) => {
      const isAlreadyInCart = prevItems.some((i) => i.itemId === item.itemId);
      if (isAlreadyInCart) {
        return prevItems.filter((i) => i.itemId !== item.itemId);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const title = pathname.includes("shop") ? "Shop Items" : "Trade Items";
  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>Search</div>
        <CartDropdown
          cartItems={cartItems}
          totalPrice={totalPrice}
          onOpenModal={handleModalOpen}
        />
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <h2 className="text-lg font-bold mb-4">Your Cart</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.itemId}>
                {item.name} - ₱{item.price}
              </li>
            ))}
          </ul>
          <Form method="post" className="flex flex-col gap-2 my-4">
            <input
              type="hidden"
              name="cartItems"
              value={JSON.stringify(cartItems)}
            />
            <input type="hidden" name="paymentMethod" value="cashondelivery" />
            <label className="text-black font-semibold">
              Shipping Address:
              <input
                type="text"
                name="address"
                required
                className="text-black p-2 rounded border mt-1 block w-64"
              />
            </label>
            <button
              type="submit"
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              disabled={cartItems.length === 0}
            >
              Place Order
            </button>
          </Form>
          <button
            onClick={handleModalClose}
            className="mt-4 bg-slate-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </Modal>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-6">
        {items.map((item) => {
          const isInCart = cartItems.some((i) => i.itemId === item.itemId);

          return (
            <div
              key={item.itemId}
              className="relative bg-slate-600 border-2 border-black text-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-60 object-cover"
              />
              <div className="absolute top-2 left-2 bg-green-400/80 px-2 py-1 rounded shadow">
                {item.discount !== 0 && (
                  <p className="text-green-800 text-md">
                    {item.discount > 0 ? "+" : "-"}
                    {Math.abs(item.discount).toFixed(0)}%
                  </p>
                )}
              </div>
              <div className="absolute top-2 right-2 bg-white bg-opacity-80 text-black px-3 py-1 rounded shadow">
                <p className="text-sm text-gray-600">S{item.size}</p>
              </div>
              <div className="absolute bottom-12 left-2 py-1 rounded shadow text-xl">
                <div className="text-lg py-2 rounded">{item.name}</div>
                <div>
                  {item.itemWear.label} / ₱{item.price.toLocaleString()}
                </div>
              </div>

              <button
                className={`w-full flex justify-center border-2 ${
                  isInCart
                    ? "bg-red-400 border-red-400"
                    : "bg-slate-800 border-slate-800"
                } hover:bg-opacity-90 text-white font-bold py-2 px-4 text-2xl transition-colors duration-300`}
                onClick={() => handleAddToCart(item)}
              >
                <img src={cart} alt="cart" className="w-8 h-8" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllItems;
