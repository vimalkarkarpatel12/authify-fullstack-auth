import React, { useContext, useRef, useState, useEffect } from "react";
import logo from "../assets/Home_logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendURL } =
    useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserData(null);
        setIsLoggedIn(false);
        toast.success("Logged out successfully");
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sendVerificationOTP = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/send-otp`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("OTP sent successfully");
        navigate("/email-verify");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    }
  };

  return (
    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <img src={logo} alt="logo" width={55} height={55} />
        <span className="fw-bold fs-4 text-dark">Authify</span>
      </div>

      {userData ? (
        <div className="position-relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: 40, height: 40, cursor: "pointer" }}
          >
            {userData?.name?.[0]?.toUpperCase()}
          </div>

          {dropdownOpen && (
            <div
              className="position-absolute shadow bg-white rounded p-2"
              style={{ top: 50, right: 0, zIndex: 100 }}
            >
              {!userData?.isAccountVerified && (
                <div
                  className="dropdown-item py-1 px-2"
                  onClick={sendVerificationOTP}
                  style={{ cursor: "pointer" }}
                >
                  Verify email
                </div>
              )}

              <div
                onClick={handleLogout}
                className="dropdown-item py-1 px-2 text-danger"
                style={{ cursor: "pointer" }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login →
        </div>
      )}
    </nav>
  );
};

export default Menubar;
