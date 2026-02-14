import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../util/constant";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendURL = AppConstants.BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 important

  // =========================
  // Get Profile
  // =========================
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/profile`,
        { withCredentials: true }   // 🔥 REQUIRED
      );

      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true);
      }

    } catch (error) {
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  // =========================
  // Check Authentication
  // =========================
  const getAuthState = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/is-authenticated`,
        { withCredentials: true }   // 🔥 REQUIRED
      );

      if (response.status === 200 && response.data === true) {
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }

    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);  // stop loading after check
    }
  };

  // 🔥 Runs automatically on refresh
  useEffect(() => {
    getAuthState();
  }, []);

  const contextValue = {
    backendURL,
    isLoggedIn,
    userData,
    setUserData,
    setIsLoggedIn,
    getUserData,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
