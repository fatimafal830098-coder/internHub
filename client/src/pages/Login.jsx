import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../api";

import {
  setUser,
  setError,
  setLoading,
} from "../redux/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.post(
        "/auth/login",
        formData
      );

      const user = response.data.user;

      dispatch(setUser(user));

      if (user.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (user.role === "recruiter") {
        window.location.href = "/recruiter-dashboard";
      } else {
        window.location.href = "/internships";
      }
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Login failed"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h1>Login to InternHub</h1>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;