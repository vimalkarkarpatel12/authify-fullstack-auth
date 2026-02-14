import React, { useContext } from "react";
import heaLogo from "../assets/headerL.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login"); // change route as needed
  };

  const {userData} = useContext(AuthContext)


  return (
    <div
      className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3"
      style={{ minHeight: "80vh" }}
    >
      <img
        src={heaLogo}
        alt="header"
        width={130}
        className="mb-4"
      />

      <h5 className="fw-semibold">
        Hey {userData ? userData.name : 'Developer'} <span role="img" aria-label="wave">🙋</span>
      </h5>

      <h1 className="fw-bold display-5 mb-3">
        Welcome to our product
      </h1>

      <p
        className="text-muted fs-5 mb-4"
        style={{ maxWidth: "500px" }}
      >
        Let's start with a quick product tour and you can setup the
        authentication in no time!
      </p>

      <button
        className="btn btn-outline-dark rounded-pill px-4 py-2"
        onClick={handleStart}
      >
        Get Started
      </button>
    </div>
  );
};

export default Header;
