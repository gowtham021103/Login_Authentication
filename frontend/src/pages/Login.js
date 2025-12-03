import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    
    // Validate inputs
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        username,
        password
      });

      // Store token
      localStorage.setItem("token", res.data.access);

      // Get user details
      const userRes = await axios.get("http://localhost:8000/api/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` }
      });

      // Store user data
      localStorage.setItem("user", JSON.stringify(userRes.data));

      // Navigate based on user role
      if (userRes.data.is_staff) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Login</h1>

      {error && <div style={{ color: "#d9534f", marginBottom: "10px", fontSize: "14px" }}>{error}</div>}

      <input 
        placeholder="Username" 
        value={username}
        onChange={e => setUsername(e.target.value)} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password}
        onChange={e => setPassword(e.target.value)} 
      />

      <button className="btn" onClick={handleLogin}>Login</button>

      <div className="page-link">
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
}