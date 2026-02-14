import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logos from "../assets/Home_logo.png";
import { AuthContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const inputRef = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const { getUserData, backendURL, userData} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  if (userData?.isAccountVerified) {
    navigate("/", { replace: true });
  }
}, [userData, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
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

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter all six digits");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/verify-otp`,
        { otp: otpValue },
        { withCredentials: true }   // 🔥 IMPORTANT FIX
      );

      if (response.status === 200) {
        toast.success("OTP Verified Successfully");
        await getUserData();
        navigate("/");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{ background: "linear-gradient(90deg,#6a5af9,#8268f9)" }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={logos} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      <div className="p-5 rounded-4 shadow bg-white text-center" style={{ width: 400 }}>
        <h4 className="fw-bold mb-2">Email Verify OTP</h4>
        <p className="text-muted mb-4">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="d-flex justify-content-between gap-2 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRef.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="form-control text-center fs-4"
            />
          ))}
        </div>

        <button
          className="btn btn-primary w-100 fw-semibold"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
