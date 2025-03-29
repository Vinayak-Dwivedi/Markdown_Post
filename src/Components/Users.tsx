import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get(`https://reqres.in/api/users?page=${page}`)
      .then((res) => {
        if (res.data.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers(res.data.data);
          setFilteredUsers(res.data.data);
          setHasMore(page < res.data.total_pages);
        }
      })
      .catch(() => alert("Failed to fetch users."));
  }, [page, navigate]);

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user: any) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div className="p-6 bg-slate-200 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 font-serif text-center">
        User List
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 mb-4 border rounded w-full max-w-md"
      />

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {filteredUsers.map((user: any) => (
            <div
              key={user.id}
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-200 font-serif text-center"
            >
              <img
                src={user.avatar}
                alt={user.first_name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <h3 className="mt-2 text-lg font-semibold">
                {user.first_name} {user.last_name}
              </h3>
              <button
                className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-800 font-serif"
                onClick={() => navigate(`/edit/${user.id}`)}
              >
                Edit
              </button>
              <button
                className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-800 font-serif"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg font-serif text-gray-600">No users found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between w-full max-w-4xl mt-4 px-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-300 font-serif rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => hasMore && setPage(page + 1)}
          disabled={!hasMore}
          className="p-2 bg-gray-300 rounded font-serif disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Handle user deletion
const handleDelete = async (id: number) => {
  try {
    await axios.delete(`https://reqres.in/api/users/${id}`);
    alert("User deleted successfully!");
    window.location.reload();
  } catch {
    alert("Failed to delete user.");
  }
};

export default Users;
