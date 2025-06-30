import type { FC } from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import img from "../assets/not-found.svg";

const Error: FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="min-h-screen text-center flex items-center justify-center px-4">
        <div>
          <img
            src={img}
            alt="not found"
            className="w-[90vw] max-w-[600px] mx-auto mb-8 -mt-12 block"
          />
          <h3 className="mb-2 text-xl font-semibold">
            Night Night!! page not found
          </h3>
          <p className="mt-4 mb-4 text-[var(--text-secondary-color)] leading-6">
            We can't seem to find the page you're looking for
          </p>
          <Link
            to="/dashboard"
            className="text-[var(--primary-500)] capitalize underline hover:opacity-80"
          >
            back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-center flex items-center justify-center px-4">
      <div>
        <h3 className="text-xl font-semibold">Something went wrong</h3>
      </div>
    </main>
  );
};

export default Error;
