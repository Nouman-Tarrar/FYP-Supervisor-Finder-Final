import React, { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot }           from "firebase/firestore";
import { db }                               from "../../firebase/config";

export default function AdminDashboard() {
  const [facultyList, setFacultyList]     = useState([]);
  const [submissions, setSubmissions]     = useState([]);

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "faculty"), (snap) =>
        setFacultyList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      ),
      onSnapshot(collection(db, "submissions"), (snap) =>
        setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      )
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  const stats = useMemo(() => {
    const totalFaculty   = facultyList.length;
    const totalSub       = submissions.length;
    const totalAccepted  = submissions.filter(s => s.status === "Accepted").length;
    const totalSlotsLeft = facultyList.reduce((sum, f) => sum + f.slots, 0);
    return { totalFaculty, totalSub, totalAccepted, totalSlotsLeft };
  }, [facultyList, submissions]);

  const recentFaculty     = facultyList.slice(-3).reverse();
  const recentSubmissions = submissions.slice(-3).reverse();

  const getBadgeClasses = (status) => {
    switch (status) {
      case "Pending":  return "bg-yellow-100 text-yellow-800";
      case "Accepted": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Revision": return "bg-orange-100 text-orange-800";
      default:         return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Faculty</h3>
          <p className="mt-2 text-3xl font-bold text-orange-500">{stats.totalFaculty}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Ideas Submitted</h3>
          <p className="mt-2 text-3xl font-bold text-orange-500">{stats.totalSub}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Assigned Students</h3>
          <p className="mt-2 text-3xl font-bold text-orange-500">{stats.totalAccepted}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Slots Available</h3>
          <p className="mt-2 text-3xl font-bold text-orange-500">{stats.totalSlotsLeft}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recently Added</h3>
          <ul className="divide-y divide-gray-200">
            {recentFaculty.map(f => (
              <li key={f.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{f.name}</p>
                  <p className="text-gray-500 text-sm">{f.domain}</p>
                </div>
                <p className="text-sm text-gray-600">Slots: {f.slots}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Submissions</h3>
          <ul className="divide-y divide-gray-200">
            {recentSubmissions.map(sub => (
              <li key={sub.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-medium">{sub.groupName}</p>
                    <p className="text-gray-500 text-sm">{sub.title}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(sub.status)}`}>
                    {sub.status}
                  </span>
                </div>
                <p className="mt-1 text-gray-500 text-xs">
                  {sub.timestamp?.toDate().toLocaleString() || ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Slot Availability</h3>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-gray-600 text-sm">Name</th>
              <th className="px-4 py-2 text-gray-600 text-sm">Domain</th>
              <th className="px-4 py-2 text-gray-600 text-sm">Office Hours</th>
              <th className="px-4 py-2 text-gray-600 text-sm">Slots Left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {facultyList.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{f.name}</td>
                <td className="px-4 py-3 text-gray-600">{f.domain}</td>
                <td className="px-4 py-3 text-gray-600">{f.officeHours}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">{f.slots}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
