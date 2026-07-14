const stages = [
  {
    step: "01",
    title: "الرؤية",
    titleEn: "Vision",
    desc: "نستمع لقصتك ونفهم رؤيتك. كل براند يبدأ بحلم، ونحن هنا لنحوله إلى واقع.",
    icon: "ri-eye-line",
  },
  {
    step: "02",
    title: "الصياغة",
    titleEn: "Formulation",
    desc: "خبراء العطور يصيغون تركيبة فريدة تعبّر عن جوهر براندك. نوتات متوازنة تروي حكاية.",
    icon: "ri-drop-line",
  },
  {
    step: "03",
    title: "التجسيد",
    titleEn: "Embodiment",
    desc: "الهوية البصرية والعبوة تتجسدان في تصميم يعكس روح العطر قبل أن يُفتح.",
    icon: "ri-shapes-line",
  },
  {
    step: "04",
    title: "الإطلاق",
    titleEn: "Launch",
    desc: "منتجك يصل إلى العالم. براند متكامل، جاهز للمنافسة في أرقى أسواق العطور.",
    icon: "ri-rocket-line",
  },
];

const ArtisticCraft = () => {
  return (
    <section id="craft" className="relative bg-stone-950 py-24 md:py-32 overflow-hidden">
      {/* Accent Glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-[150px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-amber-400/50 text-xs font-light tracking-[0.3em] uppercase block mb-6">
            الحرفية
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            من الخيال
            <br />
            <span className="text-amber-400">إلى الواقع</span>
          </h2>
          <p className="text-white/30 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
            أربع مراحل نعبر فيها معاً من فكرة في خيالك إلى براند عطري ملموس يُباع في الأسواق
          </p>
        </div>

        {/* Stages Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute right-0 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/30 via-amber-400/10 to-transparent hidden md:block"></div>

          <div className="space-y-16 md:space-y-24">
            {stages.map((stage, idx) => (
              <div
                key={stage.step}
                className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Node */}
                <div className="hidden md:flex absolute right-1/2 top-0 -translate-x-1/2 w-12 h-12 items-center justify-center rounded-full bg-stone-900 border-2 border-amber-500/30 z-10">
                  <span className="text-amber-400 text-xs font-black">{stage.step}</span>
                </div>

                {/* Content */}
                <div className={`flex-1 ${idx % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20 md:text-left"}`}>
                  {/* Mobile dot */}
                  <div className="flex items-center gap-4 md:hidden mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                      <span className="text-amber-400 text-xs font-black">{stage.step}</span>
                    </div>
                    <div>
                      <span className="text-white/30 text-xs font-light tracking-wider">{stage.titleEn}</span>
                    </div>
                  </div>

                  <div className="bg-stone-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-7 md:p-8 hover:border-amber-500/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-500/10 flex-shrink-0">
                        <i className={`${stage.icon} text-amber-400 text-sm`}></i>
                      </div>
                      <h3 className="text-xl font-black text-white">{stage.title}</h3>
                      <span className="hidden md:inline text-white/15 text-xs font-light tracking-wider">{stage.titleEn}</span>
                    </div>
                    <p className="text-white/35 text-sm leading-relaxed font-light">{stage.desc}</p>
                  </div>
                </div>

                {/* Empty spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisticCraft;