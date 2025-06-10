// src/pages/student/IdeaSubmission.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AppContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function IdeaSubmission() {
  const { user } = useAuth();
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supervisor, setSupervisor] = useState("");

  useEffect(() => {
    const fetchSelectedSupervisor = async () => {
      if (!user) return;

      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) return;

      const selectedId = studentSnap.data().selectedSupervisorID;
      if (!selectedId) return;

      const supSnap = await getDoc(doc(db, "faculty", selectedId));
      if (supSnap.exists()) {
        const supervisorData = { id: supSnap.id, ...supSnap.data() };
        setFacultyOptions([supervisorData]);
        setSupervisor(supervisorData.id);
      }
    };

    fetchSelectedSupervisor();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return;

    const supSnap = await getDoc(doc(db, "faculty", supervisor));
    const supervisorName = supSnap.exists() ? supSnap.data().name : "";

    // 1. Add new submission
    await addDoc(collection(db, "submissions"), {
      groupName: user.email,
      title,
      description,
      supervisorID: supervisor,
      supervisorName,
      studentID: user.uid,
      status: "Pending",
      comment: "",
      timestamp: serverTimestamp(),
      revisionDeadline: ""
    });

    // 2. Decrease supervisor slot after successful idea submission
    await updateDoc(doc(db, "faculty", supervisor), {
      slots: increment(-1)
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Idea Submitted Successfully!
        </h2>
        <p className="text-gray-700">
          You can track its status under “Track Status.”
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Submit FYP Idea</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Project Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter project title"
          />
        </div>
        <div>
          <label className="block text-gray-700">Project Description</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe your project"
          />
        </div>
        <div>
          <label className="block text-gray-700">Selected Supervisor</label>
          <select
            required
            value={supervisor}
            disabled
            className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100"
          >
            {facultyOptions.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
        >
          Submit Idea
        </button>
      </form>
    </div>
  );
}
