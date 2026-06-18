import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [isAuthenticated, navigate, token]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/todo/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch todos");
        return;
      }

      setTodos(data.todos || []);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/todo/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  const handleToggle = async (id, completed) => {
    try {
      const todoToUpdate = todos.find((t) => t._id === id);
      const response = await fetch(`http://localhost:4000/api/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...todoToUpdate, completed: !completed })
      });

      const data = await response.json();

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, completed: !completed } : todo
          )
        );
      } else {
        setError(data.message || "Failed to update todo");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Todos</h1>
          <Link
            to="/create-todo"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            + New Todo
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {todos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No todos yet!</p>
            <Link
              to="/create-todo"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Create your first todo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white rounded-lg shadow p-6 flex items-start justify-between"
              >
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo._id, todo.completed)}
                    className="mt-1 mr-4 w-5 h-5 text-blue-500 rounded"
                  />
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-gray-600 mt-2">{todo.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      {todo.category && <span>Category: {todo.category}</span>}
                      {todo.dueDate && (
                        <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/edit-todo/${todo._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
