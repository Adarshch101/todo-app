import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken) {
    setToken(savedToken);
  }
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
  setLoading(false);
}, []);


  const login = (token, userData) => {
  setToken(token);
  setUser(userData);
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
};


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
