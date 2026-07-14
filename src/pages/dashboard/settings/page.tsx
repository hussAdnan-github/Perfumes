import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

type TabKey = "profile" | "account" | "notifications" | "appearance" | "danger";

const tabs: { key: TabKey; icon: string; label: string }[] = [
  { key: "profile", icon: "ri-user-3-line", label: "الملف الشخصي" },
  { key: "account", icon: "ri-shield-keyhole-line", label: "الحساب" },
  { key: "notifications", icon: "ri-notification-3-line", label: "الإشعارات" },
  { key: "appearance", icon: "ri-palette-line", label: "المظهر" },
];

const notificationOptions = [
  { key: "email_updates", label: "تحديثات المشاريع", description: "إشعارات عند تغيير حالة المشروع أو تقدمه" },
  { key: "email_approvals", label: "طلبات الاعتماد", description: "إشعارات عند وجود طلبات اعتماد جديدة أو تحديثات" },
  { key: "email_messages", label: "الرسائل", description: "إشعارات عند استلام رسائل جديدة" },
  { key: "email_invoices", label: "الفواتير", description: "إشعارات عند إصدار فواتير جديدة أو استحقاق دفعات" },
  { key: "email_marketing", label: "النشرة البريدية", description: "آخر الأخبار والعروض والتحديثات من المنصة" },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "محمد الأحمد",
    email: "m.ahmed@email.com",
    phone: "+966 50 123 4567",
    company: "بيت العطور للتجارة",
    position: "المدير التنفيذي",
    bio: "رائد أعمال في مجال العطور الفاخرة، أسست بيت العطور للتجارة منذ 5 سنوات وندير حالياً 3 براندات عطرية ناجحة في السوق الخليجي.",
    language: "ar",
    theme: "light",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email_updates: true,
    email_approvals: true,
    email_messages: true,
    email_invoices: false,
    email_marketing: false,
  });

  const handleSave = (section: string) => {
    setShowSuccessToast(`تم حفظ ${section} بنجاح`);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">الإعدادات</h1>
            <p className="text-stone-400 text-xs mt-0.5">إدارة حسابك وتفضيلاتك وإعدادات الملف الشخصي</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-arrow-right-line text-base"></i>
              العودة للوحة التحكم
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-white rounded-2xl border border-stone-100 p-1.5 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.key
                    ? "bg-amber-700 text-white"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${tab.icon} text-sm`}></i>
                </div>
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("danger")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "danger"
                  ? "bg-red-600 text-white"
                  : "text-red-500 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-error-warning-line text-sm"></i>
              </div>
              منطقة الخطر
            </button>
          </div>

          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Avatar & Cover */}
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-l from-amber-700 to-amber-900 relative">
                  <button className="absolute bottom-3 left-3 bg-black/30 hover:bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5">
                    <i className="ri-camera-line text-sm"></i>
                    تغيير الغلاف
                  </button>
                </div>
                {/* Avatar */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-amber-700 flex items-center justify-center text-white font-black text-2xl border-4 border-white">
                        م
                      </div>
                      <button className="absolute bottom-0 left-0 w-7 h-7 flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-lg cursor-pointer transition-all">
                        <i className="ri-camera-line text-xs"></i>
                      </button>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black text-stone-900">{form.fullName}</h2>
                      <p className="text-stone-400 text-sm">{form.position} — {form.company}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-stone-900">المعلومات الشخصية</h3>
                  <button
                    onClick={() => handleSave("المعلومات الشخصية")}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className="ri-check-line text-sm"></i>
                    حفظ التغييرات
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">الاسم الكامل</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">رقم الجوال</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">المسمى الوظيفي</label>
                    <input
                      type="text"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-stone-400 text-xs mb-1.5 font-bold">نبذة عنك</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-stone-900">معلومات الشركة</h3>
                  <button
                    onClick={() => handleSave("معلومات الشركة")}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className="ri-check-line text-sm"></i>
                    حفظ التغييرات
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">اسم الشركة</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">المدينة</label>
                    <input
                      type="text"
                      defaultValue="الرياض"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">الدولة</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors cursor-pointer appearance-none">
                      <option>المملكة العربية السعودية</option>
                      <option>الإمارات العربية المتحدة</option>
                      <option>الكويت</option>
                      <option>قطر</option>
                      <option>البحرين</option>
                      <option>عُمان</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">السجل التجاري</label>
                    <input
                      type="text"
                      defaultValue="1010123456"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <i className="ri-lock-line text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900">تغيير كلمة المرور</h3>
                    <p className="text-stone-400 text-xs">تحديث كلمة المرور الخاصة بحسابك</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1.5 font-bold">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setTimeout(() => setShowPasswordModal(false), 1500);
                    }}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
                  >
                    تحديث كلمة المرور
                  </button>
                </div>
              </div>

              {/* Session Info */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <i className="ri-device-line text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900">الأجهزة النشطة</h3>
                    <p className="text-stone-400 text-xs">إدارة الأجهزة المتصلة بحسابك حالياً</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { device: "MacBook Pro — Chrome", location: "الرياض، السعودية", ip: "192.168.1.1", current: true, lastActive: "الآن" },
                    { device: "iPhone 15 Pro — Safari", location: "الرياض، السعودية", ip: "192.168.1.2", current: false, lastActive: "منذ ساعتين" },
                    { device: "iPad Air — Safari", location: "جدة، السعودية", ip: "10.0.0.5", current: false, lastActive: "أمس الساعة 8:30 م" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${
                        session.current ? "bg-emerald-100 text-emerald-600" : "bg-stone-200 text-stone-500"
                      }`}>
                        <i className={`text-lg ${session.device.includes("iPhone") ? "ri-smartphone-line" : session.device.includes("iPad") ? "ri-tablet-line" : "ri-computer-line"}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-800 text-xs font-bold">{session.device}</span>
                          {session.current && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">الحالي</span>
                          )}
                        </div>
                        <div className="text-stone-400 text-xs">{session.location} • {session.lastActive}</div>
                      </div>
                      {!session.current && (
                        <button className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer whitespace-nowrap">
                          تسجيل خروج
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Security */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <i className="ri-shield-check-line text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900">التحقق بخطوتين</h3>
                    <p className="text-stone-400 text-xs">أضف طبقة حماية إضافية لحسابك</p>
                  </div>
                </div>
                <div className="max-w-md">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl mb-3">
                    <div className="flex items-center gap-2">
                      <i className="ri-smartphone-line text-stone-500 text-lg"></i>
                      <span className="text-stone-700 text-xs font-medium">تطبيق المصادقة (Google Authenticator)</span>
                    </div>
                    <button className="text-amber-700 text-xs font-bold cursor-pointer whitespace-nowrap hover:underline">
                      تفعيل
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <i className="ri-message-2-line text-stone-500 text-lg"></i>
                      <span className="text-stone-700 text-xs font-medium">رسائل SMS</span>
                    </div>
                    <button className="text-amber-700 text-xs font-bold cursor-pointer whitespace-nowrap hover:underline">
                      تفعيل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-black text-stone-900">تفضيلات الإشعارات</h3>
                    <p className="text-stone-400 text-xs mt-0.5">حدد الإشعارات التي ترغب باستلامها عبر البريد الإلكتروني</p>
                  </div>
                  <button
                    onClick={() => handleSave("تفضيلات الإشعارات")}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className="ri-check-line text-sm"></i>
                    حفظ التغييرات
                  </button>
                </div>
                <div className="space-y-1">
                  {notificationOptions.map((option) => (
                    <div key={option.key} className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-xl transition-colors">
                      <div>
                        <div className="text-stone-800 text-sm font-bold mb-0.5">{option.label}</div>
                        <div className="text-stone-400 text-xs">{option.description}</div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [option.key]: !prev[option.key as keyof typeof prev],
                          }))
                        }
                        className={`w-11 h-6 rounded-full transition-all cursor-pointer flex items-center px-0.5 ${
                          notifications[option.key as keyof typeof notifications]
                            ? "bg-amber-700"
                            : "bg-stone-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                            notifications[option.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <i className="ri-notification-3-line text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900">الإشعارات داخل المنصة</h3>
                    <p className="text-stone-400 text-xs">الإشعارات التي تظهر داخل لوحة التحكم</p>
                  </div>
                </div>
                <div className="space-y-3 max-w-md">
                  {[
                    { label: "صوت الإشعارات", desc: "تشغيل صوت عند وصول إشعار جديد" },
                    { label: "الإشعارات المنبثقة", desc: "عرض إشعار منبثق عند وصول إشعار مهم" },
                    { label: "ملخص يومي", desc: "استلام ملخص يومي للإشعارات الساعة 8 صباحاً" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                      <div>
                        <div className="text-stone-800 text-xs font-bold">{item.label}</div>
                        <div className="text-stone-400 text-xs">{item.desc}</div>
                      </div>
                      <button className="w-11 h-6 rounded-full bg-amber-700 transition-all cursor-pointer flex items-center px-0.5">
                        <div className="w-5 h-5 rounded-full bg-white shadow-sm translate-x-5"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h3 className="font-black text-stone-900 mb-5">المظهر</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
                  {[
                    { key: "light", label: "فاتح", icon: "ri-sun-line" },
                    { key: "dark", label: "داكن", icon: "ri-moon-line" },
                    { key: "system", label: "تلقائي", icon: "ri-computer-line" },
                  ].map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => setForm({ ...form, theme: theme.key })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        form.theme === theme.key
                          ? "border-amber-700 bg-amber-50"
                          : "border-stone-100 hover:border-stone-200 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                        form.theme === theme.key ? "bg-amber-700 text-white" : "bg-stone-100 text-stone-500"
                      }`}>
                        <i className={`${theme.icon} text-lg`}></i>
                      </div>
                      <span className={`text-sm font-bold ${
                        form.theme === theme.key ? "text-amber-700" : "text-stone-600"
                      }`}>
                        {theme.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h3 className="font-black text-stone-900 mb-5">اللغة</h3>
                <div className="max-w-sm">
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-400 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                  <p className="text-stone-400 text-xs mt-2">سيتم تطبيق تغيير اللغة على كامل المنصة</p>
                </div>
              </div>

              {/* Font Size */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h3 className="font-black text-stone-900 mb-5">حجم الخط</h3>
                <div className="flex items-center gap-4 max-w-md">
                  <span className="text-stone-400 text-xs">صغير</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    defaultValue="1"
                    className="flex-1 accent-amber-700 cursor-pointer"
                  />
                  <span className="text-stone-400 text-xs">كبير</span>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <i className="ri-error-warning-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900">منطقة الخطر</h3>
                    <p className="text-stone-400 text-xs">إجراءات لا يمكن التراجع عنها. يرجى التأكد قبل المتابعة</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Delete Account */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <div className="text-red-700 text-sm font-bold mb-0.5">حذف الحساب</div>
                      <div className="text-red-500 text-xs">حذف حسابك نهائياً وجميع البيانات المرتبطة به. لا يمكن التراجع عن هذا الإجراء.</div>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
                    >
                      حذف الحساب
                    </button>
                  </div>

                  {/* Export Data */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-xl">
                    <div>
                      <div className="text-stone-800 text-sm font-bold mb-0.5">تصدير البيانات</div>
                      <div className="text-stone-400 text-xs">تحميل نسخة من جميع بياناتك ومشاريعك</div>
                    </div>
                    <button className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5">
                      <i className="ri-download-line text-sm"></i>
                      تصدير
                    </button>
                  </div>

                  {/* Deactivate */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-xl">
                    <div>
                      <div className="text-stone-800 text-sm font-bold mb-0.5">تعطيل الحساب مؤقتاً</div>
                      <div className="text-stone-400 text-xs">تعطيل حسابك مع إمكانية استعادته لاحقاً</div>
                    </div>
                    <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap">
                      تعطيل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-check-line text-sm"></i>
          </div>
          {showSuccessToast}
        </div>
      )}

      {/* Password Success Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <i className="ri-check-line text-2xl"></i>
            </div>
            <h3 className="font-black text-stone-900 mb-1">تم تحديث كلمة المرور</h3>
            <p className="text-stone-400 text-sm">تم تغيير كلمة المرور بنجاح</p>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100 text-red-600">
                <i className="ri-error-warning-line text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-sm">تأكيد حذف الحساب</h3>
                <p className="text-stone-400 text-xs">هذا الإجراء لا يمكن التراجع عنه</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
              <p className="text-red-600 text-xs leading-relaxed">
                سيتم حذف حسابك وجميع المشاريع والبيانات المرتبطة به بشكل نهائي. يرجى كتابة "حذف" للتأكيد.
              </p>
            </div>

            <input
              type="text"
              placeholder='اكتب "حذف" للتأكيد'
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-red-400 transition-colors mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;