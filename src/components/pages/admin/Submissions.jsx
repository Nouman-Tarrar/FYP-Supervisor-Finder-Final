// src/pages/admin/Submissions.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Submissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "submissions"), snap =>
      setSubs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const changeStatus = async (id, newStatus) => {
    const sub = subs.find(s => s.id === id);
    await updateDoc(doc(db, "submissions", id), {
      status: newStatus,
      comment: newStatus === "Revision" ? sub.comment || "" : ""
    });
  };

  const updateComment = async (id, comment) => {
    await updateDoc(doc(db, "submissions", id), { comment });
    setSubs(prev =>
      prev.map(s => (s.id === id ? { ...s, comment } : s))
    );
  };

  const getBadge = (status) => {
    switch (status) {
      case "Accepted": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Revision": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Submissions</h2>
      <div className="space-y-4">
        {subs.map(sub => (
          <div key={sub.id} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {sub.groupName} — {sub.title}
                </p>
                <p className="text-gray-600">Supervisor: {sub.supervisorName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadge(sub.status)}`}>
                {sub.status}
              </span>
            </div>

            <p className="text-gray-700">{sub.description}</p>

            {sub.status === "Revision" && (
              <div>
                <label className="block text-gray-700 mb-1">Comment:</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={sub.comment || ""}
                  onChange={e => updateComment(sub.id, e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => changeStatus(sub.id, "Accepted")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Accept
              </button>
              <button onClick={() => changeStatus(sub.id, "Rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Reject
              </button>
              <button onClick={() => changeStatus(sub.id, "Revision")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                Ask Revision
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
