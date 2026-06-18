import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Decode token to get user role (simple JWT decode)
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      setUserRole(decoded.role);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-400">
          Todo App
        </Link>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/todos"
                className="hover:text-blue-400 transition"
              >
                My Todos
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-purple-400 transition font-semibold"
                >
                 Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;