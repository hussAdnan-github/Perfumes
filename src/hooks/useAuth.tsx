import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientType: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (firstName: string, lastName: string, email: string, phone: string, clientType: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "alfajr_auth_user";

function generateId(): string {
  return "USR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.email) return parsed as User;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!email || !password) {
      return { success: false, message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" };
    }

    const stored = readStoredUser();
    if (!stored) {
      return { success: false, message: "لا يوجد حساب بهذا البريد الإلكتروني. يرجى التسجيل أولاً" };
    }

    if (stored.email !== email) {
      return { success: false, message: "البريد الإلكتروني غير صحيح" };
    }

    const newUser: User = { ...stored };
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return { success: true, message: "تم تسجيل الدخول بنجاح" };
  }, []);

  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    clientType: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!firstName || !lastName || !email || !password) {
      return { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة" };
    }

    if (password.length < 6) {
      return { success: false, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
    }

    const existing = readStoredUser();
    if (existing && existing.email === email) {
      return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول" };
    }

    const newUser: User = {
      id: generateId(),
      firstName,
      lastName,
      email,
      clientType: clientType || "فرد",
    };

    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return { success: true, message: "تم إنشاء الحساب بنجاح" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser: User = {
      id: generateId(),
      firstName: "عميل",
      lastName: "تجريبي",
      email: "demo@alfajr.com",
      clientType: "شركة",
    };

    setUser(demoUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}