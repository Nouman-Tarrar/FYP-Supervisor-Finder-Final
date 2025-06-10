// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import AdminDashboard from "./components/pages/admin/Dashboard";
import FacultyManagement from "./components/pages/admin/FacultyManagement";
import Submissions from "./components/pages/admin/Submissions";

import BrowseSupervisors from "./components/pages/student/BrowseSupervisors";
import IdeaSubmission from "./components/pages/student/IdeaSubmission";
import TrackStatus from "./components/pages/student/TrackStatus";

import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import PrivateRoute from "./components/layouts/PrivateRoute";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-6 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/faculty" element={<FacultyManagement />} />
            <Route path="/admin/submissions" element={<Submissions />} />
          </Route>

          <Route element={<PrivateRoute requiredRole="student" />}>
            <Route path="/student/browse" element={<BrowseSupervisors />} />
            <Route path="/student/submit" element={<IdeaSubmission />} />
            <Route path="/student/track" element={<TrackStatus />} />
          </Route>

          <Route
            path="*"
            element={<div className="text-center text-red-500">404 Page Not Found</div>}
          />
        </Routes>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
