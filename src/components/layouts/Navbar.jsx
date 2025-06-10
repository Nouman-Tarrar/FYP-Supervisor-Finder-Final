// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AppContext";

export default function Navbar() {
  const { role, logout } = useAuth();

  // Confirm before logging out
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <nav className="bg-zinc-950 text-white shadow-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Home link */}
        <Link
          to={
            role === "admin"
              ? "/admin/dashboard"
              : role === "student"
              ? "/student/browse"
              : "/login"
          }
          className="text-2xl font-extrabold tracking-wide text-orange-400 hover:text-white transition"
        >
          FYP Supervisor Finder
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-8">
          {role === "admin" && (
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <Link to="/admin/dashboard" className="hover:text-orange-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/faculty" className="hover:text-orange-400 transition">
                  Faculty Management
                </Link>
              </li>
              <li>
                <Link to="/admin/submissions" className="hover:text-orange-400 transition">
                  Submissions
                </Link>
              </li>
            </ul>
          )}

          {role === "student" && (
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <Link to="/student/browse" className="hover:text-orange-400 transition">
                  Browse Supervisors
                </Link>
              </li>
              <li>
                <Link to="/student/submit" className="hover:text-orange-400 transition">
                  Submit Idea
                </Link>
              </li>
              <li>
                <Link to="/student/track" className="hover:text-orange-400 transition">
                  Track Status
                </Link>
              </li>
            </ul>
          )}

          {!role && (
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <Link to="/login" className="hover:text-orange-400 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-orange-400 transition">
                  Signup
                </Link>
              </li>
            </ul>
          )}

          {role && (
            <button
              onClick={handleLogout}
              className="ml-4 text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md transition font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
