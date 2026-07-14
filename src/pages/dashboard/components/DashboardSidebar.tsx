import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: "ri-dashboard-3-line", label: "لوحة التحكم", path: "/dashboard" },
  { icon: "ri-folder-3-line", label: "مشاريعي", path: "/dashboard/projects", badge: "3" },
  { icon: "ri-kanban-view", label: "إدارة المشاريع", path: "/dashboard/projects/manage" },
  { icon: "ri-message-3-line", label: "الرسائل", path: "/dashboard/messages", badge: "5" },
  { icon: "ri-checkbox-circle-line", label: "الاعتمادات", path: "/dashboard/approvals", badge: "2" },
  { icon: "ri-price-tag-3-line", label: "الفواتير", path: "/dashboard/invoices" },
];

const workflowItems = [
  { icon: "ri-git-branch-line", label: "Workflow المنصة", path: "/workflow" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-stone-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="cursor-pointer block">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.firstName?.charAt(0) || "م"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-bold truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-white/40 text-xs truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-700 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Workflow Section */}
        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="text-white/30 text-xs font-bold px-3 mb-2">Workflow</div>
          {workflowItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-700 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          to="/services"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-amber-700 text-white hover:bg-amber-600 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-add-circle-line text-base"></i>
          </div>
          <span>مشروع جديد</span>
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-settings-3-line text-base"></i>
          </div>
          <span>الإعدادات</span>
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

export default DashboardSidebar;
