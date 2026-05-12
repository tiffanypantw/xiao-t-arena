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
      const existingData = userSnap.data();

      // 🆕 每次登入時、回填 displayName / email / photoURL（避免舊用戶沒有這些欄位）
      const needsBackfill =
        !existingData.displayName ||
        !existingData.email ||
        !existingData.uid;
      if (needsBackfill) {
        const backfillData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            firebaseUser.uid.slice(0, 8),
          photoURL: firebaseUser.photoURL || null,
        };
        await setDoc(userRef, backfillData, { merge: true });
        console.log(`✅ 回填用戶名字：${backfillData.displayName}`);
      }

      // 檢查是否需要遷移
      await migrateIfNeeded(firebaseUser, existingData, userRef);
      const updatedSnap = await getDoc(userRef);
      setUserData(updatedSnap.data());
    } else {
      // 新用戶 — 建立資料並檢查是否有舊資料需要遷移
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        weeklyProgress: {},
        collection: {},
        migrated: false,
      };
      await setDoc(userRef, newUser);
      // 遷移舊資料
      await migrateIfNeeded(firebaseUser, newUser, userRef);
      const updatedSnap = await getDoc(userRef);
      setUserData(updatedSnap.data());
    }
  };

  const migrateIfNeeded = async (firebaseUser, existingData, userRef) => {
    if (existingData.migrated) return false;

    const email = firebaseUser.email?.toLowerCase();
    if (!email) {
      await setDoc(userRef, { migrated: true }, { merge: true });
      return false;
    }

    // 從 Firestore base44Migrations collection 讀（取代舊的 hardcoded MIGRATION_DATA）
    const migrationRef = doc(db, "base44Migrations", email);
    let migrationRecord = null;
    try {
      const migrationSnap = await getDoc(migrationRef);
      if (migrationSnap.exists()) {
        migrationRecord = migrationSnap.data();
      }
    } catch (err) {
      // rules 可能擋住（例如 base44Migrations collection 尚未建立）→ 視為「無遷移紀錄」處理
      console.warn("Migration record read failed (treating as no record):", err.message);
    }

    if (!migrationRecord) {
      await setDoc(userRef, { migrated: true }, { merge: true });
      return false;
    }

    const migratedCollection = { ...existingData.collection };

    for (const badgeId of migrationRecord.badges || []) {
      if (!migratedCollection[badgeId]) {
        migratedCollection[badgeId] = {
          unlockedAt: new Date().toISOString(),
          codeUsed: "migrated-from-base44",
        };
      }
    }

    for (const cardId of migrationRecord.cards || []) {
      if (!migratedCollection[cardId]) {
        migratedCollection[cardId] = {
          unlockedAt: new Date().toISOString(),
          codeUsed: "migrated-from-base44",
        };
      }
    }

    await setDoc(
      userRef,
      { collection: migratedCollection, migrated: true },
      { merge: true }
    );

    console.log(`✅ 遷移完成：${email}`);
    return true;
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