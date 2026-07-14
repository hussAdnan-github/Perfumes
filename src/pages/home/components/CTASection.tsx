import { useState } from "react";
import ConsultationModal from "@/components/feature/ConsultationModal";

const CTASection = () => {
  const [showConsultModal, setShowConsultModal] = useState(false);

  return (
    <section className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-amber-700/30 border border-amber-600/50 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          <i className="ri-sparkling-line"></i>
          ابدأ رحلتك الآن
        </span>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          جاهز لبناء
          <br />
          <span className="text-amber-400">براندك العطري؟</span>
        </h2>

        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
          انضم لأكثر من 200 عميل بنوا برانداتهم معنا. ابدأ بـ Smart Onboarding المجاني واكتشف المسار الأنسب لمشروعك.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#onboarding"
            className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm inline-flex items-center justify-center gap-2"
          >
            <i className="ri-rocket-line"></i>
            ابدأ مجاناً
          </a>
          <button
            onClick={() => setShowConsultModal(true)}
            className="border border-white/30 hover:border-amber-400 text-white hover:text-amber-300 font-semibold px-10 py-4 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm inline-flex items-center justify-center gap-2"
          >
            <i className="ri-calendar-line"></i>
            احجز استشارة
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 text-white/40 text-sm">
          <div className="flex items-center gap-2">
            <i className="ri-shield-check-line text-emerald-400"></i>
            <span>دفع آمن</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-time-line text-amber-400"></i>
            <span>رد خلال 24 ساعة</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-customer-service-2-line text-sky-400"></i>
            <span>دعم فني مخصص</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-refresh-line text-violet-400"></i>
            <span>تعديلات حتى الرضا</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block">
        <div className="w-32 h-32 border border-amber-500/20 rounded-full flex items-center justify-center">
          <div className="w-24 h-24 border border-amber-500/30 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-amber-700/20 rounded-full flex items-center justify-center">
              <i className="ri-drop-line text-amber-400 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:block">
        <div className="w-32 h-32 border border-amber-500/20 rounded-full flex items-center justify-center">
          <div className="w-24 h-24 border border-amber-500/30 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-amber-700/20 rounded-full flex items-center justify-center">
              <i className="ri-award-line text-amber-400 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
      />
    </section>
  );
};

export default CTASection;
