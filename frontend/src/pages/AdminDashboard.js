import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, isAuthenticated } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [todosRes, usersRes] = await Promise.all([
        fetch("http://localhost:4000/api/admin/todos", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:4000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const todosData = await todosRes.json();
      const usersData = await usersRes.json();

      if (!todosRes.ok) {
        setError(todosData.message || "Failed to fetch todos");
        return;
      }

      if (!usersRes.ok) {
        setError(usersData.message || "Failed to fetch users");
        return;
      }

      setTodos(todosData.todos || []);
      setUsers(usersData.users || []);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/todos/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete todo");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const handlePromoteUser = async (userId) => {
    if (!window.confirm("Promote this user to admin?")) return;

    try {
      const response = await fetch("http://localhost:4000/api/user/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: "admin" } : user
          )
        );
      } else {
        setError(data.message || "Failed to promote user");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const uniqueCategories = Array.from(
    new Set(todos.filter((todo) => todo.category).map((todo) => todo.category))
  );

  const filteredTodos = categoryFilter
    ? todos.filter(
        (todo) => todo.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    : todos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("todos")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "todos"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            All Todos ({todos.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            All Users ({users.length})
          </button>
        </div>
        {activeTab === "todos" && (
          <div className="mb-6">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Todos Tab */}
        {activeTab === "todos" && (
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">No todos match this filter</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white rounded-lg shadow p-6 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold`}
                    >
                      {todo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      By: <span className="font-semibold">{todo.user?.username}</span> (
                      {todo.user?.email})
                    </p>
                    {todo.description && (
                      <p className="text-gray-600 mt-2">{todo.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      {todo.category && <span>Category: {todo.category}</span>}
                      {todo.dueDate && (
                        <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div>
                        <span className={`font-semibold ${todo.completed ? "text-green-600" : "text-black"}`}>
                            {todo.completed ? "Completed" : "Pending"}
                        </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
                    >
                      Delete
                    </button>
                    <a
                      href={`/edit-todo/${todo._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.role === "user" ? (
                        <button
                          onClick={() => handlePromoteUser(user._id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded text-xs transition"
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <span className="text-gray-500">Already Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
