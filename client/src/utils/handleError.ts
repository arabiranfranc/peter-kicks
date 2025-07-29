// utils/handleError.ts
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const handleAxiosError = (
  error: unknown,
  fallback = "Something went wrong"
) => {
  if (isAxiosError<{ msg: string }>(error)) {
    toast.error(error.response?.data?.msg || fallback);
  } else {
    toast.error(fallback);
  }
};
