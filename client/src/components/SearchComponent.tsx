import React, { useEffect, useState } from "react";

export const ITEM_WEAR = {
  BRAND_NEW: "brand-new",
  VNDS: "vnds",
  UIGC: "uigc",
  BEATERS: "beaters",
} as const;

export type SearchParams = {
  name: string;
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
  itemWear: string[];
};

type Props = {
  onSearchChange: (params: SearchParams) => void;
};

const defaultSearchParams: SearchParams = {
  name: "",
  minPrice: "",
  maxPrice: "",
  minSize: "",
  maxSize: "",
  itemWear: [],
};

const SearchComponent: React.FC<Props> = ({ onSearchChange }) => {
  const [searchParams, setSearchParams] =
    useState<SearchParams>(defaultSearchParams);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearchChange(searchParams);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchParams, onSearchChange]);

  const handleCheckboxChange = (wear: string) => {
    setSearchParams((prev) => {
      const exists = prev.itemWear.includes(wear);
      return {
        ...prev,
        itemWear: exists
          ? prev.itemWear.filter((w) => w !== wear)
          : [...prev.itemWear, wear],
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setSearchParams(defaultSearchParams);
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={searchParams.name}
          onChange={handleChange}
          placeholder="Search by name..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Min Price
        </label>
        <input
          type="number"
          name="minPrice"
          value={searchParams.minPrice}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Price
        </label>
        <input
          type="number"
          name="maxPrice"
          value={searchParams.maxPrice}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Size Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Min Size
        </label>
        <input
          type="number"
          name="minSize"
          value={searchParams.minSize}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Size
        </label>
        <input
          type="number"
          name="maxSize"
          value={searchParams.maxSize}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Item Wear */}
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Wear
        </label>
        <div className="flex flex-wrap gap-4">
          {Object.entries(ITEM_WEAR).map(([label, value]) => (
            <label key={value} className="inline-flex items-center">
              <input
                type="checkbox"
                value={value}
                checked={searchParams.itemWear.includes(value)}
                onChange={() => handleCheckboxChange(value)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-sm capitalize">
                {value.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="col-span-full flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default SearchComponent;
