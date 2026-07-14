import { useState, useMemo } from "react";
import { packagingOptions, filterCategories } from "@/mocks/packagingData";
import type { PackagingOption } from "@/mocks/packagingData";

interface SamplesGalleryProps {
  onSelectSample?: (sample: PackagingOption) => void;
  selectedId?: string;
}

const SamplesGallery = ({ onSelectSample, selectedId }: SamplesGalleryProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    type: "الكل",
    shape: "الكل",
    size: "الكل",
  });
  const [activeKey, setActiveKey] = useState("");

  const filteredSamples = useMemo(() => {
    return packagingOptions.filter((pkg) => {
      if (activeFilters.type !== "الكل" && pkg.type !== activeFilters.type) return false;
      if (activeFilters.shape !== "الكل" && pkg.shape !== activeFilters.shape) return false;
      if (activeFilters.size !== "الكل" && pkg.size !== activeFilters.size) return false;
      return true;
    });
  }, [activeFilters]);

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [category]: value }));
    setActiveKey(category + "-" + value + "-" + Date.now());
  };

  const clearAllFilters = () => {
    setActiveFilters({ type: "الكل", shape: "الكل", size: "الكل" });
    setActiveKey("clear-" + Date.now());
  };

  const hasActiveFilters = activeFilters.type !== "الكل" || activeFilters.shape !== "الكل" || activeFilters.size !== "الكل";

  const shapeToIcon: Record<string, string> = {
    "أسطواني": "ri-checkbox-blank-line",
    "دائري": "ri-checkbox-blank-circle-line",
    "مربع": "ri-checkbox-blank-line",
    "بيضاوي": "ri-radio-button-line",
  };

  return (
    <section className="mt-12" key={activeKey}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl">
            <i className="ri-gallery-view-2 text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-white">معرض العينات</h2>
            <p className="text-white/35 text-sm">
              تصفح عينات العبوات الجاهزة واستلهم التصميم المناسب —{" "}
              <span className="text-amber-400 font-bold">{filteredSamples.length}</span> عينة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedId && (
            <span className="bg-amber-700/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap animate-pulse">
              <i className="ri-check-line ml-1"></i>
              تم تحديد عينة
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-white/30 hover:text-amber-400 text-xs font-medium cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <i className="ri-close-circle-line"></i>
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-7 bg-stone-900 rounded-2xl border border-white/8 px-5 py-4">
        {filterCategories.map((cat) => (
          <div key={cat.key} className="flex items-center gap-2.5">
            <span className="text-white/35 text-xs font-bold whitespace-nowrap">{cat.label}:</span>
            <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg">
              {cat.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleFilterChange(cat.key, opt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilters[cat.key] === opt
                      ? "bg-amber-700 text-white shadow-sm"
                      : "text-white/35 hover:text-white/65 hover:bg-stone-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-white/25 text-[10px] font-bold whitespace-nowrap">الفلاتر النشطة:</span>
          {Object.entries(activeFilters).map(([key, val]) =>
            val !== "الكل" ? (
              <span
                key={key}
                className="bg-amber-700/15 border border-amber-600/25 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5"
              >
                {filterCategories.find((c) => c.key === key)?.label}: {val}
                <button
                  onClick={() => handleFilterChange(key, "الكل")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  <i className="ri-close-line"></i>
                </button>
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Samples Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredSamples.map((pkg, idx) => (
          <button
            key={pkg.id}
            onClick={() => onSelectSample?.(pkg)}
            className={`bg-stone-900 rounded-xl border overflow-hidden transition-all cursor-pointer text-right group ${
              selectedId === pkg.id
                ? "border-amber-500 ring-2 ring-amber-500/20 scale-[1.02]"
                : "border-white/8 hover:border-white/15"
            }`}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.4s ease-out ${idx * 0.06}s forwards`,
            }}
          >
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-stone-800 to-stone-900">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Selection indicator */}
              {selectedId === pkg.id && (
                <div className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-amber-500 rounded-full shadow-lg z-10">
                  <i className="ri-check-line text-white text-xs"></i>
                </div>
              )}

              {/* Type badge */}
              <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5 z-10">
                <span className="text-white/70 text-[9px] font-bold whitespace-nowrap">{pkg.size}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="text-white/80 text-xs font-bold leading-tight mb-0.5">{pkg.name}</div>
              <div className="text-white/25 text-[10px] mb-2">{pkg.nameEn}</div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-stone-800 text-white/35 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap flex items-center gap-1">
                  <i className={shapeToIcon[pkg.shape] || "ri-shapes-line"}></i>
                  {pkg.shape}
                </span>
                <span className="bg-stone-800 text-white/35 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                  {pkg.type}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredSamples.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4 bg-stone-900 rounded-2xl border border-white/8">
            <i className="ri-inbox-line text-white/15 text-3xl"></i>
          </div>
          <p className="text-white/25 text-sm font-bold mb-1">لا توجد عينات مطابقة</p>
          <p className="text-white/15 text-xs mb-4">جرّب تغيير الفلاتر المحددة</p>
          <button
            onClick={clearAllFilters}
            className="bg-white/10 hover:bg-white/15 text-white/60 hover:text-white/80 text-xs font-bold px-5 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all"
          >
            <i className="ri-refresh-line ml-1.5"></i>
            مسح جميع الفلاتر
          </button>
        </div>
      )}
    </section>
  );
};

export default SamplesGallery;