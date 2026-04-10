import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "./firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  uuseEffect(() => {
    // 處理 Google 登入跳轉回來的結果
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect 登入失敗：", error);
    });
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadOrCreateUserData(firebaseUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const loadOrCreateUserData = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data());
    } else {
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        weeklyProgress: {},
      };
      await setDoc(userRef, newUser);
      setUserData(newUser);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("登入失敗：", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("登出失敗：", error);
    }
  };

  const saveProgress = async (week, score, total) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const updatedProgress = {
      ...userData?.weeklyProgress,
      [week]: {
        score,
        total,
        completed: score === total,
        completedAt: new Date().toISOString(),
      },
    };
    await setDoc(
      userRef,
      { weeklyProgress: updatedProgress },
      { merge: true }
    );
    setUserData((prev) => ({ ...prev, weeklyProgress: updatedProgress }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoadingAuth,
        loginWithGoogle,
        logout,
        saveProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}