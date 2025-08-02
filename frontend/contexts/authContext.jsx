"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// This context will be used to share authentication data across the app.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Automatically Log In User If Data Exists
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("user_data");
      if (storedData) {
        try {
          const { userToken, user } = JSON.parse(storedData);
          setToken(userToken);
          setUserData(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("user_data");
        }
      }
    }
  }, []);
  const login = (newToken, newData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "user_data",
        JSON.stringify({ userToken: newToken, user: newData })
      );
    }
    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_data");
    }
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a Custom Hook for Easy Access
export const useAuth = () => useContext(AuthContext);
