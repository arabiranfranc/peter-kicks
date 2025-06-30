import {
  useLoaderData,
  useLocation,
  Form,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import cart from "../assets/icons/cart.png";
import { useState } from "react";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";
import Modal from "../components/Modal";
import TradeCartDropdown from "../components/TradeCartDropDown";
import { Plus, Trash2 } from "lucide-react";

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
    const { data } = await customFetch.get("/trade");
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

    await customFetch.post("/trade/trade-offer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Trade offer submitted successfully");
    return redirect("/trade");
  } catch (error: any) {
    console.error("Trade submit error:", error);
    toast.error(error?.response?.data?.message || "Failed to place the order");
    return null;
  }
};

const AllTradeItems: React.FC = () => {
  const items = useLoaderData() as Item[];
  const { pathname } = useLocation();
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [userTwoItems, setUserTwoItems] = useState([
    { name: "", price: 0, size: "", details: "", itemWearValue: 0 },
  ]);
  console.log(userTwoItems);
  const [shippingAddress, setShippingAddress] = useState("");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updated = [...images];
    updated[idx] = file;
    setImages(updated);
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

  const handleUserTwoItemChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    const updated = [...userTwoItems];
    const parsedValue =
      field === "price" || field === "itemWearValue" ? Number(value) : value;

    updated[idx] = { ...updated[idx], [field]: parsedValue };
    setUserTwoItems(updated);
  };

  const addUserTwoItem = () => {
    setUserTwoItems((prev) => [
      ...prev,
      { name: "", price: 0, size: "", details: "", itemWearValue: 0 },
    ]);
  };

  const removeUserTwoItem = (idx: number) => {
    const newItems = [...userTwoItems];
    const newImages = [...images];
    newItems.splice(idx, 1);
    newImages.splice(idx, 1);
    setUserTwoItems(newItems);
    setImages(newImages);
  };

  const title = pathname.includes("shop") ? "Shop Items" : "Trade Items";

  if (items.length === 0) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>Search</div>
        <TradeCartDropdown
          cartItems={cartItems}
          totalPrice={totalPrice}
          onOpenModal={handleModalOpen}
        />

        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <h2 className="text-lg font-bold mb-4">Trade Offer</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.itemId}>
                {item.name} - ₱{item.price}
              </li>
            ))}
          </ul>

          <Form
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-4 my-4"
          >
            <input
              type="hidden"
              name="userOneItemIds"
              value={JSON.stringify(cartItems.map((i) => i.itemId))}
            />
            <input
              type="hidden"
              name="userTwoItemsData"
              value={JSON.stringify(userTwoItems)}
            />

            {userTwoItems.map((item, idx) => (
              <div
                key={idx}
                className="border p-2 rounded bg-gray-100 text-black space-y-1"
              >
                <div className="flex justify-between items-center">
                  <strong>Trade Item {idx + 1}</strong>
                  <button
                    type="button"
                    onClick={() => removeUserTwoItem(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) =>
                    handleUserTwoItemChange(idx, "name", e.target.value)
                  }
                  className="w-full border rounded p-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleUserTwoItemChange(idx, "price", e.target.value)
                  }
                  className="w-full border rounded p-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Size"
                  value={item.size}
                  onChange={(e) =>
                    handleUserTwoItemChange(idx, "size", e.target.value)
                  }
                  className="w-full border rounded p-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Details"
                  value={item.details}
                  onChange={(e) =>
                    handleUserTwoItemChange(idx, "details", e.target.value)
                  }
                  className="w-full border rounded p-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Item Wear Value (0 to 1)"
                  step="0.01"
                  min="0"
                  max="1"
                  value={item.itemWearValue}
                  onChange={(e) =>
                    handleUserTwoItemChange(
                      idx,
                      "itemWearValue",
                      e.target.value
                    )
                  }
                  className="w-full border rounded p-1"
                  required
                />

                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  required
                  onChange={(e) => handleImageChange(e, idx)}
                  className="w-full"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addUserTwoItem}
              className="bg-green-600 text-white px-3 py-1 rounded w-fit mt-2 hover:bg-green-700"
            >
              Add Item
            </button>

            <label className="text-white font-semibold mt-4">
              Shipping Address:
              <input
                type="text"
                name="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="text-black p-2 rounded border mt-1 block w-full"
              />
            </label>

            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              disabled={
                cartItems.length === 0 ||
                userTwoItems.length === 0 ||
                images.length !== userTwoItems.length
              }
            >
              Offer Trade
            </button>
          </Form>
        </Modal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-6">
        {items.map((item) => {
          const isInCart = cartItems.some((i) => i.itemId === item.itemId);

          return (
            <div
              key={item.itemId}
              className="relative text-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-60 object-cover"
              />

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
                    : "bg-black border-white"
                } hover:bg-opacity-90 text-white font-bold py-2 px-4 text-2xl transition-colors duration-300`}
                onClick={() => handleAddToCart(item)}
              >
                <img src={cart} alt="cart" className="w-10 h-10" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTradeItems;
