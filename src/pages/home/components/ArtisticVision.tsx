const ArtisticVision = () => {
  return (
    <section id="vision" className="relative bg-stone-950 py-24 md:py-32 overflow-hidden">
      {/* Accent elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-600/3 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-rose-600/3 blur-[100px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=elegant%20abstract%20artistic%20composition%20representing%20fragrance%20creation%20journey%2C%20flowing%20golden%20amber%20liquid%20forms%20merging%20with%20dark%20mysterious%20space%2C%20delicate%20smoke%20wisps%20and%20floating%20particles%2C%20luxurious%20fine%20art%20aesthetic%2C%20warm%20and%20deep%20tones%2C%20sophisticated%20minimalist%20abstract%20art&width=700&height=900&seq=vision-art-01&orientation=portrait"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent"></div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 max-w-[200px]">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 mb-3">
                <i className="ri-drop-line text-amber-400 text-sm"></i>
              </div>
              <div className="text-white text-sm font-black mb-1">+200</div>
              <div className="text-white/30 text-xs font-light">تركيبة حصرية</div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-amber-600/90 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold whitespace-nowrap">متاح الآن</span>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="text-amber-400/50 text-xs font-light tracking-[0.3em] uppercase block mb-6">
              رؤيتنا
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              العطر
              <br />
              <span className="text-amber-400">ليس مجرد رائحة</span>
            </h2>
            <p className="text-white/35 text-sm md:text-base leading-relaxed mb-8 font-light">
              العطر هو الهوية التي تسبقك إلى الغرفة. هو الذكرى التي تبقى بعد أن تغادر.
              في منصتنا، ندمج بين علم تركيب العطور، والذكاء الاصطناعي، والحسّ الفني
              لنصنع معاً براندات عطرية تُخلّد في ذاكرة الأسواق.
            </p>

            {/* Pillars */}
            <div className="space-y-4">
              {[
                { icon: "ri-robot-2-line", title: "ذكاء اصطناعي", desc: "نظام ذكي يحلل السوق ويقترح التوجهات المثالية لمشروعك" },
                { icon: "ri-team-line", title: "خبراء معتمدون", desc: "فريق من أمهر خبراء العطور والمصممين في العالم العربي" },
                { icon: "ri-git-branch-line", title: "منهجية محكمة", desc: "20 مرحلة عمل متكاملة تضمن عدم وجود أخطاء أو تأخير في التنفيذ" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/10 flex-shrink-0">
                    <i className={`${item.icon} text-amber-400 text-base`}></i>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm mb-0.5">{item.title}</div>
                    <div className="text-white/30 text-xs leading-relaxed font-light">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats inline */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              {[
                { num: "20", label: "مرحلة عمل" },
                { num: "6", label: "مسار خدمي" },
                { num: "8", label: "طرف متخصص" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-black text-amber-400 mb-1">{s.num}</div>
                  <div className="text-white/20 text-xs font-light">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisticVision;