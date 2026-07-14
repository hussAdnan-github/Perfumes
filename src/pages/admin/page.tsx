import { useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import { adminStats, revenueChart, ordersByPath, recentActivity, orders } from "@/mocks/adminData";

const AdminDashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("يوليو");

  const statCards = [
    { icon: "ri-shopping-bag-3-line", label: "إجمالي الطلبات", value: adminStats.totalOrders, change: `${adminStats.activeOrders} طلب نشط`, color: "bg-amber-50 text-amber-700", iconBg: "bg-amber-100" },
    { icon: "ri-bank-card-line", label: "إجمالي الإيرادات", value: `${(adminStats.totalRevenue / 1000).toFixed(0)}K`, change: `+${adminStats.revenueGrowth}% هذا الشهر`, color: "bg-emerald-50 text-emerald-700", iconBg: "bg-emerald-100", isCurrency: true },
    { icon: "ri-user-3-line", label: "العملاء", value: adminStats.totalClients, change: `${adminStats.newClientsThisMonth} جديد هذا الشهر`, color: "bg-sky-50 text-sky-700", iconBg: "bg-sky-100" },
    { icon: "ri-team-line", label: "الموظفين", value: adminStats.totalEmployees, change: "مصممين + مدراء مشاريع", color: "bg-violet-50 text-violet-700", iconBg: "bg-violet-100" },
    { icon: "ri-star-line", label: "التقييم العام", value: adminStats.averageRating, change: "من 5 نجوم", color: "bg-yellow-50 text-yellow-700", iconBg: "bg-yellow-100", isRating: true },
    { icon: "ri-check-double-line", label: "المكتملة", value: adminStats.completedOrders, change: `${adminStats.pendingOrders} قيد الانتظار`, color: "bg-rose-50 text-rose-700", iconBg: "bg-rose-100" },
  ];

  const maxRevenue = Math.max(...revenueChart.map((r) => r.revenue));

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">النظرة العامة</h1>
            <p className="text-stone-400 text-xs">آخر تحديث: {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-stone-600 text-xs font-bold">النظام نشط</span>
            </div>
            <Link
              to="/admin/orders"
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              طلب جديد
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-200 transition-all">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${stat.iconBg} ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div className="text-2xl font-black text-stone-900 mb-1">
                  {stat.isCurrency && <span className="text-sm align-top ml-0.5"></span>}
                  {stat.value}
                  {stat.isCurrency && <span className="text-xs font-semibold ml-0.5">ريال</span>}
                  {stat.isRating && <span className="text-sm font-semibold ml-0.5">/5</span>}
                </div>
                <div className="text-stone-400 text-xs mb-0.5">{stat.label}</div>
                <div className={`text-xs font-semibold ${stat.color}`}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-stone-900 text-sm mb-1">الإيرادات الشهرية</h3>
                  <p className="text-stone-400 text-xs">إجمالي الإيرادات لآخر ١٢ شهر</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs">٢٠٢٦</span>
                  <div className="w-8 h-5 rounded-full bg-stone-200 flex items-center px-0.5 cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2 h-64">
                {revenueChart.map((item) => {
                  const heightPct = (item.revenue / maxRevenue) * 100;
                  const isSelected = item.month === selectedMonth;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                      onClick={() => setSelectedMonth(item.month)}
                    >
                      <div className="w-full relative flex flex-col items-center" style={{ height: "200px" }}>
                        <div className="absolute bottom-0 w-full flex flex-col items-center">
                          <span className={`text-xs font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "text-amber-700 opacity-100" : "text-stone-500"}`}>
                            {item.revenue.toLocaleString()}
                          </span>
                          <div
                            className={`w-full rounded-t-lg transition-all ${isSelected ? "bg-amber-600" : "bg-amber-200 group-hover:bg-amber-400"}`}
                            style={{ height: `${heightPct}%`, minHeight: "4px" }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold whitespace-nowrap ${isSelected ? "text-amber-700" : "text-stone-400"}`}>
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-600"></div>
                  <span className="text-stone-400 text-xs">الإيرادات الشهرية (ريال)</span>
                </div>
                <span className="text-stone-500 text-xs font-bold">
                  {selectedMonth}: {revenueChart.find((r) => r.month === selectedMonth)?.revenue.toLocaleString()} ريال
                </span>
              </div>
            </div>

            {/* Orders by Path */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 text-sm mb-4">الطلبات حسب المسار</h3>
              <div className="space-y-4">
                {ordersByPath.map((item) => (
                  <div key={item.path}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-stone-600 text-xs font-semibold">{item.path}</span>
                      <span className="text-stone-900 text-xs font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${item.color}`}
                        style={{ width: `${(item.count / Math.max(...ordersByPath.map((o) => o.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-stone-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">إجمالي الطلبات</span>
                  <span className="font-black text-stone-900">{ordersByPath.reduce((acc, o) => acc + o.count, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-stone-900 text-sm mb-1">أحدث الطلبات</h3>
                  <p className="text-stone-400 text-xs">آخر ٤ طلبات تم استلامها</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-amber-700 text-xs font-bold hover:text-amber-600 transition-all cursor-pointer flex items-center gap-1"
                >
                  عرض الكل
                  <i className="ri-arrow-left-s-line"></i>
                </Link>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-stone-50 hover:bg-amber-50 transition-all cursor-pointer border border-transparent hover:border-amber-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-100 flex-shrink-0">
                        <i className="ri-shopping-bag-3-line text-amber-600 text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-stone-900 text-sm font-bold">{order.client}</span>
                          <span className="text-stone-300 text-xs">{order.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-stone-500">{order.path}</span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-500">المدير: {order.manager}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div className="text-stone-900 text-sm font-bold">{order.amount.toLocaleString()} ريال</div>
                        <div className={order.paymentColor + " text-xs font-semibold whitespace-nowrap"}>{order.paymentStatus}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 text-sm mb-4">آخر النشاطات</h3>
              <div className="space-y-0">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-stone-50 last:border-b-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.color}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-stone-700 text-xs leading-relaxed">{activity.text}</p>
                      <span className="text-stone-400 text-xs">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-stone-900 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-64 opacity-5">
              <div className="w-64 h-64 bg-white rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-white text-sm mb-2">إجراءات سريعة</h3>
              <p className="text-white/50 text-xs mb-5">الوصول السريع لأهم العمليات الإدارية</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: "ri-add-circle-line", label: "طلب جديد", link: "/admin/orders", color: "bg-amber-700" },
                  { icon: "ri-user-add-line", label: "إضافة موظف", link: "/admin/team", color: "bg-emerald-700" },
                  { icon: "ri-image-add-line", label: "رفع صور عبوات", link: "/admin/content", color: "bg-sky-700" },
                  { icon: "ri-file-chart-line", label: "تقرير شهري", link: "/admin/reports", color: "bg-violet-700" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.link}
                    className={`flex items-center gap-3 p-3.5 rounded-xl ${action.color} text-white hover:opacity-90 transition-all cursor-pointer`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <i className={`${action.icon} text-base`}></i>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;