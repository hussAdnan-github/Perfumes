import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const invoices = [
  {
    id: "INV-2026-001",
    project: "براند الفجر",
    projectId: "PRJ-2026-001",
    description: "الدفعة الثانية — تطوير التركيبة والهوية البصرية",
    amount: 45000,
    currency: "SAR",
    issuedDate: "15 مايو 2026",
    dueDate: "15 يونيو 2026",
    paidDate: "12 يونيو 2026",
    status: "paid",
    paymentMethod: "تحويل بنكي",
    breakdown: [
      { item: "تطوير التركيبة Formula V2", amount: 25000 },
      { item: "تصميم الهوية البصرية", amount: 12000 },
      { item: "استشارات براند", amount: 8000 },
    ],
  },
  {
    id: "INV-2026-002",
    project: "مجموعة شرقية",
    projectId: "PRJ-2026-004",
    description: "الدفعة الأولى — بدء المشروع والمواد الخام",
    amount: 42000,
    currency: "SAR",
    issuedDate: "1 يونيو 2026",
    dueDate: "1 يوليو 2026",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    breakdown: [
      { item: "رسوم بدء المشروع", amount: 15000 },
      { item: "المواد الخام الأولية", amount: 22000 },
      { item: "تصميم العبوة", amount: 5000 },
    ],
  },
  {
    id: "INV-2026-003",
    project: "عطر الليل",
    projectId: "PRJ-2026-002",
    description: "الدفعة الأولى — تطوير العطر والعينات",
    amount: 20000,
    currency: "SAR",
    issuedDate: "10 مايو 2026",
    dueDate: "10 يونيو 2026",
    paidDate: "5 يونيو 2026",
    status: "paid",
    paymentMethod: "بطاقة ائتمان",
    breakdown: [
      { item: "تطوير العطر", amount: 12000 },
      { item: "إنتاج العينات الأولى", amount: 8000 },
    ],
  },
  {
    id: "INV-2026-004",
    project: "براند الفجر",
    projectId: "PRJ-2026-001",
    description: "الدفعة الثالثة — الإنتاج التجريبي والتغليف",
    amount: 40000,
    currency: "SAR",
    issuedDate: "20 يونيو 2026",
    dueDate: "20 يوليو 2026",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    breakdown: [
      { item: "الإنتاج التجريبي", amount: 25000 },
      { item: "التغليف والطباعة", amount: 15000 },
    ],
  },
  {
    id: "INV-2026-005",
    project: "هوية نيش",
    projectId: "PRJ-2026-003",
    description: "الدفعة الأولى — تصميم الهوية البصرية",
    amount: 18000,
    currency: "SAR",
    issuedDate: "15 أبريل 2026",
    dueDate: "15 مايو 2026",
    paidDate: "25 مايو 2026",
    status: "overdue",
    paymentMethod: null,
    breakdown: [
      { item: "تصميم الشعار", amount: 8000 },
      { item: "دليل الهوية البصرية", amount: 6000 },
      { item: "المطبوعات الأساسية", amount: 4000 },
    ],
  },
  {
    id: "INV-2026-006",
    project: "عبوة زجاجية فاخرة",
    projectId: "PRJ-2026-005",
    description: "الدفعة الأولى — تصميم ونمذجة العبوة",
    amount: 12500,
    currency: "SAR",
    issuedDate: "1 أبريل 2026",
    dueDate: "1 مايو 2026",
    paidDate: "28 أبريل 2026",
    status: "paid",
    paymentMethod: "تحويل بنكي",
    breakdown: [
      { item: "تصميم العبوة ثلاثي الأبعاد", amount: 7500 },
      { item: "طباعة النموذج الأولي", amount: 5000 },
    ],
  },
  {
    id: "INV-2026-007",
    project: "براند الفجر",
    projectId: "PRJ-2026-001",
    description: "الدفعة الأولى — البريف والتخطيط الاستراتيجي",
    amount: 28000,
    currency: "SAR",
    issuedDate: "1 مارس 2026",
    dueDate: "1 أبريل 2026",
    paidDate: "28 مارس 2026",
    status: "paid",
    paymentMethod: "تحويل بنكي",
    breakdown: [
      { item: "جلسات البريف والاستراتيجية", amount: 15000 },
      { item: "تحليل السوق والمنافسين", amount: 8000 },
      { item: "تقرير التوجه الإبداعي", amount: 5000 },
    ],
  },
  {
    id: "INV-2026-008",
    project: "ماء الذهب",
    projectId: "PRJ-2026-006",
    description: "الدفعة الأولى — بدء تطوير العطر",
    amount: 15000,
    currency: "SAR",
    issuedDate: "10 يونيو 2026",
    dueDate: "10 يوليو 2026",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    breakdown: [
      { item: "تطوير مفهوم العطر", amount: 9000 },
      { item: "تجارب أولية", amount: 6000 },
    ],
  },
  {
    id: "INV-2026-009",
    project: "مسك الأصالة",
    projectId: "PRJ-2026-009",
    description: "الدفعة الأولى — البريف والتخطيط",
    amount: 22000,
    currency: "SAR",
    issuedDate: "5 مايو 2026",
    dueDate: "5 يونيو 2026",
    paidDate: null,
    status: "overdue",
    paymentMethod: null,
    breakdown: [
      { item: "جلسات البريف", amount: 10000 },
      { item: "تخطيط استراتيجي", amount: 7000 },
      { item: "تقرير بحث السوق", amount: 5000 },
    ],
  },
  {
    id: "INV-2026-010",
    project: "عطر الليل",
    projectId: "PRJ-2026-002",
    description: "الدفعة الثانية — التغليف والتسليم",
    amount: 25000,
    currency: "SAR",
    issuedDate: "25 يونيو 2026",
    dueDate: "25 يوليو 2026",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    breakdown: [
      { item: "تصميم وتنفيذ التغليف", amount: 15000 },
      { item: "الشحن والتسليم", amount: 5000 },
      { item: "توثيق المشروع", amount: 5000 },
    ],
  },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "مدفوعة" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "مستحقة" },
  overdue: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "متأخرة" },
};

const InvoicesPage = () => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus && inv.status !== filterStatus) return false;
    if (
      searchQuery &&
      !inv.project.includes(searchQuery) &&
      !inv.id.includes(searchQuery) &&
      !inv.description.includes(searchQuery)
    )
      return false;
    return true;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: invoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">الفواتير والمدفوعات</h1>
              {stats.overdue > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {stats.overdue} متأخرة
                </span>
              )}
            </div>
            <p className="text-stone-400 text-xs mt-0.5">إدارة الفواتير وتتبع المدفوعات لجميع المشاريع</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2">
              <i className="ri-download-2-line"></i>
              تصدير
            </button>
            <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2">
              <i className="ri-add-line"></i>
              فاتورة جديدة
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Financial Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "ri-file-list-3-line", label: "إجمالي الفواتير", value: stats.total, sub: `${stats.totalAmount.toLocaleString()} ${invoices[0].currency}`, color: "bg-amber-50 text-amber-700" },
              { icon: "ri-checkbox-circle-line", label: "مدفوعة", value: stats.paid, sub: `${stats.paidAmount.toLocaleString()} ${invoices[0].currency}`, color: "bg-emerald-50 text-emerald-700" },
              { icon: "ri-time-line", label: "مستحقة", value: stats.pending, sub: `${stats.pendingAmount.toLocaleString()} ${invoices[0].currency}`, color: "bg-sky-50 text-sky-700" },
              { icon: "ri-error-warning-line", label: "متأخرة", value: stats.overdue, sub: `${invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0).toLocaleString()} ${invoices[0].currency}`, color: "bg-red-50 text-red-700" },
            ].map((stat) => (
              <button
                key={stat.label}
                onClick={() => {
                  if (stat.label === "مدفوعة") setFilterStatus("paid");
                  else if (stat.label === "مستحقة") setFilterStatus("pending");
                  else if (stat.label === "متأخرة") setFilterStatus("overdue");
                  else setFilterStatus(null);
                }}
                className="bg-white rounded-2xl p-4 lg:p-5 border border-stone-100 hover:border-amber-200 transition-all cursor-pointer text-right"
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
                <div className="text-stone-400 text-xs mb-0.5">{stat.label}</div>
                <div className="text-stone-500 text-xs font-medium">{stat.sub}</div>
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
                  placeholder="ابحث عن فاتورة..."
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
                  { key: "paid", label: "مدفوعة" },
                  { key: "pending", label: "مستحقة" },
                  { key: "overdue", label: "متأخرة" },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilterStatus(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterStatus === f.key ? "bg-amber-700 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
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
              عرض {filteredInvoices.length} من {invoices.length} فاتورة
            </span>
            {(filterStatus || searchQuery) && (
              <button
                onClick={() => { setFilterStatus(null); setSearchQuery(""); }}
                className="text-amber-700 text-xs font-bold hover:underline cursor-pointer whitespace-nowrap"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>

          {/* Invoices Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const isExpanded = selectedInvoice === invoice.id;
                const isPaid = invoice.status === "paid";
                const isOverdue = invoice.status === "overdue";

                return (
                  <div
                    key={invoice.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isExpanded ? "border-amber-400" : isOverdue ? "border-red-200" : "border-stone-100 hover:border-amber-200"
                    }`}
                  >
                    <div className="p-5">
                      {/* Status + ID */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${status.bg} ${status.text}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} ml-1.5`}></span>
                          {status.label}
                        </span>
                        <span className="text-stone-400 text-xs font-mono">{invoice.id}</span>
                      </div>

                      {/* Project & Description */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/workspace/${invoice.projectId}`}
                            className="text-amber-700 text-xs font-bold hover:underline cursor-pointer"
                          >
                            {invoice.project}
                          </Link>
                        </div>
                        <p className="text-stone-500 text-xs leading-relaxed">{invoice.description}</p>
                      </div>

                      {/* Amount */}
                      <div className="mb-4">
                        <div className="text-2xl font-black text-stone-900">
                          {invoice.amount.toLocaleString()} <span className="text-sm text-stone-400">{invoice.currency}</span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">تاريخ الإصدار</span>
                          <span className="text-stone-700 font-medium">{invoice.issuedDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">تاريخ الاستحقاق</span>
                          <span className={`font-medium ${isOverdue ? "text-red-600" : "text-stone-700"}`}>
                            {invoice.dueDate}
                          </span>
                        </div>
                        {isPaid && (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">تاريخ الدفع</span>
                            <span className="text-emerald-600 font-medium">{invoice.paidDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Payment Method */}
                      {isPaid && invoice.paymentMethod && (
                        <div className="flex items-center gap-2 mb-4 text-xs">
                          <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50">
                            <i className="ri-bank-card-line text-emerald-600 text-sm"></i>
                          </div>
                          <span className="text-stone-500">{invoice.paymentMethod}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                        <button
                          onClick={() => setSelectedInvoice(isExpanded ? null : invoice.id)}
                          className="text-amber-700 text-xs font-bold hover:underline cursor-pointer"
                        >
                          {isExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                            <i className="ri-download-2-line text-sm"></i>
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                            <i className="ri-share-forward-line text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="border-t border-amber-200 bg-amber-50/30 rounded-b-2xl p-5 space-y-4">
                        {/* Breakdown */}
                        <div>
                          <div className="text-stone-400 text-xs mb-2">تفاصيل الفاتورة</div>
                          <div className="space-y-2">
                            {invoice.breakdown.map((item, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="text-stone-600 text-xs">{item.item}</span>
                                <span className="text-stone-800 text-xs font-bold">
                                  {item.amount.toLocaleString()} {invoice.currency}
                                </span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                              <span className="text-stone-800 text-xs font-black">الإجمالي</span>
                              <span className="text-stone-900 text-sm font-black">
                                {invoice.amount.toLocaleString()} {invoice.currency}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1.5">
                            <i className="ri-download-2-line text-sm"></i>
                            تحميل PDF
                          </button>
                          {!isPaid && (
                            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1.5">
                              <i className="ri-bank-card-line text-sm"></i>
                              دفع الآن
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-stone-50 border-b border-stone-100 text-stone-400 text-xs font-bold">
                <div className="col-span-1">رقم الفاتورة</div>
                <div className="col-span-2">المشروع</div>
                <div className="col-span-2">الوصف</div>
                <div className="col-span-1">المبلغ</div>
                <div className="col-span-1">تاريخ الاستحقاق</div>
                <div className="col-span-1">الحالة</div>
                <div className="col-span-2">الدفع</div>
                <div className="col-span-2"></div>
              </div>
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const isOverdue = invoice.status === "overdue";
                const isPaid = invoice.status === "paid";

                return (
                  <div
                    key={invoice.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-6 py-4 border-b border-stone-50 hover:bg-stone-50/50 transition-colors items-center ${
                      isOverdue ? "bg-red-50/30" : ""
                    }`}
                  >
                    <div className="lg:col-span-1">
                      <span className="text-stone-500 text-xs font-mono">{invoice.id}</span>
                    </div>
                    <div className="lg:col-span-2">
                      <Link
                        to={`/workspace/${invoice.projectId}`}
                        className="text-amber-700 text-xs font-bold hover:underline cursor-pointer"
                      >
                        {invoice.project}
                      </Link>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="text-stone-500 text-xs line-clamp-1">{invoice.description}</span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="text-stone-800 text-xs font-black">{invoice.amount.toLocaleString()} {invoice.currency}</span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-stone-600"}`}>
                        {invoice.dueDate}
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${status.bg} ${status.text}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} ml-1.5`}></span>
                        {status.label}
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      {isPaid ? (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50">
                            <i className="ri-check-line text-emerald-600 text-sm"></i>
                          </div>
                          <span className="text-stone-500">{invoice.paidDate} · {invoice.paymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs">—</span>
                      )}
                    </div>
                    <div className="lg:col-span-2 flex items-center justify-end gap-1.5">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                        <i className="ri-download-2-line text-sm"></i>
                      </button>
                      {!isPaid && (
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all">
                          دفع
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 transition-all cursor-pointer"
                      >
                        <i className={`text-sm ${selectedInvoice === invoice.id ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`}></i>
                      </button>
                    </div>

                    {/* Expanded row detail */}
                    {selectedInvoice === invoice.id && (
                      <div className="lg:col-span-12 bg-amber-50/30 rounded-xl p-4 space-y-3">
                        <div className="text-stone-400 text-xs mb-1">تفاصيل الفاتورة</div>
                        <div className="space-y-2">
                          {invoice.breakdown.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-stone-600 text-xs">{item.item}</span>
                              <span className="text-stone-800 text-xs font-bold">
                                {item.amount.toLocaleString()} {invoice.currency}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                            <span className="text-stone-800 text-xs font-black">الإجمالي</span>
                            <span className="text-stone-900 text-sm font-black">
                              {invoice.amount.toLocaleString()} {invoice.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-stone-100 rounded-2xl">
                <i className="ri-file-search-line text-stone-400 text-2xl"></i>
              </div>
              <h3 className="text-stone-700 font-black mb-1">لا توجد فواتير</h3>
              <p className="text-stone-400 text-sm">لا توجد فواتير تطابق معايير البحث الحالية</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoicesPage;