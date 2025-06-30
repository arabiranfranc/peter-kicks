import axios, { AxiosError } from "axios";

const customFetch = axios.create({
  baseURL: "/api",
});

customFetch.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ msg: string }>) => {
    return Promise.reject(error);
  }
);

export default customFetch;
