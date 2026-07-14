import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "workspace_brief_draft";

type StepKey = 1 | 2 | 3 | 4;

const stepLabels: Record<StepKey, string> = {
  1: "المعلومات الأساسية",
  2: "السوق والمستهدف",
  3: "التفاصيل التجارية",
  4: "المراجعة والتأكيد",
};

interface BriefData {
  projectName: string;
  productType: string;
  idea: string;
  targetMarket: string;
  targetAudience: string;
  personality: string;
  competitors: string;
  budget: string;
  quantity: string;
  timeline: string;
  references: string;
}

const initialData: BriefData = {
  projectName: "",
  productType: "",
  idea: "",
  targetMarket: "",
  targetAudience: "",
  personality: "",
  competitors: "",
  budget: "",
  quantity: "",
  timeline: "",
  references: "",
};

const fieldLabels: Record<string, string> = {
  projectName: "اسم المشروع",
  productType: "نوع المنتج",
  idea: "وصف الفكرة",
  targetMarket: "السوق المستهدف",
  targetAudience: "الفئة المستهدفة",
  personality: "شخصية البراند",
  competitors: "المنافسون المرجعيون",
  budget: "الميزانية التقريبية",
  quantity: "الكمية المبدئية",
  timeline: "موعد الإطلاق",
  references: "مراجع وأمثلة ملهمة",
};

const BriefModule = () => {
  const [step, setStep] = useState<StepKey>(1);
  const [data, setData] = useState<BriefData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed };
      }
    } catch {
      // ignore
    }
    return initialData;
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
  }, [data]);

  const updateField = (field: keyof BriefData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
    setDraftLoaded(false);
  };

  const validateStep = (s: StepKey): boolean => {
    const errs: string[] = [];
    if (s === 1) {
      if (!data.projectName.trim()) errs.push("اسم المشروع مطلوب");
      if (!data.productType) errs.push("نوع المنتج مطلوب");
      if (!data.idea.trim() || data.idea.trim().length < 20)
        errs.push("وصف الفكرة مطلوب (20 حرف على الأقل)");
    }
    if (s === 2) {
      if (!data.targetMarket) errs.push("السوق المستهدف مطلوب");
      if (!data.personality) errs.push("شخصية البراند مطلوبة");
    }
    if (s === 3) {
      if (!data.budget) errs.push("الميزانية مطلوبة");
      if (!data.quantity) errs.push("الكمية مطلوبة");
      if (!data.timeline) errs.push("موعد الإطلاق مطلوب");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const nextStep = () => {
    if (step === 4) {
      handleSubmit();
      return;
    }
    if (!validateStep(step)) return;
    setStep((prev) => (prev + 1) as StepKey);
  };

  const prevStep = () => {
    setErrors([]);
    setStep((prev) => (prev - 1) as StepKey);
  };

  const handleSubmit = () => {
    saveDraft();
    setSubmitted(true);
  };

  const handleReset = () => {
    setData(initialData);
    setStep(1);
    setSubmitted(false);
    setErrors([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData({ ...initialData, ...JSON.parse(saved) });
        setStep(1);
        setSubmitted(false);
        setErrors([]);
        setDraftLoaded(true);
        setTimeout(() => setDraftLoaded(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const hasDraft = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const parsed = JSON.parse(saved);
      return !!parsed.projectName || !!parsed.idea || !!parsed.productType;
    } catch {
      return false;
    }
  })();

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div>
      {!submitted ? (
        <>
          {/* Progress Header */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-stone-900 text-lg">نموذج البريف التفاعلي</h3>
              <div className="flex items-center gap-3">
                {hasDraft && (
                  <button
                    onClick={loadDraft}
                    className="text-amber-700 text-xs font-bold hover:text-amber-600 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    <i className="ri-download-line ml-1"></i>
                    استرجاع المسودة
                  </button>
                )}
                <button
                  onClick={saveDraft}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-save-line ml-1"></i>
                  حفظ المسودة
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progressPercent, 8)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3">
                {(Object.entries(stepLabels) as [string, string][]).map(([s, label]) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (Number(s) < step || (Number(s) === step)) return;
                      if (step >= Number(s)) setStep(Number(s) as StepKey);
                    }}
                    className={`flex flex-col items-center gap-1 min-w-[70px] cursor-pointer transition-all ${
                      Number(s) <= step
                        ? "text-amber-700"
                        : "text-stone-300"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                        Number(s) < step
                          ? "bg-amber-700 text-white"
                          : Number(s) === step
                          ? "bg-amber-700 text-white ring-4 ring-amber-100"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {Number(s) < step ? (
                        <i className="ri-check-line text-sm"></i>
                      ) : (
                        s
                      )}
                    </div>
                    <span className="text-[10px] font-bold whitespace-nowrap hidden sm:block">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Draft Restored Toast */}
          {draftLoaded && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
              <i className="ri-check-line"></i>
              تم استرجاع المسودة بنجاح
            </div>
          )}

          {/* Saved Toast */}
          {saved && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
              <i className="ri-save-line"></i>
              تم حفظ المسودة
            </div>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-error-warning-line text-red-500"></i>
                <span className="text-red-700 text-xs font-bold">يرجى إكمال البيانات المطلوبة</span>
              </div>
              <div className="space-y-1">
                {errors.map((err) => (
                  <div key={err} className="text-red-500 text-xs flex items-center gap-1.5">
                    <i className="ri-close-circle-line"></i>
                    {err}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: معلومات أساسية */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                  <i className="ri-file-text-line text-amber-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-black text-stone-900">المعلومات الأساسية</h4>
                  <p className="text-stone-400 text-xs">أدخل البيانات الأساسية لمشروعك العطري</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    اسم المشروع <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.projectName}
                    onChange={(e) => updateField("projectName", e.target.value)}
                    placeholder="مثال: براند الفجر"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors text-right"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    نوع المنتج <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "عطر رجالي",
                      "عطر نسائي",
                      "عطر مشترك (يونيسكس)",
                      "مجموعة عطور",
                      "بخور وعود",
                      "معطرات منزلية",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("productType", type)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          data.productType === type
                            ? "bg-amber-700 border-amber-700 text-white"
                            : "border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    وصف الفكرة <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={data.idea}
                    onChange={(e) => updateField("idea", e.target.value)}
                    placeholder="صف فكرة مشروعك بالتفصيل... ما القصة وراء البراند؟ ما الإحساس اللي تبغى توصلّه؟"
                    rows={4}
                    maxLength={500}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none text-right"
                  />
                  <div className="text-xs text-stone-400 mt-1 text-left">{data.idea.length}/500</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: السوق والمستهدف */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                  <i className="ri-global-line text-amber-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-black text-stone-900">السوق والمستهدف</h4>
                  <p className="text-stone-400 text-xs">حدد السوق والجمهور المستهدف لبراندك</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    السوق المستهدف <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "السعودية",
                      "الإمارات",
                      "الخليج العربي",
                      "الشرق الأوسط",
                      "أوروبا",
                      "عالمي",
                    ].map((m) => (
                      <button
                        key={m}
                        onClick={() => updateField("targetMarket", m)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          data.targetMarket === m
                            ? "bg-amber-700 border-amber-700 text-white"
                            : "border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">الفئة المستهدفة</label>
                  <input
                    type="text"
                    value={data.targetAudience}
                    onChange={(e) => updateField("targetAudience", e.target.value)}
                    placeholder="مثال: شباب 20-35 سنة، مهتمين بالموضة والعطور الفاخرة"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors text-right"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    شخصية البراند <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "فاخر",
                      "تجاري",
                      "نيش",
                      "هدايا",
                      "عصري",
                      "كلاسيكي",
                      "شرقي",
                      "غربي",
                      "طبيعي",
                      "بسيط",
                    ].map((p) => (
                      <button
                        key={p}
                        onClick={() => updateField("personality", p)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          data.personality === p
                            ? "bg-amber-700 border-amber-700 text-white"
                            : "border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">المنافسون المرجعيون</label>
                  <input
                    type="text"
                    value={data.competitors}
                    onChange={(e) => updateField("competitors", e.target.value)}
                    placeholder="مثال: عبدالصمد القرشي، Arabian Oud، Jo Malone"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: التفاصيل التجارية */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                  <i className="ri-money-dollar-circle-line text-amber-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-black text-stone-900">التفاصيل التجارية</h4>
                  <p className="text-stone-400 text-xs">حدد النطاق التجاري والميزانية المتوقعة</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-stone-700 text-sm font-bold mb-2">
                      الميزانية التقريبية <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={data.budget}
                      onChange={(e) => updateField("budget", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">اختر الميزانية</option>
                      <option>أقل من 50,000 ريال</option>
                      <option>50,000 - 150,000 ريال</option>
                      <option>150,000 - 500,000 ريال</option>
                      <option>500,000 - 1,000,000 ريال</option>
                      <option>أكثر من 1,000,000 ريال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-bold mb-2">
                      الكمية المبدئية <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={data.quantity}
                      onChange={(e) => updateField("quantity", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">اختر الكمية</option>
                      <option>أقل من 500 وحدة</option>
                      <option>500 - 1,000 وحدة</option>
                      <option>1,000 - 5,000 وحدة</option>
                      <option>5,000 - 10,000 وحدة</option>
                      <option>أكثر من 10,000 وحدة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">
                    موعد الإطلاق <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "خلال 3 أشهر",
                      "خلال 6 أشهر",
                      "خلال سنة",
                      "أكثر من سنة",
                    ].map((t) => (
                      <button
                        key={t}
                        onClick={() => updateField("timeline", t)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          data.timeline === t
                            ? "bg-amber-700 border-amber-700 text-white"
                            : "border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 text-sm font-bold mb-2">مراجع وأمثلة ملهمة</label>
                  <textarea
                    value={data.references}
                    onChange={(e) => updateField("references", e.target.value)}
                    placeholder="اذكر أي براندات أو عطور أو تصاميم تلهمك... (مثال: عطر كذا من ماركة كذا — يعجبني فيه النوتات الخشبية والتصميم البسيط)"
                    rows={3}
                    maxLength={500}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none text-right"
                  />
                  <div className="text-xs text-stone-400 mt-1 text-left">{data.references.length}/500</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: المراجعة والتأكيد */}
          {step === 4 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                  <i className="ri-check-double-line text-amber-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-black text-stone-900">المراجعة والتأكيد</h4>
                  <p className="text-stone-400 text-xs">راجع بيانات البريف قبل الإرسال</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4 mb-6">
                {/* Basic Info Card */}
                <div className="bg-stone-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-stone-700 text-sm font-bold">المعلومات الأساسية</h5>
                    <button
                      onClick={() => setStep(1)}
                      className="text-amber-700 text-xs font-bold hover:text-amber-600 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className="ri-edit-line ml-1"></i>
                      تعديل
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">اسم المشروع</span>
                      <span className="text-stone-800 text-sm font-bold">{data.projectName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">نوع المنتج</span>
                      <span className="text-stone-800 text-sm font-bold">{data.productType}</span>
                    </div>
                    <div className="sm:col-span-1">
                      <span className="text-stone-400 text-xs block mb-0.5">وصف الفكرة</span>
                      <span className="text-stone-800 text-sm">{data.idea.length > 60 ? data.idea.slice(0, 60) + "..." : data.idea}</span>
                    </div>
                  </div>
                </div>

                {/* Market Card */}
                <div className="bg-stone-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-stone-700 text-sm font-bold">السوق والمستهدف</h5>
                    <button
                      onClick={() => setStep(2)}
                      className="text-amber-700 text-xs font-bold hover:text-amber-600 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className="ri-edit-line ml-1"></i>
                      تعديل
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">السوق المستهدف</span>
                      <span className="text-stone-800 text-sm font-bold">{data.targetMarket}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">شخصية البراند</span>
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5">{data.personality}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">الفئة المستهدفة</span>
                      <span className="text-stone-800 text-sm">{data.targetAudience || "—"}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">المنافسون</span>
                      <span className="text-stone-800 text-sm">{data.competitors || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Business Card */}
                <div className="bg-stone-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-stone-700 text-sm font-bold">التفاصيل التجارية</h5>
                    <button
                      onClick={() => setStep(3)}
                      className="text-amber-700 text-xs font-bold hover:text-amber-600 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className="ri-edit-line ml-1"></i>
                      تعديل
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">الميزانية</span>
                      <span className="text-stone-800 text-sm font-bold">{data.budget}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">الكمية</span>
                      <span className="text-stone-800 text-sm font-bold">{data.quantity}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">موعد الإطلاق</span>
                      <span className="text-stone-800 text-sm font-bold">{data.timeline}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs block mb-0.5">المراجع</span>
                      <span className="text-stone-800 text-sm">{data.references ? (data.references.length > 50 ? data.references.slice(0, 50) + "..." : data.references) : "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                step === 1
                  ? "border-stone-100 text-stone-300 cursor-not-allowed"
                  : "border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50"
              }`}
            >
              <i className="ri-arrow-right-line"></i>
              السابق
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-amber-700 hover:bg-amber-600 text-white transition-all cursor-pointer whitespace-nowrap"
            >
              {step === 4 ? (
                <>
                  <i className="ri-send-plane-fill"></i>
                  إرسال البريف
                </>
              ) : (
                <>
                  التالي
                  <i className="ri-arrow-left-line"></i>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        /* Success State */
        <div>
          <div className="bg-white rounded-2xl p-8 border border-emerald-200 text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="w-20 h-20 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-6">
              <i className="ri-file-check-line text-emerald-600 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-3">تم إرسال البريف بنجاح!</h3>
            <p className="text-stone-500 mb-2 max-w-md mx-auto">
              تم تحويل بياناتك إلى بريف منظم واحترافي. سيراجعه مدير المشروع أحمد الزهراني خلال 24 ساعة.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold px-4 py-2 rounded-full mb-8">
              <i className="ri-loader-4-line animate-spin"></i>
              Brief In Review
            </div>

            {/* Final Summary */}
            <div className="bg-stone-50 rounded-2xl p-6 text-right mb-8 max-w-lg mx-auto">
              <div className="text-xs text-stone-400 mb-4 font-bold">ملخص البريف</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(data)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <span className="text-xs text-stone-400 block">
                        {fieldLabels[k] || k}
                      </span>
                      <span className="text-sm font-semibold text-stone-800">{v}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="bg-white border border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-700 font-bold px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                مشروع جديد
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                تعديل البريف
              </button>
            </div>
          </div>

          {/* AI Analysis Preview */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-robot-line text-amber-600"></i>
              </div>
              <h4 className="font-black text-stone-900 text-sm">تحليل المساعد الذكي للبريف</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-lightbulb-line text-amber-600"></i>
                </div>
                <div>
                  <span className="text-amber-800 text-sm font-bold block mb-0.5">المسار المقترح</span>
                  <span className="text-amber-700 text-xs">
                    بناءً على نوع المنتج "{data.productType}" والسوق "{data.targetMarket}"، المسار المقترح هو:{" "}
                    <strong>المسار A — براند كامل</strong> (استراتيجية + عطر + هوية + تغليف)
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-time-line text-stone-500"></i>
                </div>
                <div>
                  <span className="text-stone-700 text-sm font-bold block mb-0.5">الجدول الزمني المتوقع</span>
                  <span className="text-stone-500 text-xs">
                    بناءً على موعد الإطلاق "{data.timeline}" والكمية "{data.quantity}"، المدة المتوقعة:{" "}
                    <strong>8-12 أسبوع</strong> من اعتماد البريف حتى التسليم
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-team-line text-stone-500"></i>
                </div>
                <div>
                  <span className="text-stone-700 text-sm font-bold block mb-0.5">الفريق المقترح</span>
                  <span className="text-stone-500 text-xs">
                    مدير مشروع، خبير عطور أول، مصمم هوية بصرية، مصمم تغليف، منسق إنتاج
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefModule;