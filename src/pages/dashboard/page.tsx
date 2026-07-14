import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardSidebar from "./components/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";

const projects = [
  {
    id: "PRJ-2024-001",
    name: "براند الفجر",
    type: "براند عطور كامل",
    status: "Formula Development",
    statusColor: "bg-rose-100 text-rose-700",
    progress: 55,
    lastUpdate: "منذ ساعتين",
    manager: "أحمد الزهراني",
    path: "A",
    pathColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "PRJ-2024-002",
    name: "عطر الليل",
    type: "تطوير عطر فقط",
    status: "Sampling",
    statusColor: "bg-sky-100 text-sky-700",
    progress: 70,
    lastUpdate: "منذ يوم",
    manager: "سارة المطيري",
    path: "B",
    pathColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "PRJ-2024-003",
    name: "هوية نيش",
    type: "هوية بصرية فقط",
    status: "Brief In Progress",
    statusColor: "bg-violet-100 text-violet-700",
    progress: 20,
    lastUpdate: "منذ 3 أيام",
    manager: "فهد العتيبي",
    path: "D",
    pathColor: "bg-violet-100 text-violet-700",
  },
];

const notifications = [
  { icon: "ri-checkbox-circle-line", color: "text-emerald-500", text: "تم اعتماد Formula V2 لمشروع براند الفجر", time: "منذ ساعة" },
  { icon: "ri-message-3-line", color: "text-sky-500", text: "رسالة جديدة من مدير مشروع عطر الليل", time: "منذ 3 ساعات" },
  { icon: "ri-file-text-line", color: "text-amber-500", text: "تم رفع ملف التصميم لمشروع هوية نيش", time: "أمس" },
  { icon: "ri-time-line", color: "text-violet-500", text: "تذكير: موعد مراجعة العينة غداً الساعة 10 صباحاً", time: "أمس" },
];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.path === activeFilter);

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">لوحة التحكم</h1>
            <p className="text-stone-400 text-xs">الإثنين، 21 أبريل 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors">
              <i className="ri-notification-3-line text-stone-600 text-base"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <Link
              to="/services"
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              مشروع جديد
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-l from-amber-700 to-amber-900 rounded-2xl p-6 mb-8 flex items-center justify-between overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-48 opacity-10">
              <div className="w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/4"></div>
            </div>
            <div>
              <div className="text-amber-200 text-xs font-bold mb-1">مرحباً بعودتك</div>
              <h2 className="text-white text-2xl font-black mb-1">{user?.firstName} {user?.lastName}</h2>
              <p className="text-white/70 text-sm">لديك 2 إشعار جديد و 3 مشاريع نشطة</p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[
                { num: "3", label: "مشاريع نشطة" },
                { num: "2", label: "اعتمادات معلقة" },
                { num: "5", label: "رسائل جديدة" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-white">{s.num}</div>
                  <div className="text-white/60 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "ri-folder-3-line", label: "إجمالي المشاريع", value: "3", change: "+1 هذا الشهر", color: "bg-amber-50 text-amber-700" },
              { icon: "ri-checkbox-circle-line", label: "مشاريع مكتملة", value: "0", change: "قيد التنفيذ", color: "bg-emerald-50 text-emerald-700" },
              { icon: "ri-time-line", label: "متوسط وقت التسليم", value: "4.2 شهر", change: "أسرع من المعدل", color: "bg-sky-50 text-sky-700" },
              { icon: "ri-star-line", label: "تقييمك", value: "4.9/5", change: "ممتاز", color: "bg-violet-50 text-violet-700" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-stone-100">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div className="text-2xl font-black text-stone-900 mb-1">{stat.value}</div>
                <div className="text-stone-400 text-xs mb-1">{stat.label}</div>
                <div className="text-stone-500 text-xs font-medium">{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-stone-900">مشاريعي النشطة</h3>
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "الكل" },
                    { key: "A", label: "براند كامل" },
                    { key: "B", label: "عطر" },
                    { key: "D", label: "هوية" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setActiveFilter(f.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeFilter === f.key
                          ? "bg-amber-700 text-white"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/workspace/${project.id}`}
                    className="block bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-stone-900">{project.name}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${project.pathColor}`}>
                            مسار {project.path}
                          </span>
                        </div>
                        <div className="text-stone-400 text-xs">{project.type} • {project.id}</div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-stone-400 text-xs">نسبة الإنجاز</span>
                        <span className="text-stone-700 text-xs font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5">
                        <div
                          className="bg-amber-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <i className="ri-user-line"></i>
                        <span>{project.manager}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="ri-time-line"></i>
                        <span>{project.lastUpdate}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                <Link
                  to="/services"
                  className="flex items-center justify-center gap-3 bg-stone-50 hover:bg-amber-50 border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-2xl p-5 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                    <i className="ri-add-line text-amber-700 text-xl"></i>
                  </div>
                  <span className="text-stone-500 font-semibold text-sm">إضافة مشروع جديد</span>
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-stone-900 text-sm">الإشعارات</h3>
                  <button className="text-amber-700 text-xs font-bold cursor-pointer">الكل</button>
                </div>
                <div className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-xl bg-stone-50 flex-shrink-0 ${n.color}`}>
                        <i className={`${n.icon} text-sm`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-stone-700 text-xs leading-relaxed">{n.text}</p>
                        <span className="text-stone-400 text-xs">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100">
                <h3 className="font-black text-stone-900 text-sm mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "ri-add-circle-line", label: "مشروع جديد", color: "bg-amber-50 text-amber-700", link: "/services" },
                    { icon: "ri-message-3-line", label: "رسالة جديدة", color: "bg-sky-50 text-sky-700", link: "/dashboard/messages" },
                    { icon: "ri-file-upload-line", label: "رفع ملف", color: "bg-emerald-50 text-emerald-700", link: "/workspace" },
                    { icon: "ri-customer-service-2-line", label: "دعم فني", color: "bg-violet-50 text-violet-700", link: null },
                  ].map((action) => (
                    action.link ? (
                      <Link
                        key={action.label}
                        to={action.link}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${action.color}`}>
                          <i className={`${action.icon} text-lg`}></i>
                        </div>
                        <span className="text-stone-600 text-xs font-semibold">{action.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={action.label}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${action.color}`}>
                          <i className={`${action.icon} text-lg`}></i>
                        </div>
                        <span className="text-stone-600 text-xs font-semibold">{action.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div className="bg-stone-900 rounded-2xl p-5">
                <h3 className="font-black text-white text-sm mb-4">المواعيد القادمة</h3>
                <div className="space-y-3">
                  {[
                    { date: "غداً", time: "10:00 ص", label: "مراجعة عينة Formula V2", color: "bg-amber-700" },
                    { date: "الخميس", time: "2:00 م", label: "جلسة استراتيجية البراند", color: "bg-sky-700" },
                    { date: "الأحد", time: "11:00 ص", label: "عرض تصاميم التغليف", color: "bg-emerald-700" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-1 h-10 rounded-full ${event.color} flex-shrink-0`}></div>
                      <div>
                        <div className="text-white text-xs font-bold">{event.label}</div>
                        <div className="text-white/40 text-xs">{event.date} • {event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
