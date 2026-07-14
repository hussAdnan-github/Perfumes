import { useState } from "react";
import { Link } from "react-router-dom";

interface WorkflowStep {
  id: string;
  num: number;
  phase: string;
  phaseAr: string;
  icon: string;
  status: "lead" | "development" | "approval" | "production" | "delivery";
  gate?: { num: number; title: string; titleAr: string };
  statusLabel: string;
  statusLabelAr: string;
  actors: { role: string; action: string; type: "primary" | "secondary" }[];
  automations: string[];
  outputs: string[];
  checkpoint: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "lead-capture",
    num: 1,
    phase: "Lead Capture",
    phaseAr: "دخول العميل",
    icon: "ri-user-add-line",
    status: "lead",
    statusLabel: "New Lead",
    statusLabelAr: "عميل جديد",
    actors: [
      { role: "العميل", action: "يدخل المنصة ويستكشف", type: "primary" },
      { role: "AI", action: "يرحب ويبدأ التشخيص", type: "secondary" },
    ],
    automations: ["ترحيب تلقائي", "بدء Onboarding تفاعلي"],
    outputs: ["ملف عميل مبدئي", "إجابات تشخيصية أولية"],
    checkpoint: "هل أكمل العميل الخطوات الأولى؟",
  },
  {
    id: "ai-qualification",
    num: 2,
    phase: "AI Qualification",
    phaseAr: "التصنيف الذكي",
    icon: "ri-robot-2-line",
    status: "lead",
    gate: { num: 1, title: "Qualification Gate", titleAr: "بوابة التأهيل" },
    statusLabel: "Qualified",
    statusLabelAr: "مؤهل",
    actors: [
      { role: "AI", action: "يصنف الطلب ويقترح المسار", type: "primary" },
      { role: "مدير المشروع", action: "يراقب ويراجع", type: "secondary" },
    ],
    automations: ["تصنيف الطلب (مقبول / يحتاج معلومات / استشارة / مرفوض)", "اقتراح Service Path"],
    outputs: ["توصية بالمسار", "تصنيف أولي", "Checklist مبدئية"],
    checkpoint: "هل الطلب واضح وقابل للتنفيذ؟",
  },
  {
    id: "service-path",
    num: 3,
    phase: "Service Path Selection",
    phaseAr: "اختيار المسار",
    icon: "ri-compass-3-line",
    status: "lead",
    statusLabel: "Project Initiated",
    statusLabelAr: "مشروع مُنشأ",
    actors: [
      { role: "العميل", action: "يختار الخدمة المناسبة", type: "primary" },
      { role: "مدير المشروع", action: "يعتمد المسار ويخصص الفريق", type: "secondary" },
    ],
    automations: ["إنشاء Project ID", "فتح Workspace", "تحميل Workflow Template"],
    outputs: ["مشروع جديد", "Workspace مخصص", "فريق معيّن"],
    checkpoint: "هل تم اختيار الخدمة وتفعيل المسار؟",
  },
  {
    id: "workspace-creation",
    num: 4,
    phase: "Workspace Creation",
    phaseAr: "إنشاء مساحة العمل",
    icon: "ri-dashboard-3-line",
    status: "development",
    statusLabel: "Project Initiated",
    statusLabelAr: "مشروع مُنشأ",
    actors: [
      { role: "AI", action: "يهيئ الـ Workspace تلقائياً", type: "primary" },
      { role: "العميل", action: "يستعرض المساحة المخصصة", type: "secondary" },
    ],
    automations: ["إنشاء 14 وحدة عمل", "توزيع الأدوار", "إرسال إشعار ترحيب"],
    outputs: ["Workspace بــ 14 وحدة", "فريق معيّن", "جدول زمني أولي"],
    checkpoint: "هل الـ Workspace جاهز بكامل وحداته؟",
  },
  {
    id: "brief-collection",
    num: 5,
    phase: "General Brief Collection",
    phaseAr: "جمع البريف العام",
    icon: "ri-file-text-line",
    status: "development",
    statusLabel: "Brief In Progress",
    statusLabelAr: "البريف قيد الإعداد",
    actors: [
      { role: "العميل", action: "يعبئ نموذج البريف", type: "primary" },
      { role: "AI", action: "يولّد Brief منظّم ويطرح أسئلة", type: "primary" },
    ],
    automations: ["توليد أسئلة ذكية حسب المسار", "رصد البيانات الناقصة", "إرسال تذكيرات"],
    outputs: ["Brief أولي", "قائمة بيانات ناقصة"],
    checkpoint: "هل البريف يحتوي على الحد الأدنى من البيانات؟",
  },
  {
    id: "internal-validation",
    num: 6,
    phase: "Internal Validation",
    phaseAr: "التحقق الداخلي",
    icon: "ri-check-double-line",
    status: "development",
    gate: { num: 2, title: "Brief Completion Gate", titleAr: "بوابة اكتمال البريف" },
    statusLabel: "Ready for Service Path",
    statusLabelAr: "جاهز للمسار",
    actors: [
      { role: "مدير المشروع", action: "يراجع البريف ويعتمد الجاهزية", type: "primary" },
      { role: "AI", action: "يؤكد اكتمال البيانات الأساسية", type: "secondary" },
    ],
    automations: ["قفل البريف بعد الاعتماد", "إشعار عند نقص البيانات", "إيقاف الانتقال حتى الاكتمال"],
    outputs: ["Brief معتمد", "إذن بدء العمل"],
    checkpoint: "هل البريف مكتمل بما يكفي لبدء العمل الفعلي؟",
  },
  {
    id: "specialized-brief",
    num: 7,
    phase: "Specialized Brief",
    phaseAr: "البريف المتخصص",
    icon: "ri-file-search-line",
    status: "development",
    statusLabel: "Concept Development",
    statusLabelAr: "تطوير المفهوم",
    actors: [
      { role: "خبير العطور", action: "يجمع التوجهات العطرية", type: "primary" },
      { role: "المصمم", action: "يجمع التوجهات البصرية", type: "primary" },
      { role: "العميل", action: "يحدد التوجهات والمراجع", type: "secondary" },
    ],
    automations: ["إنشاء أسئلة متخصصة حسب المسار (A/B/C/D/E/F)", "توجيه لبريف العطور أو التصميم"],
    outputs: ["بريف عطري", "بريف بصري", "بريف تعبوي"],
    checkpoint: "هل تم تحديد التوجهات الثلاثة الرئيسية؟",
  },
  {
    id: "concept-development",
    num: 8,
    phase: "Concept Development",
    phaseAr: "تطوير المفهوم",
    icon: "ri-lightbulb-line",
    status: "development",
    gate: { num: 3, title: "Concept Approval Gate", titleAr: "بوابة اعتماد المفهوم" },
    statusLabel: "Concept Development",
    statusLabelAr: "تطوير المفهوم",
    actors: [
      { role: "خبير العطور", action: "يطور التوجه العطري", type: "primary" },
      { role: "المصمم", action: "يعد Moodboard بصري", type: "primary" },
      { role: "مدير المشروع", action: "ينسق ويعرض على العميل", type: "secondary" },
    ],
    automations: ["إنشاء Brand Positioning Draft", "جدولة جلسة عرض المفهوم"],
    outputs: ["وثيقة Brand Positioning", "Moodboard بصري", "توجه عطري أولي"],
    checkpoint: "هل تم اعتماد الاتجاه العام للمشروع؟",
  },
  {
    id: "formula-dev",
    num: 9,
    phase: "Formula Development",
    phaseAr: "تطوير التركيبة",
    icon: "ri-drop-line",
    status: "development",
    statusLabel: "Formula Development",
    statusLabelAr: "تطوير التركيبة",
    actors: [
      { role: "خبير العطور", action: "يطور تركيبة V1", type: "primary" },
      { role: "AI", action: "يقترح نوتات وعائلات عطرية", type: "secondary" },
    ],
    automations: ["إنشاء Formula Version 1", "قفل نسخة التركيبة بعد الاعتماد", "تحويلها لمرجع تسعيري"],
    outputs: ["Formula V1", "بطاقة نوتات", "تقرير تقييم أولي"],
    checkpoint: "هل التركيبة قابلة للانتقال لمرحلة العينات؟",
  },
  {
    id: "identity-dev",
    num: 10,
    phase: "Identity Design",
    phaseAr: "تصميم الهوية البصرية",
    icon: "ri-palette-line",
    status: "development",
    statusLabel: "Identity Design",
    statusLabelAr: "تصميم الهوية",
    actors: [
      { role: "المصمم", action: "يطور الشعار والهوية", type: "primary" },
      { role: "العميل", action: "يختار من المقترحات", type: "secondary" },
    ],
    automations: ["إنشاء Moodboard", "رفع مقترحات الشعار تلقائياً", "قفل النسخة المعتمدة"],
    outputs: ["شعار (3 مقترحات)", "دليل الهوية", "لوحة ألوان وخطوط"],
    checkpoint: "هل تم اعتماد الشعار والهوية؟",
  },
  {
    id: "packaging-dev",
    num: 11,
    phase: "Packaging Design",
    phaseAr: "تصميم التغليف",
    icon: "ri-gift-2-line",
    status: "development",
    statusLabel: "Packaging Design",
    statusLabelAr: "تصميم التغليف",
    actors: [
      { role: "المصمم", action: "يصمم العبوة والاستيكر", type: "primary" },
      { role: "فريق الإنتاج", action: "يراجع قابلية التنفيذ", type: "secondary" },
    ],
    automations: ["إنشاء Bottle Spec", "إنشاء Label Spec", "توليد ملفات تنفيذية"],
    outputs: ["تصميم عبوة", "تصميم استيكر", "ملف مقاسات وخامات"],
    checkpoint: "هل اكتملت المقاسات والخامات للمراجعة الثلاثية؟",
  },
  {
    id: "client-review",
    num: 12,
    phase: "Client Review Cycle",
    phaseAr: "دورة المراجعة",
    icon: "ri-eye-line",
    status: "development",
    statusLabel: "Sampling",
    statusLabelAr: "العينات",
    actors: [
      { role: "العميل", action: "يراجع العينات والتصاميم", type: "primary" },
      { role: "مدير المشروع", action: "ينسق التعديلات", type: "secondary" },
    ],
    automations: ["إرسال نموذج تقييم للعميل", "جدولة جلسة مراجعة"],
    outputs: ["تقييم كتابي", "قائمة تعديلات", "عينة معتمدة"],
    checkpoint: "هل تم اعتماد عينة واحدة على الأقل؟",
  },
  {
    id: "3d-validation",
    num: 13,
    phase: "3D / Mockup Validation",
    phaseAr: "التحقق ثلاثي الأبعاد",
    icon: "ri-box-3-line",
    status: "approval",
    gate: { num: 4, title: "Technical Feasibility Gate", titleAr: "بوابة الجدوى التقنية" },
    statusLabel: "3D Review",
    statusLabelAr: "مراجعة ثلاثية الأبعاد",
    actors: [
      { role: "المصمم", action: "يولّد تصورات 3D", type: "primary" },
      { role: "العميل", action: "يراجع ويعتمد الشكل النهائي", type: "primary" },
      { role: "فريق الإنتاج", action: "يؤكد الجدوى التقنية", type: "secondary" },
    ],
    automations: ["توليد 3D Draft تلقائي", "إرسال للمراجعة", "قفل التصميم النهائي"],
    outputs: ["3D Mockup نهائي", "تقرير جدوى تقنية", "اعتماد الشكل النهائي"],
    checkpoint: "هل التصميم والعبوة والمقاسات قابلة للتنفيذ فعلياً؟",
  },
  {
    id: "costing-pricing",
    num: 14,
    phase: "Costing & Pricing",
    phaseAr: "التكاليف والتسعير",
    icon: "ri-price-tag-3-line",
    status: "approval",
    statusLabel: "Pricing",
    statusLabelAr: "التسعير",
    actors: [
      { role: "فريق الإنتاج", action: "يمد بالتكاليف الفعلية", type: "primary" },
      { role: "الإدارة المالية", action: "يعتمد السعر النهائي", type: "primary" },
      { role: "AI", action: "يحسب تقديرياً", type: "secondary" },
    ],
    automations: ["حساب تكاليف الوحدة تلقائياً", "توليد Quotation", "مقارنة بالميزانية"],
    outputs: ["عرض سعر تفصيلي", "فاتورة أولية", "تفصيل تكاليف"],
    checkpoint: "هل تم إصدار عرض السعر الرسمي؟",
  },
  {
    id: "commercial-approval",
    num: 15,
    phase: "Commercial Approval",
    phaseAr: "الموافقة التجارية",
    icon: "ri-exchange-dollar-line",
    status: "approval",
    gate: { num: 5, title: "Commercial Approval Gate", titleAr: "بوابة الموافقة التجارية" },
    statusLabel: "Awaiting Approval",
    statusLabelAr: "في انتظار الموافقة",
    actors: [
      { role: "العميل", action: "يوافق على السعر والنطاق", type: "primary" },
      { role: "الإدارة المالية", action: "تجهز الفاتورة", type: "secondary" },
    ],
    automations: ["إرسال عرض السعر للعميل", "تتبع نقاط الاعتماد", "تفعيل خيارات التفاوض"],
    outputs: ["موافقة تجارية", "نطاق نهائي", "فاتورة رسمية"],
    checkpoint: "هل العميل وافق على السعر والنطاق والكمية؟",
  },
  {
    id: "payment-confirmation",
    num: 16,
    phase: "Payment Confirmation",
    phaseAr: "تأكيد الدفع",
    icon: "ri-bank-card-line",
    status: "approval",
    gate: { num: 6, title: "Production Release Gate", titleAr: "بوابة إطلاق الإنتاج" },
    statusLabel: "Approved",
    statusLabelAr: "معتمد",
    actors: [
      { role: "الإدارة المالية", action: "تؤكد استلام الدفع", type: "primary" },
      { role: "مدير المشروع", action: "يطلق الإنتاج", type: "secondary" },
    ],
    automations: ["إنشاء فاتورة", "إرسال طلب دفع", "تتبع حالة الدفع", "تفعيل مرحلة التنفيذ تلقائياً"],
    outputs: ["تأكيد دفع", "إذن إنتاج", "قفل الموافقات"],
    checkpoint: "هل كل شيء معتمد والدفع تم؟",
  },
  {
    id: "production-execution",
    num: 17,
    phase: "Production Execution",
    phaseAr: "التنفيذ والإنتاج",
    icon: "ri-settings-3-line",
    status: "production",
    statusLabel: "In Production",
    statusLabelAr: "قيد الإنتاج",
    actors: [
      { role: "فريق الإنتاج", action: "ينفذ الإنتاج", type: "primary" },
      { role: "مدير المشروع", action: "يدير التنفيذ", type: "secondary" },
      { role: "AI", action: "يتابع الحالة تلقائياً", type: "secondary" },
    ],
    automations: ["إنشاء Production Order", "توزيع المهام على الفرق", "تتبع تقدم الإنتاج"],
    outputs: ["أمر إنتاج", "تقرير تقدم", "دفعة منتجة"],
    checkpoint: "هل انتهى الإنتاج الفعلي؟",
  },
  {
    id: "quality-control",
    num: 18,
    phase: "Quality Control",
    phaseAr: "ضبط الجودة",
    icon: "ri-shield-check-line",
    status: "production",
    gate: { num: 7, title: "QC Release Gate", titleAr: "بوابة إطلاق الجودة" },
    statusLabel: "QC",
    statusLabelAr: "ضبط الجودة",
    actors: [
      { role: "الجودة", action: "يفحص المطابقة", type: "primary" },
      { role: "فريق الإنتاج", action: "يصلح إن لزم", type: "secondary" },
    ],
    automations: ["إنشاء QC Checklist", "توثيق الملاحظات", "فتح Corrective Action عند الفشل", "إعادة المشروع لـ Rework تلقائياً"],
    outputs: ["تقرير QC", "شهادة مطابقة", "إذن شحن"],
    checkpoint: "هل المنتج مطابق للمواصفات المعتمدة؟",
  },
  {
    id: "shipment-delivery",
    num: 19,
    phase: "Shipment & Delivery",
    phaseAr: "الشحن والتسليم",
    icon: "ri-truck-line",
    status: "delivery",
    statusLabel: "Delivered",
    statusLabelAr: "تم التسليم",
    actors: [
      { role: "فريق الإنتاج", action: "يشحن الطلب", type: "primary" },
      { role: "العميل", action: "يستلم ويؤكد", type: "primary" },
      { role: "AI", action: "يرسل إشعارات وتوصيات", type: "secondary" },
    ],
    automations: ["إنشاء Shipment Order", "إرسال تفاصيل الشحن", "إرسال طلب تقييم", "فتح خيار Reorder", "اقتراح Cross-sell"],
    outputs: ["أمر شحن", "تأكيد استلام", "تقييم العميل"],
    checkpoint: "هل تم التسليم وتأكيد الاستلام؟",
  },
  {
    id: "project-closure",
    num: 20,
    phase: "Project Closure",
    phaseAr: "إغلاق المشروع",
    icon: "ri-checkbox-circle-line",
    status: "delivery",
    statusLabel: "Closed",
    statusLabelAr: "مغلق",
    actors: [
      { role: "مدير المشروع", action: "يغلق المشروع رسمياً", type: "primary" },
      { role: "الإدارة المالية", action: "تغلق مالياً", type: "secondary" },
    ],
    automations: ["حفظ كنموذج مرجعي", "إنشاء Retention Record", "تفعيل برنامج إعادة الطلب"],
    outputs: ["أرشيف المشروع", "تقرير ختامي", "نموذج إعادة طلب"],
    checkpoint: "هل تم إغلاق المشروع رسمياً وأرشفته؟",
  },
];

const statusColors: Record<string, string> = {
  lead: "border-stone-300 bg-stone-50 text-stone-700",
  development: "border-violet-300 bg-violet-50 text-violet-700",
  approval: "border-amber-400 bg-amber-50 text-amber-800",
  production: "border-orange-300 bg-orange-50 text-orange-700",
  delivery: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<string, string> = {
  lead: "استقطاب",
  development: "تطوير",
  approval: "اعتماد",
  production: "إنتاج",
  delivery: "تسليم وإغلاق",
};

const WorkflowPage = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredSteps = filterStatus
    ? workflowSteps.filter((s) => s.status === filterStatus)
    : workflowSteps;

  const selected = workflowSteps.find((s) => s.id === selectedStep);

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Workflow</span>
          <span className="text-stone-400 text-sm hidden md:block">مخطط سير العمل الكامل</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all">
            لوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-stone-900 mb-2">Workflow المنصة — سير العمل الكامل</h1>
          <p className="text-stone-400 text-sm max-w-3xl leading-relaxed">
            20 مرحلة متكاملة من لحظة دخول العميل حتى إغلاق المشروع وما بعده. كل مرحلة مرتبطة بـ Gate و Status وأتمتة ذكية.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {(["lead", "development", "approval", "production", "delivery"] as const).map((cat) => {
            const count = workflowSteps.filter((s) => s.status === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterStatus(filterStatus === cat ? null : cat)}
                className={`rounded-2xl p-4 border-2 text-right transition-all cursor-pointer ${
                  filterStatus === cat
                    ? statusColors[cat]
                    : "bg-white border-stone-100 hover:border-stone-300"
                }`}
              >
                <div className="font-black text-lg">{count}</div>
                <div className="text-xs mt-1">{statusLabels[cat]}</div>
              </button>
            );
          })}
        </div>

        {/* Master Timeline */}
        <div className="relative mb-8">
          {/* Vertical line */}
          <div className="absolute right-[23px] top-0 bottom-0 w-0.5 bg-stone-200 hidden lg:block"></div>

          <div className="space-y-0">
            {filteredSteps.map((step, stepIdx) => {
              const isExpanded = selectedStep === step.id;
              const gateData = step.gate;
              return (
                <div key={step.id} className="relative">
                  {/* Timeline node */}
                  <div className="hidden lg:flex absolute right-0 top-6 items-center">
                    <div className={`w-[47px] flex items-center justify-center`}>
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 flex-shrink-0 z-10 transition-all ${
                        isExpanded
                          ? "border-amber-500 bg-amber-700 text-white"
                          : "border-stone-300 bg-white text-stone-600"
                      }`}>
                        <span className="text-xs font-black">{step.num}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="lg:mr-16 mb-1">
                    <button
                      onClick={() => setSelectedStep(isExpanded ? null : step.id)}
                      className="w-full bg-white rounded-2xl p-5 border-2 text-right transition-all cursor-pointer hover:border-stone-300 group"
                      style={{ borderColor: isExpanded ? "#d97706" : undefined }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Number badge (mobile only) */}
                        <div className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border-2 flex-shrink-0 ${
                          isExpanded ? "border-amber-500 bg-amber-700 text-white" : "border-stone-300 bg-white text-stone-600"
                        }`}>
                          <span className="text-xs font-black">{step.num}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h3 className="font-black text-stone-900 text-sm">{step.phaseAr}</h3>
                            <span className="text-stone-300 text-xs">{step.phase}</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusColors[step.status]}`}>
                              {step.statusLabel}
                            </span>
                          </div>

                          <p className="text-stone-500 text-xs mb-3">{step.checkpoint}</p>

                          {/* Gate badge */}
                          {gateData && (
                            <div className="inline-flex items-center gap-2 bg-stone-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">
                              <i className="ri-git-branch-line"></i>
                              Gate {gateData.num}: {gateData.titleAr}
                            </div>
                          )}

                          {/* Quick actors */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {step.actors.map((actor, ai) => (
                              <span key={ai} className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                                actor.type === "primary" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                              }`}>
                                {actor.role}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Expand icon */}
                        <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
                          isExpanded ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-400 group-hover:bg-stone-200"
                        }`}>
                          <i className={`${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-base`}></i>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Detail */}
                    {isExpanded && selected && (
                      <div className="bg-white rounded-2xl border-2 border-amber-300 mt-2 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                          {/* Left: Actors & Outputs */}
                          <div className="lg:col-span-2 p-6 space-y-5">
                            {/* Actors */}
                            <div>
                              <h4 className="font-black text-stone-900 text-xs mb-3 flex items-center gap-2">
                                <i className="ri-team-line text-amber-600"></i>
                                الأطراف المشاركة
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selected.actors.map((actor, ai) => (
                                  <div key={ai} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${
                                      actor.type === "primary" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                                    }`}>
                                      <i className={`${
                                        actor.role.includes("العميل") ? "ri-user-line" :
                                        actor.role.includes("AI") ? "ri-robot-2-line" :
                                        actor.role.includes("مدير") ? "ri-briefcase-line" :
                                        actor.role.includes("خبير") ? "ri-drop-line" :
                                        actor.role.includes("مصمم") ? "ri-palette-line" :
                                        actor.role.includes("إنتاج") ? "ri-settings-3-line" :
                                        actor.role.includes("جودة") ? "ri-shield-check-line" :
                                        actor.role.includes("مالية") ? "ri-money-dollar-circle-line" :
                                        "ri-user-line"
                                      } text-sm`}></i>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-stone-800 text-xs font-bold">{actor.role}</div>
                                      <div className="text-stone-500 text-xs">{actor.action}</div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap mr-auto ${
                                      actor.type === "primary" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                                    }`}>
                                      {actor.type === "primary" ? "رئيسي" : "مساعد"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Outputs */}
                            <div>
                              <h4 className="font-black text-stone-900 text-xs mb-3 flex items-center gap-2">
                                <i className="ri-file-list-3-line text-amber-600"></i>
                                المخرجات
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selected.outputs.map((out, oi) => (
                                  <span key={oi} className="text-xs bg-stone-50 border border-stone-200 text-stone-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                                    <i className="ri-checkbox-circle-line text-emerald-500 ml-1"></i>
                                    {out}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Automations & Links */}
                          <div className="bg-stone-50 p-6 space-y-5 border-t lg:border-t-0 lg:border-r border-stone-200">
                            {/* Automations */}
                            <div>
                              <h4 className="font-black text-stone-900 text-xs mb-3 flex items-center gap-2">
                                <i className="ri-robot-2-line text-amber-600"></i>
                                أتمتة ذكية
                              </h4>
                              <div className="space-y-2">
                                {selected.automations.map((auto, ai) => (
                                  <div key={ai} className="flex items-start gap-2">
                                    <div className="w-5 h-5 flex items-center justify-center bg-amber-100 rounded-lg flex-shrink-0 mt-0.5">
                                      <i className="ri-flashlight-line text-amber-600 text-xs"></i>
                                    </div>
                                    <span className="text-stone-600 text-xs leading-relaxed">{auto}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Status */}
                            <div>
                              <h4 className="font-black text-stone-900 text-xs mb-2">حالة النظام</h4>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  selected.status === "lead" ? "bg-stone-400" :
                                  selected.status === "development" ? "bg-violet-500" :
                                  selected.status === "approval" ? "bg-amber-500" :
                                  selected.status === "production" ? "bg-orange-500" :
                                  "bg-emerald-500"
                                }`}></div>
                                <span className="text-stone-700 text-sm font-bold">{selected.statusLabel}</span>
                                <span className="text-stone-400 text-xs">{selected.statusLabelAr}</span>
                              </div>
                            </div>

                            {/* Gate link if exists */}
                            {gateData && (
                              <div>
                                <h4 className="font-black text-stone-900 text-xs mb-2">نقطة القرار</h4>
                                <div className="inline-flex items-center gap-2 bg-stone-900 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl">
                                  <i className="ri-git-branch-line"></i>
                                  Gate {gateData.num}: {gateData.titleAr}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Connector */}
                  {stepIdx < filteredSteps.length - 1 && (
                    <div className="lg:mr-16 h-3 flex items-center justify-start">
                      <i className="ri-arrow-down-line text-stone-300 text-sm hidden lg:block mr-[17px]"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/production"
            className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mb-3">
              <i className="ri-flask-line text-amber-600 text-lg"></i>
            </div>
            <div className="font-black text-stone-900 text-sm mb-1">تصنيع العطر</div>
            <p className="text-stone-400 text-xs mb-3">صمّم عطرك وتابع الإنتاج</p>
            <span className="text-amber-700 text-xs font-bold group-hover:mr-1 transition-all">فتح ←</span>
          </Link>
          <Link
            to="/services"
            className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mb-3">
              <i className="ri-compass-3-line text-amber-600 text-lg"></i>
            </div>
            <div className="font-black text-stone-900 text-sm mb-1">المسارات</div>
            <p className="text-stone-400 text-xs mb-3">6 مسارات خدمية متخصصة</p>
            <span className="text-amber-700 text-xs font-bold group-hover:mr-1 transition-all">فتح ←</span>
          </Link>
          <Link
            to="/workspace"
            className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mb-3">
              <i className="ri-dashboard-3-line text-amber-600 text-lg"></i>
            </div>
            <div className="font-black text-stone-900 text-sm mb-1">Workspace</div>
            <p className="text-stone-400 text-xs mb-3">14 وحدة عمل تفاعلية</p>
            <span className="text-amber-700 text-xs font-bold group-hover:mr-1 transition-all">فتح ←</span>
          </Link>
          <Link
            to="/dashboard"
            className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mb-3">
              <i className="ri-dashboard-3-line text-amber-600 text-lg"></i>
            </div>
            <div className="font-black text-stone-900 text-sm mb-1">لوحة التحكم</div>
            <p className="text-stone-400 text-xs mb-3">إدارة مشاريعك وطلباتك</p>
            <span className="text-amber-700 text-xs font-bold group-hover:mr-1 transition-all">فتح ←</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;