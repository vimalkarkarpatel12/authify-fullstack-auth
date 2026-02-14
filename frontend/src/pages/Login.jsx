import React, { useContext, useState } from "react";
import logo from "../assets/Home_logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AppContext";

const Login = () => {
  const { backendURL, setIsLoggedIn, setUserData, getUserData } = useContext(AuthContext);

  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



  const navigate = useNavigate();

  // =========================
  // Submit Handler
  // =========================
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);

    try {
      // ================= REGISTER =================
      if (isCreateAccount) {
        const response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
        });

        if (response.status === 201) {
          toast.success("Account created successfully");
          setIsCreateAccount(false);
        }
      }

      // ================= LOGIN =================
      else {
        const response = await axios.post(`${backendURL}/login`, {
          email,
          password,
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUserData(response.data.user);
          getUserData();

          toast.success("Login successful");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(90deg,#6a5af9,#8268f9)" }}
    >
      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 30,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            fontSize: 24,
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="logo" height={52} width={52} />
          <span className="fw-bold fs-3 text-light">Authify</span>
        </Link>
      </div>

      {/* Card */}
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="text-center mb-4">
          {isCreateAccount ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={onSubmitHandler}>
          {/* Name */}
          {isCreateAccount && (
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot */}
          {!isCreateAccount && (
            <div className="text-end mb-3">
              <Link to="/reset-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading
              ? "Please wait..."
              : isCreateAccount
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-3 mb-0">
          {isCreateAccount ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsCreateAccount(false)}
                style={{ cursor: "pointer" }}
                className="text-decoration-underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsCreateAccount(true)}
                style={{ cursor: "pointer" }}
                className="text-decoration-underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;