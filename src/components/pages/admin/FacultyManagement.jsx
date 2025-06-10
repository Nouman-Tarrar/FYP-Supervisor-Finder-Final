import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function FacultyManagement() {
  const [facultyList, setFacultyList] = useState([]);
  const [newName, setNewName]           = useState("");
  const [newEmail, setNewEmail]         = useState("");
  const [newDomain, setNewDomain]       = useState("");
  const [newSlots, setNewSlots]         = useState("");
  const [newOfficeHours, setNewOfficeHours] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "faculty"), snap =>
      setFacultyList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const addFaculty = async () => {
    if (!newName || !newEmail || !newDomain || !newSlots) return;
    await addDoc(collection(db, "faculty"), {
      name: newName,
      email: newEmail,
      domain: newDomain,
      slots: parseInt(newSlots),
      officeHours: newOfficeHours,
      pictureURL: "" // placeholder or integrate Storage later
    });
    setNewName(""); setNewEmail(""); setNewDomain(""); setNewSlots(""); setNewOfficeHours("");
  };

  const updateFaculty = async (id, field, value) => {
    await updateDoc(doc(db, "faculty", id), {
      [field]: field === "slots" ? parseInt(value) : value
    });
  };

  const deleteFaculty = async (id) => {
    await deleteDoc(doc(db, "faculty", id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Faculty Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Add New Faculty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={newName}
            onChange={e => setNewName(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input type="email" placeholder="Email" value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input type="text" placeholder="Domain" value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input type="number" placeholder="Slots" value={newSlots}
            onChange={e => setNewSlots(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input type="text" placeholder="Office Hours" value={newOfficeHours}
            onChange={e => setNewOfficeHours(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button onClick={addFaculty}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold col-span-2">
            Add Faculty
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {facultyList.map(f => (
          <div key={f.id}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-1 space-y-1">
              <p className="text-lg font-medium text-gray-700">{f.name}</p>
              <p className="text-gray-600 text-sm">{f.email}</p>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-gray-700">Domain</label>
                <input type="text" value={f.domain}
                  onChange={e => updateFaculty(f.id, "domain", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-gray-700">Office Hours</label>
                <input type="text" value={f.officeHours}
                  onChange={e => updateFaculty(f.id, "officeHours", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-gray-700">Slots</label>
                <input type="number" value={f.slots}
                  onChange={e => updateFaculty(f.id, "slots", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <button onClick={() => deleteFaculty(f.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
