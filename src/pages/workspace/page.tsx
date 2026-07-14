import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BriefModule from "@/pages/workspace/components/BriefModule";
import { useAuth } from "@/hooks/useAuth";

type Module = "Overview" | "Timeline" | "Brief" | "Concept" | "Formula" | "Identity" | "Packaging" | "3D Preview" | "Pricing" | "Approvals" | "Files" | "Messages" | "Delivery" | "Reorder";

const modules: { icon: string; title: Module; desc: string; badge?: string; link?: string; step: number }[] = [
  { step: 1,  icon: "ri-dashboard-3-line",    title: "Overview",   desc: "نظرة عامة على المشروع" },
  { step: 2,  icon: "ri-time-line",           title: "Timeline",   desc: "الجدول الزمني" },
  { step: 3,  icon: "ri-file-text-line",      title: "Brief",      desc: "البريف الأساسي" },
  { step: 4,  icon: "ri-lightbulb-line",      title: "Concept",    desc: "استراتيجية البراند" },
  { step: 5,  icon: "ri-drop-line",           title: "Formula",    desc: "تركيبة العطر" },
  { step: 6,  icon: "ri-palette-line",        title: "Identity",   desc: "الهوية البصرية" },
  { step: 7,  icon: "ri-gift-2-line",         title: "Packaging",  desc: "العبوة والتغليف",  link: "/packaging-customizer" },
  { step: 8,  icon: "ri-box-3-line",          title: "3D Preview", desc: "معاينة ثلاثية الأبعاد", link: "/studio-3d" },
  { step: 9,  icon: "ri-price-tag-3-line",    title: "Pricing",    desc: "عروض الأسعار",  link: "/pricing" },
  { step: 10, icon: "ri-checkbox-circle-line",title: "Approvals",  desc: "طلبات الاعتماد", badge: "2 معلق", link: "/dashboard/approvals" },
  { step: 11, icon: "ri-folder-line",         title: "Files",      desc: "ملفات المشروع" },
  { step: 12, icon: "ri-message-3-line",      title: "Messages",   desc: "التواصل مع الفريق", badge: "3 جديد" },
  { step: 13, icon: "ri-truck-line",          title: "Delivery",   desc: "التسليم",  link: "/production" },
  { step: 14, icon: "ri-refresh-line",        title: "Reorder",    desc: "إعادة الطلب",  link: "/after-sales" },
];

const messages = [
  { sender: "أحمد الزهراني", role: "مدير المشروع", time: "10:30 ص", text: "تم الانتهاء من تطوير Formula V2. يرجى مراجعتها وإرسال تقييمك.", avatar: "أ", isTeam: true },
  { sender: "أنت", role: "العميل", time: "11:15 ص", text: "شكراً أحمد. سأراجعها اليوم وأرسل التقييم.", avatar: "م", isTeam: false },
  { sender: "سارة المطيري", role: "مصممة الهوية", time: "12:00 م", text: "تم رفع مقترحات الشعار الثلاثة في قسم الملفات. في انتظار ملاحظاتك.", avatar: "س", isTeam: true },
  { sender: "أنت", role: "العميل", time: "2:30 م", text: "رائع! سأراجعها وأعطيكم ملاحظاتي قريباً.", avatar: "م", isTeam: false },
];

const timelineStages = [
  { stage: "استراتيجية البراند", status: "completed", date: "1 يناير 2024", duration: "أسبوعان" },
  { stage: "تطوير العطر", status: "completed", date: "15 يناير 2024", duration: "3 أسابيع" },
  { stage: "العينات والتقييم", status: "active", date: "5 فبراير 2024", duration: "أسبوعان" },
  { stage: "الهوية البصرية", status: "pending", date: "20 فبراير 2024", duration: "3 أسابيع" },
  { stage: "تصميم التغليف", status: "pending", date: "15 مارس 2024", duration: "أسبوعان" },
  { stage: "التصنيع", status: "pending", date: "1 أبريل 2024", duration: "4 أسابيع" },
];

const approvals = [
  { title: "اعتماد Brand Positioning", status: "pending", date: "منذ يومين", desc: "يرجى مراجعة وثيقة تموضع البراند والموافقة عليها للمتابعة" },
  { title: "اعتماد Formula V2", status: "pending", date: "منذ ساعة", desc: "نسخة محسّنة من التركيبة العطرية جاهزة للاعتماد" },
  { title: "اعتماد مقترح الشعار A", status: "approved", date: "منذ 3 أيام", desc: "تم اعتماد مقترح الشعار الأول" },
];

const WorkspacePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<Module>("Overview");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: "أنت", role: "العميل", time: "الآن", text: newMessage, avatar: "م", isTeam: false },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 min-h-screen flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="cursor-pointer block">
            <img
              src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
              alt="شعار المنصة"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Project Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-xl flex-shrink-0">
              <i className="ri-drop-line text-white text-lg"></i>
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-bold truncate">براند الفجر</div>
              <div className="text-white/40 text-xs">#PRJ-2024-001</div>
            </div>
          </div>
          <span className="inline-block bg-amber-700/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
            Formula Development
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {modules.map((mod) => (
            <button
              key={mod.title}
              onClick={() => { if (mod.link) { navigate(mod.link); } else { setActiveModule(mod.title); } }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-right ${
                activeModule === mod.title
                  ? "bg-amber-700 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${mod.icon} text-sm`}></i>
                </div>
                <span className="text-xs">{mod.step}. {mod.title}</span>
              </div>
              {mod.badge && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {mod.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back */}
        <div className="p-4 border-t border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-right-line text-base"></i>
            </div>
            <span>العودة للداشبورد</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-black text-stone-900">{activeModule}</h2>
            <p className="text-stone-400 text-xs">{modules.find((m) => m.title === activeModule)?.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors">
              <i className="ri-notification-3-line text-stone-600 text-base"></i>
            </button>
            {user && (
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                title="تسجيل الخروج"
              >
                <i className="ri-logout-box-line text-stone-500 hover:text-red-500 text-base"></i>
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* OVERVIEW */}
          {activeModule === "Overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "حالة المشروع", value: "Formula Development", icon: "ri-flag-line", color: "text-rose-600 bg-rose-50" },
                  { label: "نسبة الإنجاز", value: "55%", icon: "ri-pie-chart-line", color: "text-amber-600 bg-amber-50" },
                  { label: "الفريق المعين", value: "3 أعضاء", icon: "ri-team-line", color: "text-emerald-600 bg-emerald-50" },
                  { label: "الموعد المتوقع", value: "مايو 2024", icon: "ri-calendar-line", color: "text-sky-600 bg-sky-50" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${item.color}`}>
                      <i className={`${item.icon} text-lg`}></i>
                    </div>
                    <div className="text-xs text-stone-400 mb-1">{item.label}</div>
                    <div className="font-bold text-stone-800 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 mb-6">
                <h3 className="font-black text-stone-900 mb-4">تقدم المشروع</h3>
                <div className="w-full bg-stone-100 rounded-full h-3 mb-2">
                  <div className="bg-amber-600 h-3 rounded-full" style={{ width: "55%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>البداية</span>
                  <span className="font-bold text-amber-700">55% مكتمل</span>
                  <span>الإطلاق</span>
                </div>
              </div>

              {/* Team */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 mb-4">فريق المشروع</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "أحمد الزهراني", role: "مدير المشروع", avatar: "أ", color: "bg-amber-700" },
                    { name: "سارة المطيري", role: "مصممة الهوية", avatar: "س", color: "bg-rose-700" },
                    { name: "خالد العمري", role: "خبير العطور", avatar: "خ", color: "bg-emerald-700" },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <div className={`w-10 h-10 flex items-center justify-center ${member.color} rounded-full text-white font-bold text-sm flex-shrink-0`}>
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{member.name}</div>
                        <div className="text-stone-400 text-xs">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeModule === "Messages" && (
            <div className="flex flex-col h-[calc(100vh-200px)]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${!msg.isTeam ? "flex-row-reverse" : ""}`}>
                    <div className={`w-9 h-9 flex items-center justify-center rounded-full text-white font-bold text-sm flex-shrink-0 ${
                      msg.isTeam ? "bg-amber-700" : "bg-stone-700"
                    }`}>
                      {msg.avatar}
                    </div>
                    <div className={`max-w-md ${!msg.isTeam ? "items-end" : ""} flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-stone-700 text-xs font-bold">{msg.sender}</span>
                        <span className="text-stone-400 text-xs">{msg.role}</span>
                        <span className="text-stone-300 text-xs">{msg.time}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.isTeam
                          ? "bg-white border border-stone-100 text-stone-700"
                          : "bg-amber-700 text-white"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 bg-white rounded-2xl p-3 border border-stone-200">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 flex items-center justify-center bg-amber-700 hover:bg-amber-600 text-white rounded-xl cursor-pointer transition-colors flex-shrink-0"
                >
                  <i className="ri-send-plane-fill text-base"></i>
                </button>
              </div>
            </div>
          )}

          {/* TIMELINE */}
          {activeModule === "Timeline" && (
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 mb-6">الجدول الزمني للمشروع</h3>
              <div className="space-y-4">
                {timelineStages.map((stage, i) => (
                  <div key={stage.stage} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                        stage.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                        stage.status === "active" ? "bg-amber-100 text-amber-600" :
                        "bg-stone-100 text-stone-400"
                      }`}>
                        {stage.status === "completed" ? (
                          <i className="ri-check-line text-lg"></i>
                        ) : stage.status === "active" ? (
                          <i className="ri-loader-4-line text-lg animate-spin"></i>
                        ) : (
                          <span className="text-sm font-bold">{i + 1}</span>
                        )}
                      </div>
                      {i < timelineStages.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${
                          stage.status === "completed" ? "bg-emerald-200" : "bg-stone-200"
                        }`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-sm ${
                          stage.status === "pending" ? "text-stone-400" : "text-stone-900"
                        }`}>{stage.stage}</h4>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          stage.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          stage.status === "active" ? "bg-amber-100 text-amber-700" :
                          "bg-stone-100 text-stone-500"
                        }`}>
                          {stage.status === "completed" ? "مكتمل" : stage.status === "active" ? "جاري" : "قادم"}
                        </span>
                      </div>
                      <div className="text-stone-400 text-xs mt-1">{stage.date} • {stage.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPROVALS */}
          {activeModule === "Approvals" && (
            <div className="space-y-4">
              {approvals.map((approval, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 border-2 ${
                  approval.status === "pending" ? "border-amber-200" : "border-emerald-200"
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-black text-stone-900 mb-1">{approval.title}</h4>
                      <p className="text-stone-500 text-sm">{approval.desc}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      approval.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {approval.status === "pending" ? "معلق" : "معتمد"}
                    </span>
                  </div>
                  <div className="text-stone-400 text-xs mb-4">{approval.date}</div>
                  {approval.status === "pending" && (
                    <div className="flex gap-3">
                      <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                        اعتماد
                      </button>
                      <button className="flex-1 border border-stone-200 hover:border-red-300 text-stone-600 hover:text-red-600 font-semibold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                        طلب تعديل
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FILES */}
          {activeModule === "Files" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-stone-900">ملفات المشروع</h3>
                <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2">
                  <i className="ri-upload-line"></i>
                  رفع ملف
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Brand_Positioning.pdf", size: "2.4 MB", type: "PDF", date: "15 يناير", icon: "ri-file-pdf-line", color: "text-red-500 bg-red-50" },
                  { name: "Logo_Proposals.ai", size: "8.1 MB", type: "AI", date: "20 يناير", icon: "ri-file-edit-line", color: "text-orange-500 bg-orange-50" },
                  { name: "Formula_V2.xlsx", size: "0.8 MB", type: "XLSX", date: "22 يناير", icon: "ri-file-excel-line", color: "text-emerald-500 bg-emerald-50" },
                  { name: "Packaging_3D.zip", size: "45 MB", type: "ZIP", date: "25 يناير", icon: "ri-file-zip-line", color: "text-amber-500 bg-amber-50" },
                  { name: "Brief_Final.docx", size: "1.2 MB", type: "DOCX", date: "10 يناير", icon: "ri-file-word-line", color: "text-sky-500 bg-sky-50" },
                  { name: "Moodboard.jpg", size: "5.6 MB", type: "JPG", date: "12 يناير", icon: "ri-image-line", color: "text-violet-500 bg-violet-50" },
                ].map((file) => (
                  <div key={file.name} className="bg-white rounded-2xl p-4 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${file.color}`}>
                        <i className={`${file.icon} text-lg`}></i>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 text-sm truncate">{file.name}</div>
                        <div className="text-stone-400 text-xs">{file.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{file.date}</span>
                      <button className="text-amber-700 hover:text-amber-600 font-bold cursor-pointer transition-colors">
                        تحميل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING */}
          {activeModule === "Pricing" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-black text-stone-900 mb-4">ملخص التسعير</h3>
                <div className="space-y-3 mb-6">
                  {[
                    { item: "استراتيجية البراند", price: "15,000", status: "مدفوع" },
                    { item: "تطوير العطر (3 نسخ)", price: "20,000", status: "مدفوع" },
                    { item: "الهوية البصرية", price: "12,000", status: "معلق" },
                    { item: "تصميم التغليف", price: "8,000", status: "معلق" },
                    { item: "التصنيع (1000 وحدة)", price: "35,000", status: "لم يبدأ" },
                  ].map((row) => (
                    <div key={row.item} className="flex items-center justify-between py-3 border-b border-stone-100">
                      <span className="text-stone-700 text-sm">{row.item}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-stone-900 text-sm">{row.price} ريال</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          row.status === "مدفوع" ? "bg-emerald-100 text-emerald-700" :
                          row.status === "معلق" ? "bg-amber-100 text-amber-700" :
                          "bg-stone-100 text-stone-500"
                        }`}>{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-black text-stone-900">الإجمالي</span>
                  <span className="font-black text-amber-700 text-xl">90,000 ريال</span>
                </div>
              </div>
              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                دفع الدفعة القادمة
              </button>
            </div>
          )}

          {/* BRIEF */}
          {activeModule === "Brief" && <BriefModule />}

          {/* DEFAULT for other modules */}
          {!["Overview", "Messages", "Timeline", "Approvals", "Files", "Pricing", "Brief", "Concept", "Formula", "Identity", "3D Preview", "Delivery", "Reorder", "Packaging"].includes(activeModule) && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl mb-4">
                <i className={`${modules.find((m) => m.title === activeModule)?.icon} text-amber-600 text-2xl`}></i>
              </div>
              <h4 className="text-stone-700 font-bold mb-2">{activeModule}</h4>
              <p className="text-stone-400 text-sm max-w-xs">
                {modules.find((m) => m.title === activeModule)?.desc}
              </p>
              <button className="mt-6 bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-6 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all">
                فتح القسم
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
