import React, { useState } from "react";
import {
  Form,
  useLoaderData,
  useOutletContext,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import FormRow from "../components/FormRow";
import SubmitBtn from "../components/SubmitBtm";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";
import type { User } from "./DashboardLayout";
import { handleAxiosError } from "../utils/handleError";
import { Pencil, Trash2, Plus } from "lucide-react";

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
  op: number;
  createdAt: string;
  discount: number;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<Item[]> => {
  try {
    const { data } = await customFetch.get("/shop/user-shop");
    return Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error("Loader error:", error);
    toast.error("Failed to load items.");
    return [];
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  try {
    if (_action === "delete") {
      const itemId = formData.get("itemId") as string;
      await customFetch.delete(`/shop/user-shop/${itemId}`);
      toast.success("Item deleted");
      return null;
    }

    const wearValue = parseFloat(formData.get("itemWear[wearValue]") as string);
    if (isNaN(wearValue) || wearValue < 0 || wearValue > 1) {
      toast.error("Wear Value must be between 0 and 1");
      return null;
    }

    const file = formData.get("img");
    if (file instanceof File && file.size > 500000) {
      toast.error("Image size too large");
      return null;
    }

    const payload = new FormData();
    formData.forEach((val, key) => payload.append(key, val));

    if (_action === "update") {
      const itemId = formData.get("itemId") as string;
      await customFetch.patch(`/shop/user-shop/${itemId}`, payload);
      toast.success("Item updated");
    } else {
      await customFetch.post("/shop/user-shop", payload);
      toast.success("Item created");
    }
  } catch (error) {
    handleAxiosError(error);
  }
  return null;
};

const AddItem: React.FC = () => {
  const items = useLoaderData() as Item[];
  const { user } = useOutletContext<{ user: User }>();
  const [preview, setPreview] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setPreview(item.img);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setPreview(null);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Item) => {
    setDeleteTarget(item);
  };

  return (
    <div>
      <div className="mb-4 text-right">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus className="inline w-4 h-4 mr-1" /> Add New Item
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg border"
            />

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} • Wear: {item.itemWear.label} (
                    {item.itemWear.wearValue})
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                SRP: ₱{item.srp} • Price: ₱{item.price} • OP: ₱{item.op}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Pencil className="w-4 h-4" /> Update
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <Form method="post">
                <input type="hidden" name="_action" value="delete" />
                <input
                  type="hidden"
                  name="itemId"
                  value={deleteTarget.itemId}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => setDeleteTarget(null)}
                >
                  Confirm Delete
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-xl">
            <h1 className="text-xl font-semibold mb-4">
              {editItem ? "Update Item" : "Add Item"}
            </h1>
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
              key={editItem?.itemId || "create-form"}
            >
              <input
                type="hidden"
                name="_action"
                value={editItem ? "update" : "create"}
              />
              {editItem && (
                <input type="hidden" name="itemId" value={editItem.itemId} />
              )}

              <FormRow
                type="text"
                name="name"
                defaultValue={editItem?.name ?? ""}
              />
              <FormRow
                type="text"
                name="size"
                defaultValue={editItem?.size ?? ""}
              />
              <FormRow
                type="number"
                name="srp"
                defaultValue={editItem?.srp?.toString() ?? ""}
              />
              <FormRow
                type="number"
                name="price"
                defaultValue={editItem?.price?.toString() ?? ""}
              />
              <FormRow
                type="number"
                name="op"
                defaultValue={editItem?.op?.toString() ?? ""}
              />
              <FormRow
                type="text"
                name="itemWear[wearValue]"
                defaultValue={editItem?.itemWear?.wearValue?.toString() ?? ""}
              />

              <div className="form-row">
                <label htmlFor="img">Upload Image</label>
                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 rounded-lg border w-48 h-auto object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <SubmitBtn />
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItem;
