import { useState } from "react";
import { Link } from "react-router-dom";

interface CostItem {
  label: string;
  icon: string;
  baseUnit: number;
  included: boolean;
}

const costItems: CostItem[] = [
  { label: "تكلفة التركيبة العطرية", icon: "ri-drop-line", baseUnit: 18, included: true },
  { label: "تكلفة العبوة (زجاجة + غطاء)", icon: "ri-flask-line", baseUnit: 22, included: true },
  { label: "تكلفة الطباعة والاستيكر", icon: "ri-printer-line", baseUnit: 4, included: true },
  { label: "تكلفة التغليف والعلبة", icon: "ri-gift-2-line", baseUnit: 8, included: true },
  { label: "تكلفة التصميم", icon: "ri-palette-line", baseUnit: 5, included: true },
  { label: "تكلفة التشغيل والتعبئة", icon: "ri-settings-3-line", baseUnit: 6, included: true },
  { label: "الشحن والتوصيل", icon: "ri-truck-line", baseUnit: 3, included: false },
];

const tiers = [
  { qty: 500, discount: 0, label: "500 وحدة" },
  { qty: 1000, discount: 8, label: "1,000 وحدة" },
  { qty: 2500, discount: 15, label: "2,500 وحدة" },
  { qty: 5000, discount: 22, label: "5,000 وحدة" },
  { qty: 10000, discount: 30, label: "10,000 وحدة" },
];

const speedOptions = [
  { id: "standard", label: "قياسي", desc: "6-8 أسابيع", multiplier: 1 },
  { id: "express", label: "سريع", desc: "3-4 أسابيع", multiplier: 1.2 },
  { id: "urgent", label: "عاجل", desc: "1-2 أسبوع", multiplier: 1.5 },
];

const PricingPage = () => {
  const [quantity, setQuantity] = useState(1000);
  const [selectedTier, setSelectedTier] = useState(1);
  const [speed, setSpeed] = useState("standard");
  const [includeShipping, setIncludeShipping] = useState(false);
  const [samplesCount, setSamplesCount] = useState(3);
  const [designRounds, setDesignRounds] = useState(2);
  const [showQuotation, setShowQuotation] = useState(false);

  const speedMultiplier = speedOptions.find((s) => s.id === speed)?.multiplier ?? 1;
  const tierDiscount = tiers[selectedTier]?.discount ?? 0;

  const baseUnitCost = costItems
    .filter((item) => item.included || (item.label.includes("الشحن") && includeShipping))
    .reduce((sum, item) => sum + item.baseUnit, 0);

  const unitCostAfterSpeed = baseUnitCost * speedMultiplier;
  const unitCostAfterDiscount = unitCostAfterSpeed * (1 - tierDiscount / 100);
  const totalCost = unitCostAfterDiscount * quantity;
  const samplingCost = samplesCount * 500;
  const designCost = designRounds * 2000;
  const grandTotal = totalCost + samplingCost + designCost;
  const suggestedRetail = unitCostAfterDiscount * 3.5;

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">المرحلة 11A</span>
          <span className="text-stone-400 text-sm hidden md:block">التسعير التفصيلي</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/studio-3d" className="text-stone-500 hover:text-amber-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap hidden md:block">
            <i className="ri-arrow-right-line ml-1"></i>
            3D Studio
          </Link>
          <Link to="/dashboard/approvals" className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all">
            الموافقة والدفع
            <i className="ri-arrow-left-line mr-1"></i>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-xl">
              <i className="ri-price-tag-3-line text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900">التسعير التفصيلي</h1>
              <p className="text-stone-400 text-sm">المرحلة 11A — Detailed Pricing</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quantity Tiers */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 mb-5 flex items-center gap-2">
                <i className="ri-stack-line text-amber-700"></i>
                الكمية والشرائح
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                {tiers.map((tier, idx) => (
                  <button
                    key={tier.qty}
                    onClick={() => { setSelectedTier(idx); setQuantity(tier.qty); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      selectedTier === idx
                        ? "border-amber-600 bg-amber-50"
                        : "border-stone-200 hover:border-amber-300"
                    }`}
                  >
                    <div className={`font-black text-sm ${selectedTier === idx ? "text-amber-700" : "text-stone-700"}`}>
                      {tier.label}
                    </div>
                    {tier.discount > 0 && (
                      <div className="text-emerald-600 text-xs font-bold mt-1">خصم {tier.discount}%</div>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-stone-700 text-sm font-bold mb-2">
                  كمية مخصصة: <span className="text-amber-700">{quantity.toLocaleString()} وحدة</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 mb-5 flex items-center gap-2">
                <i className="ri-pie-chart-line text-amber-700"></i>
                تفصيل التكاليف (لكل وحدة)
              </h3>
              <div className="space-y-3">
                {costItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-lg">
                        <i className={`${item.icon} text-amber-700 text-sm`}></i>
                      </div>
                      <span className="text-stone-700 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 text-sm">{item.baseUnit} ريال</span>
                      {item.label.includes("الشحن") && (
                        <div
                          onClick={() => setIncludeShipping(!includeShipping)}
                          className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${
                            includeShipping ? "bg-amber-700" : "bg-stone-200"
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                            includeShipping ? "right-0.5" : "left-0.5"
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h3 className="font-black text-stone-900 mb-5 flex items-center gap-2">
                <i className="ri-settings-3-line text-amber-700"></i>
                خيارات إضافية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Speed */}
                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-3">سرعة التنفيذ</label>
                  <div className="space-y-2">
                    {speedOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSpeed(opt.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          speed === opt.id
                            ? "border-amber-600 bg-amber-50"
                            : "border-stone-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="text-right">
                          <div className={`text-sm font-bold ${speed === opt.id ? "text-amber-700" : "text-stone-700"}`}>
                            {opt.label}
                          </div>
                          <div className="text-stone-400 text-xs">{opt.desc}</div>
                        </div>
                        {opt.multiplier > 1 && (
                          <span className="text-xs font-bold text-rose-600 whitespace-nowrap">+{Math.round((opt.multiplier - 1) * 100)}%</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Samples */}
                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-3">
                    عدد العينات: <span className="text-amber-700">{samplesCount}</span>
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => setSamplesCount(Math.max(1, samplesCount - 1))}
                      className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors font-bold text-stone-700"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-stone-900 text-lg">{samplesCount}</span>
                    <button
                      onClick={() => setSamplesCount(Math.min(10, samplesCount + 1))}
                      className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors font-bold text-stone-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-stone-400 text-xs text-center">500 ريال / عينة</div>
                  <div className="text-amber-700 font-bold text-sm text-center mt-1">
                    {(samplesCount * 500).toLocaleString()} ريال
                  </div>
                </div>

                {/* Design Rounds */}
                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-3">
                    جولات التصميم: <span className="text-amber-700">{designRounds}</span>
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => setDesignRounds(Math.max(1, designRounds - 1))}
                      className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors font-bold text-stone-700"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-stone-900 text-lg">{designRounds}</span>
                    <button
                      onClick={() => setDesignRounds(Math.min(5, designRounds + 1))}
                      className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors font-bold text-stone-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-stone-400 text-xs text-center">2,000 ريال / جولة</div>
                  <div className="text-amber-700 font-bold text-sm text-center mt-1">
                    {(designRounds * 2000).toLocaleString()} ريال
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            {/* Cost Summary */}
            <div className="bg-stone-900 rounded-2xl p-6 text-white">
              <h3 className="font-black text-white mb-5 text-sm">ملخص التسعير</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">تكلفة الوحدة (قبل الخصم)</span>
                  <span className="font-bold">{unitCostAfterSpeed.toFixed(1)} ريال</span>
                </div>
                {tierDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">خصم الكمية ({tierDiscount}%)</span>
                    <span className="text-emerald-400 font-bold">-{(unitCostAfterSpeed * tierDiscount / 100).toFixed(1)} ريال</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                  <span className="text-white/60">تكلفة الوحدة النهائية</span>
                  <span className="font-black text-amber-400 text-base">{unitCostAfterDiscount.toFixed(1)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">الكمية</span>
                  <span className="font-bold">{quantity.toLocaleString()} وحدة</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                  <span className="text-white/60">إجمالي الإنتاج</span>
                  <span className="font-bold">{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">العينات ({samplesCount})</span>
                  <span className="font-bold">{samplingCost.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">التصميم ({designRounds} جولات)</span>
                  <span className="font-bold">{designCost.toLocaleString()} ريال</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 font-bold">الإجمالي الكلي</span>
                  <span className="text-amber-400 font-black text-2xl">
                    {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="text-sm mr-1">ريال</span>
                  </span>
                </div>
              </div>

              {/* Suggested Retail */}
              <div className="bg-white/5 rounded-xl p-3 mb-5">
                <div className="text-white/40 text-xs mb-1">سعر البيع المقترح (اختياري)</div>
                <div className="text-white font-black text-lg">
                  {suggestedRetail.toFixed(0)} ريال
                  <span className="text-white/40 text-xs font-normal mr-2">/ وحدة</span>
                </div>
                <div className="text-emerald-400 text-xs mt-1">
                  هامش ربح تقديري: {((suggestedRetail - unitCostAfterDiscount) / suggestedRetail * 100).toFixed(0)}%
                </div>
              </div>

              <button
                onClick={() => setShowQuotation(true)}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
              >
                <i className="ri-file-text-line"></i>
                توليد عرض السعر
              </button>
            </div>

            {/* Tier Comparison */}
            <div className="bg-white rounded-2xl p-5 border border-stone-100">
              <h4 className="font-black text-stone-900 text-sm mb-4">مقارنة الشرائح</h4>
              <div className="space-y-2">
                {tiers.map((tier, idx) => {
                  const tierUnit = unitCostAfterSpeed * (1 - tier.discount / 100);
                  return (
                    <div
                      key={tier.qty}
                      onClick={() => { setSelectedTier(idx); setQuantity(tier.qty); }}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        selectedTier === idx ? "bg-amber-50 border border-amber-200" : "hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-stone-700 text-xs font-bold">{tier.label}</span>
                      <div className="text-left">
                        <div className={`text-xs font-black ${selectedTier === idx ? "text-amber-700" : "text-stone-700"}`}>
                          {tierUnit.toFixed(1)} ريال/وحدة
                        </div>
                        {tier.discount > 0 && (
                          <div className="text-emerald-600 text-xs">خصم {tier.discount}%</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100">
              <div className="text-stone-400 text-xs mb-1">حالة النظام</div>
              <div className="text-amber-700 font-black text-sm">Pricing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quotation Modal */}
      {showQuotation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-stone-900 text-xl">عرض السعر</h3>
              <button
                onClick={() => setShowQuotation(false)}
                className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-stone-600"></i>
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-black text-stone-900">براند الفجر</div>
                  <div className="text-stone-400 text-xs">#QT-2024-001 — {new Date().toLocaleDateString("ar-SA")}</div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-xl">
                  <i className="ri-file-text-line text-white"></i>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">الكمية</span>
                  <span className="font-bold">{quantity.toLocaleString()} وحدة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">تكلفة الوحدة</span>
                  <span className="font-bold">{unitCostAfterDiscount.toFixed(1)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">إجمالي الإنتاج</span>
                  <span className="font-bold">{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">العينات والتصميم</span>
                  <span className="font-bold">{(samplingCost + designCost).toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
                  <span className="font-black text-stone-900">الإجمالي</span>
                  <span className="font-black text-amber-700 text-lg">{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} ريال</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/dashboard/approvals"
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm text-center"
              >
                الموافقة والدفع
              </Link>
              <button
                onClick={() => setShowQuotation(false)}
                className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
              >
                تعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
