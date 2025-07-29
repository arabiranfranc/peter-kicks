import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { toast } from "sonner"; // Make sure this is installed and used in your app
import customFetch from "../utils/customFetch"; // Adjust path if needed

type User = {
  id: string;
  name: string;
  email: string;
  number: string;
  location: string;
  role: string;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<User[]> => {
  try {
    const { data } = await customFetch.get("/dashboard/admin/users");
    return data?.users || []; // assuming the backend returns { users: [...] }
  } catch (error) {
    console.error("Loader error:", error);
    toast.error("Failed to load users.");
    return [];
  }
};

const Users: React.FC = () => {
  const users = useLoaderData() as User[];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Number</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>

                <td className="px-4 py-2 border">{user.number}</td>
                <td className="px-4 py-2 border">{user.location}</td>
                <td className="px-4 py-2 border">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
