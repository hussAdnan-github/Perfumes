import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const steps = [
  {
    step: 1,
    title: "سجّل وابدأ",
    subtitle: "أنشئ حسابك في دقيقة",
    desc: "سجل دخولك أو أنشئ حساباً جديداً للوصول إلى كافة خدمات المنصة وأدواتها الاحترافية.",
    icon: "ri-user-add-line",
    color: "bg-amber-500",
    link: "/auth",
  },
  {
    step: 2,
    title: "اختر مسارك",
    subtitle: "6 مسارات متخصصة",
    desc: "تصفح المسارات الخدمية الستة واختر ما يناسب مشروعك — من البراند الكامل إلى الطباعة والتنفيذ.",
    icon: "ri-compass-3-line",
    color: "bg-violet-500",
    link: "/services",
  },
  {
    step: 3,
    title: "لوحة التحكم",
    subtitle: "تابع كل شي من مكان واحد",
    desc: "بعد اختيار الخدمة، تنتقل إلى لوحة تحكم متكاملة فيها المشاريع والرسائل والاعتمادات والفواتير.",
    icon: "ri-dashboard-line",
    color: "bg-emerald-500",
    link: "/dashboard",
  },
  {
    step: 4,
    title: "نفّذ وأطلق",
    subtitle: "فريقنا معك خطوة بخطوة",
    desc: "فريق الخبراء يتولى التنفيذ وأنت تتابع التقدم عبر المنصة حتى يصبح براندك جاهزاً للإطلاق.",
    icon: "ri-rocket-line",
    color: "bg-rose-500",
    link: "/workflow",
  },
];

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-stone-50 py-20 md:py-28 overflow-hidden" id="how-it-works">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, #b45309 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14 md:mb-18">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <i className="ri-guide-line"></i>
            كيف تعمل المنصة
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
            رحلتك من
            <span className="text-amber-600"> البداية</span> حتى
            <span className="text-amber-600"> الإطلاق</span>
          </h2>
          <p className="text-stone-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
            أربع خطوات بسيطة تفصل بينك وبين براندك العطري — نسيرها معاً بكل احترافية
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5">
            <div className="absolute inset-0 bg-gradient-to-l from-amber-500 via-violet-500 via-emerald-500 to-rose-500 opacity-25 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => {
              const isAuthStep = s.step === 1;

              return (
                <div key={s.step} className="relative group">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center transition-all duration-500 group-hover:border-amber-200 group-hover:shadow-sm h-full flex flex-col items-center">

                    {/* Step number + icon */}
                    <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative z-10`}>
                      <i className={`${s.icon} text-white text-xl`}></i>
                    </div>

                    {/* Arrow between steps on mobile */}
                    {idx < steps.length - 1 && (
                      <div className="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-stone-300 z-10">
                        <i className="ri-arrow-down-line text-lg"></i>
                      </div>
                    )}

                    <span className="text-[10px] font-bold text-stone-300 mb-2">الخطوة {s.step}</span>
                    <h3 className="text-lg font-black text-stone-900 mb-1">{s.title}</h3>
                    <span className="text-stone-400 text-xs mb-3 block">{s.subtitle}</span>
                    <p className="text-stone-400 text-xs leading-relaxed font-light flex-1">{s.desc}</p>

                    {/* CTA */}
                    {isAuthStep ? (
                      user ? (
                        <span className="inline-flex items-center gap-1.5 mt-4 text-emerald-600 text-xs font-bold">
                          <i className="ri-checkbox-circle-fill"></i>
                          تم التسجيل
                        </span>
                      ) : (
                        <Link
                          to={s.link}
                          className="inline-flex items-center gap-1.5 mt-4 text-amber-600 hover:text-amber-700 text-xs font-bold cursor-pointer transition-colors group/link"
                        >
                          <span>سجّل الآن</span>
                          <i className="ri-arrow-left-line group-hover/link:-translate-x-0.5 transition-transform"></i>
                        </Link>
                      )
                    ) : (
                      <Link
                        to={s.link}
                        className="inline-flex items-center gap-1.5 mt-4 text-stone-400 hover:text-amber-600 text-xs font-bold cursor-pointer transition-colors group/link"
                      >
                        <span>اكتشف المزيد</span>
                        <i className="ri-arrow-left-line group-hover/link:-translate-x-0.5 transition-transform"></i>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
            >
              <i className="ri-dashboard-line"></i>
              اذهب إلى لوحة التحكم
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
            >
              <i className="ri-user-add-line"></i>
              سجّل وابدأ رحلتك الآن
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;