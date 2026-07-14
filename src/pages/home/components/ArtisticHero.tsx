import { useState, useEffect, useRef } from "react";
import ConsultationModal from "@/components/feature/ConsultationModal";
import { Link } from "react-router-dom";

const floatingWords = [
  { text: "عود", x: "15%", top: "22%", delay: 0 },
  { text: "مسك", x: "78%", top: "18%", delay: 1.2 },
  { text: "عنبر", x: "55%", top: "35%", delay: 0.6 },
  { text: "وردة", x: "32%", top: "48%", delay: 2 },
  { text: "صندل", x: "88%", top: "55%", delay: 1.6 },
  { text: "ياسمين", x: "42%", top: "62%", delay: 0.3 },
  { text: "زعفران", x: "68%", top: "72%", delay: 1.9 },
  { text: "بخور", x: "22%", top: "80%", delay: 2.4 },
];

const ArtisticHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-950"
    >
      {/* Background Layers */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=dark%20luxurious%20abstract%20background%20with%20floating%20golden%20particles%20and%20delicate%20smoke%20wisps%2C%20deep%20obsidian%20tones%20with%20warm%20amber%20light%20rays%20piercing%20through%20darkness%2C%20elegant%20atmospheric%20composition%20reminiscent%20of%20fine%20fragrance%20artistry%2C%20mysterious%20and%20opulent%20mood%2C%20no%20text%20no%20logos%20no%20products&width=1920&height=1080&seq=art-hero-bg-01&orientation=landscape"
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-stone-950/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/30 to-stone-950/85"></div>
      </div>

      {/* Floating Words */}
      {floatingWords.map((word, i) => (
        <div
          key={word.text}
          className="absolute pointer-events-none select-none whitespace-nowrap"
          style={{
            left: word.x,
            top: word.top,
            animation: `floatWord ${5 + i * 1.2}s ease-in-out ${word.delay}s infinite alternate`,
            opacity: 0.12,
          }}
        >
          <span className="text-amber-300/40 text-4xl md:text-6xl font-black tracking-widest">
            {word.text}
          </span>
        </div>
      ))}

      {/* Center Light Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-amber-600/8 blur-[120px]"
        style={{
          transform: `translate(-50%, ${-50 + scrollY * 0.02}%) scale(${1 + scrollY * 0.0003})`,
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Subtitle line */}
        <div
          className="inline-flex items-center gap-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s", opacity: 0, animation: "fadeInUp 0.8s ease-out 0.2s forwards" }}
        >
          <div className="h-px w-10 bg-amber-500/40"></div>
          <span className="text-amber-400/70 text-xs font-light tracking-[0.3em] uppercase">
            Maison de Parfum
          </span>
          <div className="h-px w-10 bg-amber-500/40"></div>
        </div>

        {/* Main Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6"
          style={{ opacity: 0, animation: "fadeInUp 0.8s ease-out 0.4s forwards" }}
        >
          <span className="block text-amber-400 font-light text-xl md:text-2xl lg:text-3xl tracking-[0.15em] mb-3">
            من الفكرة
          </span>
          <span className="block">نصنع</span>
          <span className="block bg-gradient-to-l from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            الأثر
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-white/40 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light"
          style={{ opacity: 0, animation: "fadeInUp 0.8s ease-out 0.6s forwards" }}
        >
          منصة متكاملة تحوّل رؤيتك إلى براند عطري استثنائي —
          الذكاء الاصطناعي يلتقي بخبراء العطور لصناعة ما لا يُنسى
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ opacity: 0, animation: "fadeInUp 0.8s ease-out 0.8s forwards" }}
        >
          <Link
            to="/auth"
            className="group relative bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 md:px-10 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 text-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              سجّل وابدأ مشروعك
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
          <button
            onClick={() => setShowConsultModal(true)}
            className="group border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-8 md:px-10 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 text-sm inline-flex items-center gap-2"
          >
            احجز استشارة مجانية
            <i className="ri-customer-service-2-line group-hover:scale-110 transition-transform duration-500"></i>
          </button>
        </div>

        {/* Stats Row */}
        <div
          className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-8 max-w-md mx-auto"
          style={{ opacity: 0, animation: "fadeInUp 0.8s ease-out 1s forwards" }}
        >
          {[
            { num: "+200", label: "مشروع" },
            { num: "+50", label: "براند" },
            { num: "98%", label: "رضا" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-amber-400 mb-1">{stat.num}</div>
              <div className="text-white/30 text-xs font-light tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">استكشف</span>
        <div className="w-px h-8 bg-gradient-to-b from-amber-400/60 to-transparent animate-pulse"></div>
      </div>

      <ConsultationModal isOpen={showConsultModal} onClose={() => setShowConsultModal(false)} />
    </section>
  );
};

export default ArtisticHero;