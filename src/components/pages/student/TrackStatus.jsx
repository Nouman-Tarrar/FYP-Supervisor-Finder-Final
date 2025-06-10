import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AppContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function TrackStatus() {
  const { user } = useAuth();
  const [sub, setSub] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "submissions"), where("studentID", "==", user.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSub({ id: snap.docs[0].id, ...snap.docs[0].data() });
      }
    }
    if (user) load();
  }, [user]);

  const submitRevision = async () => {
    await updateDoc(doc(db, "submissions", sub.id), { status: "In Review" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFileName(file.name);
  };

  if (!sub) return <p>Loading...</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Track Idea Status</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">{sub.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500">Supervisor</p>
            <p className="font-medium">{sub.supervisorName}</p>
          </div>
          <div>
            <p className="text-gray-500">Submitted On</p>
            <p className="font-medium">{sub.timestamp?.toDate().toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="font-medium">{sub.revisionDeadline || "—"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-6">Status</h3>
        <div className="text-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium 
            ${sub.status === "Accepted" ? "bg-green-100 text-green-800" : ""}
            ${sub.status === "Rejected" ? "bg-red-100 text-red-800" : ""}
            ${sub.status === "Revision" ? "bg-orange-100 text-orange-800" : ""}
            ${sub.status === "In Review" ? "bg-blue-100 text-blue-800" : ""}
            ${sub.status === "Pending" ? "bg-gray-100 text-gray-800" : ""}`}>
            Current Status: {sub.status}
          </span>
        </div>
      </div>

      {sub.status === "Revision" && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Revision Required</h3>
          <p className="text-gray-700">Comment: {sub.comment || "No comment provided"}</p>
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Upload Revised File</label>
            <input type="file" onChange={handleFileChange} />
            {selectedFileName && (
              <p className="text-sm text-gray-600 italic">{selectedFileName}</p>
            )}
            <button
              onClick={submitRevision}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg mt-4"
            >
              Submit Revision
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
