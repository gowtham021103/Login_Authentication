import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleRegister = async () => {
    await axios.post("http://localhost:8000/api/register/", form);

    const res = await axios.post("http://localhost:8000/api/login/", {
      username: form.username,
      password: form.password
    });

    localStorage.setItem("token", res.data.access);

    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Create Account</h1>

      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <button className="btn" onClick={handleRegister}>Register</button>

      <div className="page-link">
        Already have an account? <a href="/">Login</a>
      </div>
    </div>
  );
}
