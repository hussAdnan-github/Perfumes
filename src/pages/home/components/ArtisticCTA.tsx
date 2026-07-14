import { useState } from "react";
import ConsultationModal from "@/components/feature/ConsultationModal";
import { Link } from "react-router-dom";

const ArtisticCTA = () => {
  const [showConsultModal, setShowConsultModal] = useState(false);

  return (
    <section className="relative bg-stone-950 py-24 md:py-32 overflow-hidden">
      {/* Background Visual */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=dark%20abstract%20artistic%20background%20with%20flowing%20golden%20liquid%20light%20streaks%20and%20delicate%20floating%20particles%2C%20luxurious%20mysterious%20atmosphere%2C%20deep%20obsidian%20tones%20with%20warm%20amber%20illumination%2C%20elegant%20ethereal%20composition%2C%20fine%20art%20aesthetic&width=1920&height=800&seq=cta-art-bg&orientation=landscape"
          alt=""
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40"></div>
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-600/5 blur-[150px]"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-amber-500/20"></div>
          <i className="ri-star-line text-amber-400/30 text-xs"></i>
          <div className="h-px w-16 bg-amber-500/20"></div>
        </div>

        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
          قصتك تستحق
          <br />
          <span className="text-amber-400">أن تُروى بعطر</span>
        </h2>
        <p className="text-white/30 text-sm md:text-base max-w-lg mx-auto mb-12 leading-relaxed font-light">
          كل براند عظيم يبدأ بخطوة. ابدأ اليوم ودعنا نساعدك في تحويل فكرتك إلى عطر يخلّد اسمك.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowConsultModal(true)}
            className="group bg-amber-600 hover:bg-amber-500 text-white font-bold px-12 py-4 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 text-sm inline-flex items-center gap-2"
          >
            احجز استشارة مجانية
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
          </button>
          <Link
            to="/services"
            className="border border-white/10 hover:border-white/30 text-white/50 hover:text-white/80 font-medium px-12 py-4 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 text-sm"
          >
            تصفح الخدمات
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 inline-flex items-center gap-6 px-8 py-4 rounded-full bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <i className="ri-shield-check-line text-emerald-500/60"></i>
            <span>ضمان الجودة</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <i className="ri-time-line text-amber-400/60"></i>
            <span>تسليم في الموعد</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <i className="ri-lock-line text-amber-400/60"></i>
            <span>سرية تامة</span>
          </div>
        </div>
      </div>

      <ConsultationModal isOpen={showConsultModal} onClose={() => setShowConsultModal(false)} />
    </section>
  );
};

export default ArtisticCTA;