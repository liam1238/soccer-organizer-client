import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  signIn: () => void;
  signOut: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAdmin: false,
  signIn: () => {},
  signOut: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) checkAdmin(user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) checkAdmin(session.user.id);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from("admins").select("*").eq("id", userId);
    setIsAdmin(!!(data && data.length > 0)); // make it to return true / false anyway
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
