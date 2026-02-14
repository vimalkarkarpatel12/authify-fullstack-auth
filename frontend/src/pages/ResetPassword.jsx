import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Home_logo.png";
import { AuthContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { backendURL } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // ===============================
  // STEP 1 → Send Reset OTP
  // ===============================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${backendURL}/send-reset-otp?email=${email}`
      );

      toast.success("OTP sent to your email");
      setIsEmailSent(true);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // OTP INPUT HANDLING
  // ===============================
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    const newOtp = [...otp];
    pasteData.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
  };

  // ===============================
  // STEP 2 → Verify OTP
  // ===============================
  const handleVerifyOtp = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    setIsOtpSubmitted(true);
  };

  // ===============================
  // STEP 3 → Reset Password
  // ===============================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${backendURL}/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
      });

      toast.success("Password reset successfully");
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(90deg,#6a5af9,#8268f9)" }}
    >

      <Link to="/" className="position-absolute top-0 start-0 p-4 text-decoration-none d-flex gap-2 align-items-center">
        <img src={logo} alt="logo" height={52} width={52} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      {/* STEP 1 */}
      {!isEmailSent && (
        <div className="bg-white p-5 rounded shadow" style={{ width: 400 }}>
          <h4 className="mb-3 text-center">Reset Password</h4>

          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2 */}
      {isEmailSent && !isOtpSubmitted && (
        <div className="bg-white p-5 rounded shadow text-center" style={{ width: 400 }}>
          <h4>Enter OTP</h4>

          <div className="d-flex gap-2 my-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="form-control text-center"
              />
            ))}
          </div>

          <button className="btn btn-primary w-100" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {isOtpSubmitted && (
        <div className="bg-white p-5 rounded shadow" style={{ width: 400 }}>
          <h4 className="text-center mb-3">Set New Password</h4>

          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ResetPassword;
