
import React, { createContext, useState, useContext, useEffect } from "react";
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
  logout: () => void;
  updateCredits: (newCredits: number) => void;
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

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function (would be replaced with real authentication)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const user: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          credits: 10, // Free credits for new users
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : String(error)));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      if (email && password) {
        const user: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          credits: 10, // Free credits for new users
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Account created successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Signup failed: " + (error instanceof Error ? error.message : String(error)));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
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
