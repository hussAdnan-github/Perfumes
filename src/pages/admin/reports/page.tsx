import { useState } from "react";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import { reportsData, reportsActivity } from "@/mocks/adminData";

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "paths" | "designers" | "financial">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("2026");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const maxRev2026 = Math.max(...reportsData.monthlyComparison.map((m) => m.revenue2026));
  const maxRev2025 = Math.max(...reportsData.monthlyComparison.map((m) => m.revenue2025));
  const maxRev = Math.max(maxRev2026, maxRev2025);
  const totalStatus = reportsData.statusDistribution.reduce((acc, s) => acc + s.count, 0);

  const overviewStats = [
    {
      icon: "ri-money-dollar-circle-line",
      label: "إجمالي الإيرادات",
      value: `${(reportsData.overview.totalRevenue / 1000).toFixed(0)}K`,
      sub: "ريال سعودي",
      change: `+${reportsData.overview.revenueGrowth}%`,
      changeColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: "ri-shopping-bag-3-line",
      label: "إجمالي الطلبات",
      value: reportsData.overview.totalOrders,
      sub: "طلب",
      change: `+${reportsData.overview.ordersGrowth}%`,
      changeColor: "text-sky-600",
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      icon: "ri-funds-line",
      label: "متوسط قيمة الطلب",
      value: `${(reportsData.overview.avgOrderValue / 1000).toFixed(1)}K`,
      sub: "ريال",
      change: `+${reportsData.overview.avgOrderGrowth}%`,
      changeColor: "text-emerald-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: "ri-check-double-line",
      label: "نسبة الإنجاز",
      value: `${reportsData.overview.completionRate}%`,
      sub: "من الطلبات",
      change: `+${reportsData.overview.completionGrowth}%`,
      changeColor: "text-emerald-600",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      icon: "ri-user-star-line",
      label: "أفضل عميل",
      value: reportsData.overview.topClient,
      sub: `${(reportsData.overview.topClientValue / 1000).toFixed(0)}K ريال`,
      change: "",
      changeColor: "",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      icon: "ri-road-map-line",
      label: "أفضل مسار",
      value: reportsData.overview.topPath,
      sub: `${reportsData.overview.topPathCount} طلب`,
      change: "",
      changeColor: "",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const tabs = [
    { key: "overview" as const, label: "نظرة عامة", icon: "ri-dashboard-3-line" },
    { key: "clients" as const, label: "العملاء", icon: "ri-user-3-line" },
    { key: "paths" as const, label: "المسارات", icon: "ri-road-map-line" },
    { key: "designers" as const, label: "المصممين", icon: "ri-palette-line" },
    { key: "financial" as const, label: "مالي", icon: "ri-bank-card-line" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">التقارير</h1>
            <p className="text-stone-400 text-xs">تقارير مالية وإحصائية شاملة عن أداء المنصة</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer transition-all"
            >
              <option value="2026">٢٠٢٦</option>
              <option value="2025">٢٠٢٥</option>
              <option value="all">كل السنوات</option>
            </select>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-download-line"></i>
                </div>
                تصدير
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-[10px]"></i>
                </div>
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowExportMenu(false)}></div>
                  <div className="absolute left-0 top-full mt-2 bg-white rounded-xl border border-stone-100 shadow-lg z-30 w-48 py-1">
                    {[
                      { icon: "ri-file-pdf-line", label: "تصدير PDF" },
                      { icon: "ri-file-excel-2-line", label: "تصدير Excel" },
                      { icon: "ri-file-text-line", label: "تصدير CSV" },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setShowExportMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer whitespace-nowrap transition-all"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className={opt.icon}></i>
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1 border border-stone-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-amber-700 text-white"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={tab.icon}></i>
                </div>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {overviewStats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-3 ${stat.iconBg} ${stat.iconColor}`}>
                      <i className={`${stat.icon} text-lg`}></i>
                    </div>
                    <div className="text-xl font-black text-stone-900 mb-0.5">{stat.value}</div>
                    <div className="text-stone-400 text-[10px] mb-0.5">{stat.label}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 text-[10px]">{stat.sub}</span>
                      {stat.change && (
                        <span className={`text-[10px] font-bold ${stat.changeColor}`}>{stat.change}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue Comparison Chart */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-black text-stone-900 text-sm mb-1">مقارنة الإيرادات — ٢٠٢٥ vs ٢٠٢٦</h3>
                    <p className="text-stone-400 text-xs">مقارنة شهرية للإيرادات بين العامين</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-stone-500 text-[10px] font-bold">٢٠٢٦</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-stone-300"></div>
                      <span className="text-stone-500 text-[10px] font-bold">٢٠٢٥</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-3 h-72">
                  {reportsData.monthlyComparison.map((item) => {
                    const h2026 = (item.revenue2026 / maxRev) * 100;
                    const h2025 = (item.revenue2025 / maxRev) * 100;
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="relative w-full flex justify-center" style={{ height: "240px" }}>
                          <div className="absolute bottom-0 flex items-end gap-1.5">
                            <div
                              className="w-5 rounded-t-md bg-amber-500 transition-all hover:bg-amber-600"
                              style={{ height: `${h2026}%`, minHeight: "4px" }}
                              title={`٢٠٢٦: ${item.revenue2026.toLocaleString()} ريال`}
                            ></div>
                            <div
                              className="w-5 rounded-t-md bg-stone-300 transition-all hover:bg-stone-400"
                              style={{ height: `${h2025}%`, minHeight: "4px" }}
                              title={`٢٠٢٥: ${item.revenue2025.toLocaleString()} ريال`}
                            ></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-stone-400 whitespace-nowrap">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Orders Comparison + Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-black text-stone-900 text-sm mb-4">مقارنة عدد الطلبات — ٢٠٢٥ vs ٢٠٢٦</h3>
                  <div className="space-y-3">
                    {reportsData.monthlyComparison.map((item) => {
                      const maxOrders = Math.max(item.orders2025, item.orders2026, 1);
                      return (
                        <div key={item.month} className="flex items-center gap-3">
                          <span className="text-stone-500 text-[10px] font-bold w-12 whitespace-nowrap">{item.month}</span>
                          <div className="flex-1 flex items-center gap-1">
                            <div className="flex-1 flex items-center gap-1">
                              <div className="flex-1 bg-stone-100 rounded-full h-5 relative overflow-hidden">
                                <div
                                  className="absolute top-0 right-0 h-full bg-amber-500 rounded-full transition-all flex items-center justify-end px-1.5"
                                  style={{ width: `${(item.orders2026 / maxOrders) * 100}%`, minWidth: item.orders2026 > 0 ? "24px" : "0" }}
                                >
                                  {item.orders2026 > 0 && (
                                    <span className="text-white text-[9px] font-black">{item.orders2026}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 flex items-center gap-1">
                              <div className="flex-1 bg-stone-100 rounded-full h-5 relative overflow-hidden">
                                <div
                                  className="absolute top-0 right-0 h-full bg-stone-300 rounded-full transition-all flex items-center justify-end px-1.5"
                                  style={{ width: `${(item.orders2025 / maxOrders) * 100}%`, minWidth: item.orders2025 > 0 ? "24px" : "0" }}
                                >
                                  {item.orders2025 > 0 && (
                                    <span className="text-stone-600 text-[9px] font-black">{item.orders2025}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-black text-stone-900 text-sm mb-4">توزيع حالة الطلبات</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-44 h-44">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {(() => {
                          let cumulative = 0;
                          return reportsData.statusDistribution.map((item) => {
                            const pct = (item.count / totalStatus) * 100;
                            const dash = (pct / 100) * 283;
                            const offset = 283 - (cumulative / 100) * 283;
                            cumulative += pct;
                            return (
                              <circle
                                key={item.status}
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={
                                  item.color === "bg-emerald-500" ? "#10b981" :
                                  item.color === "bg-sky-500" ? "#0ea5e9" :
                                  item.color === "bg-amber-500" ? "#f59e0b" :
                                  item.color === "bg-violet-500" ? "#8b5cf6" :
                                  "#f43f5e"
                                }
                                strokeWidth="10"
                                strokeDasharray={`${dash} ${283 - dash}`}
                                strokeDashoffset={offset}
                                className="transition-all"
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-stone-900">{totalStatus}</span>
                        <span className="text-[10px] text-stone-400 font-bold">إجمالي الطلبات</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {reportsData.statusDistribution.map((item) => (
                      <div key={item.status} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`}></div>
                        <span className="text-stone-600 text-[10px] font-semibold">{item.status}</span>
                        <span className="text-stone-900 text-[10px] font-black mr-auto">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quarterly Report */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-4">التقارير ربع السنوية</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الربع</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الإيرادات</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الطلبات</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">العملاء</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">النمو</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.quarterlyReport.map((q) => (
                        <tr key={q.quarter} className="border-b border-stone-50 hover:bg-amber-50/30 transition-all">
                          <td className="py-3.5 px-4 text-stone-900 text-xs font-bold whitespace-nowrap">{q.quarter}</td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{q.revenue.toLocaleString()} ريال</td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{q.orders}</td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{q.clients}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">{q.growth}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-1">أفضل العملاء</h3>
                <p className="text-stone-400 text-xs mb-5">ترتيب العملاء حسب إجمالي الإنفاق وعدد الطلبات</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">#</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">العميل</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الطلبات</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">إجمالي الإنفاق</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">المسار المفضل</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">آخر طلب</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">التقييم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.topClients.map((client, i) => (
                        <tr key={client.name} className="border-b border-stone-50 hover:bg-amber-50/30 transition-all">
                          <td className="py-3.5 px-4">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                              i === 0 ? "bg-amber-500 text-white" :
                              i === 1 ? "bg-stone-300 text-stone-600" :
                              i === 2 ? "bg-amber-200 text-amber-700" :
                              "bg-stone-100 text-stone-500"
                            }`}>{i + 1}</span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-900 text-xs font-bold whitespace-nowrap">{client.name}</td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{client.orders}</td>
                          <td className="py-3.5 px-4 text-stone-900 text-xs font-bold whitespace-nowrap">{client.totalSpent.toLocaleString()} ريال</td>
                          <td className="py-3.5 px-4 text-stone-600 text-xs whitespace-nowrap">{client.path}</td>
                          <td className="py-3.5 px-4 text-stone-500 text-xs whitespace-nowrap">{client.lastOrder}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <div key={j} className="w-3 h-3 flex items-center justify-center">
                                  <i className={`ri-star-fill text-[10px] ${j < client.rating ? "text-amber-400" : "text-stone-200"}`}></i>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Client Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-stone-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
                      <i className="ri-user-star-line text-lg text-amber-600"></i>
                    </div>
                    <div>
                      <div className="text-stone-900 text-xs font-black">أعلى إنفاق</div>
                      <div className="text-stone-400 text-[10px]">شركة الأصالة</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-stone-900">265,000 ريال</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50">
                      <i className="ri-repeat-line text-lg text-emerald-600"></i>
                    </div>
                    <div>
                      <div className="text-stone-900 text-xs font-black">أكثر تكرراً</div>
                      <div className="text-stone-400 text-[10px]">شركة الأصالة</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-stone-900">18 طلب</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50">
                      <i className="ri-heart-line text-lg text-rose-600"></i>
                    </div>
                    <div>
                      <div className="text-stone-900 text-xs font-black">متوسط التقييم</div>
                      <div className="text-stone-400 text-[10px]">كل العملاء</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-stone-900">4.8 / 5</div>
                </div>
              </div>
            </div>
          )}

          {/* Paths Tab */}
          {activeTab === "paths" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-1">أداء المسارات</h3>
                <p className="text-stone-400 text-xs mb-5">تحليل أداء كل مسار من حيث الطلبات والإيرادات</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">المسار</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الطلبات</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">الإيرادات</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">متوسط قيمة الطلب</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">نسبة الإنجاز</th>
                        <th className="text-right text-stone-400 text-[10px] font-bold py-3 px-4 whitespace-nowrap">مؤشر الأداء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.pathPerformance.map((p) => (
                        <tr key={p.path} className="border-b border-stone-50 hover:bg-amber-50/30 transition-all">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.color}`}></div>
                              <span className="text-stone-900 text-xs font-bold whitespace-nowrap">{p.path}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{p.orders}</td>
                          <td className="py-3.5 px-4 text-stone-900 text-xs font-bold whitespace-nowrap">{p.revenue.toLocaleString()} ريال</td>
                          <td className="py-3.5 px-4 text-stone-700 text-xs font-semibold whitespace-nowrap">{p.avgValue.toLocaleString()} ريال</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-stone-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${p.color}`}
                                  style={{ width: `${p.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-stone-600 text-[10px] font-bold whitespace-nowrap">{p.completionRate}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                              p.revenue > 500000 ? "bg-emerald-50 text-emerald-700" :
                              p.revenue > 200000 ? "bg-amber-50 text-amber-700" :
                              "bg-stone-50 text-stone-600"
                            }`}>
                              {p.revenue > 500000 ? "ممتاز" : p.revenue > 200000 ? "جيد" : "متوسط"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Designers Tab */}
          {activeTab === "designers" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-1">أداء المصممين</h3>
                <p className="text-stone-400 text-xs mb-5">تقييم أداء فريق التصميم من حيث الإنتاجية والإيرادات</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reportsData.designerPerformance.map((designer) => (
                    <div key={designer.name} className="border border-stone-100 rounded-2xl p-5 hover:border-amber-200 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {designer.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-stone-900 text-xs font-bold truncate">{designer.name}</div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div key={j} className="w-2.5 h-2.5 flex items-center justify-center">
                                <i className={`ri-star-fill text-[8px] ${j < Math.round(designer.rating) ? "text-amber-400" : "text-stone-200"}`}></i>
                              </div>
                            ))}
                            <span className="text-stone-500 text-[10px] font-bold">{designer.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-stone-50 rounded-xl p-3">
                          <div className="text-stone-900 text-sm font-black">{designer.projects}</div>
                          <div className="text-stone-400 text-[10px]">مشروع</div>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-3">
                          <div className="text-stone-900 text-sm font-black">{designer.completed}</div>
                          <div className="text-stone-400 text-[10px]">مكتمل</div>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-3">
                          <div className="text-stone-900 text-sm font-black">{designer.active}</div>
                          <div className="text-stone-400 text-[10px]">نشط</div>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-3">
                          <div className="text-stone-900 text-sm font-black">{(designer.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-stone-400 text-[10px]">ريال</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === "financial" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الإيرادات لعام ٢٠٢٦", value: "2,847,500 ريال", icon: "ri-funds-line", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
                  { label: "متوسط الإيراد الشهري", value: "406,786 ريال", icon: "ri-line-chart-line", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
                  { label: "أعلى شهر إيرادات", value: "يونيو — 415,000", icon: "ri-trophy-line", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
                  { label: "نسبة النمو السنوي", value: "+18.3%", icon: "ri-arrow-up-line", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-3 ${item.iconBg} ${item.iconColor}`}>
                      <i className={`${item.icon} text-lg`}></i>
                    </div>
                    <div className="text-lg font-black text-stone-900 mb-0.5">{item.value}</div>
                    <div className="text-stone-400 text-[10px]">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-4">ملخص الإيرادات الشهرية — ٢٠٢٦</h3>
                <div className="space-y-3">
                  {reportsData.monthlyComparison.map((item) => {
                    const pct = (item.revenue2026 / maxRev) * 100;
                    return (
                      <div key={item.month} className="flex items-center gap-3">
                        <span className="text-stone-500 text-[10px] font-bold w-12 whitespace-nowrap">{item.month}</span>
                        <div className="flex-1 bg-stone-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="absolute top-0 right-0 h-full bg-gradient-to-l from-amber-500 to-amber-400 rounded-full transition-all flex items-center justify-end px-3"
                            style={{ width: `${pct}%`, minWidth: item.revenue2026 > 0 ? "80px" : "0" }}
                          >
                            <span className="text-white text-[10px] font-black whitespace-nowrap">{item.revenue2026.toLocaleString()} ريال</span>
                          </div>
                        </div>
                        <span className="text-stone-400 text-[10px] font-bold w-12 text-left whitespace-nowrap">{item.orders2026} طلب</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Activity Log Sidebar */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-stone-900 text-sm">آخر نشاطات التقارير</h3>
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-history-line text-stone-400"></i>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y-0">
              {reportsActivity.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border border-stone-50 rounded-xl hover:bg-amber-50/30 transition-all">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-stone-700 text-xs leading-relaxed">{item.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-stone-400 text-[10px]">{item.user}</span>
                      <span className="text-stone-300 text-[10px]">•</span>
                      <span className="text-stone-400 text-[10px]">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;