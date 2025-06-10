// src/components/contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../components/firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        setRole(snap.exists() ? snap.data().role : null);
      } else {
        setRole(null);
      }
      setLoading(false); // done checking
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, role, username) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      role,
      username,
      email,
    });
    toast.success("Account created");
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in");
  };

  const logout = () => {
    signOut(auth);
    toast.info("Logged out");
  };

  const signInWithGoogle = async (role) => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userDoc = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      await setDoc(userDoc, {
        role,
        username: cred.user.displayName || "",
        email: cred.user.email,
      });
    }
    toast.success("Signed in with Google");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signup, login, logout, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
