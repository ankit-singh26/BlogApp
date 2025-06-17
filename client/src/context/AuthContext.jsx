import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Access environment variable for backend URL
const backendURL = import.meta.env.VITE_BACKEND_URL;

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // Handle login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${backendURL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUserToken(data.token);
        setUser(jwtDecode(data.token));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    setUser(null);
    navigate("/login");
  };

  // Watch for token changes or expiry
  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expired");
          logout();
        } else {
          setUser(decoded);
        }
      } catch (e) {
        console.error("Invalid token", e);
        logout();
      }
    }
  }, [userToken]);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isAuthenticated: !!userToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
