import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConsultationModal from "@/components/feature/ConsultationModal";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";

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
    features: [
      "استراتيجية البراند والتموضع",
      "تطوير التركيبة العطرية",
      "الهوية البصرية الكاملة",
      "تصميم العبوة والتغليف",
      "التصنيع والإنتاج",
      "خطة الإطلاق التسويقي",
    ],
    stages: 6,
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20complete%20creation%20process%20mood%20board%20design%20packaging%20fragrance%20bottles%20elegant%20studio%20setup%20professional%20brand%20identity%20development%20warm%20amber%20tones%20dark%20background&width=600&height=400&seq=svc001&orientation=landscape",
    link: "/brand-creation",
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
    features: [
      "تحليل التوجه العطري",
      "تطوير 3 نسخ من التركيبة",
      "عينات للتقييم",
      "تقرير تفصيلي للتركيبة",
      "شهادة المكونات",
      "دعم ما بعد الاعتماد",
    ],
    stages: 4,
    image: "https://readdy.ai/api/search-image?query=perfume%20fragrance%20development%20laboratory%20professional%20chemist%20working%20with%20essential%20oils%20aromatic%20ingredients%20testing%20samples%20elegant%20scientific%20environment%20warm%20lighting&width=600&height=400&seq=svc002&orientation=landscape",
    link: "/production",
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
    features: [
      "تصميم العبوة الخارجية",
      "تصميم الاستيكر والملصقات",
      "اختيار المواد والخامات",
      "نماذج ثلاثية الأبعاد",
      "ملفات الطباعة الجاهزة",
      "الإشراف على الإنتاج",
    ],
    stages: 4,
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20packaging%20design%20elegant%20boxes%20bottles%20labels%20premium%20materials%20gold%20foil%20embossing%20sophisticated%20product%20presentation%20dark%20background%20warm%20tones&width=600&height=400&seq=svc003&orientation=landscape",
    link: "/packaging-customizer",
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
    features: [
      "تصميم الشعار (3 مقترحات)",
      "نظام الألوان والخطوط",
      "دليل الهوية البصرية",
      "تطبيقات الهوية",
      "ملفات المصدر الكاملة",
      "حقوق الملكية الكاملة",
    ],
    stages: 4,
    image: "https://readdy.ai/api/search-image?query=luxury%20brand%20visual%20identity%20design%20logo%20typography%20color%20palette%20mood%20board%20elegant%20minimalist%20style%20professional%20branding%20studio%20dark%20sophisticated%20aesthetic&width=600&height=400&seq=svc004&orientation=landscape",
    link: "/visual-identity",
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
    features: [
      "مراجعة التركيبة والتصميم",
      "اختبار الجودة",
      "الإنتاج بالكميات المطلوبة",
      "التعبئة والتغليف",
      "شهادات الجودة",
      "الشحن والتسليم",
    ],
    stages: 4,
    image: "https://readdy.ai/api/search-image?query=perfume%20manufacturing%20production%20line%20professional%20factory%20filling%20machines%20quality%20control%20elegant%20industrial%20process%20clean%20modern%20facility&width=600&height=400&seq=svc005&orientation=landscape",
    link: "/manufacturing",
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
    features: [
      "مراجعة الملفات",
      "طباعة عالية الجودة",
      "تشطيبات متنوعة",
      "ضمان دقة الألوان",
      "تسليم سريع",
      "خيارات شحن متعددة",
    ],
    stages: 3,
    image: "https://readdy.ai/api/search-image?query=professional%20printing%20production%20high%20quality%20labels%20packaging%20materials%20luxury%20print%20finishing%20gold%20foil%20embossing%20elegant%20results%20clean%20studio&width=600&height=400&seq=svc006&orientation=landscape",
    link: "/services/F",
  },
];

const journeySteps = [
  { step: 1, label: "بناء البراند", en: "Brand Strategy", icon: "ri-compass-3-line", color: "bg-amber-500", link: "/brand-creation", desc: "حدد استراتيجية براندك وشخصيته وتموضعه" },
  { step: 2, label: "الهوية البصرية", en: "Visual Identity", icon: "ri-palette-line", color: "bg-violet-500", link: "/visual-identity", desc: "صمم شعارك وألوانك وخطوطك" },
  { step: 3, label: "التغليف", en: "Packaging", icon: "ri-gift-2-line", color: "bg-emerald-500", link: "/packaging-customizer", desc: "خصص عبوة واستيكر وتغليف 3D" },
  { step: 4, label: "التصنيع", en: "Manufacturing", icon: "ri-settings-3-line", color: "bg-sky-500", link: "/manufacturing", desc: "حدد مواصفات الإنتاج والشحن" },
  { step: 5, label: "الإطلاق", en: "Launch", icon: "ri-rocket-line", color: "bg-rose-500", link: "/workflow", desc: "تابع سير العمل حتى التسليم" },
];

const ServicesPage = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const selected = services.find((s) => s.id === selectedService);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      <Navbar />

      {/* Hero */}
      <div className="bg-stone-900 py-20 px-6 text-center">
        <span className="inline-flex items-center gap-2 border border-amber-600/50 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          <i className="ri-compass-3-line"></i>
          خدماتنا
        </span>
        {user ? (
          <>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              مرحباً بك،{" "}
              <span className="text-amber-400">{user.firstName}</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-6">
              اختر الخدمة التي تريد البدء بها وسيتم إنشاء مشروعك مباشرة في لوحة التحكم
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
              >
                <i className="ri-dashboard-line"></i>
                لوحة التحكم
              </Link>
              <Link
                to="/dashboard/projects"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-amber-400 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
              >
                <i className="ri-folder-3-line"></i>
                مشاريعي الحالية
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              اختر مسارك
              <br />
              <span className="text-amber-400">نحو النجاح</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              6 مسارات متخصصة مصممة لتلبية احتياجات كل مشروع — من الفكرة حتى الإطلاق
            </p>
          </>
        )}
      </div>

      {/* Customer Journey Flow */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-road-map-line"></i>
            رحلة العميل الموصى بها
          </span>
          <h2 className="text-2xl font-black text-stone-900 mb-2">ابدأ من هنا — خطوة بخطوة</h2>
          <p className="text-stone-500 text-sm max-w-lg mx-auto">لأفضل تجربة، ننصح باتباع هذا التسلسل. كل مرحلة تعتمد على مخرجات المرحلة السابقة.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-stone-200 hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-l from-amber-500 via-violet-500 via-emerald-500 via-sky-500 to-rose-500 opacity-40"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {journeySteps.map((step, idx) => (
              <Link
                key={step.step}
                to={step.link}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative z-10`}>
                  <i className={`${step.icon} text-white text-2xl`}></i>
                </div>
                <span className="text-[10px] font-bold text-stone-300 mb-1">الخطوة {step.step}</span>
                <span className="text-sm font-black text-stone-800 group-hover:text-amber-700 transition-colors whitespace-nowrap">{step.label}</span>
                <span className="text-[10px] text-stone-400">{step.en}</span>
                <p className="text-stone-400 text-[11px] mt-1 leading-relaxed hidden sm:block">{step.desc}</p>
                {idx < journeySteps.length - 1 && (
                  <i className="ri-arrow-down-line text-stone-300 mt-2 lg:hidden"></i>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-stone-100 text-stone-500 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <i className="ri-stack-line"></i>
            كل الخدمات
          </span>
          <h2 className="text-2xl font-black text-stone-900">أو اختر أي خدمة بشكل منفصل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => {
                if (service.link && service.link !== `/services/${service.id}`) {
                  navigate(service.link);
                } else {
                  setSelectedService(service.id === selectedService ? null : service.id);
                }
              }}
              className={`bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedService === service.id
                  ? "border-amber-600"
                  : "border-stone-100 hover:border-amber-300"
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {service.badge && (
                  <span className={`absolute top-4 right-4 ${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
                    {service.badge}
                  </span>
                )}
                <div className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient}`}>
                  <i className={`${service.icon} text-white text-lg`}></i>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-stone-400 text-xs font-bold mb-1">{service.subtitle}</div>
                <h3 className="text-stone-900 font-black text-lg mb-2">{service.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{service.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div>
                    <div className="text-amber-700 font-black text-sm">{service.price}</div>
                    <div className="text-stone-400 text-xs">{service.duration}</div>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400 text-xs">
                    <i className="ri-git-branch-line"></i>
                    <span>{service.stages} مراحل</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Service Detail */}
        {selected && (
          <div className={`bg-gradient-to-br ${selected.gradient} rounded-3xl p-10 text-white mb-16`}>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1">
                <div className="text-white/60 text-xs font-bold mb-2">المسار {selected.id} — {selected.subtitle}</div>
                <h2 className="text-3xl font-black mb-4">{selected.title}</h2>
                <p className="text-white/70 leading-relaxed mb-8">{selected.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {selected.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                      <div className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                        <i className="ri-check-line text-xs"></i>
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {user ? (
                    <Link
                      to={selected.link && selected.link.startsWith("/services/") ? `/services/${selected.id}` : (selected.link || `/services/${selected.id}`)}
                      className="bg-white text-stone-900 font-black px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all hover:bg-amber-100 text-sm inline-flex items-center gap-2"
                    >
                      <i className="ri-rocket-line"></i>
                      ابدأ هذا المشروع
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      className="bg-white text-stone-900 font-black px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all hover:bg-amber-100 text-sm inline-flex items-center gap-2"
                    >
                      <i className="ri-rocket-line"></i>
                      سجّل لبدء هذا المسار
                    </Link>
                  )}
                  <button
                    onClick={() => setShowConsultModal(true)}
                    className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    احجز استشارة
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-72">
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-white/60 text-xs font-bold mb-4">تفاصيل الخدمة</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">السعر</span>
                      <span className="text-white font-bold text-sm">{selected.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">المدة</span>
                      <span className="text-white font-bold text-sm">{selected.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">عدد المراحل</span>
                      <span className="text-white font-bold text-sm">{selected.stages} مراحل</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">الدعم</span>
                      <span className="text-white font-bold text-sm">مخصص</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl p-12 border border-stone-100">
          {user ? (
            <>
              <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-2xl mx-auto mb-6">
                <i className="ri-dashboard-line text-emerald-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">اختر الخدمة وابدأ مشروعك</h3>
              <p className="text-stone-500 mb-6 max-w-md mx-auto text-sm">
                اختر أي من الخدمات أعلاه وسيتم إنشاء مشروعك تلقائياً في لوحة التحكم. يمكنك متابعة تقدم مشروعك من خلال لوحة التحكم في أي وقت.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard"
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-dashboard-line"></i>
                  لوحة التحكم
                </Link>
                <Link
                  to="/dashboard/projects"
                  className="border border-stone-200 hover:border-amber-400 text-stone-700 font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-folder-3-line"></i>
                  مشاريعي
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-2xl mx-auto mb-6">
                <i className="ri-customer-service-2-line text-amber-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">لست متأكداً من المسار المناسب؟</h3>
              <p className="text-stone-500 mb-6 max-w-md mx-auto text-sm">
                جرّب Smart Onboarding المجاني وسيحدد النظام المسار الأنسب لمشروعك في أقل من 5 دقائق
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/auth"
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-user-add-line"></i>
                  سجّل وابدأ الآن
                </Link>
                <button
                  onClick={() => setShowConsultModal(true)}
                  className="border border-stone-200 hover:border-amber-400 text-stone-700 font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  تواصل مع خبير
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Page Navigation */}
      <div className="bg-white border-t border-stone-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/about"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-right-line text-xl group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-light">الصفحة السابقة</div>
              <div className="text-sm font-bold">عنا</div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { label: "الرئيسية", path: "/" },
              { label: "عنا", path: "/about" },
              { label: "الخدمات", path: "/services", active: true },
              { label: "نماذج الأعمال", path: "/portfolio" },
              { label: "الأسئلة", path: "/faq" },
              { label: "تواصل معنا", path: "/contact" },
            ].map((dot, i) => (
              <Link
                key={dot.path}
                to={dot.path}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${dot.active ? "bg-amber-700 w-5" : "bg-stone-300 hover:bg-amber-400"}`}
                title={dot.label}
              />
            ))}
          </div>

          <Link
            to="/portfolio"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-light">الصفحة التالية</div>
              <div className="text-sm font-bold">نماذج من الأعمال</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-left-line text-xl group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </Link>
        </div>
      </div>

      <FooterSection />
      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
      />
    </div>
  );
};

export default ServicesPage;
