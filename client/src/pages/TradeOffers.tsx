import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";
import { useState } from "react";

type TradeItem = {
  itemId: string;
  name: string;
  img: string;
  price: number;
  size?: string;
  details?: string;
  itemWear?: {
    label: string;
    wearValue: number;
  };
};

type TradeOffer = {
  _id: string;
  userOne: string;
  userTwo: string;
  userOneItems: TradeItem[];
  userTwoItems: TradeItem[];
  userOneTotalPrice: number;
  userTwoTotalPrice: number;
  shippingAddress: string;
  status: "pending" | "accepted" | "declined" | "cancelled" | "completed";
  createdAt: string;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<TradeOffer[]> => {
  try {
    const { data } = await customFetch.get("/trade/trade-offer");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Loader error:", error);
    return [];
  }
};

const TradeOffers: React.FC = () => {
  const loadedOffers = useLoaderData() as TradeOffer[];
  const [offers, setOffers] = useState<TradeOffer[]>(loadedOffers);

  const updateStatus = async (tradeId: string, newStatus: string) => {
    try {
      await customFetch.patch(`/trade/update-status/${tradeId}`, {
        status: newStatus,
      });

      setOffers((prev) =>
        prev.map((offer) =>
          offer._id === tradeId ? { ...offer, status: newStatus as any } : offer
        )
      );

      toast.success(`Trade marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update trade status");
    }
  };

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold mb-4">Trade Offers</h1>

      {offers.map((offer) => (
        <div
          key={offer._id}
          className="border border-gray-600 rounded-lg p-4 shadow bg-gray-900"
        >
          <div className="mb-2 text-sm text-gray-400">
            Trade ID: <span className="text-white">{offer._id}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* User One Items */}
            <div>
              <h2 className="text-lg font-semibold mb-2">User One Items</h2>
              <div className="space-y-2">
                {offer.userOneItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center gap-4 bg-gray-800 p-2 rounded"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div>{item.name}</div>
                      <div>₱{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Total: ₱{offer.userOneTotalPrice}
              </div>
            </div>

            {/* User Two Items */}
            <div>
              <h2 className="text-lg font-semibold mb-2">User Two Items</h2>
              <div className="space-y-2">
                {offer.userTwoItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center gap-4 bg-gray-800 p-2 rounded"
                  >
                    <img
                      src={
                        item.img.startsWith("http")
                          ? item.img
                          : `https://res.cloudinary.com/north-side/image/upload/v1750638043/${item.img}`
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div>{item.name}</div>
                      <div>₱{item.price}</div>
                      <div className="text-sm text-gray-400">
                        {item.details} — Size: {item.size}
                      </div>
                      {item.itemWear && (
                        <div className="text-sm text-yellow-400">
                          Wear: {item.itemWear.label} ({item.itemWear.wearValue}
                          )
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Total: ₱{offer.userTwoTotalPrice}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm">
              Shipping Address:{" "}
              <span className="text-white">{offer.shippingAddress}</span>
            </p>
            <p className="text-sm">
              Status:{" "}
              <span className="font-bold capitalize">{offer.status}</span>
            </p>
          </div>

          {/* Action Buttons */}
          {offer.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateStatus(offer._id, "accepted")}
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(offer._id, "declined")}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white"
              >
                Decline
              </button>
            </div>
          )}

          {offer.status === "accepted" && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateStatus(offer._id, "completed")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white"
              >
                Complete
              </button>
              <button
                onClick={() => updateStatus(offer._id, "cancelled")}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded text-black"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TradeOffers;
