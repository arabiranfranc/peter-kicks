import {
  Form,
  Link,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import FormRow from "../components/FormRow";
import sneaker from "../assets/sneaker.png";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";
import SubmitBtn from "../components/SubmitBtm";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/login", data);
    toast.success("Login successful");
    return redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const Login: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white p-2 rounded-full shadow-lg border-3 border-black">
          <img
            src={sneaker}
            alt="Logo"
            className="w-28 h-28 object-contain rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-center border-2 border-black rounded-2xl shadow-2xl text-black">
        <div className="max-w-full h-[75vh] max-w-md bg-transparent flex flex-col justify-center gap-5">
          <div className="flex justify-center">
            <h2>Login</h2>
          </div>
          <Form method="post">
            <FormRow type="email" name="email" labelText="Email" />
            <FormRow type="password" name="password" labelText="Password" />
            <SubmitBtn />
            <p className="text-sm text-center text-gray-600">
              Not a member?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
