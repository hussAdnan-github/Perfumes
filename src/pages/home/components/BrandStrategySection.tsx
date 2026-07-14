import { useState } from "react";

const brandPaths = [
  {
    id: "A",
    title: "إنشاء براند عطور كامل",
    icon: "ri-award-fill",
    desc: "من الاستراتيجية إلى الإطلاق — براند متكامل بهوية وعطر وتغليف",
    stages: ["استراتيجية البراند", "تطوير العطر", "الهوية البصرية", "التغليف", "التصنيع"],
    color: "from-amber-700 to-amber-900",
    badge: "الأكثر طلباً",
  },
  {
    id: "B",
    title: "تطوير عطر فقط",
    icon: "ri-drop-fill",
    desc: "تطوير تركيبة عطرية احترافية مع عينات وتقييم",
    stages: ["التوجه العطري", "تطوير التركيبة", "العينات", "الاعتماد"],
    color: "from-rose-700 to-rose-900",
    badge: null,
  },
  {
    id: "C",
    title: "عبوة واستيكر وتغليف",
    icon: "ri-gift-fill",
    desc: "تصميم وتنفيذ العبوة والتغليف الاحترافي",
    stages: ["تصميم العبوة", "الاستيكر", "التغليف", "الإنتاج"],
    color: "from-emerald-700 to-emerald-900",
    badge: null,
  },
  {
    id: "D",
    title: "هوية بصرية فقط",
    icon: "ri-palette-fill",
    desc: "تصميم هوية بصرية متكاملة للبراند",
    stages: ["الشعار", "الألوان", "الخطوط", "دليل الهوية"],
    color: "from-violet-700 to-violet-900",
    badge: null,
  },
  {
    id: "E",
    title: "تصنيع فقط",
    icon: "ri-settings-fill",
    desc: "تصنيع المنتج بناءً على تركيبة وتصميم جاهزين",
    stages: ["مراجعة التركيبة", "الإنتاج", "ضبط الجودة", "التسليم"],
    color: "from-sky-700 to-sky-900",
    badge: null,
  },
  {
    id: "F",
    title: "طباعة وتنفيذ فقط",
    icon: "ri-printer-fill",
    desc: "طباعة وتنفيذ ملفات جاهزة",
    stages: ["مراجعة الملفات", "الطباعة", "التشطيب", "التسليم"],
    color: "from-stone-600 to-stone-800",
    badge: null,
  },
];

const BrandStrategySection = () => {
  const [selectedPath, setSelectedPath] = useState("A");
  const selected = brandPaths.find((p) => p.id === selectedPath)!;

  return (
    <section id="brand" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-compass-3-line"></i>
            استراتيجية البراند
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            اختر مسارك
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            6 مسارات متخصصة — كل مشروع له طريقه الأنسب
          </p>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {brandPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`relative p-6 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                selectedPath === path.id
                  ? "border-amber-600 bg-amber-50"
                  : "border-stone-100 bg-stone-50 hover:border-amber-300"
              }`}
            >
              {path.badge && (
                <span className="absolute top-4 left-4 bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {path.badge}
                </span>
              )}
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${path.color} mb-4`}>
                <i className={`${path.icon} text-white text-xl`}></i>
              </div>
              <div className="font-black text-stone-900 text-sm mb-2">{path.title}</div>
              <div className="text-stone-500 text-xs leading-relaxed">{path.desc}</div>
            </button>
          ))}
        </div>

        {/* Selected Path Detail */}
        <div className={`bg-gradient-to-br ${selected.color} rounded-3xl p-10 text-white`}>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="text-amber-300 text-xs font-bold mb-3">المسار المختار — {selected.id}</div>
              <h3 className="text-3xl font-black mb-4">{selected.title}</h3>
              <p className="text-white/70 text-base leading-relaxed mb-8">{selected.desc}</p>

              {/* Brand Positioning Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "اسم البراند", placeholder: "مثال: الفجر" },
                  { label: "الفئة السعرية", placeholder: "فاخر / متوسط / اقتصادي" },
                  { label: "شريحة العملاء", placeholder: "رجال 25-45 / نساء 20-35" },
                  { label: "قنوات البيع", placeholder: "أونلاين / متاجر / كليهما" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-white/70 text-xs font-semibold mb-2">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stages */}
            <div className="w-full lg:w-72">
              <div className="text-white/70 text-xs font-bold mb-4">مراحل المسار</div>
              <div className="flex flex-col gap-3">
                {selected.stages.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
                    <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-full text-xs font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm font-semibold">{stage}</span>
                    {i === 0 && (
                      <span className="mr-auto bg-amber-500/30 text-amber-300 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                        جاري
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-white text-stone-900 font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all hover:bg-amber-100 text-sm">
                ابدأ هذا المسار
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStrategySection;
