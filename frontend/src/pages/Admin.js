import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(u => u.id !== id));
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData({ username: user.username, email: user.email });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ username: "", email: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${editingId}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
      setEditingId(null);
      setFormData({ username: "", email: "" });
      setErrors({});
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px" }}>
      <h1 className="page-title">Admin Panel</h1>

      {editingId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="modal-buttons">
              <button className="btn-save" onClick={updateUser}>
                Save
              </button>
              <button className="btn-cancel" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {users.map(user => (
        <div className="user-card" key={user.id}>
          <strong>{user.username}</strong> – {user.email}
          <button onClick={() => startEdit(user)} className="btn-edit">
            Edit
          </button>
          <button onClick={() => deleteUser(user.id)} className="btn-delete">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}