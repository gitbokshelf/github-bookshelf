import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  recovery: boolean;
  dismissRecovery: () => void;
}>({ user: null, loading: true, recovery: false, dismissRecovery: () => {} });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let live = true;
    // A assinatura é criada antes da leitura inicial para não perder eventos.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!live) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (live) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });
    return () => {
      live = false;
      subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        recovery,
        dismissRecovery: () => setRecovery(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
