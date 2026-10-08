// High-Performance Firebase Auth Context
// Instant login with background Firestore synchronization and zero-latency state hydration

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Fast localStorage helper for instant hydration
const CACHE_KEY_USER = "stayfinder_cached_user";
const CACHE_KEY_PROFILE = "stayfinder_cached_profile";

function getCached(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function setCached(key, data) {
  try {
    if (data) localStorage.setItem(key, JSON.stringify(data));
    else localStorage.removeItem(key);
  } catch {}
}

export function AuthProvider({ children }) {
  // Initialize with cached user immediately (0ms initial delay)
  const [currentUser, setCurrentUser] = useState(() => getCached(CACHE_KEY_USER));
  const [userProfile, setUserProfile] = useState(() => getCached(CACHE_KEY_PROFILE));
  const [loading, setLoading] = useState(!getCached(CACHE_KEY_USER));

  // Background non-blocking profile sync to Firestore
  const syncProfileBackground = (uid, profileData) => {
    // Fire and forget — never block login navigation
    Promise.resolve().then(async () => {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
          uid,
          ...profileData,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn("Background Firestore sync skipped:", err?.message);
      }
    });
  };

  // Google Sign-In — INSTANT RETURN
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    // Allow Google to reuse active session without redundant account selection delays
    provider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Fast-path: immediately construct lightweight user profile
    const fastProfile = {
      uid: user.uid,
      fullName: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email,
      photoURL: user.photoURL,
      accountType: "student"
    };

    // Update state immediately (O(1) memory update)
    setCurrentUser(user);
    setUserProfile(fastProfile);
    setCached(CACHE_KEY_USER, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
    setCached(CACHE_KEY_PROFILE, fastProfile);

    // Sync to Firestore in background without awaiting
    syncProfileBackground(user.uid, fastProfile);

    return result;
  }

  // Email & Password Login — INSTANT RETURN
  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const fastProfile = {
      uid: user.uid,
      fullName: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email
    };

    setCurrentUser(user);
    setUserProfile(fastProfile);
    setCached(CACHE_KEY_USER, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email
    });
    setCached(CACHE_KEY_PROFILE, fastProfile);

    return result;
  }

  // Register with Email & Password
  async function register(email, password, fullName, accountType) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Set displayName
    updateProfile(user, { displayName: fullName }).catch(() => {});

    const fastProfile = {
      uid: user.uid,
      fullName,
      email,
      accountType,
      createdAt: new Date().toISOString(),
      favorites: []
    };

    setCurrentUser(user);
    setUserProfile(fastProfile);
    setCached(CACHE_KEY_USER, {
      uid: user.uid,
      displayName: fullName,
      email: user.email
    });
    setCached(CACHE_KEY_PROFILE, fastProfile);

    // Sync in background
    syncProfileBackground(user.uid, fastProfile);

    return result;
  }

  // Logout — INSTANT
  async function logout() {
    setCached(CACHE_KEY_USER, null);
    setCached(CACHE_KEY_PROFILE, null);
    setCurrentUser(null);
    setUserProfile(null);
    return signOut(auth);
  }

  // Auth state listener with lazy profile hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cachedUser = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        setCurrentUser(user);
        setCached(CACHE_KEY_USER, cachedUser);

        // Fetch full profile lazily in background
        getDoc(doc(db, "users", user.uid))
          .then((snap) => {
            if (snap.exists()) {
              setUserProfile(snap.data());
              setCached(CACHE_KEY_PROFILE, snap.data());
            }
          })
          .catch(() => {});
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setCached(CACHE_KEY_USER, null);
        setCached(CACHE_KEY_PROFILE, null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
