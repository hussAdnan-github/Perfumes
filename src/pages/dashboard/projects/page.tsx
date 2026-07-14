import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const allProjects = [
  {
    id: "PRJ-2026-001",
    name: "براند الفجر",
    type: "براند عطور كامل",
    status: "تطوير التركيبة",
    statusKey: "formula",
    progress: 55,
    lastUpdate: "منذ ساعتين",
    manager: "أحمد الزهراني",
    managerInitial: "أ",
    path: "A",
    pathLabel: "براند كامل",
    priority: "عالي",
    deadline: "15 أغسطس 2026",
    budget: "SAR 85,000",
    phase: "تطوير",
  },
  {
    id: "PRJ-2026-002",
    name: "عطر الليل",
    type: "تطوير عطر فقط",
    status: "العينات",
    statusKey: "sampling",
    progress: 70,
    lastUpdate: "منذ يوم",
    manager: "سارة المطيري",
    managerInitial: "س",
    path: "B",
    pathLabel: "عطر فقط",
    priority: "متوسط",
    deadline: "1 سبتمبر 2026",
    budget: "SAR 45,000",
    phase: "تطوير",
  },
  {
    id: "PRJ-2026-003",
    name: "هوية نيش",
    type: "هوية بصرية فقط",
    status: "البريف قيد الإعداد",
    statusKey: "brief",
    progress: 20,
    lastUpdate: "منذ 3 أيام",
    manager: "فهد العتيبي",
    managerInitial: "ف",
    path: "D",
    pathLabel: "هوية بصرية",
    priority: "عالي",
    deadline: "20 أكتوبر 2026",
    budget: "SAR 35,000",
    phase: "استقطاب",
  },
  {
    id: "PRJ-2026-004",
    name: "مجموعة شرقية",
    type: "براند عطور كامل",
    status: "في الإنتاج",
    statusKey: "production",
    progress: 85,
    lastUpdate: "منذ 5 ساعات",
    manager: "نورة القحطاني",
    managerInitial: "ن",
    path: "A",
    pathLabel: "براند كامل",
    priority: "عالي",
    deadline: "10 يوليو 2026",
    budget: "SAR 120,000",
    phase: "إنتاج",
  },
  {
    id: "PRJ-2026-005",
    name: "عبوة زجاجية فاخرة",
    type: "عبوة وتغليف",
    status: "مراجعة ثلاثية الأبعاد",
    statusKey: "3d-review",
    progress: 60,
    lastUpdate: "أمس",
    manager: "تركي الشهري",
    managerInitial: "ت",
    path: "C",
    pathLabel: "تغليف",
    priority: "متوسط",
    deadline: "25 أغسطس 2026",
    budget: "SAR 28,000",
    phase: "اعتماد",
  },
  {
    id: "PRJ-2026-006",
    name: "ماء الذهب",
    type: "تطوير عطر فقط",
    status: "تصميم الهوية",
    statusKey: "identity",
    progress: 40,
    lastUpdate: "منذ يومين",
    manager: "سارة المطيري",
    managerInitial: "س",
    path: "B",
    pathLabel: "عطر فقط",
    priority: "منخفض",
    deadline: "5 نوفمبر 2026",
    budget: "SAR 38,000",
    phase: "تطوير",
  },
  {
    id: "PRJ-2026-007",
    name: "عبير الصباح",
    type: "تصنيع",
    status: "بانتظار الموافقة",
    statusKey: "awaiting-approval",
    progress: 90,
    lastUpdate: "منذ 4 ساعات",
    manager: "أحمد الزهراني",
    managerInitial: "أ",
    path: "E",
    pathLabel: "تصنيع",
    priority: "عاجل",
    deadline: "30 يوليو 2026",
    budget: "SAR 65,000",
    phase: "اعتماد",
  },
  {
    id: "PRJ-2026-008",
    name: "ملصقات احترافية",
    type: "طباعة",
    status: "تم التسليم",
    statusKey: "delivered",
    progress: 100,
    lastUpdate: "منذ أسبوع",
    manager: "فهد العتيبي",
    managerInitial: "ف",
    path: "F",
    pathLabel: "طباعة",
    priority: "مكتمل",
    deadline: "1 يونيو 2026",
    budget: "SAR 12,000",
    phase: "تسليم",
  },
  {
    id: "PRJ-2026-009",
    name: "مسك الأصالة",
    type: "براند عطور كامل",
    status: "جمع البريف العام",
    statusKey: "brief",
    progress: 10,
    lastUpdate: "منذ 6 أيام",
    manager: "نورة القحطاني",
    managerInitial: "ن",
    path: "A",
    pathLabel: "براند كامل",
    priority: "متوسط",
    deadline: "15 ديسمبر 2026",
    budget: "SAR 95,000",
    phase: "استقطاب",
  },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  formula: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  sampling: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  brief: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  production: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "3d-review": { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  identity: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
  "awaiting-approval": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const pathConfig: Record<string, { bg: string; text: string; icon: string }> = {
  A: { bg: "bg-amber-50", text: "text-amber-700", icon: "ri-vip-diamond-line" },
  B: { bg: "bg-sky-50", text: "text-sky-700", icon: "ri-drop-line" },
  C: { bg: "bg-rose-50", text: "text-rose-700", icon: "ri-gift-2-line" },
  D: { bg: "bg-violet-50", text: "text-violet-700", icon: "ri-palette-line" },
  E: { bg: "bg-orange-50", text: "text-orange-700", icon: "ri-settings-3-line" },
  F: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "ri-printer-line" },
};

const priorityConfig: Record<string, string> = {
  عالي: "bg-red-50 text-red-600",
  عاجل: "bg-red-100 text-red-700",
  متوسط: "bg-amber-50 text-amber-600",
  منخفض: "bg-stone-100 text-stone-500",
  مكتمل: "bg-emerald-50 text-emerald-600",
};

const phaseLabels: Record<string, { label: string; color: string }> = {
  استقطاب: { label: "استقطاب", color: "bg-stone-100 text-stone-600" },
  تطوير: { label: "تطوير", color: "bg-violet-50 text-violet-600" },
  اعتماد: { label: "اعتماد", color: "bg-amber-50 text-amber-600" },
  إنتاج: { label: "إنتاج", color: "bg-orange-50 text-orange-600" },
  تسليم: { label: "تسليم", color: "bg-emerald-50 text-emerald-600" },
};

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPhase, setFilterPhase] = useState<string | null>(null);
  const [filterPath, setFilterPath] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"progress" | "deadline" | "name">("progress");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredProjects = allProjects
    .filter((p) => {
      if (searchQuery && !p.name.includes(searchQuery) && !p.id.includes(searchQuery)) {
        return false;
      }
      if (filterPhase && p.phase !== filterPhase) return false;
      if (filterPath && p.path !== filterPath) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "name") return a.name.localeCompare(b.name, "ar");
      return 0;
    });

  const stats = {
    total: allProjects.length,
    active: allProjects.filter((p) => p.progress < 100).length,
    completed: allProjects.filter((p) => p.progress === 100).length,
    awaitingApproval: allProjects.filter((p) => p.statusKey === "awaiting-approval").length,
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">مشاريعي</h1>
              <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {allProjects.length} مشاريع
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">إدارة وتتبع جميع مشاريعك من مكان واحد</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors">
              <i className="ri-filter-3-line text-stone-600 text-base"></i>
            </button>
            <Link
              to="/dashboard/projects/new"
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              مشروع جديد
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "ri-folder-3-line", label: "إجمالي المشاريع", value: stats.total, color: "bg-amber-50 text-amber-700" },
              { icon: "ri-loader-4-line", label: "نشطة", value: stats.active, color: "bg-sky-50 text-sky-700" },
              { icon: "ri-checkbox-circle-line", label: "مكتملة", value: stats.completed, color: "bg-emerald-50 text-emerald-700" },
              { icon: "ri-time-line", label: "بانتظار الموافقة", value: stats.awaitingApproval, color: "bg-rose-50 text-rose-700" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 lg:p-5 border border-stone-100">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
                <div className="text-stone-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-stone-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن مشروع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Phase Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 text-xs whitespace-nowrap">المرحلة:</span>
                {[
                  { key: null, label: "الكل" },
                  { key: "استقطاب", label: "استقطاب" },
                  { key: "تطوير", label: "تطوير" },
                  { key: "اعتماد", label: "اعتماد" },
                  { key: "إنتاج", label: "إنتاج" },
                  { key: "تسليم", label: "تسليم" },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilterPhase(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterPhase === f.key
                        ? "bg-amber-700 text-white"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Path Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 text-xs whitespace-nowrap">المسار:</span>
                {[
                  { key: null, label: "الكل" },
                  { key: "A", label: "A" },
                  { key: "B", label: "B" },
                  { key: "C", label: "C" },
                  { key: "D", label: "D" },
                  { key: "E", label: "E" },
                  { key: "F", label: "F" },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilterPath(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterPath === f.key
                        ? "bg-amber-700 text-white"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & View Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-xs">ترتيب حسب:</span>
                {[
                  { key: "progress" as const, label: "نسبة الإنجاز" },
                  { key: "name" as const, label: "الاسم" },
                  { key: "deadline" as const, label: "تاريخ التسليم" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === s.key
                        ? "bg-stone-800 text-white"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-stone-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <i className="ri-grid-line text-sm"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <i className="ri-list-check text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-stone-500 text-xs">
              عرض {filteredProjects.length} من {allProjects.length} مشروع
            </span>
            {(filterPhase || filterPath || searchQuery) && (
              <button
                onClick={() => { setFilterPhase(null); setFilterPath(null); setSearchQuery(""); }}
                className="text-amber-700 text-xs font-bold hover:underline cursor-pointer whitespace-nowrap"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>

          {/* Projects Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProjects.map((project) => {
                const statusStyle = statusConfig[project.statusKey] || { bg: "bg-stone-50", text: "text-stone-700", dot: "bg-stone-400" };
                const pathStyle = pathConfig[project.path] || { bg: "bg-stone-50", text: "text-stone-700", icon: "ri-folder-3-line" };
                const priorityStyle = priorityConfig[project.priority] || "bg-stone-50 text-stone-500";
                const phaseStyle = phaseLabels[project.phase] || { label: project.phase, color: "bg-stone-100 text-stone-600" };
                const isExpanded = selectedProject === project.id;

                return (
                  <div
                    key={project.id}
                    className={`bg-white rounded-2xl border transition-all group ${
                      isExpanded ? "border-amber-400" : "border-stone-100 hover:border-amber-200"
                    }`}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-black text-stone-900 text-sm truncate">{project.name}</h3>
                            <span className={`${priorityStyle} text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold`}>
                              {project.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${pathStyle.bg} ${pathStyle.text}`}>
                              <i className={`${pathStyle.icon} ml-1 text-xs`}></i>
                              مسار {project.path}
                            </span>
                            <span className="text-stone-400 text-xs">{project.id}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProject(isExpanded ? null : project.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer flex-shrink-0"
                        >
                          <i className={`text-stone-400 text-sm transition-transform ${isExpanded ? "ri-arrow-up-s-line" : "ri-more-2-line"}`}></i>
                        </button>
                      </div>

                      {/* Status & Phase */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyle.dot} ml-1.5`}></span>
                          {project.status}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${phaseStyle.color}`}>
                          {phaseStyle.label}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-stone-400 text-xs">نسبة الإنجاز</span>
                          <span className="text-stone-700 text-xs font-black">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              project.progress === 100 ? "bg-emerald-500" : "bg-amber-600"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex-shrink-0">
                            {project.managerInitial}
                          </div>
                          <span>{project.manager}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <i className="ri-time-line text-stone-300"></i>
                          <span>{project.lastUpdate}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                        <div className="text-stone-400 text-xs">
                          <i className="ri-calendar-line ml-1"></i>
                          {project.deadline}
                        </div>
                        <Link
                          to={`/workspace/${project.id}`}
                          className="text-amber-700 text-xs font-bold hover:text-amber-800 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          فتح
                          <i className="ri-arrow-left-line text-xs"></i>
                        </Link>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="border-t border-amber-200 bg-amber-50/50 rounded-b-2xl p-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-stone-400 text-xs mb-1">نوع المشروع</div>
                            <div className="text-stone-800 text-xs font-bold">{project.type}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-xs mb-1">الميزانية</div>
                            <div className="text-stone-800 text-xs font-bold">{project.budget}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-xs mb-1">تاريخ التسليم</div>
                            <div className="text-stone-800 text-xs font-bold">{project.deadline}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-xs mb-1">المسار</div>
                            <div className="text-stone-800 text-xs font-bold">{project.pathLabel}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Link
                            to={`/workspace/${project.id}`}
                            className="flex-1 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all text-center whitespace-nowrap"
                          >
                            فتح مساحة العمل
                          </Link>
                          <button className="w-10 h-10 flex items-center justify-center bg-white border border-stone-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all">
                            <i className="ri-share-forward-line text-stone-500 text-sm"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* New Project Card */}
              <Link
                to="/dashboard/projects/new"
                className="flex flex-col items-center justify-center gap-3 bg-stone-50 hover:bg-amber-50 border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-2xl p-10 transition-all cursor-pointer min-h-[280px]"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-amber-100 rounded-2xl">
                  <i className="ri-add-line text-amber-700 text-2xl"></i>
                </div>
                <span className="text-stone-500 font-semibold text-sm">مشروع جديد</span>
                <span className="text-stone-400 text-xs">ابدأ رحلة براند جديدة</span>
              </Link>
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-stone-50 border-b border-stone-100 text-stone-400 text-xs font-bold">
                <div className="col-span-3">المشروع</div>
                <div className="col-span-2">الحالة</div>
                <div className="col-span-2">المسار</div>
                <div className="col-span-2">نسبة الإنجاز</div>
                <div className="col-span-2">المدير</div>
                <div className="col-span-1"></div>
              </div>
              {filteredProjects.map((project) => {
                const statusStyle = statusConfig[project.statusKey] || { bg: "bg-stone-50", text: "text-stone-700", dot: "bg-stone-400" };
                const pathStyle = pathConfig[project.path] || { bg: "bg-stone-50", text: "text-stone-700", icon: "ri-folder-3-line" };
                return (
                  <div key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-6 py-4 border-b border-stone-50 hover:bg-stone-50/50 transition-colors items-center">
                    <div className="lg:col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600 font-black text-sm flex-shrink-0">
                        {project.managerInitial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-stone-900 text-sm truncate">{project.name}</div>
                        <div className="text-stone-400 text-xs">{project.id}</div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyle.dot} ml-1.5`}></span>
                        {project.status}
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${pathStyle.bg} ${pathStyle.text}`}>
                        مسار {project.path} · {project.pathLabel}
                      </span>
                    </div>
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${project.progress === 100 ? "bg-emerald-500" : "bg-amber-600"}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-stone-600 text-xs font-bold w-9 text-right">{project.progress}%</span>
                    </div>
                    <div className="lg:col-span-2 flex items-center gap-2 text-stone-500 text-xs">
                      <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex-shrink-0">
                        {project.managerInitial}
                      </div>
                      <span>{project.manager}</span>
                    </div>
                    <div className="lg:col-span-1 flex justify-end">
                      <Link
                        to={`/workspace/${project.id}`}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-400 hover:text-amber-700 transition-all cursor-pointer"
                      >
                        <i className="ri-arrow-left-line text-sm"></i>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-stone-100 rounded-2xl">
                <i className="ri-search-line text-stone-400 text-2xl"></i>
              </div>
              <h3 className="text-stone-700 font-black mb-1">لا توجد نتائج</h3>
              <p className="text-stone-400 text-sm">جرب تغيير معايير البحث أو إعادة ضبط الفلاتر</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;