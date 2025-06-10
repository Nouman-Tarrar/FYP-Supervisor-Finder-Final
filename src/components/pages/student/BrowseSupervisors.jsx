// src/pages/student/BrowseSupervisors.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AppContext";

export default function BrowseSupervisors() {
  const { user } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filterDomain, setFilterDomain] = useState("");
  const [filterSlots, setFilterSlots] = useState("");
  const [filterOffice, setFilterOffice] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "faculty"), snap =>
      setFacultyList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadSelection = async () => {
      const ref = doc(db, "students", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSelectedId(snap.data().selectedSupervisorID || null);
      }
    };
    loadSelection();
  }, [user]);

  const filtered = facultyList.filter(f =>
    (filterDomain === "" || f.domain.toLowerCase().includes(filterDomain.toLowerCase())) &&
    (filterOffice === "" || f.officeHours.toLowerCase().includes(filterOffice.toLowerCase())) &&
    (filterSlots === "" || f.slots >= parseInt(filterSlots))
  );

  const selectSupervisor = async (id) => {
    if (selectedId) {
      alert("You’ve already selected a supervisor. Unselect first.");
      return;
    }

    // Only store selection — no decrement here
    await setDoc(doc(db, "students", user.uid), {
      selectedSupervisorID: id
    }, { merge: true });

    setSelectedId(id);
    alert("Supervisor reserved! Now submit your idea.");
  };

  const unselectSupervisor = async () => {
    if (!selectedId) return;

    // Optional: check if idea submitted, don't allow unselect after
    const subSnap = await getDoc(doc(db, "submissions", user.uid));
    if (subSnap.exists()) {
      alert("You cannot unselect a supervisor after idea submission.");
      return;
    }

    await setDoc(doc(db, "students", user.uid), {
      selectedSupervisorID: null
    }, { merge: true });

    setSelectedId(null);
    alert("Supervisor unselected.");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Browse Supervisors</h2>

      <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="text" placeholder="Filter by Domain" value={filterDomain}
          onChange={e => setFilterDomain(e.target.value)}
          className="px-4 py-2 border rounded-lg" />
        <input type="number" placeholder="Min Slots" value={filterSlots}
          onChange={e => setFilterSlots(e.target.value)}
          className="px-4 py-2 border rounded-lg" />
        <input type="text" placeholder="Filter by Office Hours" value={filterOffice}
          onChange={e => setFilterOffice(e.target.value)}
          className="px-4 py-2 border rounded-lg" />
      </div>

      {selectedId && (
        <div className="text-center">
          <p className="text-gray-700 mb-2">
            You’ve selected a supervisor. Please unselect before choosing another.
          </p>
          <button
            onClick={unselectSupervisor}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Unselect Supervisor
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(f => (
          <div key={f.id} className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <p className="text-xl font-semibold text-gray-700">{f.name}</p>
            <p className="text-gray-600">Domain: {f.domain}</p>
            <p className="text-gray-600">Slots: {f.slots}</p>
            <p className="text-gray-600">Office Hours: {f.officeHours}</p>
            <button
              disabled={f.slots === 0 || selectedId !== null}
              onClick={() => selectSupervisor(f.id)}
              className={`w-full py-2 rounded-lg font-semibold text-white ${
                f.slots === 0 || selectedId !== null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {f.slots === 0 ? "Full" : selectedId === f.id ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
