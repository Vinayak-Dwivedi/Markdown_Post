import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://reqres.in/api/users/${id}`)
      .then((res) => setUser(res.data.data))
      .catch(() => setError("Failed to fetch user details. Try again."));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!user.first_name || !user.last_name || !user.email) {
      setError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      alert("User updated successfully!");
      navigate("/users");
    } catch (error) {
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-xl font-bold mb-4 text-center font-serif">
        Edit User
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={user.first_name}
          onChange={(e) => setUser({ ...user, first_name: e.target.value })}
          placeholder="First Name"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          value={user.last_name}
          onChange={(e) => setUser({ ...user, last_name: e.target.value })}
          placeholder="Last Name"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 font-serif disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
