import { Form, Link, redirect } from "react-router-dom";
import FormRow from "../components/FormRow";
import sneaker from "../assets/sneaker.png";
import customFetch from "../utils/customFetch";
import type { ActionFunctionArgs } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtm";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  const data = rawData as Record<string, string>;

  if (!data.birthday || data.birthday.trim() === "") {
    delete data.birthday;
  } else {
    data.birthday = data.birthday;
  }

  try {
    await customFetch.post("/auth/register", data);
    toast.success("User Register Successfully");
    // return redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const Register: React.FC = () => {
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key);

      if (
        pressedKeys.has("Control") &&
        pressedKeys.has("F9") &&
        pressedKeys.has("F11")
      ) {
        setShowSecret((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
        <div className="max-w-full h-[75vh] max-w-md bg-transparent flex flex-col justify-center gap-4">
          <div className="flex justify-center">
            <h2>Create an account</h2>
          </div>
          <Form method="post">
            <FormRow type="email" name="email" labelText="Email" />
            <FormRow type="password" name="password" labelText="Password" />
            <FormRow type="text" name="name" labelText="Firstname" />
            <FormRow type="text" name="lastName" labelText="Lastname" />
            <FormRow type="text" name="location" labelText="Location" />
            <FormRow
              type="date"
              name="birthday"
              labelText="Birthday"
              defaultValue="2000-01-01"
            />

            {showSecret && (
              <FormRow type="text" name="secretKey" labelText="Secret Key" />
            )}

            <SubmitBtn />

            <p className="text-sm text-center text-gray-600">
              Already a member?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
