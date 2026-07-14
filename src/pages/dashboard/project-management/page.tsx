import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const projectCategories = [
  {
    key: "brand",
    title: "بناء البراند",
    icon: "ri-compass-3-line",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    link: "/brand-creation",
  },
  {
    key: "identity",
    title: "الهوية البصرية",
    icon: "ri-palette-line",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    link: "/visual-identity",
  },
  {
    key: "packaging",
    title: "التغليف",
    icon: "ri-gift-2-line",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    link: "/packaging-customizer",
  },
  {
    key: "manufacturing",
    title: "التصنيع",
    icon: "ri-settings-3-line",
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    link: "/manufacturing",
  },
];

const allProjects = [
  {
    id: "BRD-001",
    name: "براند الفجر",
    category: "brand" as const,
    status: "تطوير التركيبة",
    statusStep: 3,
    totalSteps: 5,
    progress: 55,
    deadline: "15 أغسطس 2026",
    manager: "أحمد الزهراني",
    managerInitial: "أ",
    priority: "عالي",
    phase: "تطوير",
    lastUpdate: "منذ ساعتين",
    budget: "SAR 85,000",
  },
  {
    id: "BRD-002",
    name: "مجموعة شرقية",
    category: "brand" as const,
    status: "في الإنتاج",
    statusStep: 5,
    totalSteps: 5,
    progress: 85,
    deadline: "10 يوليو 2026",
    manager: "نورة القحطاني",
    managerInitial: "ن",
    priority: "عالي",
    phase: "إنتاج",
    lastUpdate: "منذ 5 ساعات",
    budget: "SAR 120,000",
  },
  {
    id: "BRD-003",
    name: "مسك الأصالة",
    category: "brand" as const,
    status: "جمع البريف العام",
    statusStep: 1,
    totalSteps: 5,
    progress: 10,
    deadline: "15 ديسمبر 2026",
    manager: "نورة القحطاني",
    managerInitial: "ن",
    priority: "متوسط",
    phase: "استقطاب",
    lastUpdate: "منذ 6 أيام",
    budget: "SAR 95,000",
  },
  {
    id: "VIS-001",
    name: "هوية نيش",
    category: "identity" as const,
    status: "تصميم الشعار",
    statusStep: 3,
    totalSteps: 6,
    progress: 20,
    deadline: "20 أكتوبر 2026",
    manager: "فهد العتيبي",
    managerInitial: "ف",
    priority: "عالي",
    phase: "تطوير",
    lastUpdate: "منذ 3 أيام",
    budget: "SAR 35,000",
  },
  {
    id: "VIS-002",
    name: "هوية الكيان",
    category: "identity" as const,
    status: "دليل الهوية",
    statusStep: 4,
    totalSteps: 6,
    progress: 65,
    deadline: "5 سبتمبر 2026",
    manager: "فهد العتيبي",
    managerInitial: "ف",
    priority: "متوسط",
    phase: "اعتماد",
    lastUpdate: "منذ يوم",
    budget: "SAR 28,000",
  },
  {
    id: "VIS-003",
    name: "ريشة الشرق",
    category: "identity" as const,
    status: "تم التسليم",
    statusStep: 6,
    totalSteps: 6,
    progress: 100,
    deadline: "1 مايو 2026",
    manager: "سارة المطيري",
    managerInitial: "س",
    priority: "مكتمل",
    phase: "تسليم",
    lastUpdate: "منذ شهر",
    budget: "SAR 22,000",
  },
  {
    id: "PKG-001",
    name: "عبوة زجاجية فاخرة",
    category: "packaging" as const,
    status: "مراجعة ثلاثية الأبعاد",
    statusStep: 3,
    totalSteps: 5,
    progress: 60,
    deadline: "25 أغسطس 2026",
    manager: "تركي الشهري",
    managerInitial: "ت",
    priority: "متوسط",
    phase: "اعتماد",
    lastUpdate: "أمس",
    budget: "SAR 28,000",
  },
  {
    id: "PKG-002",
    name: "علبة المخمل الملكي",
    category: "packaging" as const,
    status: "اختيار المواد",
    statusStep: 2,
    totalSteps: 5,
    progress: 35,
    deadline: "30 سبتمبر 2026",
    manager: "تركي الشهري",
    managerInitial: "ت",
    priority: "منخفض",
    phase: "تطوير",
    lastUpdate: "منذ 4 أيام",
    budget: "SAR 18,000",
  },
  {
    id: "MFG-001",
    name: "عبير الصباح",
    category: "manufacturing" as const,
    status: "بانتظار الموافقة",
    statusStep: 4,
    totalSteps: 4,
    progress: 90,
    deadline: "30 يوليو 2026",
    manager: "أحمد الزهراني",
    managerInitial: "أ",
    priority: "عاجل",
    phase: "اعتماد",
    lastUpdate: "منذ 4 ساعات",
    budget: "SAR 65,000",
  },
  {
    id: "MFG-002",
    name: "دفعة العود الثالثة",
    category: "manufacturing" as const,
    status: "مراجعة الملفات",
    statusStep: 1,
    totalSteps: 4,
    progress: 15,
    deadline: "12 نوفمبر 2026",
    manager: "سارة المطيري",
    managerInitial: "س",
    priority: "متوسط",
    phase: "استقطاب",
    lastUpdate: "منذ أسبوع",
    budget: "SAR 42,000",
  },
  {
    id: "MFG-003",
    name: "إنتاج محدود – زيت العود",
    category: "manufacturing" as const,
    status: "تم الشحن",
    statusStep: 4,
    totalSteps: 4,
    progress: 100,
    deadline: "15 مارس 2026",
    manager: "أحمد الزهراني",
    managerInitial: "أ",
    priority: "مكتمل",
    phase: "تسليم",
    lastUpdate: "منذ شهرين",
    budget: "SAR 55,000",
  },
  {
    id: "BRD-004",
    name: "عنبر الخليج",
    category: "brand" as const,
    status: "استراتيجية البراند",
    statusStep: 1,
    totalSteps: 5,
    progress: 8,
    deadline: "1 فبراير 2027",
    manager: "نورة القحطاني",
    managerInitial: "ن",
    priority: "منخفض",
    phase: "استقطاب",
    lastUpdate: "منذ أسبوعين",
    budget: "SAR 110,000",
  },
];

const priorityConfig: Record<string, string> = {
  عالي: "bg-rose-50 text-rose-600",
  عاجل: "bg-red-100 text-red-700",
  متوسط: "bg-amber-50 text-amber-600",
  منخفض: "bg-stone-100 text-stone-500",
  مكتمل: "bg-emerald-50 text-emerald-600",
};

const ProjectManagementPage = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "timeline">("kanban");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const stats = useMemo(() => {
    const projects = allProjects;
    const active = projects.filter((p) => p.progress > 0 && p.progress < 100).length;
    const completed = projects.filter((p) => p.progress === 100).length;
    const totalBudget = projects.reduce((sum, p) => {
      const num = parseInt(p.budget.replace(/[^0-9]/g, ""));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return {
      total: projects.length,
      active,
      completed,
      awaiting: projects.filter((p) => p.status.includes("بانتظار")).length,
      totalBudget,
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!filterPriority) return allProjects;
    return allProjects.filter((p) => p.priority === filterPriority);
  }, [filterPriority]);

  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, typeof allProjects> = {};
    projectCategories.forEach((cat) => {
      grouped[cat.key] = filteredProjects.filter((p) => p.category === cat.key);
    });
    return grouped;
  }, [filteredProjects]);

  const categoryStats = useMemo(() => {
    return projectCategories.map((cat) => {
      const catProjects = projectsByCategory[cat.key];
      const active = catProjects.filter((p) => p.progress > 0 && p.progress < 100).length;
      const completed = catProjects.filter((p) => p.progress === 100).length;
      const totalBudget = catProjects.reduce((sum, p) => {
        const num = parseInt(p.budget.replace(/[^0-9]/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
      return { ...cat, count: catProjects.length, active, completed, totalBudget };
    });
  }, [projectsByCategory]);

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">إدارة المشاريع</h1>
              <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {stats.total} مشروع
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">نظرة شاملة على جميع مشاريعك حسب النوع والمرحلة</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-50 rounded-xl p-1">
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
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === "timeline" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <i className="ri-timeline-view text-sm"></i>
                جدول زمني
              </button>
            </div>
            <Link
              to="/dashboard/projects"
              className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-100 transition-all"
            >
              <i className="ri-list-check text-sm"></i>
              عرض القائمة
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {[
              { icon: "ri-folder-3-line", label: "إجمالي المشاريع", value: stats.total, color: "bg-amber-50 text-amber-700" },
              { icon: "ri-loader-4-line", label: "نشطة", value: stats.active, color: "bg-sky-50 text-sky-700" },
              { icon: "ri-checkbox-circle-line", label: "مكتملة", value: stats.completed, color: "bg-emerald-50 text-emerald-700" },
              { icon: "ri-time-line", label: "بانتظار الموافقة", value: stats.awaiting, color: "bg-rose-50 text-rose-700" },
              { icon: "ri-money-dollar-circle-line", label: "إجمالي الميزانية", value: `${(stats.totalBudget / 1000).toFixed(0)}K ر.س`, color: "bg-violet-50 text-violet-700" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 border border-stone-100 hover:border-stone-200 transition-all">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-2 ${stat.color}`}>
                  <i className={`${stat.icon} text-base`}></i>
                </div>
                <div className="text-2xl font-black text-stone-900 mb-0.5">{stat.value}</div>
                <div className="text-stone-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Category Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {categoryStats.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer text-right ${
                  expandedCategory === cat.key ? `${cat.borderColor}` : "border-stone-100 hover:border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${cat.lightColor} ${cat.textColor}`}>
                    <i className={`${cat.icon} text-lg`}></i>
                  </div>
                  <span className="text-stone-300 text-xs">{cat.count} مشاريع</span>
                </div>
                <h3 className="font-black text-stone-800 text-sm mb-2">{cat.title}</h3>
                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                    {cat.active} نشط
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    {cat.completed} مكتمل
                  </span>
                  <span className="mr-auto">{cat.totalBudget > 0 ? `${(cat.totalBudget / 1000).toFixed(0)}K` : ""}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-50 flex items-center justify-between">
                  <span className="text-stone-400 text-xs">عرض التفاصيل</span>
                  {expandedCategory === cat.key ? (
                    <i className="ri-arrow-up-s-line text-stone-400 text-sm transition-transform"></i>
                  ) : (
                    <i className="ri-arrow-down-s-line text-stone-400 text-sm transition-transform"></i>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-stone-400 text-xs">الأولوية:</span>
            {[
              { key: null, label: "الكل" },
              { key: "عاجل", label: "عاجل" },
              { key: "عالي", label: "عالي" },
              { key: "متوسط", label: "متوسط" },
              { key: "منخفض", label: "منخفض" },
              { key: "مكتمل", label: "مكتمل" },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setFilterPriority(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterPriority === f.key
                    ? "bg-amber-700 text-white"
                    : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                }`}
              >
                {f.label}
              </button>
            ))}
            {filterPriority && (
              <button
                onClick={() => setFilterPriority(null)}
                className="text-amber-700 text-xs font-bold hover:underline cursor-pointer whitespace-nowrap"
              >
                إعادة ضبط
              </button>
            )}
          </div>

          {viewMode === "kanban" ? (
            /* KANBAN VIEW - By Category */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {projectCategories.map((cat) => {
                const catProjects = projectsByCategory[cat.key];
                const isExpanded = expandedCategory === cat.key;

                return (
                  <div key={cat.key} className="flex flex-col min-h-[400px]">
                    {/* Column Header */}
                    <div className={`flex items-center justify-between mb-3 px-1`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                        <h3 className="font-black text-stone-800 text-sm">{cat.title}</h3>
                        <span className="bg-stone-100 text-stone-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">{catProjects.length}</span>
                      </div>
                      <Link
                        to={cat.link}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
                        title="بدء مشروع جديد"
                      >
                        <i className="ri-add-line text-sm"></i>
                      </Link>
                    </div>

                    {/* Project Cards */}
                    <div className={`flex-1 space-y-3 ${!isExpanded && catProjects.length > 2 ? "max-h-[600px] overflow-hidden relative" : ""}`}>
                      {catProjects.map((project) => {
                        const priorityStyle = priorityConfig[project.priority] || "bg-stone-50 text-stone-500";
                        const isSelected = selectedProject === project.id;

                        return (
                          <div
                            key={project.id}
                            onClick={() => setSelectedProject(isSelected ? null : project.id)}
                            className={`bg-white rounded-2xl border transition-all cursor-pointer group ${
                              isSelected ? "border-amber-400 ring-4 ring-amber-50" : `${cat.borderColor}/50 hover:border-amber-300`
                            }`}
                          >
                            <div className="p-4">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-black text-stone-900 text-xs truncate">{project.name}</h4>
                                    <span className={`${priorityStyle} text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold`}>
                                      {project.priority}
                                    </span>
                                  </div>
                                  <span className="text-stone-400 text-xs">{project.id}</span>
                                </div>
                              </div>

                              {/* Stage Progress */}
                              <div className="mb-3">
                                <div className="flex items-center gap-1 mb-2">
                                  {Array.from({ length: project.totalSteps }).map((_, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex-1 h-1.5 rounded-full transition-all ${
                                        idx < project.statusStep
                                          ? project.progress === 100
                                            ? "bg-emerald-400"
                                            : cat.color
                                          : "bg-stone-100"
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold ${cat.textColor}`}>{project.status}</span>
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
                                      project.progress === 100 ? "bg-emerald-500" : cat.color
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
                                <span>{project.lastUpdate}</span>
                              </div>

                              {/* Expanded Details */}
                              {isSelected && (
                                <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-stone-400">التسليم</span>
                                    <span className="text-stone-700 font-bold">{project.deadline}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-stone-400">الميزانية</span>
                                    <span className="text-stone-700 font-bold">{project.budget}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-stone-400">المرحلة</span>
                                    <span className="text-stone-700 font-bold">{project.phase}</span>
                                  </div>
                                  <Link
                                    to={`/workspace/${project.id}`}
                                    className="block w-full bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-xl text-center cursor-pointer transition-all whitespace-nowrap mt-2"
                                  >
                                    فتح مساحة العمل
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {catProjects.length === 0 && (
                        <div className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center">
                          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl bg-stone-100">
                            <i className={`${cat.icon} text-stone-400 text-lg`}></i>
                          </div>
                          <p className="text-stone-400 text-xs mb-3">لا توجد مشاريع</p>
                          <Link
                            to={cat.link}
                            className="inline-flex items-center gap-1.5 bg-white border border-stone-200 hover:border-amber-300 text-stone-600 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap"
                          >
                            <i className="ri-add-line"></i>
                            بدء مشروع
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Show More */}
                    {!isExpanded && catProjects.length > 2 && (
                      <button
                        onClick={() => setExpandedCategory(cat.key)}
                        className={`mt-2 py-2 text-xs font-bold ${cat.textColor} hover:opacity-80 cursor-pointer transition-all text-center flex items-center justify-center gap-1`}
                      >
                        عرض {catProjects.length - 2} مشاريع إضافية
                        <i className="ri-arrow-down-s-line text-sm"></i>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* TIMELINE VIEW */
            <div className="space-y-6">
              {projectCategories.map((cat) => {
                const catProjects = projectsByCategory[cat.key];
                if (catProjects.length === 0) return null;

                return (
                  <div key={cat.key} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                    <div className={`px-6 py-4 border-b border-stone-100 flex items-center gap-3 ${cat.lightColor}`}>
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${cat.color}`}>
                        <i className={`${cat.icon} text-white text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="font-black text-stone-900 text-sm">{cat.title}</h3>
                        <span className="text-stone-400 text-xs">{catProjects.length} مشاريع</span>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6">
                      {/* Timeline Header */}
                      <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-stone-400 text-xs font-bold mb-2">
                        <div className="col-span-4">المشروع</div>
                        <div className="col-span-2">الحالة</div>
                        <div className="col-span-2">نسبة الإنجاز</div>
                        <div className="col-span-2">موعد التسليم</div>
                        <div className="col-span-2">الميزانية</div>
                      </div>

                      <div className="space-y-3">
                        {catProjects.map((project) => {
                          const priorityStyle = priorityConfig[project.priority] || "bg-stone-50 text-stone-500";

                          return (
                            <Link
                              key={project.id}
                              to={`/workspace/${project.id}`}
                              className="block bg-stone-50 hover:bg-stone-100 rounded-xl p-4 transition-all cursor-pointer group"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                                <div className="lg:col-span-4 flex items-center gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-stone-600 font-black text-sm flex-shrink-0 border border-stone-200">
                                    {project.managerInitial}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-black text-stone-900 text-sm truncate">{project.name}</h4>
                                      <span className={`${priorityStyle} text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold`}>
                                        {project.priority}
                                      </span>
                                    </div>
                                    <div className="text-stone-400 text-xs">{project.id} · {project.manager}</div>
                                  </div>
                                </div>

                                <div className="lg:col-span-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${cat.color} flex-shrink-0`}></div>
                                    <span className={`text-xs font-bold ${cat.textColor}`}>{project.status}</span>
                                  </div>
                                  <span className="text-stone-400 text-xs">مرحلة {project.statusStep}/{project.totalSteps}</span>
                                </div>

                                <div className="lg:col-span-2 flex items-center gap-3">
                                  <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-2 rounded-full transition-all ${project.progress === 100 ? "bg-emerald-500" : cat.color}`}
                                      style={{ width: `${project.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-stone-600 text-xs font-black w-10 text-right">{project.progress}%</span>
                                </div>

                                <div className="lg:col-span-2 text-stone-600 text-xs font-medium flex items-center gap-1.5">
                                  <i className="ri-calendar-line text-stone-300"></i>
                                  {project.deadline}
                                </div>

                                <div className="lg:col-span-2 flex items-center justify-between">
                                  <span className="text-stone-600 text-xs font-bold">{project.budget}</span>
                                  <i className="ri-arrow-left-line text-stone-300 group-hover:text-amber-600 transition-colors"></i>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectManagementPage;