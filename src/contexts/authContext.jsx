import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getUserByUID } from "../util/crud";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Implement your authentication logic here, such as checking if the user is logged in.

  const login = async (payload) => {
    // Your login logic (e.g., setting the user in state)
    try {
      const email = payload.email;
      const password = payload.password;
      const authUser = await signInWithEmailAndPassword(auth, email, password);
      const dbUser = await getUserByUID(authUser.user.uid);
      const userData = { ...dbUser, ...authUser.user };
      console.log(userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.log(error.message);
      return { success: false, error: error.message };
    }
    return;
  };

  const logout = async () => {
    // Your logout logic (e.g., removing the user from state)
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed: ", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
