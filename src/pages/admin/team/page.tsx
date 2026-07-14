import { useState, useMemo } from "react";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import { teamMembers, availableRoles, availableDepartments, allPermissions, teamActivityLog } from "@/mocks/adminData";

type TeamMember = typeof teamMembers[0];

const statusFilters = [
  { key: "all", label: "الكل" },
  { key: "نشط", label: "نشط" },
  { key: "إجازة", label: "إجازة" },
  { key: "غير نشط", label: "غير نشط" },
];

const AdminTeamPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    permissions: [] as string[],
  });

  const [editMemberData, setEditMemberData] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchSearch =
        !searchQuery ||
        m.name.includes(searchQuery) ||
        m.email.includes(searchQuery) ||
        m.role.includes(searchQuery) ||
        m.id.includes(searchQuery);
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchRole = !roleFilter || m.role === roleFilter;
      const matchDept = !departmentFilter || m.department === departmentFilter;
      return matchSearch && matchStatus && matchRole && matchDept;
    });
  }, [searchQuery, statusFilter, roleFilter, departmentFilter]);

  const stats = useMemo(() => {
    const total = teamMembers.length;
    const active = teamMembers.filter((m) => m.status === "نشط").length;
    const designers = teamMembers.filter((m) => m.role.includes("مصمم")).length;
    const inactive = teamMembers.filter((m) => m.status !== "نشط").length;
    return { total, active, designers, inactive };
  }, []);

  const roleOptions = useMemo(() => {
    const seen = new Set<string>();
    return availableRoles.filter((r) => {
      if (seen.has(r.label)) return false;
      seen.add(r.label);
      return true;
    });
  }, []);

  const openEditModal = (member: TeamMember) => {
    setEditMemberData({ ...member });
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteConfirm(true);
  };

  const togglePermission = (permLabel: string, isEdit: boolean) => {
    if (isEdit && editMemberData) {
      setEditMemberData((prev) => {
        if (!prev) return null;
        const perms = prev.permissions.includes(permLabel)
          ? prev.permissions.filter((p) => p !== permLabel)
          : [...prev.permissions, permLabel];
        return { ...prev, permissions: perms };
      });
    } else {
      setNewMember((prev) => {
        const perms = prev.permissions.includes(permLabel)
          ? prev.permissions.filter((p) => p !== permLabel)
          : [...prev.permissions, permLabel];
        return { ...prev, permissions: perms };
      });
    }
  };

  const resetAddForm = () => {
    setNewMember({ name: "", email: "", phone: "", role: "", department: "", permissions: [] });
    setShowAddModal(false);
  };

  const MemberAvatar = ({ name, className = "" }: { name: string; className?: string }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
    const colors = ["bg-amber-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-orange-500"];
    const colorIndex = name.length % colors.length;
    return (
      <div className={`${colors[colorIndex]} ${className} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <AdminSidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="ri-menu-line text-xl text-stone-600"></i>
            </button>
            <div>
              <h1 className="text-lg font-black text-stone-900">الفريق والصلاحيات</h1>
              <p className="text-xs text-stone-500">إدارة أعضاء الفريق والأدوار والصلاحيات</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line text-lg"></i>
            <span className="hidden sm:inline">إضافة عضو جديد</span>
          </button>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: "ri-team-line", label: "إجمالي الفريق", value: stats.total, color: "bg-stone-900" },
              { icon: "ri-user-follow-line", label: "الأعضاء النشطون", value: stats.active, color: "bg-emerald-600" },
              { icon: "ri-brush-line", label: "المصممين", value: stats.designers, color: "bg-violet-600" },
              { icon: "ri-user-unfollow-line", label: "غير نشطين / إجازة", value: stats.inactive, color: "bg-amber-600" },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl p-4 border border-stone-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${card.color} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <i className={`${card.icon} text-white text-sm`}></i>
                  </div>
                  <span className="text-stone-500 text-xs font-medium">{card.label}</span>
                </div>
                <div className="text-2xl font-black text-stone-900">{card.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"></i>
                <input
                  type="text"
                  placeholder="ابحث بالاسم، الإيميل، أو رقم العضو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
              >
                {statusFilters.map((sf) => (
                  <option key={sf.key} value={sf.key}>{sf.label}</option>
                ))}
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
              >
                <option value="">كل الأدوار</option>
                {roleOptions.map((r) => (
                  <option key={r.key} value={r.label}>{r.label}</option>
                ))}
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
              >
                <option value="">كل الأقسام</option>
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {(searchQuery || statusFilter !== "all" || roleFilter || departmentFilter) && (
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("all"); setRoleFilter(""); setDepartmentFilter(""); }}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-stone-500 hover:text-stone-700 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-close-circle-line text-sm"></i>
                  مسح الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap">العضو</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap">الدور</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap hidden md:table-cell">القسم</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap hidden lg:table-cell">الصلاحيات</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap">الحالة</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap hidden sm:table-cell">المشاريع</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stone-400">
                        <i className="ri-user-search-line text-3xl block mb-2"></i>
                        <span className="text-sm font-medium">لا توجد نتائج مطابقة</span>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <MemberAvatar name={member.name} className="w-9 h-9 text-xs" />
                            <div>
                              <div className="font-bold text-stone-900 text-sm">{member.name}</div>
                              <div className="text-xs text-stone-400 hidden sm:block">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${member.roleColor}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell whitespace-nowrap">{member.department}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.slice(0, 3).map((p) => (
                              <span key={p} className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium whitespace-nowrap">
                                {p}
                              </span>
                            ))}
                            {member.permissions.length > 3 && (
                              <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 text-stone-400 text-[10px] font-medium">
                                +{member.permissions.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${member.statusColor}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-600 font-medium hidden sm:table-cell text-center">
                          {member.projects}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(member)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 cursor-pointer"
                              title="تعديل"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                            {member.role !== "مالك المنصة" && (
                              <button
                                onClick={() => openDeleteConfirm(member)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                                title="حذف"
                              >
                                <i className="ri-delete-bin-line text-sm"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>عرض {filteredMembers.length} من {teamMembers.length} عضو</span>
              <button
                onClick={() => setShowActivityLog(true)}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 font-medium cursor-pointer"
              >
                <i className="ri-history-line"></i>
                سجل النشاطات
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto" onClick={resetAddForm}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 my-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-stone-900">إضافة عضو جديد</h2>
                <p className="text-xs text-stone-500 mt-0.5">أدخل بيانات العضو الجديد وصلاحياته</p>
              </div>
              <button onClick={resetAddForm} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer">
                <i className="ri-close-line text-lg text-stone-500"></i>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                    placeholder="مثال: محمد الشمري"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                    placeholder="email@brand.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newMember.phone}
                    onChange={(e) => setNewMember((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">الدور الوظيفي *</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
                  >
                    <option value="">اختر الدور...</option>
                    {roleOptions.map((r) => (
                      <option key={r.key} value={r.label}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5">القسم</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember((p) => ({ ...p, department: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
                >
                  <option value="">اختر القسم...</option>
                  {availableDepartments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2">الصلاحيات</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPermissions.map((perm) => {
                    const isSelected = newMember.permissions.includes(perm.label);
                    return (
                      <button
                        key={perm.key}
                        onClick={() => togglePermission(perm.label, false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center ${isSelected ? "text-white" : "text-stone-400"}`}>
                          <i className={isSelected ? "ri-checkbox-circle-fill text-sm" : "ri-checkbox-blank-circle-line text-sm"}></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`${perm.icon} text-xs`}></i>
                          <span>{perm.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={resetAddForm}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (newMember.name && newMember.email && newMember.role) {
                    resetAddForm();
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-user-add-line ml-1.5"></i>
                إضافة العضو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editMemberData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto" onClick={() => { setShowEditModal(false); setEditMemberData(null); }}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 my-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MemberAvatar name={editMemberData.name} className="w-10 h-10 text-xs" />
                <div>
                  <h2 className="text-lg font-black text-stone-900">تعديل العضو</h2>
                  <p className="text-xs text-stone-500">{editMemberData.name} — {editMemberData.id}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowEditModal(false); setEditMemberData(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <i className="ri-close-line text-lg text-stone-500"></i>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">الاسم الكامل</label>
                  <input
                    type="text"
                    value={editMemberData.name}
                    onChange={(e) => setEditMemberData((p) => p ? { ...p, name: e.target.value } : null)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editMemberData.email}
                    onChange={(e) => setEditMemberData((p) => p ? { ...p, email: e.target.value } : null)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editMemberData.phone}
                    onChange={(e) => setEditMemberData((p) => p ? { ...p, phone: e.target.value } : null)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">الدور</label>
                  <select
                    value={editMemberData.role}
                    onChange={(e) => {
                      const selectedRole = roleOptions.find((r) => r.label === e.target.value);
                      setEditMemberData((p) =>
                        p ? { ...p, role: e.target.value, roleColor: selectedRole?.color || p.roleColor } : null
                      );
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
                  >
                    {roleOptions.map((r) => (
                      <option key={r.key} value={r.label}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1.5">الحالة</label>
                  <select
                    value={editMemberData.status}
                    onChange={(e) => {
                      const statusColors: Record<string, string> = {
                        "نشط": "bg-emerald-100 text-emerald-700",
                        "إجازة": "bg-amber-100 text-amber-700",
                        "غير نشط": "bg-stone-100 text-stone-600",
                      };
                      setEditMemberData((p) =>
                        p ? { ...p, status: e.target.value, statusColor: statusColors[e.target.value] || p.statusColor } : null
                      );
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
                  >
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                    <option value="غير نشط">غير نشط</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5">القسم</label>
                <select
                  value={editMemberData.department}
                  onChange={(e) => setEditMemberData((p) => p ? { ...p, department: e.target.value } : null)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-stone-400 text-stone-700 cursor-pointer"
                >
                  {availableDepartments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2">الصلاحيات</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPermissions.map((perm) => {
                    const isSelected = editMemberData.permissions.includes(perm.label);
                    return (
                      <button
                        key={perm.key}
                        onClick={() => togglePermission(perm.label, true)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center ${isSelected ? "text-white" : "text-stone-400"}`}>
                          <i className={isSelected ? "ri-checkbox-circle-fill text-sm" : "ri-checkbox-blank-circle-line text-sm"}></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`${perm.icon} text-xs`}></i>
                          <span>{perm.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedMember(editMemberData);
                  setShowDeleteConfirm(true);
                  setShowEditModal(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-line text-sm"></i>
                حذف العضو
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowEditModal(false); setEditMemberData(null); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => { setShowEditModal(false); setEditMemberData(null); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-save-line ml-1.5"></i>
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-rose-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-black text-stone-900 mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-stone-500 mb-1">
                هل أنت متأكد من حذف العضو
              </p>
              <p className="text-sm font-bold text-stone-800 mb-5">{selectedMember.name}؟</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                <p className="text-xs text-amber-700 font-medium">
                  هذا الإجراء لا يمكن التراجع عنه. سيتم إلغاء صلاحيات العضو ومنعه من الوصول إلى النظام.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line ml-1.5"></i>
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto" onClick={() => setShowActivityLog(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-md mx-4 my-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-stone-900">سجل نشاطات الفريق</h2>
                <p className="text-xs text-stone-500">آخر التعديلات والإجراءات</p>
              </div>
              <button
                onClick={() => setShowActivityLog(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <i className="ri-close-line text-lg text-stone-500"></i>
              </button>
            </div>
            <div className="p-5 max-h-[55vh] overflow-y-auto space-y-0">
              {teamActivityLog.map((log, idx) => (
                <div key={log.id} className="flex gap-3 py-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`${log.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${log.icon} text-white text-xs`}></i>
                    </div>
                    {idx < teamActivityLog.length - 1 && (
                      <div className="w-px flex-1 bg-stone-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <p className="text-sm font-medium text-stone-800">{log.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-500">{log.member}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-400">{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;