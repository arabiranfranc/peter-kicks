import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  Form,
  redirect,
} from "react-router-dom";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import cart from "../assets/icons/cart.png";
import CartDropdown from "../components/CartDropdown";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";
import Modal from "../components/Modal";
import SearchComponent, {
  type SearchParams,
} from "../components/SearchComponent";

export type Item = {
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "";
    const minPrice = parseFloat(url.searchParams.get("priceMin") || "0");
    const maxPrice = parseFloat(url.searchParams.get("priceMax") || "999999");
    const minSize = parseFloat(url.searchParams.get("sizeMin") || "0");
    const maxSize = parseFloat(url.searchParams.get("sizeMax") || "99");
    const itemWear = url.searchParams.getAll("itemWear");

    const params: Record<string, any> = {
      name,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      itemWear,
    };

    const { data } = await customFetch.get("/shop", { params });
    return Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error("Loader error:", error);
    toast.error("Failed to load items.");
    return [];
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);
    const cartItems = JSON.parse(rawData.cartItems as string);
    const paymentMethod = rawData.paymentMethod;
    const fulfillmentMethod = rawData.fulfillmentMethod;
    let address = rawData.address;

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty.");
      return null;
    }

    if (paymentMethod === "ewallet" && fulfillmentMethod === "pickup") {
      address = "Poblacion, Makati";
    }

    await customFetch.post("/orders", {
      cartItems,
      paymentMethod,
      fulfillmentMethod,
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
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cashondelivery");
  const [fulfillmentMethod, setFulfillmentMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearchChange = (params: Partial<SearchParams>) => {
    const newParams = new URLSearchParams();

    if (params.name) newParams.set("name", params.name);
    if (params.minPrice) newParams.set("priceMin", params.minPrice);
    if (params.maxPrice) newParams.set("priceMax", params.maxPrice);
    if (params.minSize) newParams.set("sizeMin", params.minSize);
    if (params.maxSize) newParams.set("sizeMax", params.maxSize);
    if (params.itemWear && params.itemWear.length > 0) {
      params.itemWear.forEach((wear) => newParams.append("itemWear", wear));
    }

    // 🛑 Avoid updating if identical to current searchParams
    if (newParams.toString() === searchParams.toString()) return;

    setSearchParams(newParams);
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddToCart = (item: Item) => {
    setCartItems((prevItems) => {
      const isAlreadyInCart = prevItems.some((i) => i.itemId === item.itemId);
      return isAlreadyInCart
        ? prevItems.filter((i) => i.itemId !== item.itemId)
        : [...prevItems, item];
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-start mb-4">
        <div className="ml-auto">
          <CartDropdown
            cartItems={cartItems}
            totalPrice={totalPrice}
            onOpenModal={handleModalOpen}
          />
        </div>

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

            <label className="text-black font-semibold">
              Payment Method:
              <select
                name="paymentMethod"
                required
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setFulfillmentMethod("delivery");
                }}
                className="text-black p-2 rounded border mt-1 block w-64"
              >
                <option value="cashondelivery">Cash on Delivery</option>
                <option value="ewallet">E-wallet</option>
              </select>
            </label>

            {paymentMethod === "ewallet" && (
              <label className="text-black font-semibold">
                Fulfillment Option:
                <select
                  name="fulfillmentMethod"
                  required
                  value={fulfillmentMethod}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFulfillmentMethod(value);
                    if (value === "pickup") {
                      setAddress("Poblacion, Makati");
                    } else {
                      setAddress("");
                    }
                  }}
                  className="text-black p-2 rounded border mt-1 block w-64"
                >
                  <option value="delivery">Deliver to Address</option>
                  <option value="pickup">Pick Up</option>
                </select>
              </label>
            )}

            {(paymentMethod === "cashondelivery" ||
              (paymentMethod === "ewallet" &&
                fulfillmentMethod === "delivery")) && (
              <label className="text-black font-semibold">
                Shipping Address:
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-black p-2 rounded border mt-1 block w-64"
                />
              </label>
            )}

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

      <div className="flex gap-6">
        <div className="w-1/5">
          <SearchComponent onSearchChange={handleSearchChange} />
        </div>
        <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const isInCart = cartItems.some((i) => i.itemId === item.itemId);
            return (
              <div
                key={item.itemId}
                className="relative h-[360px] bg-slate-600 border-2 border-black text-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-80 object-cover"
                />
                {item.discount !== 0 && (
                  <div className="absolute top-2 left-2 bg-green-400/80 px-2 py-1 rounded shadow">
                    <p className="text-green-800 text-md">
                      {item.discount > 0 ? "+" : "-"}
                      {Math.abs(item.discount).toFixed(0)}%
                    </p>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white bg-opacity-80 text-black px-3 py-1 rounded shadow">
                  <p className="text-sm text-gray-600">S{item.size}</p>
                </div>
                <div className="absolute bottom-10 p-3 space-y-2">
                  <div className="text-xl font-bold">{item.name}</div>
                  <div className="text-sm text-gray-300">
                    {item.itemWear.label} / ₱{item.price.toLocaleString()}
                  </div>
                </div>
                <button
                  className={`absolute bottom-0 left-0 right-0 border-t border-black text-white font-bold py-2 px-4 text-lg transition-colors duration-300 ${
                    isInCart
                      ? "bg-red-400 hover:bg-red-500"
                      : "bg-slate-800 hover:bg-slate-900"
                  }`}
                  onClick={() => handleAddToCart(item)}
                >
                  <div className="flex justify-center items-center gap-2">
                    <img src={cart} alt="cart" className="w-6 h-6" />
                    {isInCart ? "Remove" : "Add to Cart"}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllItems;
