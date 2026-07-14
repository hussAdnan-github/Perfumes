import { useState } from "react";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import { settingsData } from "@/mocks/adminData";

type TabKey = "general" | "notifications" | "security" | "appearance" | "integrations";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "general", label: "عام", icon: "ri-settings-3-line" },
  { key: "notifications", label: "التنبيهات", icon: "ri-notification-3-line" },
  { key: "security", label: "الأمان", icon: "ri-shield-check-line" },
  { key: "appearance", label: "المظهر", icon: "ri-palette-line" },
  { key: "integrations", label: "التكاملات", icon: "ri-plug-line" },
];

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">الإعدادات</h1>
            <p className="text-stone-400 text-xs">إدارة إعدادات المنصة والتحكم في الخيارات</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowActivityPanel(!showActivityPanel)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all ${
                showActivityPanel
                  ? "bg-amber-100 text-amber-700"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-history-line"></i>
              </div>
              سجل النشاطات
            </button>
            <button
              onClick={handleSave}
              className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-check-line"></i>
              </div>
              حفظ التغييرات
            </button>
          </div>
        </div>

        {saved && (
          <div className="mx-8 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-check-double-line"></i>
            </div>
            تم حفظ الإعدادات بنجاح
          </div>
        )}

        <div className="p-8">
          <div className="flex gap-6">
            {/* Content Area */}
            <div className={`flex-1 transition-all ${showActivityPanel ? "lg:max-w-[calc(100%-340px)]" : ""}`}>
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

              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-black text-stone-900 text-sm mb-5">معلومات المنصة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">اسم المنصة</label>
                        <input
                          type="text"
                          defaultValue={settingsData.general.platformName}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">البريد الإلكتروني</label>
                        <input
                          type="email"
                          defaultValue={settingsData.general.email}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">وصف المنصة</label>
                        <textarea
                          defaultValue={settingsData.general.platformDescription}
                          rows={2}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">رقم الهاتف</label>
                        <input
                          type="text"
                          defaultValue={settingsData.general.phone}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">اللغة</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.general.language}</option>
                          <option>English</option>
                          <option>Français</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-black text-stone-900 text-sm mb-5">الإعدادات الإقليمية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">المنطقة الزمنية</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.general.timezone}</option>
                          <option>Asia/Dubai</option>
                          <option>Asia/Kuwait</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">صيغة التاريخ</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.general.dateFormat}</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">العملة</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.general.currency}</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-black text-stone-900 text-sm mb-1">إعدادات التنبيهات</h3>
                  <p className="text-stone-400 text-xs mb-5">تحكم في التنبيهات والإشعارات التي تصلك من المنصة</p>
                  <div className="space-y-0">
                    {[
                      { key: "emailNotifications", label: "تفعيل التنبيهات البريدية", desc: "استلام إشعارات عبر البريد الإلكتروني" },
                      { key: "orderAlerts", label: "تنبيهات الطلبات الجديدة", desc: "إشعار فوري عند استلام طلب جديد" },
                      { key: "paymentAlerts", label: "تنبيهات المدفوعات", desc: "إشعار عند استلام حوالة بنكية جديدة" },
                      { key: "teamActivityAlerts", label: "تنبيهات نشاط الفريق", desc: "إشعار عند قيام الموظفين بإجراءات مهمة" },
                      { key: "marketingEmails", label: "رسائل تسويقية", desc: "استلام عروض ونصائح تسويقية" },
                      { key: "weeklyDigest", label: "الملخص الأسبوعي", desc: "تقرير أسبوعي موجز عن أداء المنصة" },
                      { key: "monthlyReport", label: "التقرير الشهري", desc: "تقرير شهري مفصل بالإحصائيات" },
                      { key: "smsAlerts", label: "تنبيهات SMS", desc: "استلام تنبيهات عاجلة عبر الرسائل النصية" },
                    ].map((item) => {
                      const isEnabled = settingsData.notifications[item.key as keyof typeof settingsData.notifications];
                      return (
                        <div key={item.key} className="flex items-center justify-between py-4 border-b border-stone-50 last:border-b-0">
                          <div>
                            <div className="text-stone-900 text-sm font-bold">{item.label}</div>
                            <div className="text-stone-400 text-xs">{item.desc}</div>
                          </div>
                          <button
                            className={`relative w-12 h-7 rounded-full transition-all cursor-pointer ${
                              isEnabled ? "bg-emerald-500" : "bg-stone-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
                                isEnabled ? "right-0.5" : "right-5"
                              }`}
                            ></div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-black text-stone-900 text-sm mb-5">إعدادات الأمان</h3>
                    <div className="space-y-0">
                      {[
                        { key: "twoFactorAuth", label: "المصادقة الثنائية", desc: "تفعيل التحقق بخطوتين لتسجيل الدخول" },
                        { key: "ipWhitelisting", label: "قائمة IP البيضاء", desc: "تقييد الدخول لعناوين IP محددة فقط" },
                        { key: "loginAlerts", label: "تنبيهات تسجيل الدخول", desc: "إشعار عند تسجيل الدخول من جهاز جديد" },
                      ].map((item) => {
                        const isEnabled = settingsData.security[item.key as keyof typeof settingsData.security];
                        return (
                          <div key={item.key} className="flex items-center justify-between py-4 border-b border-stone-50 last:border-b-0">
                            <div>
                              <div className="text-stone-900 text-sm font-bold">{item.label}</div>
                              <div className="text-stone-400 text-xs">{item.desc}</div>
                            </div>
                            <button
                              className={`relative w-12 h-7 rounded-full transition-all cursor-pointer ${
                                typeof isEnabled === "boolean" && isEnabled ? "bg-emerald-500" : "bg-stone-300"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
                                  typeof isEnabled === "boolean" && isEnabled ? "right-0.5" : "right-5"
                                }`}
                              ></div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 pt-5 border-t border-stone-50">
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">مهلة انتهاء الجلسة</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.security.sessionTimeout}</option>
                          <option>15 دقيقة</option>
                          <option>60 دقيقة</option>
                          <option>ساعتين</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">انتهاء كلمة المرور</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all cursor-pointer">
                          <option>{settingsData.security.passwordExpiry}</option>
                          <option>30 يوماً</option>
                          <option>180 يوماً</option>
                          <option>لا تنتهي</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-500 text-xs font-bold mb-1.5">أقصى محاولات دخول</label>
                        <input
                          type="number"
                          defaultValue={settingsData.security.maxLoginAttempts}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 font-medium focus:outline-none focus:border-amber-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-black text-stone-900 text-sm mb-5">إعدادات المظهر</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-stone-500 text-xs font-bold mb-1.5">السمة</label>
                      <div className="flex gap-2">
                        {["فاتح", "داكن", "تلقائي"].map((theme) => (
                          <button
                            key={theme}
                            className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
                              settingsData.appearance.theme === theme
                                ? "bg-amber-50 border-amber-400 text-amber-700"
                                : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-500 text-xs font-bold mb-1.5">موضع القائمة الجانبية</label>
                      <div className="flex gap-2">
                        {["يمين", "يسار"].map((pos) => (
                          <button
                            key={pos}
                            className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
                              settingsData.appearance.sidebarPosition === pos
                                ? "bg-amber-50 border-amber-400 text-amber-700"
                                : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-500 text-xs font-bold mb-1.5">كثافة العرض</label>
                      <div className="flex gap-2">
                        {["مضغوط", "مريح", "واسع"].map((density) => (
                          <button
                            key={density}
                            className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
                              settingsData.appearance.density === density
                                ? "bg-amber-50 border-amber-400 text-amber-700"
                                : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                          >
                            {density}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-500 text-xs font-bold mb-1.5">حجم الخط</label>
                      <div className="flex gap-2">
                        {["صغير", "متوسط", "كبير"].map((size) => (
                          <button
                            key={size}
                            className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
                              settingsData.appearance.fontSize === size
                                ? "bg-amber-50 border-amber-400 text-amber-700"
                                : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === "integrations" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-black text-stone-900 text-sm mb-1">التكاملات والربط</h3>
                    <p className="text-stone-400 text-xs mb-5">إدارة التطبيقات والخدمات المرتبطة بالمنصة</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {settingsData.integrations.map((integration) => (
                        <div key={integration.name} className="border border-stone-100 rounded-2xl p-5 hover:border-amber-200 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50">
                              <i className={`${integration.icon} text-xl text-stone-600`}></i>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${integration.statusColor}`}>
                              {integration.status}
                            </span>
                          </div>
                          <div className="text-stone-900 text-sm font-bold mb-1">{integration.name}</div>
                          <div className="text-stone-400 text-xs mb-3">{integration.description}</div>
                          <button
                            className={`text-xs font-bold px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap transition-all ${
                              integration.status === "متصل"
                                ? "bg-stone-50 text-stone-600 hover:bg-stone-100"
                                : "bg-amber-700 text-white hover:bg-amber-600"
                            }`}
                          >
                            {integration.status === "متصل" ? "إدارة" : "ربط الآن"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Panel */}
            {showActivityPanel && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl p-5 border border-stone-100 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-stone-900 text-sm">سجل نشاط الإعدادات</h3>
                    <button
                      onClick={() => setShowActivityPanel(false)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer transition-all"
                    >
                      <i className="ri-close-line text-stone-400 text-sm"></i>
                    </button>
                  </div>
                  <div className="space-y-0">
                    {settingsData.activityLog.map((log) => (
                      <div key={log.id} className="flex gap-3 py-3 border-b border-stone-50 last:border-b-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.color}`}></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-stone-700 text-xs leading-relaxed">{log.action}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-stone-400 text-[10px]">{log.user}</span>
                            <span className="text-stone-300 text-[10px]">•</span>
                            <span className="text-stone-400 text-[10px]">{log.time}</span>
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
      </main>
    </div>
  );
};

export default AdminSettingsPage;