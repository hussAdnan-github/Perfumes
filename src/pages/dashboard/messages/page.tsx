import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

const conversations = [
  {
    id: "conv-001",
    name: "أحمد الزهراني",
    role: "مدير مشروع براند الفجر",
    avatar: "أ",
    avatarColor: "bg-amber-700",
    online: true,
    project: "براند الفجر",
    unread: 2,
    lastMessage: "تم الانتهاء من تجارب التركيبة الأولى، في انتظار موافقتك",
    lastTime: "الآن",
    pinned: true,
    messages: [
      { id: "m1", sender: "them", text: "السلام عليكم أستاذ محمد، معاك أحمد مدير مشروع براند الفجر", time: "10:30 ص" },
      { id: "m2", sender: "me", text: "وعليكم السلام أستاذ أحمد، أهلاً وسهلاً", time: "10:32 ص" },
      { id: "m3", sender: "them", text: "حبيت أبلغك إن فريق التطوير خلص من تجارب التركيبة الأولى. أرسلت لك الملف في المرفقات عشان تراجع وتعطيني ملاحظاتك", time: "10:35 ص" },
      { id: "m4", sender: "them", text: "النتائج كانت جداً إيجابية - الثبات وصل إلى 8 ساعات مع انتشار ممتاز على البشرة. باقي كم تعديل بسيط على النوتات العليا حسب ملاحظاتك السابقة", time: "10:36 ص" },
      { id: "m5", sender: "me", text: "ممتاز! خليني أراجع الملف وأرد عليك اليوم إن شاء الله", time: "10:40 ص" },
      { id: "m6", sender: "them", text: "تم الانتهاء من تجارب التركيبة الأولى، في انتظار موافقتك", time: "10:42 ص" },
      { id: "m7", sender: "them", text: "المرفقات:\n📎 نتائج_التجارب_الفجر_V1.pdf\n📎 تقرير_الثبات_والانتشار.xlsx", time: "10:42 ص" },
    ],
  },
  {
    id: "conv-002",
    name: "سارة المطيري",
    role: "مديرة مشروع عطر الليل",
    avatar: "س",
    avatarColor: "bg-sky-700",
    online: true,
    project: "عطر الليل",
    unread: 0,
    lastMessage: "تمام، تم إرسال العينات للعميل النهائي ✅",
    lastTime: "منذ 30 دقيقة",
    pinned: true,
    messages: [
      { id: "m1", sender: "them", text: "صباح الخير! أبشرك إن العينات وصلت من المصنع وجاهزة للشحن", time: "9:00 ص" },
      { id: "m2", sender: "me", text: "صباح النور! ممتاز والله. جودة العينات كيف؟", time: "9:05 ص" },
      { id: "m3", sender: "them", text: "ممتازة جداً، اللون والقوام والرائحة كلها مطابقة للمواصفات المطلوبة. أرسل لك صور العينات", time: "9:10 ص" },
      { id: "m4", sender: "me", text: "خلاص تمام، شحنيها للعميل وبلغيني برقم الشحنة", time: "9:15 ص" },
      { id: "m5", sender: "them", text: "تمام، تم إرسال العينات للعميل النهائي ✅", time: "9:30 ص" },
      { id: "m6", sender: "them", text: "رقم الشحنة: SHIP-2026-0894\nشركة الشحن: أرامكس\nالتسليم المتوقع: بعد غد", time: "9:32 ص" },
    ],
  },
  {
    id: "conv-003",
    name: "فهد العتيبي",
    role: "المصمم الرئيسي",
    avatar: "ف",
    avatarColor: "bg-violet-700",
    online: false,
    project: "هوية نيش",
    unread: 3,
    lastMessage: "النسخة النهائية من شعار هوية نيش جاهزة للمراجعة، بانتظارك",
    lastTime: "منذ ساعة",
    pinned: false,
    messages: [
      { id: "m1", sender: "them", text: "أستاذ محمد، خلصت من تطوير 3 مفاهيم للشعار", time: "أمس 4:00 م" },
      { id: "m2", sender: "them", text: "المفهوم الأول: خط عربي مخصص مع زخرفة نباتية\nالمفهوم الثاني: تصميم مونوجرام هندسي\nالمفهوم الثالث: دمج بين الحرف والنبات", time: "أمس 4:02 م" },
      { id: "m3", sender: "me", text: "جميل جداً! المفهوم الأول والمفهوم الثالث عجبوني. نطوّر عليهم", time: "أمس 5:30 م" },
      { id: "m4", sender: "them", text: "بإذن الله بكره أرسل لك النسخة المطورة", time: "أمس 5:45 م" },
      { id: "m5", sender: "them", text: "النسخة النهائية من شعار هوية نيش جاهزة للمراجعة، بانتظارك", time: "الآن" },
      { id: "m6", sender: "them", text: "مرفق ملفات:\n🎨 شعار_هوية_نيش_الرئيسي.png\n🎨 شعار_هوية_نيش_الفرعي.png\n🎨 دليل_الهوية_البصرية.pdf", time: "الآن" },
    ],
  },
  {
    id: "conv-004",
    name: "نورة القحطاني",
    role: "مديرة مشروع مجموعة شرقية",
    avatar: "ن",
    avatarColor: "bg-rose-700",
    online: true,
    project: "مجموعة شرقية",
    unread: 2,
    lastMessage: "استفسار عن مواصفات العبوة الزجاجية للعطر الشرقي",
    lastTime: "منذ 3 ساعات",
    pinned: false,
    messages: [
      { id: "m1", sender: "them", text: "السلام عليكم، عندي كم استفسار بخصوص العبوة الزجاجية", time: "2:00 م" },
      { id: "m2", sender: "them", text: "العميل طلب تعديل على شكل الزجاجة — يبغاها أكثر انسيابية مع إضافة نقش شرقي على الغطاء", time: "2:02 م" },
      { id: "m3", sender: "me", text: "وعليكم السلام. التعديل ممكن بس يحتاج إعادة تصميم القالب. التكلفة الإضافية حوالي ٥٠٠٠ ريال", time: "2:10 م" },
      { id: "m4", sender: "them", text: "تمام، براجع مع العميل وأرد لك", time: "2:15 م" },
      { id: "m5", sender: "them", text: "استفسار عن مواصفات العبوة الزجاجية للعطر الشرقي", time: "2:30 م" },
    ],
  },
  {
    id: "conv-005",
    name: "النظام",
    role: "إشعار تلقائي",
    avatar: "🤖",
    avatarColor: "bg-stone-600",
    online: false,
    project: "النظام",
    unread: 1,
    lastMessage: "تذكير: جلسة مراجعة العينة غداً الساعة 10:00 صباحاً",
    lastTime: "أمس",
    pinned: false,
    messages: [
      { id: "m1", sender: "them", text: "🔔 تذكير: لديك جلسة مراجعة عينة Formula V2 لمشروع براند الفجر", time: "أمس 8:00 ص" },
      { id: "m2", sender: "them", text: "📅 التاريخ: غداً (الثلاثاء)\n🕙 الوقت: 10:00 صباحاً\n📍 المكان: معمل التطوير - مبنى B\n👥 الحضور: أحمد الزهراني، محمد الأحمد، فريق التطوير", time: "أمس 8:01 ص" },
      { id: "m3", sender: "them", text: "تذكير: جلسة مراجعة العينة غداً الساعة 10:00 صباحاً", time: "أمس 8:00 ص" },
    ],
  },
  {
    id: "conv-006",
    name: "تركي الشهري",
    role: "مصمم العبوات",
    avatar: "ت",
    avatarColor: "bg-orange-700",
    online: false,
    project: "عبوة زجاجية فاخرة",
    unread: 0,
    lastMessage: "نموذج الـ 3D للعبوة الزجاجية جاهز، تقدر تشوفه في الاستوديو",
    lastTime: "منذ يومين",
    pinned: false,
    messages: [
      { id: "m1", sender: "them", text: "السلام عليكم، وصلتني مواصفات العبوة المطلوبة وبدأت العمل على النموذج ثلاثي الأبعاد", time: "السبت 11:00 ص" },
      { id: "m2", sender: "me", text: "وعليكم السلام، ممتاز. كم تحتاج وقت تقريبي؟", time: "السبت 11:30 ص" },
      { id: "m3", sender: "them", text: "حوالي 3-4 أيام عمل للنموذج الكامل مع المواد والإضاءة", time: "السبت 11:45 ص" },
      { id: "m4", sender: "them", text: "نموذج الـ 3D للعبوة الزجاجية جاهز، تقدر تشوفه في الاستوديو", time: "الإثنين 3:00 م" },
    ],
  },
  {
    id: "conv-007",
    name: "دعم فني",
    role: "فريق الدعم",
    avatar: "🎧",
    avatarColor: "bg-emerald-700",
    online: true,
    project: "الدعم الفني",
    unread: 0,
    lastMessage: "تم حل المشكلة — الرابط يعمل بشكل صحيح الآن ✅",
    lastTime: "منذ أسبوع",
    pinned: false,
    messages: [
      { id: "m1", sender: "me", text: "السلام عليكم، رابط الاستوديو ثلاثي الأبعاد ما يفتح معي", time: "الأحد 9:00 ص" },
      { id: "m2", sender: "them", text: "وعليكم السلام أستاذ محمد. خلينا نشوف المشكلة. هل يظهر لك أي رسالة خطأ؟", time: "الأحد 9:05 ص" },
      { id: "m3", sender: "me", text: "يقول Error 500", time: "الأحد 9:07 ص" },
      { id: "m4", sender: "them", text: "تمام، المشكلة في السيرفر. فريق التقنية بيصلحها خلال ١٠ دقائق إن شاء الله", time: "الأحد 9:10 ص" },
      { id: "m5", sender: "them", text: "تم حل المشكلة — الرابط يعمل بشكل صحيح الآن ✅", time: "الأحد 9:20 ص" },
    ],
  },
];

const notificationsList = [
  {
    id: "notif-1",
    type: "approval",
    icon: "ri-checkbox-circle-line",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    text: "تم اعتماد Formula V2 لمشروع براند الفجر",
    time: "منذ 30 دقيقة",
    read: false,
  },
  {
    id: "notif-2",
    type: "deadline",
    icon: "ri-alarm-line",
    color: "text-rose-500",
    bg: "bg-rose-50",
    text: "موعد تسليم مشروع مجموعة شرقية خلال 10 أيام",
    time: "منذ ساعة",
    read: false,
  },
  {
    id: "notif-3",
    type: "file",
    icon: "ri-file-text-line",
    color: "text-amber-500",
    bg: "bg-amber-50",
    text: "فهد العتيبي رفع ملفات التصميم النهائية لمشروع هوية نيش",
    time: "منذ ساعتين",
    read: true,
  },
  {
    id: "notif-4",
    type: "meeting",
    icon: "ri-calendar-check-line",
    color: "text-sky-500",
    bg: "bg-sky-50",
    text: "تأكيد جلسة مراجعة العينة غداً الساعة 10 صباحاً",
    time: "منذ 3 ساعات",
    read: true,
  },
  {
    id: "notif-5",
    type: "update",
    icon: "ri-refresh-line",
    color: "text-violet-500",
    bg: "bg-violet-50",
    text: "تحديث: تم نقل مشروع عطر الليل إلى مرحلة الإنتاج",
    time: "أمس",
    read: true,
  },
  {
    id: "notif-6",
    type: "message",
    icon: "ri-message-3-line",
    color: "text-sky-500",
    bg: "bg-sky-50",
    text: "رسالة جديدة من أحمد الزهراني بخصوص براند الفجر",
    time: "أمس",
    read: true,
  },
  {
    id: "notif-7",
    type: "system",
    icon: "ri-settings-3-line",
    color: "text-stone-500",
    bg: "bg-stone-100",
    text: "تحديث نظام: إضافة ميزة التوقيع الإلكتروني للاعتمادات",
    time: "منذ يومين",
    read: true,
  },
  {
    id: "notif-8",
    type: "payment",
    icon: "ri-money-dollar-circle-line",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    text: "تم استلام الدفعة الأولى من مشروع مسك الأصالة",
    time: "منذ 3 أيام",
    read: true,
  },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("conv-001");
  const [messageInput, setMessageInput] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "projects" | "system">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  const filteredConversations = conversations.filter((c) => {
    if (searchQuery && !c.name.includes(searchQuery) && !c.project.includes(searchQuery) && !c.lastMessage.includes(searchQuery)) {
      return false;
    }
    if (filterType === "unread" && c.unread === 0) return false;
    if (filterType === "projects" && c.project === "النظام" && c.project === "الدعم الفني") return false;
    if (filterType === "system" && c.project !== "النظام" && c.project !== "الدعم الفني") return false;
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const totalNotifications = notificationsList.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-stone-900">الرسائل</h1>
              {totalUnread > 0 && (
                <span className="bg-amber-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {totalUnread} غير مقروءة
                </span>
              )}
            </div>
            <p className="text-stone-400 text-xs mt-0.5">صندوق الوارد وإدارة المحادثات</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                showNotifications ? "bg-amber-100 text-amber-700" : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              <i className="ri-notification-3-line text-base"></i>
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2">
              <i className="ri-edit-line"></i>
              رسالة جديدة
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List Sidebar */}
          <div className="w-80 lg:w-96 border-l border-stone-100 bg-white flex flex-col flex-shrink-0">
            {/* Search & Filters */}
            <div className="p-4 space-y-3">
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-stone-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="ابحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="flex gap-1.5 bg-stone-50 rounded-xl p-1">
                {[
                  { key: "all" as const, label: "الكل", count: conversations.length },
                  { key: "unread" as const, label: "غير مقروءة", count: totalUnread },
                  { key: "projects" as const, label: "المشاريع", count: conversations.filter((c) => c.project !== "النظام" && c.project !== "الدعم الفني").length },
                  { key: "system" as const, label: "النظام", count: conversations.filter((c) => c.project === "النظام" || c.project === "الدعم الفني").length },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilterType(f.key)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterType === f.key
                        ? "bg-white text-stone-800 shadow-sm"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {f.label}
                    <span className="block text-[10px] opacity-60">{f.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-stone-100 rounded-xl">
                    <i className="ri-chat-off-line text-stone-400 text-xl"></i>
                  </div>
                  <p className="text-stone-600 font-bold text-sm mb-1">لا توجد محادثات</p>
                  <p className="text-stone-400 text-xs">جرب تغيير الفلتر أو معايير البحث</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = selectedConversation === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-right px-4 py-3 flex items-start gap-3 transition-all cursor-pointer border-b border-stone-50 ${
                        isActive ? "bg-amber-50 border-r-2 border-r-amber-700" : "hover:bg-stone-50"
                      }`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 relative ${conv.avatarColor} text-white font-bold text-sm`}>
                        {conv.avatar}
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-stone-900 text-sm truncate">{conv.name}</span>
                            {conv.pinned && (
                              <i className="ri-pushpin-2-fill text-amber-500 text-xs flex-shrink-0"></i>
                            )}
                          </div>
                          <span className="text-stone-400 text-xs whitespace-nowrap ml-2">{conv.lastTime}</span>
                        </div>
                        <div className="text-stone-400 text-xs mb-1">{conv.project}</div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs truncate ${conv.unread > 0 ? "text-stone-700 font-medium" : "text-stone-400"}`}>
                            {conv.lastMessage}
                          </span>
                          {conv.unread > 0 && (
                            <span className="bg-amber-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold flex-shrink-0 mr-2">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 bg-white border-b border-stone-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${currentConversation.avatarColor} text-white font-bold text-sm`}>
                      {currentConversation.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-stone-900 text-sm">{currentConversation.name}</h3>
                        {currentConversation.online && (
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-stone-400 text-xs">
                        {currentConversation.role} · {currentConversation.project}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                      <i className="ri-search-line text-sm"></i>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                      <i className="ri-phone-line text-sm"></i>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                      <i className="ri-attachment-line text-sm"></i>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer">
                      <i className="ri-more-line text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {currentConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.sender === "me"
                            ? "bg-amber-700 text-white rounded-bl-2xl"
                            : "bg-stone-100 text-stone-800 rounded-br-2xl"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <span
                          className={`text-xs block mt-1.5 ${
                            msg.sender === "me" ? "text-white/60" : "text-stone-400"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Today marker */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-stone-100"></div>
                    <span className="text-stone-400 text-xs whitespace-nowrap">اليوم</span>
                    <div className="flex-1 h-px bg-stone-100"></div>
                  </div>
                </div>

                {/* Reply Input */}
                <div className="p-4 bg-white border-t border-stone-100 flex-shrink-0">
                  <div className="flex items-end gap-3">
                    <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer flex-shrink-0">
                      <i className="ri-emotion-line text-base"></i>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer flex-shrink-0">
                      <i className="ri-mic-line text-base"></i>
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        rows={1}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 pr-4 pl-10 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 transition-colors resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setMessageInput("");
                          }
                        }}
                      />
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-400 transition-all cursor-pointer">
                        <i className="ri-attachment-2 text-base"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => setMessageInput("")}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-700 hover:bg-amber-600 text-white transition-all cursor-pointer flex-shrink-0"
                    >
                      <i className="ri-send-plane-fill text-base"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center bg-amber-50 rounded-full">
                    <i className="ri-message-3-line text-amber-700 text-3xl"></i>
                  </div>
                  <h2 className="text-xl font-black text-stone-900 mb-2">صندوق الوارد</h2>
                  <p className="text-stone-400 text-sm mb-6">اختر محادثة من القائمة لعرض الرسائل</p>
                  <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all">
                    بدء محادثة جديدة
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="w-80 border-r border-stone-100 bg-white overflow-y-auto flex-shrink-0 shadow-lg">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-black text-stone-900 text-sm">التنبيهات</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
              <div className="divide-y divide-stone-50">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                      n.read ? "opacity-70" : "bg-amber-50/40"
                    }`}
                  >
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${n.bg}`}>
                      <i className={`${n.icon} ${n.color} text-sm`}></i>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs leading-relaxed mb-1 ${n.read ? "text-stone-500" : "text-stone-800 font-medium"}`}>
                        {n.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-[10px]">{n.time}</span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;