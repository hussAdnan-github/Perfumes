import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const approvals = [
  {
    id: "APR-2026-001",
    project: "براند الفجر",
    projectId: "PRJ-2026-001",
    type: "تركيبة",
    typeKey: "formula",
    title: "اعتماد تركيبة Formula V2 النهائية",
    requestedBy: "أحمد الزهراني",
    requestedByInitial: "أ",
    requestedDate: "20 يونيو 2026",
    priority: "عالي",
    status: "pending",
    stage: 2,
    totalStages: 3,
    stages: [
      { label: "تقديم الطلب", done: true, date: "20 يونيو" },
      { label: "مراجعة فنية", done: false, date: "قيد الانتظار" },
      { label: "اعتماد نهائي", done: false, date: "--" },
    ],
    reviewers: [
      { name: "د. خالد العمري", role: "رئيس التطوير", status: "approved", initial: "خ" },
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "pending", initial: "م" },
      { name: "فريق الجودة", role: "مراقبة الجودة", status: "pending", initial: "ج" },
    ],
    description: "نتائج تجارب التركيبة النهائية V2 مع تحسينات النوتات العليا. الثبات 8 ساعات، الانتشار ممتاز، وجميع المواد الخام مطابقة للمواصفات القياسية.",
    attachments: ["نتائج_التجارب_V2.pdf", "تقرير_الجودة.xlsx", "شهادة_المواد_الخام.pdf"],
  },
  {
    id: "APR-2026-002",
    project: "هوية نيش",
    projectId: "PRJ-2026-003",
    type: "تصميم",
    typeKey: "design",
    title: "اعتماد الشعار النهائي والهوية البصرية",
    requestedBy: "فهد العتيبي",
    requestedByInitial: "ف",
    requestedDate: "18 يونيو 2026",
    priority: "عالي",
    status: "pending",
    stage: 1,
    totalStages: 3,
    stages: [
      { label: "تقديم التصميم", done: true, date: "18 يونيو" },
      { label: "مراجعة العميل", done: false, date: "قيد الانتظار" },
      { label: "اعتماد نهائي", done: false, date: "--" },
    ],
    reviewers: [
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "pending", initial: "م" },
      { name: "د. فاطمة الناصر", role: "مستشارة البراند", status: "pending", initial: "ف" },
    ],
    description: "الشعار النهائي المعتمد على المفهومين 1 و3 مع التعديلات المطلوبة. يشمل الشعار الرئيسي والفرعي ودليل الهوية البصرية الشامل.",
    attachments: ["شعار_هوية_نيش_الرئيسي.png", "شعار_هوية_نيش_الفرعي.png", "دليل_الهوية_البصرية.pdf"],
  },
  {
    id: "APR-2026-003",
    project: "مجموعة شرقية",
    projectId: "PRJ-2026-004",
    type: "إنتاج",
    typeKey: "production",
    title: "اعتماد بدء الإنتاج التجريبي للدفعة الأولى",
    requestedBy: "نورة القحطاني",
    requestedByInitial: "ن",
    requestedDate: "15 يونيو 2026",
    priority: "عاجل",
    status: "approved",
    stage: 3,
    totalStages: 3,
    stages: [
      { label: "مراجعة المواصفات", done: true, date: "15 يونيو" },
      { label: "فحص المواد", done: true, date: "18 يونيو" },
      { label: "اعتماد الإنتاج", done: true, date: "22 يونيو" },
    ],
    reviewers: [
      { name: "د. خالد العمري", role: "رئيس التطوير", status: "approved", initial: "خ" },
      { name: "م. سلمان الحربي", role: "مدير الإنتاج", status: "approved", initial: "س" },
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "approved", initial: "م" },
    ],
    description: "طلب بدء الإنتاج التجريبي للدفعة الأولى من مجموعة شرقية (1000 وحدة). تم فحص جميع المواد الخام واعتماد المواصفات النهائية.",
    attachments: ["أمر_الإنتاج_التجريبي.pdf", "قائمة_المواد_الخام.xlsx"],
  },
  {
    id: "APR-2026-004",
    project: "عطر الليل",
    projectId: "PRJ-2026-002",
    type: "عينة",
    typeKey: "sample",
    title: "اعتماد عينات الزجاجة والتغليف النهائية",
    requestedBy: "سارة المطيري",
    requestedByInitial: "س",
    requestedDate: "12 يونيو 2026",
    priority: "متوسط",
    status: "approved",
    stage: 3,
    totalStages: 3,
    stages: [
      { label: "استلام العينات", done: true, date: "12 يونيو" },
      { label: "فحص الجودة", done: true, date: "15 يونيو" },
      { label: "موافقة العميل", done: true, date: "19 يونيو" },
    ],
    reviewers: [
      { name: "تركي الشهري", role: "مصمم العبوات", status: "approved", initial: "ت" },
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "approved", initial: "م" },
      { name: "العميل", role: "العميل النهائي", status: "approved", initial: "ع" },
    ],
    description: "عينات العبوة الزجاجية والتغليف النهائية المطابقة لمواصفات التصميم. تم إرسال العينات للعميل وتم استلام الموافقة النهائية.",
    attachments: ["صور_العينات.zip", "نموذج_الموافقة_موقع.pdf"],
  },
  {
    id: "APR-2026-005",
    project: "براند الفجر",
    projectId: "PRJ-2026-001",
    type: "تصميم",
    typeKey: "design",
    title: "اعتماد تصاميم العبوة والتغليف الأولية",
    requestedBy: "فهد العتيبي",
    requestedByInitial: "ف",
    requestedDate: "8 يونيو 2026",
    priority: "عالي",
    status: "rejected",
    stage: 2,
    totalStages: 3,
    stages: [
      { label: "تقديم التصميم", done: true, date: "8 يونيو" },
      { label: "مراجعة العميل", done: true, date: "10 يونيو" },
      { label: "اعتماد نهائي", done: false, date: "مرفوض" },
    ],
    reviewers: [
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "rejected", initial: "م" },
      { name: "د. فاطمة الناصر", role: "مستشارة البراند", status: "approved", initial: "ف" },
    ],
    description: "تصاميم العبوة الأولية. تم رفض التصميم لعدم توافقه مع الهوية البصرية للبراند. مطلوب إعادة تصميم بدمج عناصر شرقية أكثر وضوحاً.",
    attachments: ["تصاميم_العبوة_V1.pdf", "ملاحظات_المراجعة.pdf"],
    rejectReason: "التصميم لا يعكس الهوية البصرية للبراند — مطلوب عناصر شرقية أكثر وضوحاً وألوان أكثر دفئاً",
  },
  {
    id: "APR-2026-006",
    project: "مسك الأصالة",
    projectId: "PRJ-2026-009",
    type: "تركيبة",
    typeKey: "formula",
    title: "اعتماد مفهوم التركيبة الأولي",
    requestedBy: "أحمد الزهراني",
    requestedByInitial: "أ",
    requestedDate: "5 يونيو 2026",
    priority: "متوسط",
    status: "approved",
    stage: 3,
    totalStages: 3,
    stages: [
      { label: "تقديم المفهوم", done: true, date: "5 يونيو" },
      { label: "مراجعة فنية", done: true, date: "8 يونيو" },
      { label: "اعتماد المفهوم", done: true, date: "12 يونيو" },
    ],
    reviewers: [
      { name: "د. خالد العمري", role: "رئيس التطوير", status: "approved", initial: "خ" },
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "approved", initial: "م" },
    ],
    description: "مفهوم التركيبة الأولي لمسك الأصالة — مسك شرقي مع لمسات عصرية. تم اعتماد 3 نوتات رئيسية للبدء في مرحلة التطوير.",
    attachments: ["مفهوم_التركيبة.pdf", "قائمة_النوتات.pdf"],
  },
  {
    id: "APR-2026-007",
    project: "عبوة زجاجية فاخرة",
    projectId: "PRJ-2026-005",
    type: "عينة",
    typeKey: "sample",
    title: "اعتماد نموذج الطباعة ثلاثية الأبعاد",
    requestedBy: "تركي الشهري",
    requestedByInitial: "ت",
    requestedDate: "1 يونيو 2026",
    priority: "متوسط",
    status: "approved",
    stage: 3,
    totalStages: 3,
    stages: [
      { label: "تقديم النموذج", done: true, date: "1 يونيو" },
      { label: "مراجعة 3D", done: true, date: "3 يونيو" },
      { label: "اعتماد للإنتاج", done: true, date: "6 يونيو" },
    ],
    reviewers: [
      { name: "تركي الشهري", role: "مصمم العبوات", status: "approved", initial: "ت" },
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "approved", initial: "م" },
    ],
    description: "نموذج الطباعة ثلاثية الأبعاد للعبوة الزجاجية. تم فحص النموذج في الاستوديو واعتماد الشكل النهائي.",
    attachments: ["نموذج_3D.stl", "صور_النموذج.zip"],
  },
  {
    id: "APR-2026-008",
    project: "ماء الذهب",
    projectId: "PRJ-2026-006",
    type: "تصميم",
    typeKey: "design",
    title: "اعتماد المزاج البصري ولوحة الألوان",
    requestedBy: "فهد العتيبي",
    requestedByInitial: "ف",
    requestedDate: "28 مايو 2026",
    priority: "منخفض",
    status: "rejected",
    stage: 1,
    totalStages: 3,
    stages: [
      { label: "تقديم المزاج", done: true, date: "28 مايو" },
      { label: "مراجعة العميل", done: false, date: "مرفوض" },
      { label: "اعتماد نهائي", done: false, date: "--" },
    ],
    reviewers: [
      { name: "محمد الأحمد", role: "صاحب المشروع", status: "rejected", initial: "م" },
      { name: "د. فاطمة الناصر", role: "مستشارة البراند", status: "pending", initial: "ف" },
    ],
    description: "مقترح المزاج البصري ولوحة الألوان لعطر ماء الذهب. تم رفض اللوحة الحالية وطلب تعديلها لتعكس فخامة ودفء أكثر.",
    attachments: ["لوحة_الألوان_V1.pdf", "مرجعيات_بصرية.pdf"],
    rejectReason: "لوحة الألوان باردة جداً ولا تعكس مفهوم 'الذهب' — مطلوب ألوان أكثر دفئاً مع درجات ذهبية وعنبرية",
  },
];

const typeConfig: Record<string, { bg: string; text: string; icon: string }> = {
  formula: { bg: "bg-rose-50", text: "text-rose-700", icon: "ri-flask-line" },
  design: { bg: "bg-violet-50", text: "text-violet-700", icon: "ri-palette-line" },
  sample: { bg: "bg-sky-50", text: "text-sky-700", icon: "ri-box-3-line" },
  production: { bg: "bg-orange-50", text: "text-orange-700", icon: "ri-settings-3-line" },
};

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "قيد الانتظار" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "معتمد" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "مرفوض" },
};

const priorityConfig: Record<string, string> = {
  عاجل: "bg-red-50 text-red-600",
  عالي: "bg-amber-50 text-amber-600",
  متوسط: "bg-stone-100 text-stone-500",
  منخفض: "bg-stone-50 text-stone-400",
};

const reviewerStatusConfig: Record<string, { bg: string; text: string; icon: string }> = {
  approved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "ri-check-line" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: "ri-time-line" },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: "ri-close-line" },
};

const ApprovalsPage = () => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const filteredApprovals = approvals.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterType && a.typeKey !== filterType) return false;
    if (searchQuery && !a.title.includes(searchQuery) && !a.project.includes(searchQuery)) return false;
    return true;
  });

  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => a.status === "pending").length,
    approved: approvals.filter((a) => a.status === "approved").length,
    rejected: approvals.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">الاعتمادات والموافقات</h1>
              {stats.pending > 0 && (
                <span className="bg-amber-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {stats.pending} معلقة
                </span>
              )}
            </div>
            <p className="text-stone-400 text-xs mt-0.5">إدارة سير الموافقات والاعتمادات لجميع المشاريع</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/workflow"
              className="text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-git-branch-line text-base"></i>
              عرض Workflow المنصة
            </Link>
            <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2">
              <i className="ri-add-line"></i>
              طلب اعتماد جديد
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "ri-file-list-3-line", label: "إجمالي الطلبات", value: stats.total, color: "bg-amber-50 text-amber-700" },
              { icon: "ri-time-line", label: "قيد الانتظار", value: stats.pending, color: "bg-amber-50 text-amber-700" },
              { icon: "ri-checkbox-circle-line", label: "معتمدة", value: stats.approved, color: "bg-emerald-50 text-emerald-700" },
              { icon: "ri-close-circle-line", label: "مرفوضة", value: stats.rejected, color: "bg-red-50 text-red-700" },
            ].map((stat) => (
              <button
                key={stat.label}
                onClick={() => {
                  if (stat.label === "قيد الانتظار") setFilterStatus("pending");
                  else if (stat.label === "معتمدة") setFilterStatus("approved");
                  else if (stat.label === "مرفوضة") setFilterStatus("rejected");
                  else setFilterStatus(null);
                }}
                className="bg-white rounded-2xl p-4 lg:p-5 border border-stone-100 hover:border-amber-200 transition-all cursor-pointer text-right"
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
                <div className="text-stone-400 text-xs">{stat.label}</div>
              </button>
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
                  placeholder="ابحث عن طلب اعتماد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 text-xs whitespace-nowrap">الحالة:</span>
                {[
                  { key: null, label: "الكل" },
                  { key: "pending", label: "قيد الانتظار" },
                  { key: "approved", label: "معتمد" },
                  { key: "rejected", label: "مرفوض" },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilterStatus(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterStatus === f.key
                        ? "bg-amber-700 text-white"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 text-xs whitespace-nowrap">النوع:</span>
                {[
                  { key: null, label: "الكل" },
                  { key: "formula", label: "تركيبة" },
                  { key: "design", label: "تصميم" },
                  { key: "sample", label: "عينة" },
                  { key: "production", label: "إنتاج" },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilterType(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterType === f.key
                        ? "bg-amber-700 text-white"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-stone-500 text-xs">
              عرض {filteredApprovals.length} من {approvals.length} طلب اعتماد
            </span>
            {(filterStatus || filterType || searchQuery) && (
              <button
                onClick={() => { setFilterStatus(null); setFilterType(null); setSearchQuery(""); }}
                className="text-amber-700 text-xs font-bold hover:underline cursor-pointer whitespace-nowrap"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>

          {/* Approvals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredApprovals.map((approval) => {
              const typeStyle = typeConfig[approval.typeKey] || { bg: "bg-stone-50", text: "text-stone-700", icon: "ri-file-3-line" };
              const statusStyle = statusConfig[approval.status] || { bg: "bg-stone-50", text: "text-stone-700", dot: "bg-stone-400", label: approval.status };
              const priorityStyle = priorityConfig[approval.priority] || "bg-stone-50 text-stone-500";
              const isExpanded = selectedApproval === approval.id;

              return (
                <div
                  key={approval.id}
                  className={`bg-white rounded-2xl border transition-all ${
                    isExpanded ? "border-amber-400" : "border-stone-100 hover:border-amber-200"
                  }`}
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyle.dot} ml-1.5`}></span>
                            {statusStyle.label}
                          </span>
                          <span className={`${priorityStyle} text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold`}>
                            {approval.priority}
                          </span>
                        </div>
                        <h3 className="font-black text-stone-900 text-sm mb-1.5">{approval.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-500 text-xs font-medium">{approval.project}</span>
                          <span className="text-stone-300 text-xs">•</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${typeStyle.bg} ${typeStyle.text}`}>
                            <i className={`${typeStyle.icon} ml-1 text-xs`}></i>
                            {approval.type}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedApproval(isExpanded ? null : approval.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer flex-shrink-0"
                      >
                        <i className={`text-stone-400 text-sm transition-transform ${isExpanded ? "ri-arrow-up-s-line" : "ri-more-2-line"}`}></i>
                      </button>
                    </div>

                    {/* Workflow Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-stone-400 text-xs">سير الاعتماد</span>
                        <span className="text-stone-500 text-xs font-bold">{approval.stage} من {approval.totalStages}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {approval.stages.map((stage, i) => (
                          <div key={i} className="flex items-center flex-1">
                            <div className="flex flex-col items-center w-full">
                              <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold mb-1.5 ${
                                  stage.done
                                    ? "bg-emerald-500 text-white"
                                    : approval.status === "rejected" && i === approval.stages.length - 1
                                      ? "bg-red-500 text-white"
                                      : i === approval.stage - 1
                                        ? "bg-amber-500 text-white"
                                        : "bg-stone-200 text-stone-400"
                                }`}
                              >
                                {stage.done ? <i className="ri-check-line text-sm"></i> : i + 1}
                              </div>
                              <span className="text-[10px] text-stone-500 text-center whitespace-nowrap">{stage.label}</span>
                              <span className="text-[10px] text-stone-400">{stage.date}</span>
                            </div>
                            {i < approval.stages.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 mx-1 mt-[-16px] ${
                                  approval.stages[i].done && approval.stages[i + 1].done
                                    ? "bg-emerald-400"
                                    : approval.stages[i].done
                                      ? "bg-amber-300"
                                      : "bg-stone-200"
                                }`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Info */}
                    <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 font-bold flex-shrink-0">
                          {approval.requestedByInitial}
                        </div>
                        <span>{approval.requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="ri-calendar-line text-stone-300"></i>
                        <span>{approval.requestedDate}</span>
                      </div>
                    </div>

                    {/* Quick Actions for Pending */}
                    {approval.status === "pending" && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-stone-50">
                        <button
                          onClick={() => setShowActionModal({ id: approval.id, action: "approve" })}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                          <i className="ri-check-line text-sm"></i>
                          اعتماد
                        </button>
                        <button
                          onClick={() => setShowActionModal({ id: approval.id, action: "reject" })}
                          className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                          <i className="ri-close-line text-sm"></i>
                          رفض
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-400 transition-all cursor-pointer flex-shrink-0">
                          <i className="ri-chat-3-line text-sm"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-amber-200 bg-amber-50/30 rounded-b-2xl p-5 space-y-4">
                      {/* Description */}
                      <div>
                        <div className="text-stone-400 text-xs mb-1.5">وصف الطلب</div>
                        <p className="text-stone-700 text-xs leading-relaxed">{approval.description}</p>
                      </div>

                      {/* Attachments */}
                      <div>
                        <div className="text-stone-400 text-xs mb-2">المرفقات</div>
                        <div className="flex flex-wrap gap-2">
                          {approval.attachments.map((file, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600 cursor-pointer hover:border-amber-300 transition-colors"
                            >
                              <i className="ri-file-text-line text-amber-600 text-sm"></i>
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {approval.status === "rejected" && approval.rejectReason && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className="ri-error-warning-line text-red-500 text-sm"></i>
                            </div>
                            <span className="text-red-700 text-xs font-bold">سبب الرفض</span>
                          </div>
                          <p className="text-red-600 text-xs">{approval.rejectReason}</p>
                        </div>
                      )}

                      {/* Reviewers Chain */}
                      <div>
                        <div className="text-stone-400 text-xs mb-2">سلسلة المعتمدين</div>
                        <div className="space-y-2">
                          {approval.reviewers.map((reviewer, i) => {
                            const revStatus = reviewerStatusConfig[reviewer.status];
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-xl font-bold text-xs flex-shrink-0 ${
                                  reviewer.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                  reviewer.status === "rejected" ? "bg-red-100 text-red-700" :
                                  "bg-amber-100 text-amber-700"
                                }`}>
                                  {reviewer.initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-stone-800 text-xs font-bold">{reviewer.name}</div>
                                  <div className="text-stone-400 text-xs">{reviewer.role}</div>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${revStatus.bg} ${revStatus.text}`}>
                                  <i className={`${revStatus.icon} ml-1 text-xs`}></i>
                                  {reviewer.status === "approved" ? "معتمد" : reviewer.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                                </span>
                                {i < approval.reviewers.length - 1 && (
                                  <div className="w-0.5 h-6 bg-stone-200 mx-1 flex-shrink-0 hidden sm:block"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Expanded Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link
                          to={`/workspace/${approval.projectId}`}
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
          </div>

          {/* Empty State */}
          {filteredApprovals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-stone-100 rounded-2xl">
                <i className="ri-file-search-line text-stone-400 text-2xl"></i>
              </div>
              <h3 className="text-stone-700 font-black mb-1">لا توجد طلبات اعتماد</h3>
              <p className="text-stone-400 text-sm">لا توجد طلبات تطابق معايير البحث الحالية</p>
            </div>
          )}
        </div>
      </main>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                showActionModal.action === "approve" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              }`}>
                <i className={`text-xl ${showActionModal.action === "approve" ? "ri-check-line" : "ri-close-line"}`}></i>
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-sm">
                  {showActionModal.action === "approve" ? "تأكيد الاعتماد" : "تأكيد الرفض"}
                </h3>
                <p className="text-stone-400 text-xs">
                  {showActionModal.action === "approve" ? "سيتم اعتماد الطلب وإشعار جميع الأطراف" : "سيتم رفض الطلب مع ذكر السبب"}
                </p>
              </div>
            </div>

            {showActionModal.action === "reject" && (
              <textarea
                placeholder="اكتب سبب الرفض..."
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-red-400 transition-colors resize-none mb-4"
              ></textarea>
            )}

            {showActionModal.action === "approve" && (
              <textarea
                placeholder="ملاحظات إضافية (اختياري)..."
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-emerald-400 transition-colors resize-none mb-4"
              ></textarea>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowActionModal(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowActionModal(null)}
                className={`flex-1 text-white text-sm font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                  showActionModal.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {showActionModal.action === "approve" ? "تأكيد الاعتماد" : "تأكيد الرفض"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;