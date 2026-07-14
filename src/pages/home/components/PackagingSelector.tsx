import { useState, useMemo, useEffect, useRef } from "react";
import { packagingOptions, filterCategories } from "@/mocks/packagingData";
import type { PackagingOption } from "@/mocks/packagingData";

const PackagingSelector = () => {
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedShape, setSelectedShape] = useState("الكل");
  const [selectedSize, setSelectedSize] = useState("الكل");
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const activeFilters = useMemo(() => {
    const af: { label: string; key: string }[] = [];
    if (selectedType !== "الكل") af.push({ label: selectedType, key: "type" });
    if (selectedShape !== "الكل") af.push({ label: selectedShape, key: "shape" });
    if (selectedSize !== "الكل") af.push({ label: selectedSize, key: "size" });
    return af;
  }, [selectedType, selectedShape, selectedSize]);

  const filteredPackages = useMemo(() => {
    return packagingOptions.filter((pkg) => {
      if (selectedType !== "الكل" && pkg.type !== selectedType) return false;
      if (selectedShape !== "الكل" && pkg.shape !== selectedShape) return false;
      if (selectedSize !== "الكل" && pkg.size !== selectedSize) return false;
      return true;
    });
  }, [selectedType, selectedShape, selectedSize]);

  const clearFilters = () => {
    setSelectedType("الكل");
    setSelectedShape("الكل");
    setSelectedSize("الكل");
  };

  const selectedItem = useMemo(
    () => packagingOptions.find((p) => p.id === selectedPkg) ?? null,
    [selectedPkg],
  );

  return (
    <section ref={sectionRef} id="packaging" className="relative py-20 md:py-28">
      {/* Section Header */}
      <div
        className={`text-center mb-14 transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-amber-500/30"></div>
          <span className="text-amber-400/60 text-xs font-light tracking-[0.25em] uppercase">
            Packaging Studio
          </span>
          <div className="h-px w-8 bg-amber-500/30"></div>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
          اختر <span className="text-amber-400">شكل العبوة</span>
        </h2>
        <p className="text-white/35 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
          استعرض تشكيلتنا من العبوات الفاخرة واختر ما يناسب هوية براندك.
          فلترة ذكية حسب النوع والشكل والحجم
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className={`max-w-5xl mx-auto px-4 md:px-6 mb-10 transition-all duration-700 delay-100 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 md:p-6">
          {filterCategories.map((cat) => (
            <div key={cat.key} className="mb-4 last:mb-0">
              <div className="text-white/40 text-xs mb-3 font-light tracking-wide">{cat.label}</div>
              <div className="flex flex-wrap gap-2">
                {cat.options.map((opt) => {
                  const isActive =
                    (cat.key === "type" && selectedType === opt) ||
                    (cat.key === "shape" && selectedShape === opt) ||
                    (cat.key === "size" && selectedSize === opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (cat.key === "type") setSelectedType(opt);
                        if (cat.key === "shape") setSelectedShape(opt);
                        if (cat.key === "size") setSelectedSize(opt);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-300 ${
                        isActive
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-white/[0.04] text-white/50 border border-white/[0.06] hover:border-white/15 hover:text-white/70"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Active Filters + Clear */}
          {activeFilters.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3 flex-wrap">
              <span className="text-white/30 text-xs">الفلاتر النشطة:</span>
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full"
                >
                  {f.label}
                  <button
                    type="button"
                    onClick={() => {
                      if (f.key === "type") setSelectedType("الكل");
                      if (f.key === "shape") setSelectedShape("الكل");
                      if (f.key === "size") setSelectedSize("الكل");
                    }}
                    className="cursor-pointer hover:text-white transition-colors w-4 h-4 flex items-center justify-center"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-white/25 hover:text-white/60 text-xs cursor-pointer transition-colors mr-auto"
              >
                مسح الكل
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mt-3 text-white/25 text-xs">
            {filteredPackages.length} عبوة
          </div>
        </div>
      </div>

      {/* Packaging Grid */}
      <div
        className={`max-w-5xl mx-auto px-4 md:px-6 transition-all duration-700 delay-200 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <i className="ri-inbox-line text-3xl text-white/15"></i>
            </div>
            <p className="text-white/30 text-sm">لا توجد عبوات تطابق الفلاتر المحددة</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-amber-400/60 hover:text-amber-400 text-xs cursor-pointer transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredPackages.map((pkg, i) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkg(selectedPkg === pkg.id ? null : pkg.id)}
                className="group relative cursor-pointer text-right"
                style={{
                  opacity: 0,
                  animation: animateIn
                    ? `fadeInUp 0.5s ease-out ${0.1 + i * 0.06}s forwards`
                    : "none",
                }}
              >
                {/* Image Container */}
                <div
                  className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                    selectedPkg === pkg.id
                      ? "ring-2 ring-amber-400/60 scale-[1.02]"
                      : "ring-1 ring-white/[0.06] group-hover:ring-white/15"
                  }`}
                >
                  <div className="aspect-[4/5] w-full bg-gradient-to-b from-stone-900 to-stone-950 relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Selected check */}
                    {selectedPkg === pkg.id && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center animate-scale-in">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 px-1">
                  <h4
                    className={`text-sm font-bold transition-colors duration-300 ${
                      selectedPkg === pkg.id
                        ? "text-amber-300"
                        : "text-white/70 group-hover:text-white/90"
                    }`}
                  >
                    {pkg.name}
                  </h4>
                  <p className="text-white/25 text-xs mt-0.5 font-light">{pkg.nameEn}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-white/20 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {pkg.type}
                    </span>
                    <span className="text-white/20 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {pkg.shape}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Detail Panel */}
      {selectedItem && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
          <div
            className="relative bg-white/[0.03] backdrop-blur-sm border border-amber-500/15 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-5 items-center animate-scale-in"
          >
            <div className="w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-stone-900">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-white font-bold text-lg mb-1">{selectedItem.name}</h3>
              <p className="text-white/25 text-xs mb-3">{selectedItem.nameEn}</p>
              <p className="text-white/50 text-sm leading-relaxed">{selectedItem.description}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-end">
                <span className="text-amber-300/80 text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {selectedItem.type}
                </span>
                <span className="text-amber-300/80 text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {selectedItem.shape}
                </span>
                <span className="text-amber-300/80 text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {selectedItem.size}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPkg(null)}
              className="absolute top-3 left-3 md:static w-7 h-7 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] cursor-pointer transition-colors"
            >
              <i className="ri-close-line text-white/50 text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PackagingSelector;