import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EditTodo = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchTodo();
  }, [isAuthenticated, navigate, id, token]);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch todo");
        return;
      }

      const todo = data.todo;
      if (!todo) {
        setError("Todo not found");
        return;
      }

      setTitle(todo.title);
      setDescription(todo.description || "");
      setCategory(todo.category || "");
      setCompleted(todo.completed || false);
      if (todo.dueDate) {
        setDueDate(new Date(todo.dueDate).toISOString().split("T")[0]);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:4000/api/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          dueDate: dueDate || null,
          completed
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update todo");
        return;
      }

      navigate("/todos");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Todo</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What do you need to do?"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add more details about this todo..."
                rows="4"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Work, Personal"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-5 h-5 text-blue-500 rounded"
              />
              <label htmlFor="completed" className="ml-3 text-gray-700 font-semibold">
                Mark as completed
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
              >
                {submitting ? "Updating..." : "Update Todo"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/todos")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTodo;
