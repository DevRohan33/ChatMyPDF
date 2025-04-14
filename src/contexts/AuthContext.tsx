import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCredits: (newCredits: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            credits: userData.credits,
          };
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        credits: 10,
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          credits: userData.credits,
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out!");
  };

  const updateCredits = async (newCredits: number) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.id), {
      email: user.email,
      credits: newCredits,
    });
    const updatedUser = { ...user, credits: newCredits };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
