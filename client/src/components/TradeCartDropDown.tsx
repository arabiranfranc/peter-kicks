import { useState } from "react";
import { ChevronDown, Repeat } from "lucide-react";

type Item = {
  itemId: string;
  name: string;
  price: number;
  img: string;
};

type CartDropdownProps = {
  cartItems: Item[];
  totalPrice: number;
  onOpenModal: () => void;
};

const TradeCartDropdown: React.FC<CartDropdownProps> = ({
  cartItems,
  totalPrice,
  onOpenModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        <Repeat className="w-8 h-8 text-gray-400" />
        {totalPrice}
        {`(${cartItems.length})`}
        <ChevronDown className="w-8 h-8 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 p-4 border-black border-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Your Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <ul className="divide-y divide-gray-200 grid grid-cols-2 gap-2">
              {cartItems.map((item) => (
                <li key={item.itemId} className="py-2 text-sm text-gray-800">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div> {item.name}</div>₱{item.price.toLocaleString()}
                </li>
              ))}
            </ul>
          )}
          <button onClick={onOpenModal} className="bg-white px-4 py-2 rounded">
            View Cart ({cartItems.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeCartDropdown;
