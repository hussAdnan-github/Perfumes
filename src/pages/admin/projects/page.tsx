import { useState, useMemo } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { adminProjects, adminProjectStats, adminProjectCategories, adminProjectPhases, adminProjectPriorities, adminProjectTimeline } from "@/mocks/adminData";
import { exportProjectsToExcel, exportProjectsToPDF } from "./exportUtils";

const availableManagers = ["أحمد الزهراني", "سارة المطيري", "نورة القحطاني"];
const availableDesigners = ["نورة القحطاني", "فهد العتيبي", "هند الشهري", "خالد الشمري"];

type Project = typeof adminProjects[0];

const AdminProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [sortBy, setSortBy] = useState<"progress" | "deadline" | "budget" | "name">("progress");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Project | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<Project | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredProjects = useMemo(() => {
    return adminProjects
      .filter((p) => {
        if (searchTerm && !p.name.includes(searchTerm) && !p.id.includes(searchTerm) && !p.client.includes(searchTerm)) return false;
        if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
        if (phaseFilter !== "all" && p.phase !== phaseFilter) return false;
        if (priorityFilter !== "all" && p.priority !== priorityFilter) return false;
        if (managerFilter !== "all" && p.manager !== managerFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "progress") return b.progress - a.progress;
        if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (sortBy === "budget") return b.budget - a.budget;
        if (sortBy === "name") return a.name.localeCompare(b.name, "ar");
        return 0;
      });
  }, [searchTerm, categoryFilter, phaseFilter, priorityFilter, managerFilter, sortBy]);

  const stats = adminProjectStats;

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    adminProjectCategories.filter(c => c.key !== "all").forEach(cat => {
      grouped[cat.key] = filteredProjects.filter(p => p.category === cat.key);
    });
    return grouped;
  }, [filteredProjects]);

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || phaseFilter !== "all" || priorityFilter !== "all" || managerFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPhaseFilter("all");
    setPriorityFilter("all");
    setManagerFilter("all");
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">إدارة المشاريع</h1>
              <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {stats.total} مشروع
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">متابعة وإدارة جميع مشاريع المنصة من لوحة واحدة</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
              >
                <i className="ri-download-line"></i>
                تصدير
                <i className={`ri-arrow-down-s-line text-xs transition-transform ${showExportMenu ? "rotate-180" : ""}`}></i>
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)}></div>
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-stone-100 shadow-lg z-20 min-w-[180px] overflow-hidden">
                    <button
                      onClick={() => { exportProjectsToExcel(filteredProjects, stats, adminProjectCategories); setShowExportMenu(false); }}
                      className="w-full text-right px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer whitespace-nowrap flex items-center gap-3"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <i className="ri-file-excel-2-line text-base"></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold">Excel</div>
                        <div className="text-stone-400 text-xs font-normal">تصدير جدول البيانات</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { exportProjectsToPDF(filteredProjects, stats, adminProjectCategories); setShowExportMenu(false); }}
                      className="w-full text-right px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer whitespace-nowrap flex items-center gap-3 border-t border-stone-50"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                        <i className="ri-file-pdf-2-line text-base"></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold">PDF</div>
                        <div className="text-stone-400 text-xs font-normal">تقرير قابل للطباعة</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                showTimeline ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
              title="سجل النشاطات"
            >
              <i className="ri-history-line text-base"></i>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              مشروع جديد
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {[
              { label: "الإجمالي", value: stats.total, color: "bg-stone-900", icon: "ri-folder-3-line", bg: "bg-stone-100" },
              { label: "نشطة", value: stats.active, color: "bg-sky-600", icon: "ri-loader-4-line", bg: "bg-sky-50" },
              { label: "مكتملة", value: stats.completed, color: "bg-emerald-600", icon: "ri-checkbox-circle-line", bg: "bg-emerald-50" },
              { label: "معرضة للخطر", value: stats.atRisk, color: "bg-rose-600", icon: "ri-alert-line", bg: "bg-rose-50" },
              { label: "متوسط الإنجاز", value: `${stats.avgProgress}%`, color: "bg-amber-600", icon: "ri-pie-chart-line", bg: "bg-amber-50" },
              { label: "الميزانية", value: `${(stats.totalBudget / 1000).toFixed(0)}K`, color: "bg-violet-600", icon: "ri-money-dollar-circle-line", bg: "bg-violet-50" },
              { label: "المدفوع", value: `${(stats.totalPaid / 1000).toFixed(0)}K`, color: "bg-emerald-600", icon: "ri-bank-card-line", bg: "bg-emerald-50" },
              { label: "المعلق", value: `${(stats.pendingAmount / 1000).toFixed(0)}K`, color: "bg-orange-600", icon: "ri-hourglass-line", bg: "bg-orange-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 border border-stone-100">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-2 ${stat.bg}`}>
                  <i className={`${stat.icon} text-base`} style={{ color: stat.color.replace("bg-", "") }}></i>
                </div>
                <div className="text-lg font-black text-stone-900 mb-0.5">{stat.value}</div>
                <div className="text-stone-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-xs">
                <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="بحث عن مشروع أو عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-9 pl-4 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {adminProjectCategories.map((c) => (
                      <option key={c.key} value={c.key}>{c.key === "all" ? "التصنيف: الكل" : c.label}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Phase Filter */}
                <div className="relative">
                  <select
                    value={phaseFilter}
                    onChange={(e) => setPhaseFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {adminProjectPhases.map((p) => (
                      <option key={p.key} value={p.key}>{p.key === "all" ? "المرحلة: الكل" : p.label}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {adminProjectPriorities.map((p) => (
                      <option key={p.key} value={p.key}>{p.key === "all" ? "الأولوية: الكل" : p.label}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Manager Filter */}
                <div className="relative">
                  <select
                    value={managerFilter}
                    onChange={(e) => setManagerFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    <option value="all">المدير: الكل</option>
                    {availableManagers.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-rose-600 text-xs font-bold hover:text-rose-700 cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-close-circle-line"></i>
                    مسح الفلاتر
                  </button>
                )}
              </div>
            </div>

            {/* Sort & View Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-xs">ترتيب:</span>
                {[
                  { key: "progress" as const, label: "الإنجاز" },
                  { key: "deadline" as const, label: "موعد التسليم" },
                  { key: "budget" as const, label: "الميزانية" },
                  { key: "name" as const, label: "الاسم" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === s.key ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-stone-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    viewMode === "kanban" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <i className="ri-layout-column-line text-sm"></i>
                  كانبان
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    viewMode === "table" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <i className="ri-table-line text-sm"></i>
                  جدول
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-stone-500 text-xs">عرض {filteredProjects.length} من {adminProjects.length} مشروع</span>
          </div>

          {/* Content Area: Kanban vs Table + Timeline Sidebar */}
          <div className="flex gap-6">
            <div className={`flex-1 min-w-0 ${showTimeline ? "lg:w-[calc(100%-340px)]" : ""}`}>
              {viewMode === "kanban" ? (
                /* KANBAN VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Object.entries(groupedByCategory).map(([catKey, projects]) => {
                    const cat = adminProjectCategories.find(c => c.key === catKey);
                    if (!cat || projects.length === 0) return null;

                    return (
                      <div key={catKey} className="flex flex-col min-h-[300px]">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${cat.dot}`}></div>
                            <h3 className="font-black text-stone-800 text-sm">{cat.label}</h3>
                            <span className="bg-stone-100 text-stone-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">{projects.length}</span>
                          </div>
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
                            title="إضافة مشروع"
                          >
                            <i className="ri-add-line text-sm"></i>
                          </button>
                        </div>

                        {/* Project Cards */}
                        <div className="flex-1 space-y-3">
                          {projects.map((project) => {
                            const isLate = new Date(project.deadline) < new Date() && project.progress < 100;
                            return (
                              <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className="bg-white rounded-2xl border border-stone-100 hover:border-amber-300 transition-all cursor-pointer group"
                              >
                                <div className="p-4">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-stone-900 text-sm truncate">{project.name}</h4>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${project.priorityColor}`}>
                                          {project.priority}
                                        </span>
                                      </div>
                                      <span className="text-stone-400 text-xs">{project.id}</span>
                                    </div>
                                    {isLate && (
                                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-100 flex-shrink-0" title="متأخر">
                                        <i className="ri-alert-line text-rose-600 text-xs"></i>
                                      </span>
                                    )}
                                  </div>

                                  {/* Milestones */}
                                  <div className="mb-3">
                                    <div className="flex items-center gap-1 mb-2">
                                      {project.milestones.map((m, idx) => (
                                        <div
                                          key={idx}
                                          className={`flex-1 h-1.5 rounded-full transition-all ${
                                            m.done ? cat.dot : "bg-stone-100"
                                          }`}
                                        ></div>
                                      ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className={`text-xs font-bold ${cat.color?.split(" ")[1] || "text-stone-700"}`}>{project.status}</span>
                                      <span className="text-stone-400 text-xs">{project.statusStep}/{project.totalSteps}</span>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-stone-400 text-xs">الإنجاز</span>
                                      <span className="text-stone-600 text-xs font-black">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-1.5 rounded-full transition-all duration-700 ${
                                          project.progress === 100 ? "bg-emerald-500" : project.progress >= 70 ? "bg-amber-500" : project.progress >= 40 ? "bg-sky-500" : "bg-stone-300"
                                        }`}
                                        style={{ width: `${project.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Meta */}
                                  <div className="flex items-center justify-between text-xs text-stone-400">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex-shrink-0">
                                        {project.managerInitial}
                                      </div>
                                      <span>{project.manager}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${project.riskColor}`}>
                                        {project.risk}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {filteredProjects.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-100 mx-auto mb-4">
                        <i className="ri-inbox-line text-stone-400 text-2xl"></i>
                      </div>
                      <p className="text-stone-500 font-semibold text-sm mb-1">لا توجد مشاريع مطابقة</p>
                      <p className="text-stone-400 text-xs">جرب تغيير معايير البحث أو الفلاتر</p>
                    </div>
                  )}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-stone-100">
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المشروع</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">العميل</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">التصنيف</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الحالة</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الإنجاز</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الميزانية</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المدير</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المصمم</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">التسليم</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الخطر</th>
                          <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => {
                          const isLate = new Date(project.deadline) < new Date() && project.progress < 100;
                          return (
                            <tr key={project.id} className="border-b border-stone-50 hover:bg-amber-50/50 transition-all">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-stone-900 text-sm font-bold">{project.name}</span>
                                    {isLate && <i className="ri-alert-line text-rose-500 text-xs" title="متأخر"></i>}
                                  </div>
                                  <div className="text-stone-400 text-xs">{project.id}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-stone-700 text-xs font-semibold">{project.client}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${project.categoryColor}`}>
                                  <i className={`${project.categoryIcon} ml-1 text-xs`}></i>
                                  {project.pathLabel}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${project.categoryDot}`}></span>
                                  <span className="text-stone-600 text-xs font-semibold whitespace-nowrap">{project.status}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-1.5 rounded-full ${project.progress === 100 ? "bg-emerald-500" : project.progress >= 70 ? "bg-amber-500" : "bg-sky-500"}`}
                                      style={{ width: `${project.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-stone-600 text-xs font-bold">{project.progress}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-stone-900 text-xs font-bold whitespace-nowrap">{project.budget.toLocaleString()} ريال</div>
                                <div className="text-stone-400 text-xs whitespace-nowrap">المدفوع: {project.paid.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex-shrink-0">
                                    {project.managerInitial}
                                  </div>
                                  <span className="text-stone-600 text-xs whitespace-nowrap">{project.manager}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {project.designer ? (
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-50 text-violet-500 text-xs font-bold flex-shrink-0">
                                      {project.designerInitial}
                                    </div>
                                    <span className="text-stone-600 text-xs whitespace-nowrap">{project.designer}</span>
                                  </div>
                                ) : (
                                  <span className="text-stone-300 text-xs">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs whitespace-nowrap ${isLate ? "text-rose-600 font-bold" : "text-stone-500"}`}>
                                  {project.deadline}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${project.riskColor}`}>
                                  {project.risk}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all cursor-pointer"
                                    title="التفاصيل"
                                  >
                                    <i className="ri-eye-line text-sm"></i>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setShowStatusModal(project); setNewStatus(project.status); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-sky-50 hover:text-sky-600 transition-all cursor-pointer"
                                    title="تغيير الحالة"
                                  >
                                    <i className="ri-arrow-right-circle-line text-sm"></i>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(project); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                                    title="حذف"
                                  >
                                    <i className="ri-delete-bin-line text-sm"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredProjects.length === 0 && (
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-100 mx-auto mb-4">
                        <i className="ri-inbox-line text-stone-400 text-2xl"></i>
                      </div>
                      <p className="text-stone-500 font-semibold text-sm mb-1">لا توجد مشاريع مطابقة</p>
                      <p className="text-stone-400 text-xs">جرب تغيير معايير البحث أو الفلاتر</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                    <div className="text-stone-400 text-xs">
                      عرض {filteredProjects.length} من {adminProjects.length} مشروع
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition-all cursor-pointer">
                        <i className="ri-arrow-right-s-line text-sm"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white text-xs font-bold">1</button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all cursor-pointer text-xs">2</button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition-all cursor-pointer">
                        <i className="ri-arrow-left-s-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Sidebar */}
            {showTimeline && (
              <div className="hidden lg:block w-[320px] flex-shrink-0">
                <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-stone-900 text-sm">سجل النشاطات</h3>
                    <button
                      onClick={() => setShowTimeline(false)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 transition-all cursor-pointer"
                    >
                      <i className="ri-close-line text-sm"></i>
                    </button>
                  </div>
                  <div className="space-y-0">
                    {adminProjectTimeline.map((item, i) => (
                      <div key={item.id} className="flex gap-3 py-3 border-b border-stone-50 last:border-b-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`}></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-stone-700 text-xs leading-relaxed">
                            <span className="font-bold">{item.action}</span>
                            {" — "}{item.project}
                          </p>
                          <p className="text-stone-400 text-xs">{item.detail}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-stone-400 text-xs">{item.user}</span>
                            <span className="text-stone-300 text-xs">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${selectedProject.categoryDot}`}></div>
                  <div>
                    <h3 className="font-black text-stone-900 text-sm">{selectedProject.name}</h3>
                    <p className="text-stone-400 text-xs">{selectedProject.id} · {selectedProject.pathLabel}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-stone-500"></i>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Risk Banner */}
                {selectedProject.risk === "مرتفع" && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-100 flex-shrink-0">
                      <i className="ri-alert-line text-rose-600"></i>
                    </div>
                    <div>
                      <h4 className="text-rose-700 text-sm font-bold mb-1">مشروع عالي المخاطر</h4>
                      <p className="text-rose-600 text-xs">{selectedProject.notes}</p>
                    </div>
                  </div>
                )}

                {/* Progress Section */}
                <div>
                  <h4 className="text-stone-900 text-sm font-bold mb-3">تقدم المشروع</h4>
                  <div className="flex items-center gap-0 mb-4">
                    {selectedProject.milestones.map((m, idx) => (
                      <div key={idx} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                            m.done ? "bg-emerald-500 text-white" :
                            idx === selectedProject.statusStep - 1 ? "bg-amber-500 text-white" :
                            "bg-stone-100 text-stone-400"
                          }`}>
                            {m.done ? <i className="ri-check-line text-sm"></i> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-semibold whitespace-nowrap ${m.done ? "text-emerald-600" : idx === selectedProject.statusStep - 1 ? "text-amber-600" : "text-stone-400"}`}>
                            {m.name}
                          </span>
                        </div>
                        {idx < selectedProject.milestones.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${m.done ? "bg-emerald-400" : "bg-stone-200"}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 text-xs">نسبة الإنجاز:</span>
                      <span className="text-stone-900 text-sm font-black">{selectedProject.progress}%</span>
                    </div>
                    <div className="flex-1 mx-4 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${selectedProject.progress === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">العميل</div>
                    <div className="text-stone-900 text-sm font-bold">{selectedProject.client}</div>
                    <div className="text-stone-500 text-xs">{selectedProject.clientEmail}</div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">التصنيف</div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${selectedProject.categoryColor}`}>
                      <i className={`${selectedProject.categoryIcon} ml-1 text-xs`}></i>
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">الأولوية</div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${selectedProject.priorityColor}`}>
                      {selectedProject.priority}
                    </span>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">الميزانية</div>
                    <div className="text-stone-900 text-sm font-bold">{selectedProject.budget.toLocaleString()} ريال</div>
                    <div className="text-stone-500 text-xs">المدفوع: {selectedProject.paid.toLocaleString()} ريال</div>
                    <div className="text-stone-500 text-xs">المتبقي: {(selectedProject.budget - selectedProject.paid).toLocaleString()} ريال</div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">المدير</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex-shrink-0">
                        {selectedProject.managerInitial}
                      </div>
                      <span className="text-stone-700 text-xs font-semibold">{selectedProject.manager}</span>
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">المصمم</div>
                    {selectedProject.designer ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex-shrink-0">
                          {selectedProject.designerInitial}
                        </div>
                        <span className="text-stone-700 text-xs font-semibold">{selectedProject.designer}</span>
                      </div>
                    ) : (
                      <span className="text-stone-300 text-xs">غير محدد</span>
                    )}
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">تاريخ الإنشاء</div>
                    <div className="text-stone-700 text-xs font-semibold">{selectedProject.createdDate}</div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">موعد التسليم</div>
                    <div className={`text-xs font-semibold ${new Date(selectedProject.deadline) < new Date() && selectedProject.progress < 100 ? "text-rose-600" : "text-stone-700"}`}>
                      {selectedProject.deadline}
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs mb-1">آخر تحديث</div>
                    <div className="text-stone-700 text-xs font-semibold">{selectedProject.lastUpdate}</div>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h4 className="text-stone-900 text-sm font-bold mb-2">الفريق</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedProject.team.map((member, i) => (
                      <span key={i} className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-600 text-xs font-semibold whitespace-nowrap">
                        {member}
                      </span>
                    ))}
                    <button className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-amber-700 text-xs font-bold whitespace-nowrap hover:bg-amber-100 cursor-pointer transition-all flex items-center gap-1">
                      <i className="ri-add-line text-xs"></i>
                      إضافة عضو
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-stone-900 text-sm font-bold mb-2">الوصف</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Notes */}
                {selectedProject.notes && (
                  <div>
                    <h4 className="text-stone-900 text-sm font-bold mb-2">ملاحظات</h4>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-amber-800 text-xs leading-relaxed">{selectedProject.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-stone-100 px-6 py-4 flex items-center justify-between rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setShowDeleteConfirm(selectedProject); setSelectedProject(null); }}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer whitespace-nowrap"
                  >
                    حذف المشروع
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => { setShowStatusModal(selectedProject); setNewStatus(selectedProject.status); }}
                    className="px-5 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className="ri-arrow-right-circle-line text-sm"></i>
                    تغيير الحالة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowStatusModal(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-black text-stone-900 text-sm">تغيير حالة المشروع</h3>
                <button onClick={() => setShowStatusModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer">
                  <i className="ri-close-line text-stone-500"></i>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-stone-400 text-xs mb-1">المشروع</div>
                  <div className="text-stone-900 text-sm font-bold">{showStatusModal.name}</div>
                  <div className="text-stone-500 text-xs">{showStatusModal.id}</div>
                </div>

                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">الحالة الحالية</label>
                  <div className="bg-stone-50 rounded-xl px-4 py-2.5 text-stone-600 text-sm font-semibold">{showStatusModal.status}</div>
                </div>

                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">الحالة الجديدة</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {showStatusModal.milestones.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">ملاحظات</label>
                  <textarea
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all h-20 resize-none"
                    placeholder="سبب تغيير الحالة..."
                  ></textarea>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button onClick={() => setShowStatusModal(null)} className="px-4 py-2.5 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap">
                  إلغاء
                </button>
                <button onClick={() => setShowStatusModal(null)} className="px-6 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                  <i className="ri-check-line"></i>
                  تحديث الحالة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-rose-100">
                  <i className="ri-delete-bin-line text-rose-600 text-2xl"></i>
                </div>
                <h3 className="font-black text-stone-900 text-sm mb-2">تأكيد حذف المشروع</h3>
                <p className="text-stone-500 text-xs mb-4 leading-relaxed">
                  هل أنت متأكد من حذف مشروع <strong>{showDeleteConfirm.name}</strong>؟
                  <br />
                  <span className="text-rose-500">لا يمكن التراجع عن هذا الإجراء.</span>
                </p>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-2.5 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className="ri-delete-bin-line"></i>
                    نعم، احذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <h3 className="font-black text-stone-900 text-sm">إضافة مشروع جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer">
                  <i className="ri-close-line text-stone-500"></i>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">اسم المشروع</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="اسم المشروع" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">العميل</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="اسم العميل أو الشركة" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">البريد الإلكتروني للعميل</label>
                    <input type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">التصنيف</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      {adminProjectCategories.filter(c => c.key !== "all").map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">الميزانية (ريال)</label>
                    <input type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المبلغ المدفوع (ريال)</label>
                    <input type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">مدير المشروع</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      {availableManagers.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المصمم</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      <option value="">بدون مصمم</option>
                      {availableDesigners.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">الأولوية</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      <option>متوسط</option>
                      <option>عالي</option>
                      <option>عاجل</option>
                      <option>منخفض</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">موعد التسليم</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">وصف المشروع</label>
                  <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all h-24 resize-none" placeholder="وصف تفصيلي للمشروع..."></textarea>
                </div>
                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">ملاحظات</label>
                  <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all h-20 resize-none" placeholder="أي ملاحظات إضافية..."></textarea>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-stone-100 px-6 py-4 flex items-center justify-end gap-2 rounded-b-3xl">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap">
                  إلغاء
                </button>
                <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                  <i className="ri-check-line"></i>
                  إنشاء المشروع
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProjectsPage;