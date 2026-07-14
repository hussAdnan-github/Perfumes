import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const portfolioItems = [
  {
    id: 1,
    title: "براند الفجر",
    subtitle: "عطور شرقية فاخرة",
    category: "براند كامل",
    image: "https://readdy.ai/api/search-image?query=luxury%20arabic%20perfume%20brand%20complete%20collection%2C%20elegant%20golden%20bottles%20with%20intricate%20patterns%20on%20dark%20marble%2C%20sophisticated%20middle%20eastern%20fragrance%20presentation%2C%20warm%20amber%20lighting%2C%20premium%20product%20photography%20with%20soft%20shadows%2C%20rich%20oriental%20aesthetic&width=600&height=500&seq=portfolio-01&orientation=portrait",
    tags: ["براند كامل", "عطور شرقية", "تغليف فاخر"],
  },
  {
    id: 2,
    title: "عطر مسك",
    subtitle: "تركيبة نيش حصرية",
    category: "تطوير عطر",
    image: "https://readdy.ai/api/search-image?query=elegant%20niche%20perfume%20bottle%20with%20minimal%20design%2C%20soft%20musk%20colored%20fragrance%2C%20artistic%20product%20photography%20on%20cream%20marble%2C%20delicate%20lighting%20highlighting%20glass%20texture%2C%20premium%20minimalist%20aesthetic%2C%20warm%20neutral%20tones%2C%20sophisticated%20composition&width=600&height=500&seq=portfolio-02&orientation=portrait",
    tags: ["تطوير عطر", "نيش", "تركيبة حصرية"],
  },
  {
    id: 3,
    title: "هوية نيش",
    subtitle: "هوية بصرية متكاملة",
    category: "هوية بصرية",
    image: "https://readdy.ai/api/search-image?query=luxury%20brand%20visual%20identity%20showcase%2C%20elegant%20logo%20design%20on%20premium%20stationery%2C%20sophisticated%20color%20palette%20cards%2C%20minimalist%20branding%20presentation%20on%20marble%20surface%2C%20artistic%20brand%20guidelines%20layout%2C%20warm%20cream%20and%20gold%20tones%2C%20editorial%20design%20aesthetic&width=600&height=500&seq=portfolio-03&orientation=portrait",
    tags: ["هوية بصرية", "شعار", "دليل العلامة"],
  },
  {
    id: 4,
    title: "عبوة كريستال",
    subtitle: "تغليف فاخر مخصص",
    category: "عبوة وتغليف",
    image: "https://readdy.ai/api/search-image?query=luxury%20custom%20perfume%20packaging%20design%2C%20premium%20gift%20box%20with%20gold%20foil%20details%2C%20elegant%20bottle%20presentation%2C%20sophisticated%20unboxing%20experience%2C%20refined%20packaging%20craftsmanship%2C%20warm%20ambient%20lighting%2C%20minimalist%20luxury%20aesthetic%20with%20amber%20accents&width=600&height=500&seq=portfolio-04&orientation=portrait",
    tags: ["تغليف", "عبوة", "تصميم 3D"],
  },
  {
    id: 5,
    title: "ليالي العود",
    subtitle: "براند عطور كامل",
    category: "براند كامل",
    image: "https://readdy.ai/api/search-image?query=oud%20perfume%20luxury%20brand%20collection%2C%20dark%20elegant%20bottles%20with%20gold%20accents%2C%20premium%20arabic%20fragrance%20presentation%2C%20sophisticated%20middle%20eastern%20aesthetic%2C%20warm%20intimate%20lighting%2C%20rich%20amber%20and%20dark%20wood%20tones%2C%20editorial%20product%20photography&width=600&height=500&seq=portfolio-05&orientation=portrait",
    tags: ["براند كامل", "عود", "إطلاق"],
  },
  {
    id: 6,
    title: "زهرة الخليج",
    subtitle: "تصنيع وتغليف",
    category: "تصنيع",
    image: "https://readdy.ai/api/search-image?query=professional%20perfume%20manufacturing%20facility%2C%20elegant%20production%20line%20with%20glass%20bottles%2C%20quality%20control%20process%2C%20modern%20clean%20industrial%20environment%2C%20sophisticated%20packaging%20machinery%2C%20warm%20professional%20lighting%2C%20premium%20production%20aesthetic&width=600&height=500&seq=portfolio-06&orientation=portrait",
    tags: ["تصنيع", "تغليف", "جودة"],
  },
];

const categories = ["الكل", "براند كامل", "تطوير عطر", "هوية بصرية", "عبوة وتغليف", "تصنيع"];

const PortfolioSection = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const [observerStarted, setObserverStarted] = useState(false);

  const filtered = activeCategory === "الكل"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (observerStarted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-portfolio-index"));
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
            }, idx * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-portfolio-index]");
    cards?.forEach((card) => observer.observe(card));
    setObserverStarted(true);
    return () => observer.disconnect();
  }, [activeCategory, observerStarted]);

  useEffect(() => {
    setVisibleItems(new Set());
    setObserverStarted(false);
  }, [activeCategory]);

  return (
    <section id="portfolio" ref={sectionRef} className="relative bg-white py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "radial-gradient(circle at 40% 60%, #b45309 1px, transparent 1px), radial-gradient(circle at 60% 40%, #b45309 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <i className="ri-image-2-line"></i>
            نماذج من أعمالنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
            أعمالنا تتحدث
            <span className="text-amber-600"> عنا</span>
          </h2>
          <p className="text-stone-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
            مجموعة مختارة من مشاريعنا الناجحة — كل مشروع قصة نجاح صنعناها معاً
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-amber-700 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const isVisible = visibleItems.has(idx);

            return (
              <div
                key={item.id}
                data-portfolio-index={idx}
                className={`group relative rounded-2xl overflow-hidden border border-stone-100 bg-white cursor-pointer transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[6/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-center">
                  <h3 className="font-black text-stone-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">{item.title}</h3>
                  <span className="text-stone-400 text-xs font-light">{item.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
              <i className="ri-image-2-line text-stone-300 text-2xl"></i>
            </div>
            <p className="text-stone-400 text-sm">لا توجد أعمال في هذه الفئة حالياً</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
          >
            <i className="ri-rocket-line"></i>
            ابدأ مشروعك وكن ضمن أعمالنا
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;