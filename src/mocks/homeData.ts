export const onboardingQuestions = [
  {
    id: 1,
    icon: "ri-focus-3-line",
    question: "ما هدفك الأساسي؟",
    options: ["إنشاء براند عطور كامل", "تطوير عطر فقط", "تغليف وعبوة", "هوية بصرية فقط"],
  },
  {
    id: 2,
    icon: "ri-award-line",
    question: "هل لديك براند قائم؟",
    options: ["نعم، براند قائم", "لا، أبدأ من الصفر", "في مرحلة التأسيس"],
  },
  {
    id: 3,
    icon: "ri-flask-line",
    question: "هل لديك تركيبة جاهزة؟",
    options: ["نعم، تركيبة جاهزة", "لا، أحتاج تطوير", "لدي مرجع فقط"],
  },
  {
    id: 4,
    icon: "ri-palette-line",
    question: "هل لديك تصميم أو مرجع بصري؟",
    options: ["نعم، تصميم كامل", "مراجع بصرية فقط", "لا، أحتاج تصميم"],
  },
  {
    id: 5,
    icon: "ri-stack-line",
    question: "ما الكمية المتوقعة؟",
    options: ["أقل من 500 وحدة", "500 - 2000 وحدة", "أكثر من 2000 وحدة"],
  },
  {
    id: 6,
    icon: "ri-money-dollar-circle-line",
    question: "ما الفئة السعرية؟",
    options: ["اقتصادي", "متوسط", "فاخر", "نيش / تجميعي"],
  },
];

export const workspaceModules = [
  { icon: "ri-dashboard-3-line", title: "Overview", desc: "نظرة عامة على المشروع وحالته الحالية", badge: "Project Initiated" },
  { icon: "ri-file-text-line", title: "Brief", desc: "البريف الأساسي وبيانات المشروع الكاملة", badge: null },
  { icon: "ri-folder-line", title: "Files", desc: "ملفات المشروع والمرفقات والمراجع البصرية", badge: null },
  { icon: "ri-message-3-line", title: "Messages", desc: "التواصل المباشر مع فريق المشروع", badge: "3 جديد" },
  { icon: "ri-price-tag-3-line", title: "Pricing", desc: "عروض الأسعار والفواتير والمدفوعات", badge: null },
  { icon: "ri-checkbox-circle-line", title: "Approvals", desc: "طلبات الاعتماد والموافقات المطلوبة", badge: "2 معلق" },
  { icon: "ri-time-line", title: "Timeline", desc: "الجدول الزمني ومراحل التنفيذ", badge: null },
  { icon: "ri-box-3-line", title: "3D Design", desc: "نماذج ثلاثية الأبعاد للعبوة والتغليف", badge: null },
  { icon: "ri-drop-line", title: "Formula", desc: "تركيبة العطر ونسخ التطوير والعينات", badge: null },
];

export const fragranceNotes = [
  { family: "Floral", icon: "ri-plant-line", examples: "وردة، ياسمين، زهر البرتقال" },
  { family: "Woody", icon: "ri-tree-line", examples: "عود، صندل، أرز" },
  { family: "Oriental", icon: "ri-star-line", examples: "عنبر، مسك، بخور" },
  { family: "Citrus", icon: "ri-sun-line", examples: "برتقال، ليمون، جريب فروت" },
  { family: "Amber", icon: "ri-fire-line", examples: "عنبر، فانيليا، راتنج" },
  { family: "Leather", icon: "ri-shield-line", examples: "جلد، دخان، تبغ" },
];

export const projectStatuses = [
  { label: "New Lead", color: "bg-amber-100 text-amber-800" },
  { label: "Qualified", color: "bg-emerald-100 text-emerald-800" },
  { label: "Project Initiated", color: "bg-sky-100 text-sky-800" },
  { label: "Brief In Progress", color: "bg-violet-100 text-violet-800" },
  { label: "Formula Development", color: "bg-rose-100 text-rose-800" },
  { label: "Approved Formula", color: "bg-green-100 text-green-800" },
];
