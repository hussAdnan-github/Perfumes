import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const services = [
  {
    id: "A",
    letter: "أ",
    title: "براند عطور كامل",
    subtitle: "Full Brand",
    desc: "رحلة متكاملة من الفكرة إلى الإطلاق — تركيبة عطرية فريدة، هوية بصرية مميزة، عبوة استثنائية، وتصنيع احترافي.",
    features: ["تطوير تركيبة حصرية", "هوية بصرية متكاملة", "عبوة وتغليف مخصص", "تصنيع وإطلاق"],
    icon: "ri-award-fill",
    color: "amber",
  },
  {
    id: "B",
    letter: "ب",
    title: "تطوير عطر",
    subtitle: "Fragrance",
    desc: "خبراء العطور يطورون تركيبة فريدة تُعبّر عن جوهر براندك، مع عينات متعددة وتقييم دقيق حتى الوصول للكمال.",
    features: ["تحليل السوق والاتجاهات", "تركيبة حصرية مخصصة", "3 عينات تطوير", "تقرير جودة معتمد"],
    icon: "ri-drop-fill",
    color: "rose",
  },
  {
    id: "C",
    letter: "ج",
    title: "عبوة وتغليف",
    subtitle: "Packaging",
    desc: "تصميم مبتكر وتنفيذ دقيق لعبوة تعكس هوية براندك وتجذب الأنظار في نقاط البيع والمنصات الرقمية.",
    features: ["تصميم 3D تفاعلي", "خامات فاخرة متنوعة", "طباعة بجودة عالية", "نماذج أولية"],
    icon: "ri-gift-fill",
    color: "emerald",
  },
  {
    id: "D",
    letter: "د",
    title: "هوية بصرية",
    subtitle: "Visual Identity",
    desc: "نظام بصري متكامل يمنح براندك شخصية لا تُنسى — شعار، ألوان، خطوط، وتطبيقات احترافية لكل قنواتك.",
    features: ["شعار فريد وذو معنى", "دليل هوية بصرية", "تصاميم سوشيال ميديا", "مواد تسويقية"],
    icon: "ri-palette-fill",
    color: "violet",
  },
  {
    id: "E",
    letter: "هـ",
    title: "تصنيع",
    subtitle: "Manufacturing",
    desc: "تحويل تصميمك وتركيبتك إلى منتج حقيقي بأعلى معايير الجودة والدقة في التنفيذ مع ضمان الجودة الشامل.",
    features: ["مرافق معتمدة دولياً", "تعبئة وتغليف احترافي", "فحص جودة صارم", "تسليم في الموعد"],
    icon: "ri-settings-fill",
    color: "sky",
  },
  {
    id: "F",
    letter: "و",
    title: "طباعة وتنفيذ",
    subtitle: "Print",
    desc: "تنفيذ ملفاتك الجاهزة بأعلى جودة طباعة وأسرع وقت توصيل، مع ضمان دقة الألوان والتشطيبات الفاخرة.",
    features: ["طباعة فاخرة متعددة", "تشطيبات خاصة (فويل/تجعيد)", "دقة ألوان مضمونة", "توصيل سريع"],
    icon: "ri-printer-fill",
    color: "stone",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; hoverBorder: string; hoverBg: string; dot: string }> = {
  amber: {
    bg: "bg-amber-50/50",
    border: "border-amber-100",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
    hoverBorder: "group-hover:border-amber-300",
    hoverBg: "group-hover:bg-amber-50",
    dot: "bg-amber-400",
  },
  rose: {
    bg: "bg-rose-50/50",
    border: "border-rose-100",
    text: "text-rose-600",
    iconBg: "bg-rose-100",
    hoverBorder: "group-hover:border-rose-300",
    hoverBg: "group-hover:bg-rose-50",
    dot: "bg-rose-400",
  },
  emerald: {
    bg: "bg-emerald-50/50",
    border: "border-emerald-100",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
    hoverBorder: "group-hover:border-emerald-300",
    hoverBg: "group-hover:bg-emerald-50",
    dot: "bg-emerald-400",
  },
  violet: {
    bg: "bg-violet-50/50",
    border: "border-violet-100",
    text: "text-violet-600",
    iconBg: "bg-violet-100",
    hoverBorder: "group-hover:border-violet-300",
    hoverBg: "group-hover:bg-violet-50",
    dot: "bg-violet-400",
  },
  sky: {
    bg: "bg-sky-50/50",
    border: "border-sky-100",
    text: "text-sky-600",
    iconBg: "bg-sky-100",
    hoverBorder: "group-hover:border-sky-300",
    hoverBg: "group-hover:bg-sky-50",
    dot: "bg-sky-400",
  },
  stone: {
    bg: "bg-stone-50/50",
    border: "border-stone-200",
    text: "text-stone-600",
    iconBg: "bg-stone-100",
    hoverBorder: "group-hover:border-stone-300",
    hoverBg: "group-hover:bg-stone-100",
    dot: "bg-stone-400",
  },
};

const ServicesShowcase = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setTimeout(() => {
              setVisibleCards((prev) => {
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
            }, idx * 120);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="relative bg-stone-950 py-24 md:py-32 overflow-hidden" ref={sectionRef}>
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, #d97706 1px, transparent 1px), radial-gradient(circle at 80% 20%, #d97706 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      ></div>

      {/* Top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-amber-600/5 blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-amber-500/30"></div>
            <span className="text-amber-400/60 text-xs font-light tracking-[0.25em] uppercase">
              خدماتنا
            </span>
            <div className="h-px w-10 bg-amber-500/30"></div>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            ستة مسارات
            <br />
            <span className="text-amber-400">لبراندك العطري</span>
          </h2>
          <p className="text-white/30 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
            كل خدمة صُممت بعناية لتناسب مرحلة مختلفة من رحلتك — ابدأ من أي نقطة ونكمل معك حتى الإطلاق
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => {
            const c = colorMap[service.color];
            const isVisible = visibleCards.has(idx);

            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                data-index={idx}
                className={`group relative block rounded-2xl border ${c.border} bg-stone-900/40 backdrop-blur-sm p-7 md:p-8 transition-all duration-700 ${c.hoverBg} hover:border-opacity-30 hover:shadow-lg cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Letter watermark */}
                <span className="absolute top-4 left-4 text-white/[0.03] text-7xl font-black select-none leading-none pointer-events-none">
                  {service.letter}
                </span>

                {/* Top Row: Icon + ID */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${c.iconBg} transition-transform duration-500 group-hover:scale-110`}>
                    <i className={`${service.icon} ${c.text} text-lg`}></i>
                  </div>
                  <span className={`text-xs font-bold tracking-wider ${c.text} opacity-60`}>
                    المسار {service.id}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-black text-white mb-1 relative z-10 group-hover:text-amber-300 transition-colors duration-500">
                  {service.title}
                </h3>
                <span className="text-white/15 text-[10px] font-light tracking-wider uppercase block mb-4">
                  {service.subtitle}
                </span>

                {/* Description */}
                <p className="text-white/35 text-sm leading-relaxed font-light mb-5 relative z-10">
                  {service.desc}
                </p>

                {/* Divider */}
                <div className={`w-10 h-px ${c.iconBg} mb-4 transition-all duration-500 group-hover:w-16`}></div>

                {/* Features list */}
                <ul className="space-y-2 relative z-10">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-white/40 text-xs font-light">
                      <div className={`w-1 h-1 rounded-full ${c.dot} opacity-50 flex-shrink-0`}></div>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Hover arrow */}
                <div className="absolute bottom-7 left-7 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                  <span className={`text-xs font-bold ${c.text}`}>استكشف المسار</span>
                  <i className="ri-arrow-left-line text-xs text-amber-400"></i>
                </div>

                {/* Bottom highlight line on hover */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 ${c.iconBg} transition-all duration-700 rounded-full`}></div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 text-amber-400/70 hover:text-amber-300 text-sm font-medium transition-colors duration-500 cursor-pointer group"
          >
            <span>تصفح كل الخدمات بالتفصيل</span>
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;