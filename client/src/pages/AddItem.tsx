import {
  Form,
  useOutletContext,
  type ActionFunctionArgs,
} from "react-router-dom";
import FormRow from "../components/FormRow";
import SubmitBtn from "../components/SubmitBtm";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";
import type { User } from "./DashboardLayout";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const file = formData.get("img");
  const wearValueRaw = formData.get("itemWear[wearValue]");

  const wearValue = parseFloat(String(wearValueRaw));

  if (isNaN(wearValue) || wearValue <= 0 || wearValue >= 1) {
    toast.error("Wear Value must be a number between 0 and 1");
    return null;
  }

  formData.set("wearValue", String(wearValue));

  if (file instanceof File && file.size > 500000) {
    toast.error("Image size too large");
    return null;
  }

  try {
    await customFetch.post("/shop", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    toast.success("New item added successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to add new item");
  }
  return null;
};

const AddItem: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div>
      <Form method="post" encType="multipart/form-data" className="form">
        <h1 className="form-title">Add Item</h1>
        <div className="form-center">
          <FormRow type="text" name="name" />
          <FormRow type="text" name="size" />
          <FormRow type="number" name="srp" />
          <FormRow type="number" name="price" />
          <FormRow type="text" name="itemWear[wearValue]" />
          <div className="form-row">
            <label htmlFor="img">Upload Image</label>
            <input type="file" id="img" name="img" accept="image/*" required />
          </div>
          <SubmitBtn />
        </div>
      </Form>
    </div>
  );
};

export default AddItem;
