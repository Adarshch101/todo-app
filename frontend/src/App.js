import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import CreateTodo from "./pages/CreateTodo";
import EditTodo from "./pages/EditTodo";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/todos" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/create-todo" element={<CreateTodo />} />
            <Route path="/edit-todo/:id" element={<EditTodo />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
