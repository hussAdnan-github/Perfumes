import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { teamMembers } from "@/mocks/adminData";

type TeamMember = typeof teamMembers[0];

interface AdminAuthContextType {
  currentMember: TeamMember;
  switchMember: (memberId: string) => void;
  allMembers: typeof teamMembers;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_MEMBER_KEY = "admin_current_member_id";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [currentMember, setCurrentMember] = useState<TeamMember>(teamMembers[0]);

  useEffect(() => {
    const storedId = localStorage.getItem(ADMIN_MEMBER_KEY);
    if (storedId) {
      const found = teamMembers.find((m) => m.id === storedId);
      if (found) setCurrentMember(found);
    }
  }, []);

  const switchMember = useCallback((memberId: string) => {
    const found = teamMembers.find((m) => m.id === memberId);
    if (found) {
      setCurrentMember(found);
      localStorage.setItem(ADMIN_MEMBER_KEY, memberId);
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ currentMember, switchMember, allMembers: teamMembers }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

export type AdminTeamMember = TeamMember;