import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useState, useRef, useEffect } from "react";

const mainNavItems = [
  { icon: "ri-dashboard-3-line", label: "النظرة العامة", path: "/admin" },
  { icon: "ri-shopping-bag-3-line", label: "إدارة الطلبات", path: "/admin/orders" },
  { icon: "ri-folder-chart-line", label: "إدارة المشاريع", path: "/admin/projects" },
  { icon: "ri-team-line", label: "الفريق والصلاحيات", path: "/admin/team" },
  { icon: "ri-gallery-line", label: "مكتبة المحتوى", path: "/admin/content" },
  { icon: "ri-bank-card-line", label: "المدفوعات والحوالات", path: "/admin/payments" },
];

const bottomItems = [
  { icon: "ri-settings-3-line", label: "الإعدادات", path: "/admin/settings" },
  { icon: "ri-file-chart-line", label: "التقارير", path: "/admin/reports" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { currentMember, switchMember, allMembers } = useAdminAuth();
  const navigate = useNavigate();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const memberInitials = currentMember.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const avatarColors: Record<string, string> = {
    "مالك المنصة": "from-amber-600 to-amber-800 ring-amber-500/30",
    "مدير مشاريع": "from-sky-600 to-sky-800 ring-sky-500/30",
    "مديرة مشاريع": "from-sky-600 to-sky-800 ring-sky-500/30",
    "مصمم أول": "from-violet-600 to-violet-800 ring-violet-500/30",
    "مصممة أولى": "from-violet-600 to-violet-800 ring-violet-500/30",
    "مصمم جرافيك": "from-violet-600 to-violet-800 ring-violet-500/30",
    "مصممة جرافيك": "from-violet-600 to-violet-800 ring-violet-500/30",
    "مصمم منتجات": "from-violet-600 to-violet-800 ring-violet-500/30",
    "مدير حسابات": "from-rose-600 to-rose-800 ring-rose-500/30",
    "محاسب": "from-rose-600 to-rose-800 ring-rose-500/30",
    "مدير تسويق": "from-emerald-600 to-emerald-800 ring-emerald-500/30",
    "مديرة تسويق": "from-emerald-600 to-emerald-800 ring-emerald-500/30",
    "منسق عملاء": "from-orange-600 to-orange-800 ring-orange-500/30",
    "منسقة عملاء": "from-orange-600 to-orange-800 ring-orange-500/30",
    "موظف دعم": "from-stone-600 to-stone-800 ring-stone-500/30",
  };

  const avatarGradient = avatarColors[currentMember.role] || "from-stone-600 to-stone-800 ring-stone-500/30";

  return (
    <aside className="w-64 bg-stone-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/admin" className="cursor-pointer flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center flex-shrink-0">
            <i className="ri-shield-check-line text-white text-lg"></i>
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-black leading-tight">لوحة الإدارة</div>
            <div className="text-amber-500 text-[10px] font-bold leading-tight">صلاحية المدير</div>
          </div>
        </Link>
      </div>

      {/* Admin Info with User Switcher */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2`}>
            {memberInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-bold truncate">{currentMember.name}</div>
            <div className="text-amber-400 text-xs truncate font-medium">{currentMember.role}</div>
          </div>
          <div className="relative" ref={switcherRef}>
            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
              title="تغيير المستخدم"
            >
              <i className="ri-arrow-down-s-line text-sm"></i>
            </button>

            {showSwitcher && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-stone-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                <div className="p-1.5">
                  <div className="text-white/30 text-[10px] font-bold px-3 py-1.5 mb-1">محاكاة مستخدم</div>
                  {allMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { switchMember(m.id); setShowSwitcher(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer text-right ${
                        currentMember.id === m.id
                          ? "bg-amber-700/30 text-amber-300"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === "نشط" ? "bg-emerald-400" : m.status === "إجازة" ? "bg-amber-400" : "bg-stone-400"}`}></span>
                      <span className="flex-1 truncate text-xs font-medium">{m.name}</span>
                      <span className="text-[10px] text-white/30 whitespace-nowrap">{m.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-white/30 text-xs font-bold px-3 mb-2">القائمة الرئيسية</div>
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isDisabled = item.badge !== undefined;
          return (
            <Link
              key={item.path}
              to={isDisabled ? "#" : item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-700 text-white"
                  : isDisabled
                    ? "text-white/30 cursor-not-allowed"
                    : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              onClick={(e) => { if (isDisabled) e.preventDefault(); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-white/10 text-white/40 text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="text-white/30 text-xs font-bold px-3 mb-2">المزيد</div>
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = item.badge !== undefined;
            return (
              <Link
                key={item.path}
                to={isDisabled ? "#" : item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-700 text-white"
                    : isDisabled
                      ? "text-white/30 cursor-not-allowed"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                onClick={(e) => { if (isDisabled) e.preventDefault(); }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-white/10 text-white/40 text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-home-4-line text-base"></i>
          </div>
          <span>العودة للموقع</span>
        </Link>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-r-line text-base"></i>
          </div>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;