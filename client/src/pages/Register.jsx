import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { setUser, setError, setLoading } from "../redux/authSlice";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    companyName: "",
    companyDescription: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        "/auth/register",
        formData
      );

      dispatch(setUser(response.data.user));

      navigate("/");
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Registration failed"
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
        <h1>Create InternHub Account</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === "recruiter" && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />

            <textarea
              name="companyDescription"
              placeholder="Company Description"
              value={formData.companyDescription}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit">
          Register
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;