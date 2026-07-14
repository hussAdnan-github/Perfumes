import { useState } from "react";
import ConsultationModal from "@/components/feature/ConsultationModal";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"register" | "login" | "consult">("register");
  const [showConsultModal, setShowConsultModal] = useState(false);

  return (
    <section
      id="entry"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=luxury%20perfume%20bottles%20arranged%20elegantly%20on%20dark%20marble%20surface%20with%20golden%20light%20rays%20dramatic%20shadows%20artistic%20composition%20high%20end%20fragrance%20brand%20photography%20deep%20black%20background%20with%20warm%20amber%20golden%20tones%20bokeh%20effect%20professional%20studio%20lighting&width=1920&height=1080&seq=hero001&orientation=landscape"
          alt="خلفية عطور فاخرة"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Text */}
        <div className="flex-1 text-right">
          <span className="inline-block border border-amber-400/60 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            منصة العطور الاحترافية
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            ابنِ براندك العطري
            <br />
            <span className="text-amber-400">من الفكرة</span>
            <br />
            إلى الإطلاق
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
            منصة متكاملة تجمع بين الذكاء الاصطناعي وخبراء العطور لتحويل رؤيتك إلى براند عطري احترافي يُطلق في الأسواق.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mb-10">
            {[
              { num: "+200", label: "مشروع مكتمل" },
              { num: "+50", label: "براند مُطلق" },
              { num: "98%", label: "رضا العملاء" },
            ].map((stat) => (
              <div key={stat.label} className="text-right">
                <div className="text-3xl font-black text-amber-400">{stat.num}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#onboarding"
              className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm"
            >
              ابدأ الآن مجاناً
            </a>
            <a
              href="#workspace"
              className="border border-white/40 hover:border-amber-400 text-white hover:text-amber-300 font-semibold px-8 py-3.5 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm"
            >
              استكشف المنصة
            </a>
          </div>
        </div>

        {/* Right: Entry Card */}
        <div className="w-full lg:w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <h2 className="text-white text-xl font-bold mb-6 text-center">ادخل إلى المنصة</h2>

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-full p-1 mb-6">
            {[
              { key: "register", label: "تسجيل حساب" },
              { key: "login", label: "دخول سريع" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "register" | "login")}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-amber-700 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "register" && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="الاسم الكامل"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <input
                type="tel"
                placeholder="رقم الجوال"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <select className="w-full bg-white/10 border border-white/20 text-white/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors">
                <option value="" className="text-stone-800">نوع العميل</option>
                <option value="individual" className="text-stone-800">فرد</option>
                <option value="company" className="text-stone-800">شركة</option>
                <option value="distributor" className="text-stone-800">موزع</option>
                <option value="brand" className="text-stone-800">براند قائم</option>
              </select>
              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm whitespace-nowrap">
                إنشاء حساب
              </button>
            </div>
          )}

          {activeTab === "login" && (
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm whitespace-nowrap">
                دخول
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveTab("consult")}
              className="text-amber-300 hover:text-amber-200 text-sm cursor-pointer transition-colors"
            >
              أو طلب استشارة مباشرة &larr;
            </button>
          </div>

          {activeTab === "consult" && (
            <div className="mt-4 p-4 bg-amber-700/20 border border-amber-500/30 rounded-xl text-center">
              <i className="ri-customer-service-2-line text-amber-400 text-2xl mb-2 block"></i>
              <p className="text-white/80 text-sm mb-3">سيتواصل معك أحد خبرائنا خلال 24 ساعة</p>
              <button
                onClick={() => setShowConsultModal(true)}
                className="inline-block bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-6 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all"
              >
                اطلب استشارة الآن
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs">اكتشف المزيد</span>
        <i className="ri-arrow-down-line text-white/50 text-lg"></i>
      </div>

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
      />
    </section>
  );
};

export default HeroSection;
