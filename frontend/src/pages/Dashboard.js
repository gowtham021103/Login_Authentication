import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    api
      .get("/api/users/")
      .then((res) => setUsers(res.data || []))
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError(err.response?.data || err.message || "Failed to load users");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="page-container" style={{ maxWidth: "700px" }}>
      <h1 className="page-title">Dashboard - All Users</h1>
      {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div className="user-card" key={user.id}>
            <strong>{user.username}</strong> – {user.email}
          </div>
        ))
      )}
    </div>
  );
}
