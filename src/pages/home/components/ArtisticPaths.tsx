import { Link } from "react-router-dom";

const paths = [
  {
    id: "A",
    letter: "أ",
    title: "براند كامل",
    subtitle: "Full Brand",
    desc: "من الصفر إلى الإطلاق، نبني معاً برانداً عطرياً متكاملاً يحمل بصمتك ويروي قصتك.",
    gradient: "from-amber-700 to-amber-900",
    glow: "bg-amber-500/20",
    icon: "ri-award-fill",
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20complete%20collection%20elegant%20bottles%20arranged%20on%20dark%20marble%20surface%20with%20golden%20light%20rays%2C%20sophisticated%20branding%20materials%20moodboard%2C%20premium%20fragrance%20product%20photography%2C%20deep%20black%20background%20with%20warm%20amber%20tones%2C%20artistic%20composition&width=700&height=500&seq=path-a-gallery&orientation=landscape"
  },
  {
    id: "B",
    letter: "ب",
    title: "تطوير عطر",
    subtitle: "Fragrance",
    desc: "تركيبة عطرية فريدة تُطوَّر خصيصاً لك، مع عينات متعددة وتقييم دقيق حتى الكمال.",
    gradient: "from-rose-700 to-rose-900",
    glow: "bg-rose-500/20",
    icon: "ri-drop-fill",
    image: "https://readdy.ai/api/search-image?query=perfume%20development%20laboratory%20scene%20with%20essential%20oils%20and%20aromatic%20ingredients%20beautifully%20arranged%2C%20glass%20bottles%20and%20testing%20strips%20on%20dark%20table%2C%20warm%20diffused%20lighting%2C%20elegant%20scientific%20aesthetic%2C%20fragrance%20creation%20artistry%2C%20moody%20atmospheric%20photography&width=700&height=500&seq=path-b-gallery&orientation=landscape"
  },
  {
    id: "C",
    letter: "ج",
    title: "تغليف وعبوة",
    subtitle: "Packaging",
    desc: "تصميم وتنفيذ عبوة استثنائية تعكس هوية براندك وتجذب الأنظار في نقطة البيع.",
    gradient: "from-emerald-700 to-emerald-900",
    glow: "bg-emerald-500/20",
    icon: "ri-gift-fill",
    image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20packaging%20design%20elegant%20boxes%20with%20gold%20foil%20embossing%20and%20rich%20textures%2C%20premium%20materials%20presentation%2C%20dark%20sophisticated%20background%20with%20soft%20spotlight%2C%20artistic%20product%20photography%20showcasing%20packaging%20craftsmanship&width=700&height=500&seq=path-c-gallery&orientation=landscape"
  },
  {
    id: "D",
    letter: "د",
    title: "هوية بصرية",
    subtitle: "Identity",
    desc: "نظام بصري متكامل — شعار، ألوان، خطوط، وتطبيقات تمنح براندك شخصية لا تُنسى.",
    gradient: "from-violet-700 to-violet-900",
    glow: "bg-violet-500/20",
    icon: "ri-palette-fill",
    image: "https://readdy.ai/api/search-image?query=luxury%20brand%20visual%20identity%20design%20concept%2C%20elegant%20logo%20sketches%20and%20typography%20samples%20arranged%20on%20dark%20surface%2C%20color%20palette%20swatches%20with%20gold%20accents%2C%20sophisticated%20branding%20studio%20aesthetic%2C%20moody%20artistic%20composition&width=700&height=500&seq=path-d-gallery&orientation=landscape"
  },
  {
    id: "E",
    letter: "هـ",
    title: "تصنيع",
    subtitle: "Manufacturing",
    desc: "نحوّل تصميمك وتركيبتك إلى منتج حقيقي بأعلى معايير الجودة والدقة في التنفيذ.",
    gradient: "from-sky-700 to-sky-900",
    glow: "bg-sky-500/20",
    icon: "ri-settings-fill",
    image: "https://readdy.ai/api/search-image?query=modern%20perfume%20manufacturing%20facility%20clean%20industrial%20aesthetic%2C%20precise%20filling%20machinery%20and%20quality%20control%20process%2C%20elegant%20production%20line%2C%20warm%20ambient%20lighting%2C%20professional%20craftsmanship%2C%20sophisticated%20industrial%20photography&width=700&height=500&seq=path-e-gallery&orientation=landscape"
  },
  {
    id: "F",
    letter: "و",
    title: "طباعة وتنفيذ",
    subtitle: "Print",
    desc: "تنفيذ ملفاتك الجاهزة بأعلى جودة طباعة وأسرع وقت، مع ضمان دقة الألوان والتشطيبات.",
    gradient: "from-stone-600 to-stone-800",
    glow: "bg-stone-500/20",
    icon: "ri-printer-fill",
    image: "https://readdy.ai/api/search-image?query=professional%20luxury%20printing%20production%2C%20high%20quality%20labels%20and%20packaging%20materials%20with%20gold%20foil%20finishing%2C%20elegant%20print%20results%20displayed%20on%20dark%20surface%2C%20warm%20studio%20lighting%2C%20sophisticated%20craftsmanship%20showcase&width=700&height=500&seq=path-f-gallery&orientation=landscape"
  },
];

const ArtisticPaths = () => {
  return (
    <section id="paths" className="relative bg-stone-950 py-24 md:py-32 overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, #d97706 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-amber-400/50 text-xs font-light tracking-[0.3em] uppercase block mb-6">
            المسارات الستة
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            كل رحلة
            <br />
            <span className="text-amber-400">تبدأ بخطوة</span>
          </h2>
          <p className="text-white/30 text-sm md:text-base max-w-md mx-auto leading-relaxed font-light">
            ستة مسارات متخصصة، صُممت بعناية لتناسب كل مرحلة من مراحل رحلتك العطرية
          </p>
        </div>

        {/* Paths Gallery */}
        <div className="space-y-6">
          {paths.map((path, idx) => (
            <Link
              key={path.id}
              to={`/services/${path.id}`}
              className="group block relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[220px]">
                {/* Visual Side */}
                <div className={`lg:col-span-5 relative overflow-hidden ${idx % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative h-52 lg:h-full overflow-hidden rounded-2xl lg:rounded-none lg:rounded-r-2xl">
                    <img
                      src={path.image}
                      alt={path.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${path.gradient} opacity-50 group-hover:opacity-30 transition-opacity duration-500`}></div>

                    {/* Letter Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/15 text-[180px] font-black select-none leading-none">
                        {path.letter}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`lg:col-span-7 bg-stone-900/80 backdrop-blur-sm border border-white/5 p-8 lg:p-10 flex flex-col justify-center rounded-2xl lg:rounded-none transition-all duration-500 group-hover:border-white/10 group-hover:bg-stone-900/95 ${idx % 2 === 0 ? "lg:order-2 lg:rounded-l-2xl" : "lg:order-1 lg:rounded-l-2xl lg:rounded-r-2xl"}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${path.gradient}`}>
                      <i className={`${path.icon} text-white text-base`}></i>
                    </div>
                    <div>
                      <span className="text-amber-400/60 text-xs font-bold tracking-wider">المسار {path.id}</span>
                      <div className="text-white/30 text-xs font-light">{path.subtitle}</div>
                    </div>
                    <div className="mr-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <span className="text-amber-400 text-xs font-bold whitespace-nowrap">استكشف</span>
                      <i className="ri-arrow-left-line text-amber-400 text-sm"></i>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white mb-3">{path.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xl font-light">{path.desc}</p>

                  {/* Divider */}
                  <div className="mt-5 w-12 h-px bg-gradient-to-l from-amber-400/30 to-transparent"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtisticPaths;