import { useState, createContext, useContext } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("jk-user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, _password: string) => {
    // Simulated login
    const u = { name: email.split("@")[0], email };
    setUser(u);
    localStorage.setItem("jk-user", JSON.stringify(u));
  };

  const signup = async (name: string, email: string, _password: string) => {
    const u = { name, email };
    setUser(u);
    localStorage.setItem("jk-user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jk-user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
