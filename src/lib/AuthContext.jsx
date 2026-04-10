import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "./firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
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

  useEffect(() => {
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
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        weeklyProgress: {},
        collection: {},
      };
      await setDoc(userRef, newUser);
      setUserData(newUser);
    }
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((error) => {
      console.error("Google 登入失敗：", error);
    });
  };

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: '電子郵件或密碼錯誤' };
      }
      return { success: false, error: '登入失敗，請再試一次' };
    }
  };

  const registerWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: '這個電子郵件已經註冊過了' };
      }
      if (error.code === 'auth/weak-password') {
        return { success: false, error: '密碼至少需要 6 個字元' };
      }
      return { success: false, error: '註冊失敗，請再試一次' };
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

  const refreshUserData = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserData(userSnap.data());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoadingAuth,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        saveProgress,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}