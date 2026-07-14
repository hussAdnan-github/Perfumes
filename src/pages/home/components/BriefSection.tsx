import { useState } from "react";

const BriefSection = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    idea: "",
    productType: "",
    targetMarket: "",
    budget: "",
    timeline: "",
    quantity: "",
    personality: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const requiredFields = ["projectName", "idea", "productType", "targetMarket"];
    const missingFields = requiredFields.filter((f) => !formData[f as keyof typeof formData]);
    if (missingFields.length > 0) {
      setMissing(missingFields);
      return;
    }
    setMissing([]);
    setSubmitted(true);
  };

  const fieldLabels: Record<string, string> = {
    projectName: "اسم المشروع",
    idea: "وصف الفكرة",
    productType: "نوع المنتج",
    targetMarket: "السوق المستهدف",
  };

  return (
    <section id="brief" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-file-text-line"></i>
            البريف الأساسي
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            بناء الـ Brief
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            أدخل بيانات مشروعك وسيحوّلها الذكاء الاصطناعي إلى بريف منظم واحترافي
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Image */}
          <div className="w-full lg:w-[420px] rounded-3xl overflow-hidden relative min-h-[500px]">
            <img
              src="https://readdy.ai/api/search-image?query=elegant%20perfume%20brand%20design%20studio%20workspace%20with%20mood%20boards%20color%20swatches%20fragrance%20bottles%20sketches%20and%20design%20tools%20on%20a%20clean%20white%20marble%20desk%20warm%20natural%20lighting%20minimalist%20luxury%20aesthetic%20creative%20professional%20environment&width=420&height=600&seq=brief001&orientation=portrait"
              alt="استوديو تصميم"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 right-8 left-8">
              <div className="text-xs text-amber-400 font-bold mb-2">المرحلة 3</div>
              <h3 className="text-white text-2xl font-black leading-tight">
                بيانات المشروع
                <br />
                تُبنى البراندات
              </h3>
            </div>

            {/* Missing Data Checklist */}
            {missing.length > 0 && (
              <div className="absolute top-6 right-6 left-6 bg-red-900/80 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-error-warning-line text-red-300"></i>
                  <span className="text-red-200 text-xs font-bold">بيانات ناقصة</span>
                </div>
                {missing.map((f) => (
                  <div key={f} className="text-red-300 text-xs flex items-center gap-1.5">
                    <i className="ri-close-circle-line"></i>
                    {fieldLabels[f]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="flex-1 bg-white rounded-3xl p-8 border border-stone-100">
            {!submitted ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">
                      اسم المشروع <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => handleChange("projectName", e.target.value)}
                      placeholder="مثال: براند الفجر"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        missing.includes("projectName")
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">
                      نوع المنتج <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => handleChange("productType", e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        missing.includes("productType")
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    >
                      <option value="">اختر نوع المنتج</option>
                      <option>عطر رجالي</option>
                      <option>عطر نسائي</option>
                      <option>عطر مشترك</option>
                      <option>بخور وعود</option>
                      <option>مجموعة عطور</option>
                    </select>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-stone-700 text-sm font-semibold mb-2">
                    وصف الفكرة <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.idea}
                    onChange={(e) => handleChange("idea", e.target.value)}
                    placeholder="صف فكرة مشروعك بالتفصيل..."
                    rows={3}
                    maxLength={500}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${
                      missing.includes("idea")
                        ? "border-red-300 bg-red-50"
                        : "border-stone-200 focus:border-amber-400"
                    }`}
                  />
                  <div className="text-xs text-stone-400 text-left mt-1">{formData.idea.length}/500</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">
                      السوق المستهدف <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.targetMarket}
                      onChange={(e) => handleChange("targetMarket", e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        missing.includes("targetMarket")
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    >
                      <option value="">اختر السوق</option>
                      <option>السعودية</option>
                      <option>الإمارات</option>
                      <option>الخليج العربي</option>
                      <option>الشرق الأوسط</option>
                      <option>أوروبا</option>
                      <option>عالمي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">الميزانية التقريبية</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">اختر الميزانية</option>
                      <option>أقل من 50,000 ريال</option>
                      <option>50,000 - 150,000 ريال</option>
                      <option>150,000 - 500,000 ريال</option>
                      <option>أكثر من 500,000 ريال</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">الكمية المبدئية</label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">اختر الكمية</option>
                      <option>أقل من 500 وحدة</option>
                      <option>500 - 1000 وحدة</option>
                      <option>1000 - 5000 وحدة</option>
                      <option>أكثر من 5000 وحدة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">موعد الإطلاق</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleChange("timeline", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">اختر الموعد</option>
                      <option>خلال 3 أشهر</option>
                      <option>خلال 6 أشهر</option>
                      <option>خلال سنة</option>
                      <option>أكثر من سنة</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-stone-700 text-sm font-semibold mb-2">شخصية البراند المطلوبة</label>
                  <div className="flex flex-wrap gap-2">
                    {["فاخر", "تجاري", "نيش", "هدايا", "عصري", "كلاسيكي", "شرقي", "غربي"].map((p) => (
                      <button
                        key={p}
                        onClick={() => handleChange("personality", p)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          formData.personality === p
                            ? "bg-amber-700 border-amber-700 text-white"
                            : "border-stone-200 text-stone-600 hover:border-amber-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-4 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
                >
                  <i className="ri-magic-line"></i>
                  إنشاء البريف بالذكاء الاصطناعي
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-6">
                  <i className="ri-file-check-line text-emerald-600 text-4xl"></i>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-3">تم إنشاء البريف!</h3>
                <p className="text-stone-500 mb-2">
                  تم تحويل بياناتك إلى بريف منظم. سيراجعه مدير المشروع خلال 24 ساعة.
                </p>
                <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold px-4 py-2 rounded-full mb-8">
                  Brief In Progress
                </div>
                <div className="bg-stone-50 rounded-2xl p-6 text-right mb-6">
                  <div className="text-xs text-stone-400 mb-4 font-bold">ملخص البريف</div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(formData).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <div className="text-xs text-stone-400">{fieldLabels[k] || k}</div>
                        <div className="text-sm font-semibold text-stone-800">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="border border-stone-200 hover:border-stone-400 text-stone-600 font-semibold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  تعديل البريف
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BriefSection;
