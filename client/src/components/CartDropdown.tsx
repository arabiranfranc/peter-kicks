import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

const CartDropdown: React.FC<CartDropdownProps> = ({
  cartItems,
  totalPrice,
  onOpenModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-slate-800 inline-block text-left text-white mb-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-1 px-4 py-2 text-md font-medium text-white bg-slate-800 border rounded-md shadow-sm"
      >
        {totalPrice}Cart{`(${cartItems.length})`}
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-100 origin-top-right rounded-md bg-slate-800 shadow-lg ring-1 ring-black/5 p-5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Your Cart</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-white bg-red-500 hover:underline"
            >
              Close
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <ul className="mb-2 grid grid-cols-2 gap-2">
              {cartItems.map((item) => (
                <li key={item.itemId} className="py-2 text-sm bg-slate-600">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="ml-2">
                    <div> {item.name}</div>
                    <div>₱{item.price.toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onOpenModal}
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
