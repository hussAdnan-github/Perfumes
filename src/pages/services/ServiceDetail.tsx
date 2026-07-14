import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConsultationModal from "@/components/feature/ConsultationModal";

const services = [
  {
    id: "A",
    title: "إنشاء براند عطور كامل",
    subtitle: "Full Brand Creation",
    icon: "ri-award-fill",
    gradient: "from-amber-700 to-amber-900",
    badge: "الأكثر طلباً",
    badgeColor: "bg-amber-500",
    price: "يبدأ من 50,000 ريال",
    duration: "3 - 6 أشهر",
    desc: "الحل الأشمل لمن يريد بناء براند عطري متكامل من الصفر. يشمل كل شيء من الاستراتيجية حتى الإطلاق.",
    longDesc: "هذا المسار مصمم للعملاء الذين يريدون بناء براند عطري متكامل من الصفر. نبدأ باستراتيجية البراند والتموضع السوقي، ثم نطور التركيبة العطرية الفريدة، ونصمم الهوية البصرية الكاملة، ونعتني بتصميم العبوة والتغليف بأدق التفاصيل، وأخيراً نتولى التصنيع والإنتاج مع خطة إطلاق تسويقي متكاملة.",
    features: [
      "استراتيجية البراند والتموضع",
      "تطوير التركيبة العطرية",
      "الهوية البصرية الكاملة",
      "تصميم العبوة والتغليف",
      "التصنيع والإنتاج",
      "خطة الإطلاق التسويقي",
    ],
    stages: [
      { name: "Onboarding", desc: "التعريف بالمشروع وتحديد الأهداف", icon: "ri-user-add-line" },
      { name: "Brand Strategy", desc: "استراتيجية البراند والتموضع", icon: "ri-compass-3-line" },
      { name: "Fragrance Development", desc: "تطوير التركيبة العطرية", icon: "ri-drop-line" },
      { name: "Visual Identity", desc: "تصميم الهوية البصرية", icon: "ri-palette-line" },
      { name: "Packaging Design", desc: "تصميم العبوة والتغليف", icon: "ri-gift-line" },
      { name: "Production", desc: "التصنيع والإنتاج", icon: "ri-settings-line" },
      { name: "Launch", desc: "الإطلاق والتسليم", icon: "ri-rocket-line" },
    ],
    deliverables: [
      "تركيبة عطرية معتمدة وموثقة",
      "هوية بصرية كاملة مع دليل استخدام",
      "عبوة وتغليف جاهزين للإنتاج",
      "خطة تسويقية للإطلاق",
      "شهادات جودة ومطابقة",
      "ملفات المصدر الكاملة",
    ],
    team: ["مدير مشروع", "خبير عطور", "مصمم هوية", "مصمم تعبئة", "فريق إنتاج"],
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20complete%20creation%20process%20mood%20board%20design%20packaging%20fragrance%20bottles%20elegant%20studio%20setup%20professional%20brand%20identity%20development%20warm%20amber%20tones%20dark%20background&width=800&height=500&seq=svc001&orientation=landscape",
  },
  {
    id: "B",
    title: "تطوير عطر فقط",
    subtitle: "Fragrance Development",
    icon: "ri-drop-fill",
    gradient: "from-rose-700 to-rose-900",
    badge: null,
    badgeColor: "",
    price: "يبدأ من 15,000 ريال",
    duration: "4 - 8 أسابيع",
    desc: "تطوير تركيبة عطرية احترافية مع عينات متعددة وتقييم دقيق حتى الوصول للتركيبة المثالية.",
    longDesc: "هذا المسار مخصص للعملاء الذين يملكون تصميم العبوة والهوية البصرية ويحتاجون فقط لتطوير التركيبة العطرية. نعمل على تحليل التوجه العطري المطلوب، ثم نطور 3 نسخ مختلفة من التركيبة، ونقدم عينات للتقييم، ونعدل حتى الوصول للتركيبة المثالية.",
    features: [
      "تحليل التوجه العطري",
      "تطوير 3 نسخ من التركيبة",
      "عينات للتقييم",
      "تقرير تفصيلي للتركيبة",
      "شهادة المكونات",
      "دعم ما بعد الاعتماد",
    ],
    stages: [
      { name: "Onboarding", desc: "فهم الرؤية والتوجه العطري", icon: "ri-user-add-line" },
      { name: "Fragrance Brief", desc: "تحديد العائلة والنوتات", icon: "ri-file-list-line" },
      { name: "Formula Development", desc: "تطوير التركيبة", icon: "ri-flask-line" },
      { name: "Sampling", desc: "عينات وتقييم", icon: "ri-test-tube-line" },
      { name: "Refinement", desc: "التعديلات والتحسين", icon: "ri-refresh-line" },
      { name: "Approval", desc: "اعتماد النسخة النهائية", icon: "ri-check-double-line" },
    ],
    deliverables: [
      "تركيبة عطرية معتمدة",
      "تقرير مكونات تفصيلي",
      "3 عينات نهائية",
      "شهادة المطابقة",
      "ملف التركيبة السري",
    ],
    team: ["خبير عطور", "كيميائي عطور", "مدير مشروع"],
    image: "https://readdy.ai/api/search-image?query=perfume%20fragrance%20development%20laboratory%20professional%20chemist%20working%20with%20essential%20oils%20aromatic%20ingredients%20testing%20samples%20elegant%20scientific%20environment%20warm%20lighting&width=800&height=500&seq=svc002&orientation=landscape",
  },
  {
    id: "C",
    title: "عبوة واستيكر وتغليف",
    subtitle: "Packaging & Labeling",
    icon: "ri-gift-fill",
    gradient: "from-emerald-700 to-emerald-900",
    badge: null,
    badgeColor: "",
    price: "يبدأ من 8,000 ريال",
    duration: "3 - 5 أسابيع",
    desc: "تصميم وتنفيذ عبوة احترافية تعكس هوية براندك وتجذب المستهلك في نقطة البيع.",
    longDesc: "هذا المسار مخصص لتصميم وتنفيذ العبوة والتغليف. سواء كان لديك عطر جاهز أو تركيبة موجودة، نساعدك في تصميم عبوة فريدة تعكس هوية براندك. نبدأ باختيار الشكل والحجم والخامات، ثم نصمم الاستيكر والملصقات، ونقدم نماذج ثلاثية الأبعاد، ونسلم ملفات الطباعة الجاهزة.",
    features: [
      "تصميم العبوة الخارجية",
      "تصميم الاستيكر والملصقات",
      "اختيار المواد والخامات",
      "نماذج ثلاثية الأبعاد",
      "ملفات الطباعة الجاهزة",
      "الإشراف على الإنتاج",
    ],
    stages: [
      { name: "Onboarding", desc: "فهم المنتج والمتطلبات", icon: "ri-user-add-line" },
      { name: "Packaging Brief", desc: "تحديد المقاسات والخامات", icon: "ri-ruler-line" },
      { name: "Bottle Selection", desc: "اختيار العبوة", icon: "ri-vip-diamond-line" },
      { name: "Label Design", desc: "تصميم الاستيكر", icon: "ri-price-tag-line" },
      { name: "Box Design", desc: "تصميم العلبة", icon: "ri-archive-line" },
      { name: "3D Preview", desc: "معاينة ثلاثية الأبعاد", icon: "ri-eye-line" },
      { name: "Production", desc: "الطباعة والتنفيذ", icon: "ri-printer-line" },
    ],
    deliverables: [
      "عبوة معتمدة مع مواصفاتها",
      "استيكر جاهز للطباعة",
      "علبة تعبئة معتمدة",
      "نماذج ثلاثية الأبعاد",
      "ملفات الطباعة النهائية",
    ],
    team: ["مصمم تعبئة", "مصمم جرافيك", "مدير مشروع"],
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20packaging%20design%20elegant%20boxes%20bottles%20labels%20premium%20materials%20gold%20foil%20embossing%20sophisticated%20product%20presentation%20dark%20background%20warm%20tones&width=800&height=500&seq=svc003&orientation=landscape",
  },
  {
    id: "D",
    title: "هوية بصرية كاملة",
    subtitle: "Visual Identity",
    icon: "ri-palette-fill",
    gradient: "from-violet-700 to-violet-900",
    badge: null,
    badgeColor: "",
    price: "يبدأ من 12,000 ريال",
    duration: "2 - 4 أسابيع",
    desc: "تصميم هوية بصرية متكاملة تميز براندك وتترك انطباعاً لا يُنسى في ذهن العميل.",
    longDesc: "هذا المسار مخصص لتصميم الهوية البصرية الكاملة للبراند. نبدأ بفهم قيم البراند وشخصيته المستهدفة، ثم نطور 3 مقترحات للشعار، ونبني نظام الألوان والخطوط، ونصمم تطبيقات الهوية على مختلف القنوات، ونسلم دليل الهوية البصرية الشامل.",
    features: [
      "تصميم الشعار (3 مقترحات)",
      "نظام الألوان والخطوط",
      "دليل الهوية البصرية",
      "تطبيقات الهوية",
      "ملفات المصدر الكاملة",
      "حقوق الملكية الكاملة",
    ],
    stages: [
      { name: "Onboarding", desc: "فهم البراند والقيم", icon: "ri-user-add-line" },
      { name: "Brand Brief", desc: "تحديد الشخصية والتوجه", icon: "ri-file-list-line" },
      { name: "Moodboard", desc: "لوحة الإلهام", icon: "ri-image-line" },
      { name: "Logo Concepts", desc: "3 مقترحات للشعار", icon: "ri-shapes-line" },
      { name: "Identity Development", desc: "تطوير الهوية", icon: "ri-palette-line" },
      { name: "Applications", desc: "تطبيقات الهوية", icon: "ri-layout-grid-line" },
      { name: "Delivery", desc: "تسليم الملفات", icon: "ri-folder-transfer-line" },
    ],
    deliverables: [
      "شعار معتمد بصيغ متعددة",
      "دليل الهوية البصرية",
      "نظام ألوان وخطوط",
      "تطبيقات على 10 قنوات",
      "ملفات المصدر الكاملة",
      "حقوق ملكية كاملة",
    ],
    team: ["مصمم هوية", "مصمم جرافيك", "مدير مشروع"],
    image: "https://readdy.ai/api/search-image?query=luxury%20brand%20visual%20identity%20design%20logo%20typography%20color%20palette%20mood%20board%20elegant%20minimalist%20style%20professional%20branding%20studio%20dark%20sophisticated%20aesthetic&width=800&height=500&seq=svc004&orientation=landscape",
  },
  {
    id: "E",
    title: "تصنيع فقط",
    subtitle: "Manufacturing",
    icon: "ri-settings-fill",
    gradient: "from-sky-700 to-sky-900",
    badge: null,
    badgeColor: "",
    price: "حسب الكمية",
    duration: "4 - 8 أسابيع",
    desc: "تصنيع منتجك بناءً على تركيبة وتصميم جاهزين مع ضمان أعلى معايير الجودة.",
    longDesc: "هذا المسار مخصص للعملاء الذين يملكون تركيبة عطرية جاهزة وتصميم معتمد ويحتاجون فقط للتصنيع. نقوم بمراجعة التركيبة والتصميم، ثم ننفذ الإنتاج بالكميات المطلوبة مع اختبارات جودة صارمة، ونسلم المنتج جاهزاً للتعبئة والشحن.",
    features: [
      "مراجعة التركيبة والتصميم",
      "اختبار الجودة",
      "الإنتاج بالكميات المطلوبة",
      "التعبئة والتغليف",
      "شهادات الجودة",
      "الشحن والتسليم",
    ],
    stages: [
      { name: "Onboarding", desc: "استلام الملفات", icon: "ri-user-add-line" },
      { name: "Review", desc: "مراجعة التركيبة والتصميم", icon: "ri-search-line" },
      { name: "QC Testing", desc: "اختبار الجودة", icon: "ri-shield-check-line" },
      { name: "Production", desc: "التصنيع", icon: "ri-settings-line" },
      { name: "Assembly", desc: "التعبئة والتجميع", icon: "ri-box-3-line" },
      { name: "Final QC", desc: "فحص نهائي", icon: "ri-check-double-line" },
      { name: "Delivery", desc: "الشحن والتسليم", icon: "ri-truck-line" },
    ],
    deliverables: [
      "كمية منتجة حسب الطلب",
      "شهادات جودة",
      "تقرير إنتاج",
      "تأكيد تسليم",
    ],
    team: ["فريق إنتاج", "فريق جودة", "مدير مشروع"],
    image: "https://readdy.ai/api/search-image?query=perfume%20manufacturing%20production%20line%20professional%20factory%20filling%20machines%20quality%20control%20elegant%20industrial%20process%20clean%20modern%20facility&width=800&height=500&seq=svc005&orientation=landscape",
  },
  {
    id: "F",
    title: "طباعة وتنفيذ",
    subtitle: "Print & Execute",
    icon: "ri-printer-fill",
    gradient: "from-stone-600 to-stone-800",
    badge: null,
    badgeColor: "",
    price: "يبدأ من 3,000 ريال",
    duration: "1 - 2 أسبوع",
    desc: "طباعة وتنفيذ ملفاتك الجاهزة بأعلى جودة وأسرع وقت مع ضمان دقة الألوان.",
    longDesc: "هذا المسار مخصص للطباعة والتنفيذ السريع. إذا كان لديك ملفات جاهزة للطباعة (استيكر، علب، كرتون)، ننفذها بأعلى جودة مع ضمان دقة الألوان والتشطيبات. ندعم مختلف أنواع الورق والتشطيبات الخاصة.",
    features: [
      "مراجعة الملفات",
      "طباعة عالية الجودة",
      "تشطيبات متنوعة",
      "ضمان دقة الألوان",
      "تسليم سريع",
      "خيارات شحن متعددة",
    ],
    stages: [
      { name: "File Review", desc: "مراجعة الملفات", icon: "ri-file-check-line" },
      { name: "Pre-press", desc: "تحضير للطباعة", icon: "ri-printer-cloud-line" },
      { name: "Printing", desc: "الطباعة", icon: "ri-printer-line" },
      { name: "Finishing", desc: "التشطيب", icon: "ri-scissors-cut-line" },
      { name: "QC", desc: "فحص الجودة", icon: "ri-shield-check-line" },
      { name: "Delivery", desc: "التسليم", icon: "ri-truck-line" },
    ],
    deliverables: [
      "طباعة حسب الكمية المطلوبة",
      "تشطيبات عالية الجودة",
      "تقرير جودة",
      "تأكيد تسليم",
    ],
    team: ["فريق طباعة", "فريق جودة"],
    image: "https://readdy.ai/api/search-image?query=professional%20printing%20production%20high%20quality%20labels%20packaging%20materials%20luxury%20print%20finishing%20gold%20foil%20embossing%20elegant%20results%20clean%20studio&width=800&height=500&seq=svc006&orientation=landscape",
  },
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "stages" | "deliverables" | "team">("overview");
  const [showConsultModal, setShowConsultModal] = useState(false);

  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-6">
            <i className="ri-error-warning-line text-stone-400 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">الخدمة غير موجودة</h1>
          <p className="text-stone-500 mb-6">الخدمة المطلوبة غير متوفرة في قائمة خدماتنا</p>
          <Link
            to="/services"
            className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all inline-flex items-center gap-2"
          >
            <i className="ri-arrow-right-line"></i>
            العودة للخدمات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/services" className="text-stone-400 hover:text-stone-600 transition-colors">
            <i className="ri-arrow-right-line text-xl"></i>
          </Link>
          <Link to="/" className="cursor-pointer">
            <img
              src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
              alt="شعار المنصة"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-stone-500 hover:text-amber-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">الرئيسية</Link>
          <Link to="/services" className="text-amber-700 text-sm font-bold cursor-pointer whitespace-nowrap">الخدمات</Link>
          <Link to="/dashboard" className="text-stone-500 hover:text-amber-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">لوحة التحكم</Link>
        </div>
        <Link
          to="/auth"
          className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all"
        >
          ابدأ مشروعك
        </Link>
      </nav>

      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${service.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/60 text-sm font-bold">المسار {service.id}</span>
                {service.badge && (
                  <span className={`${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
                    {service.badge}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{service.title}</h1>
              <p className="text-white/80 text-lg leading-relaxed mb-6">{service.longDesc}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 rounded-xl px-5 py-3">
                  <div className="text-white/60 text-xs mb-1">السعر</div>
                  <div className="text-white font-bold">{service.price}</div>
                </div>
                <div className="bg-white/10 rounded-xl px-5 py-3">
                  <div className="text-white/60 text-xs mb-1">المدة</div>
                  <div className="text-white font-bold">{service.duration}</div>
                </div>
                <div className="bg-white/10 rounded-xl px-5 py-3">
                  <div className="text-white/60 text-xs mb-1">المراحل</div>
                  <div className="text-white font-bold">{service.stages.length} مراحل</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-white text-stone-900 font-black px-8 py-4 rounded-full cursor-pointer whitespace-nowrap transition-all hover:bg-amber-100 text-sm inline-flex items-center gap-2"
                >
                  <i className="ri-rocket-line"></i>
                  ابدأ هذا المسار
                </button>
                <button
                  onClick={() => navigate("/workflow")}
                  className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center gap-2"
                >
                  <i className="ri-flow-chart"></i>
                  سير العمل
                </button>
              </div>
            </div>
            <div className="w-full lg:w-[450px]">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-[300px] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-stone-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "نظرة عامة", icon: "ri-dashboard-line" },
              { id: "stages", label: "مراحل العمل", icon: "ri-git-branch-line" },
              { id: "deliverables", label: "المخرجات", icon: "ri-folder-zip-line" },
              { id: "team", label: "الفريق", icon: "ri-team-line" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-black text-stone-900 mb-6">مميزات الخدمة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-stone-100">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl mb-4">
                      <i className="ri-check-line text-amber-700"></i>
                    </div>
                    <p className="text-stone-900 font-bold text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-stone-900 rounded-3xl p-8">
              <h2 className="text-xl font-black text-white mb-6">إحصائيات سريعة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">{service.stages.length}</div>
                  <div className="text-white/60 text-sm">مرحلة عمل</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">{service.deliverables.length}</div>
                  <div className="text-white/60 text-sm">مخرج نهائي</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">{service.team.length}</div>
                  <div className="text-white/60 text-sm">خبير متخصص</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 mb-1">100%</div>
                  <div className="text-white/60 text-sm">دعم مخصص</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stages Tab */}
        {activeTab === "stages" && (
          <div>
            <h2 className="text-2xl font-black text-stone-900 mb-6">مراحل سير العمل</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-stone-200"></div>
              
              <div className="space-y-6">
                {service.stages.map((stage, index) => (
                  <div key={index} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-white border-2 border-amber-600 rounded-full flex-shrink-0">
                      <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-stone-100">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl flex-shrink-0">
                          <i className={`${stage.icon} text-amber-700`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-stone-900 mb-1">{stage.name}</h3>
                          <p className="text-stone-500 text-sm">{stage.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deliverables Tab */}
        {activeTab === "deliverables" && (
          <div>
            <h2 className="text-2xl font-black text-stone-900 mb-6">المخرجات النهائية</h2>
            <div className="bg-white rounded-3xl p-8 border border-stone-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.deliverables.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg flex-shrink-0">
                      <i className="ri-file-check-line text-amber-700"></i>
                    </div>
                    <span className="text-stone-900 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-200 rounded-lg flex-shrink-0">
                    <i className="ri-information-line text-amber-800"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">ملاحظة مهمة</h4>
                    <p className="text-amber-700 text-sm">
                      جميع المخرجات يتم تسليمها بصيغ رقمية عالية الجودة، مع حقوق استخدام كاملة للعميل.
                      كما يتم الاحتفاظ بنسخة احتياطية من المشروع لمدة سنة كاملة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div>
            <h2 className="text-2xl font-black text-stone-900 mb-6">فريق العمل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-stone-100 text-center">
                  <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-4">
                    <i className="ri-user-line text-amber-700 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">{member}</h3>
                  <p className="text-stone-500 text-sm">خبير متخصص في مجاله</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-stone-900 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">هل تحتاج استشارة قبل البدء؟</h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في اختيار المسار الأنسب
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowConsultModal(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-customer-service-2-line"></i>
                  احجز استشارة مجانية
                </button>
                <Link
                  to="/workspace"
                  className="border border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  جرّب Workspace
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-stone-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-stone-900 mb-2">جاهز لبدء مشروعك؟</h3>
              <p className="text-stone-500 text-sm">ابدأ الآن واحصل على استشارة مجانية + عرض سعر مخصص</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center gap-2"
              >
                <i className="ri-rocket-line"></i>
                ابدأ الآن
              </button>
              <Link
                to="/services"
                className="border border-stone-200 hover:border-amber-400 text-stone-700 font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
              >
                الخدمات الأخرى
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        preselectedService={service.title}
      />
    </div>
  );
};

export default ServiceDetail;