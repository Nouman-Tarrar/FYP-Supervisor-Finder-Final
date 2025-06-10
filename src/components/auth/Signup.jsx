// src/auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AppContext";
import { toast } from "react-toastify";

export default function Signup() {
  const [activeTab, setActiveTab] = useState("admin"); // admin or student
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { user, role, signup, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user && role === "admin") navigate("/admin/dashboard", { replace: true });
      if (user && role === "student") navigate("/student/browse", { replace: true });
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await signup(email, password, activeTab, username);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Checking signup status...</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">FYP Supervisor Finder</h2>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("admin")}
            className={`w-1/2 text-center py-2 font-semibold ${
              activeTab === "admin"
                ? "border-b-4 border-orange-500 text-orange-500"
                : "text-gray-500"
            }`}
          >
            Signup as Admin/Faculty
          </button>
          <button
            onClick={() => setActiveTab("student")}
            className={`w-1/2 text-center py-2 font-semibold ${
              activeTab === "student"
                ? "border-b-4 border-orange-500 text-orange-500"
                : "text-gray-500"
            }`}
          >
            Signup as Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Confirm password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Signup
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600 mr-2">Or signup with</span>
          <button
            onClick={() => signInWithGoogle(activeTab)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Google
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Login now
          </a>
        </p>
      </div>
    </div>
  );
}
