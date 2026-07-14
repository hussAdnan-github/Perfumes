import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type WizardPhase = "files" | "specs" | "quality" | "shipping";

interface ManufacturingSelections {
  formulaStatus: string | null;
  designStatus: string | null;
  productionQty: string | null;
  timeline: string | null;
  qualityLevel: string | null;
  fillingMethod: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingMethod: string | null;
  confirmed: boolean;
}

const emptySelections: ManufacturingSelections = {
  formulaStatus: null,
  designStatus: null,
  productionQty: null,
  timeline: null,
  qualityLevel: null,
  fillingMethod: null,
  shippingAddress: "",
  shippingCity: "",
  shippingMethod: null,
  confirmed: false,
};

const STORAGE_KEY = "manufacturing_wizard_state";

interface SavedState {
  activePhase: WizardPhase;
  filesStep: number;
  specsStep: number;
  qualityStep: number;
  shippingStep: number;
  selections: ManufacturingSelections;
  completedPhases: WizardPhase[];
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
  icon: string;
}

const animationStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { transform: scale(0.85); opacity: 0; }
    60% { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.3); }
    50% { box-shadow: 0 0 0 8px rgba(180, 83, 9, 0); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes confettiFall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(60px) rotate(720deg); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes progressPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .animate-fade-slide-in { animation: fadeSlideIn 0.4s ease-out forwards; }
  .animate-pop-in { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
  .animate-toast-in { animation: toastIn 0.35s ease-out forwards; }
  .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-progress-pulse { animation: progressPulse 2s ease-in-out infinite; }
  .confetti-particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 2px;
    animation: confettiFall 1.5s ease-out forwards;
  }
  .selection-card {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .selection-card:hover {
    transform: translateY(-2px);
  }
  .selection-card:active {
    transform: scale(0.97);
  }
  .chip {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .chip:active {
    transform: scale(0.92);
  }
  .step-transition-enter {
    animation: fadeSlideIn 0.45s ease-out forwards;
  }
  .step-complete-icon {
    animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

const saveState = (state: Partial<SavedState>) => {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
    const merged = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
};

const loadState = (): Partial<SavedState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
};

const clearState = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
};

const formulaStatusOptions = [
  { id: "ready", name: "تركيبة جاهزة", en: "Formula Ready", icon: "ri-check-double-line", desc: "لديك تركيبة معتمدة وجاهزة للتصنيع — أرسل الملف ونبدأ فوراً", tag: "الأسرع", statusColor: "emerald" },
  { id: "needs-review", name: "أحتاج مراجعة", en: "Needs Review", icon: "ri-search-eye-line", desc: "لديك تركيبة لكن تحتاج مراجعة من خبرائنا قبل التصنيع", tag: "موصى به", statusColor: "amber" },
  { id: "not-started", name: "لم أبدأ بعد", en: "Not Started Yet", icon: "ri-flask-line", desc: "تحتاج مساعدة في تطوير التركيبة — يمكننا تطويرها لك أولاً", tag: "دعم كامل", statusColor: "rose" },
];

const designStatusOptions = [
  { id: "ready", name: "تصميم جاهز", en: "Design Ready", icon: "ri-check-double-line", desc: "ملفات التصميم (عبوة، استيكر، صندوق) جاهزة للطباعة والتنفيذ", tag: "جاهز", statusColor: "emerald" },
  { id: "needs-edits", name: "أحتاج تعديلات", en: "Needs Adjustments", icon: "ri-edit-line", desc: "لديك تصميم لكن تريد تعديلات قبل الطباعة — فريقنا يساعدك", tag: "مرن", statusColor: "amber" },
  { id: "not-designed", name: "لم أصمم بعد", en: "Not Designed Yet", icon: "ri-brush-line", desc: "تحتاج تصميم كامل من الصفر — نوفر لك خدمة التصميم الاحترافي", tag: "شامل", statusColor: "rose" },
];

const productionQtyOptions = [
  { id: "small", name: "دفعة محدودة", en: "Limited Batch", qty: "100 - 500", icon: "ri-numbers-line", desc: "إصدار أولي، اختبار السوق، حصرية — مناسب للبراندات الجديدة", unitPrice: "من ٤٥ ريال للوحدة" },
  { id: "medium", name: "إنتاج متوسط", en: "Medium Production", qty: "500 - 3000", icon: "ri-stack-line", desc: "حجم تجاري مناسب — يلبي الطلب مع الحفاظ على الجودة", unitPrice: "من ٣٥ ريال للوحدة" },
  { id: "large", name: "إنتاج كبير", en: "Large Scale", qty: "3000 - 10000+", icon: "ri-database-2-line", desc: "إنتاج ضخم، تكلفة منخفضة للوحدة — للتوزيع الواسع", unitPrice: "من ٢٨ ريال للوحدة" },
];

const timelineOptions = [
  { id: "express", name: "سريع", en: "Express", duration: "4 أسابيع", icon: "ri-rocket-line", desc: "مسار سريع، فرق متوازية — لأوقات الذروة والمواسم", badge: "⚡ أولوية" },
  { id: "standard", name: "قياسي", en: "Standard", duration: "6 أسابيع", icon: "ri-calendar-check-line", desc: "الوتيرة المثالية — توازن بين السرعة والجودة", badge: "✓ الأكثر طلباً" },
  { id: "extended", name: "ممتد", en: "Extended", duration: "8 أسابيع", icon: "ri-hourglass-line", desc: "وقت كافٍ لكل تفصيلة — أقصى درجات الدقة", badge: "دقة عالية" },
];

const qualityLevelOptions = [
  { id: "basic", name: "أساسي", en: "Basic QC", icon: "ri-shield-line", desc: "فحص بصري + فحص العبوة + مطابقة المواصفات الأساسية", checks: ["فحص التسريب", "مطابقة اللون والرائحة", "فحص العبوة الخارجية"], time: "يومان" },
  { id: "advanced", name: "متقدم", en: "Advanced QC", icon: "ri-shield-check-line", desc: "فحص شامل + اختبارات معملية + تقرير مفصل", checks: ["اختبار الثبات", "تحليل كروماتوغرافي (GC-MS)", "فحص التطاير", "اختبار الحساسية", "مطابقة كاملة للمواصفات"], time: "٥ أيام" },
  { id: "comprehensive", name: "شامل", en: "Comprehensive QC", icon: "ri-shield-star-line", desc: "أعلى مستوى فحص + شهادات دولية + توثيق كامل", checks: ["كل فحوص المستوى المتقدم", "شهادة IFRA", "شهادة ISO 22716", "شهادة GMP", "تقرير سلامة شامل", "توثيق كامل للتتبع"], time: "١٠ أيام" },
];

const fillingMethodOptions = [
  { id: "manual", name: "تعبئة يدوية", en: "Manual Filling", icon: "ri-hand-heart-line", desc: "مناسب للدفعات المحدودة والعطور الفاخرة — دقة يدوية عالية", capacity: "حتى ٢٠٠ وحدة/يوم" },
  { id: "semi-auto", name: "نصف آلية", en: "Semi-Automatic", icon: "ri-settings-3-line", desc: "توازن بين الدقة والسرعة — مناسب للإنتاج المتوسط", capacity: "حتى ١٠٠٠ وحدة/يوم" },
  { id: "full-auto", name: "آلية كاملة", en: "Fully Automatic", icon: "ri-robot-2-line", desc: "أعلى سرعة واتساق — مناسب للإنتاج الكبير", capacity: "أكثر من ٣٠٠٠ وحدة/يوم" },
];

const shippingMethodOptions = [
  { id: "standard", name: "شحن قياسي", en: "Standard Shipping", icon: "ri-truck-line", desc: "شحن بري/بحري — اقتصادي ومناسب للكميات الكبيرة", time: "٧-١٤ يوم", cost: "الأقل تكلفة" },
  { id: "express", name: "شحن سريع", en: "Express Shipping", icon: "ri-flight-takeoff-line", desc: "شحن جوي سريع — يصل خلال أيام", time: "٢-٥ أيام", cost: "متوسط التكلفة" },
  { id: "same-day", name: "توصيل فوري", en: "Same-Day Delivery", icon: "ri-car-line", desc: "للمدن القريبة من المصنع — استلام في نفس اليوم", time: "نفس اليوم", cost: "الأعلى تكلفة" },
];

const phasesList: { key: WizardPhase; label: string; icon: string; desc: string }[] = [
  { key: "files", label: "مراجعة الملفات", icon: "ri-folder-check-line", desc: "تأكيد جاهزية التركيبة والتصميم" },
  { key: "specs", label: "مواصفات الإنتاج", icon: "ri-settings-3-line", desc: "الكمية والجدول الزمني" },
  { key: "quality", label: "الجودة والتعبئة", icon: "ri-shield-check-line", desc: "معايير الفحص وطريقة التعبئة" },
  { key: "shipping", label: "الشحن والتسليم", icon: "ri-truck-line", desc: "عنوان وطريقة التسليم" },
];

const ManufacturingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navUserMenuOpen, setNavUserMenuOpen] = useState(false);
  const saved = loadState();

  const [activePhase, setActivePhaseState] = useState<WizardPhase>(saved?.activePhase || "files");
  const [filesStep, setFilesStepState] = useState(saved?.filesStep || 0);
  const [specsStep, setSpecsStepState] = useState(saved?.specsStep || 0);
  const [qualityStep, setQualityStepState] = useState(saved?.qualityStep || 0);
  const [shippingStep, setShippingStepState] = useState(saved?.shippingStep || 0);
  const [selections, setSelections] = useState<ManufacturingSelections>(saved?.selections || emptySelections);
  const [completedPhases, setCompletedPhases] = useState<WizardPhase[]>(saved?.completedPhases || []);
  const [allDone, setAllDone] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebration, setCelebration] = useState(false);
  const [savingIndicator, setSavingIndicator] = useState(false);

  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastIdRef.current;
    const icons: Record<string, string> = { success: "ri-checkbox-circle-fill", info: "ri-information-fill", warning: "ri-error-warning-fill" };
    setToasts((prev) => [...prev, { id, message, type, icon: icons[type] }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const showSaving = useCallback(() => {
    setSavingIndicator(true);
    setTimeout(() => setSavingIndicator(false), 1200);
  }, []);

  const setActivePhase = useCallback((phase: WizardPhase) => {
    setActivePhaseState(phase);
    saveState({ activePhase: phase });
    showSaving();
  }, [showSaving]);

  const getStepState = (phase: WizardPhase) => {
    switch (phase) {
      case "files": return { step: filesStep, setStep: (v: number | ((p: number) => number)) => { setFilesStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ filesStep: n }); return n; }); showSaving(); } };
      case "specs": return { step: specsStep, setStep: (v: number | ((p: number) => number)) => { setSpecsStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ specsStep: n }); return n; }); showSaving(); } };
      case "quality": return { step: qualityStep, setStep: (v: number | ((p: number) => number)) => { setQualityStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ qualityStep: n }); return n; }); showSaving(); } };
      case "shipping": return { step: shippingStep, setStep: (v: number | ((p: number) => number)) => { setShippingStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ shippingStep: n }); return n; }); showSaving(); } };
    }
  };

  const getSubSteps = (phase: WizardPhase): { label: string; icon: string }[] => {
    switch (phase) {
      case "files": return [
        { label: "حالة التركيبة", icon: "ri-flask-line" },
        { label: "حالة التصميم", icon: "ri-brush-line" },
      ];
      case "specs": return [
        { label: "كمية الإنتاج", icon: "ri-numbers-line" },
        { label: "المدة الزمنية", icon: "ri-calendar-check-line" },
      ];
      case "quality": return [
        { label: "فحص الجودة", icon: "ri-shield-check-line" },
        { label: "طريقة التعبئة", icon: "ri-contrast-drop-line" },
      ];
      case "shipping": return [
        { label: "عنوان التسليم", icon: "ri-map-pin-line" },
        { label: "التأكيد النهائي", icon: "ri-check-double-line" },
      ];
    }
  };

  const updateSelections = useCallback((val: ManufacturingSelections | ((prev: ManufacturingSelections) => ManufacturingSelections)) => {
    setSelections((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      saveState({ selections: next });
      return next;
    });
  }, []);

  const canGoNext = (phase: WizardPhase): boolean => {
    const s = getStepState(phase);
    switch (phase) {
      case "files":
        if (s.step === 0) return selections.formulaStatus !== null;
        if (s.step === 1) return selections.designStatus !== null;
        return true;
      case "specs":
        if (s.step === 0) return selections.productionQty !== null;
        if (s.step === 1) return selections.timeline !== null;
        return true;
      case "quality":
        if (s.step === 0) return selections.qualityLevel !== null;
        if (s.step === 1) return selections.fillingMethod !== null;
        return true;
      case "shipping":
        if (s.step === 0) return selections.shippingAddress.length >= 3 && selections.shippingCity.length >= 2 && selections.shippingMethod !== null;
        if (s.step === 1) return true;
        return true;
    }
  };

  const handleStepForward = (phase: WizardPhase) => {
    if (!canGoNext(phase)) {
      addToast("يرجى إكمال الاختيار أولاً", "warning");
      return;
    }
    const { step, setStep } = getStepState(phase);
    const subSteps = getSubSteps(phase);
    if (step === subSteps.length - 1) {
      const newCompleted = completedPhases.includes(phase) ? completedPhases : [...completedPhases, phase];
      setCompletedPhases(newCompleted);
      saveState({ completedPhases: newCompleted });
      const phaseIdx = phasesList.findIndex((p) => p.key === phase);
      if (phaseIdx < phasesList.length - 1) {
        const nextPhase = phasesList[phaseIdx + 1].key;
        setActivePhase(nextPhase);
        addToast(`أحسنت! انتقلنا إلى ${phasesList[phaseIdx + 1].label}`, "success");
      } else {
        updateSelections((prev) => ({ ...prev, confirmed: true }));
        setAllDone(true);
        setCelebration(true);
        addToast("تم تأكيد طلب التصنيع! 🎉", "success");
        setTimeout(() => setCelebration(false), 4000);
      }
      return;
    }
    setStep((prev: number) => prev + 1);
    addToast(`تم حفظ ${subSteps[step].label} ✓`, "success");
  };

  const handleStepBackward = (phase: WizardPhase) => {
    const { step, setStep } = getStepState(phase);
    if (step === 0) return;
    setStep((prev: number) => prev - 1);
  };

  /* keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleStepForward(activePhase);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handleStepBackward(activePhase);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhase, filesStep, specsStep, qualityStep, shippingStep, selections]);

  const renderPhaseProgress = () => {
    const currentIdx = phasesList.findIndex((p) => p.key === activePhase);
    return (
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {phasesList.map((phase, i) => {
              const isCurrent = activePhase === phase.key;
              const isDone = completedPhases.includes(phase.key);
              const isPast = i < currentIdx;
              const clickable = isDone || isPast;
              return (
                <div key={phase.key} className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => clickable && setActivePhase(phase.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? "bg-amber-700 text-white animate-pulse-glow"
                        : isDone
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : isPast
                            ? "bg-stone-100 text-stone-500 border border-stone-200"
                            : "bg-stone-50 text-stone-300 border border-stone-100 cursor-default"
                    } ${clickable ? "hover:scale-105 active:scale-95" : ""}`}
                  >
                    <i className={`${isDone ? "ri-checkbox-circle-fill" : phase.icon}`}></i>
                    <span className="hidden sm:inline">{phase.label}</span>
                    {isDone && <span className="text-emerald-500 text-xs">✓</span>}
                  </button>
                  {i < phasesList.length - 1 && (
                    <div className={`w-6 h-0.5 rounded-full transition-all duration-500 ${isDone ? "bg-emerald-300" : "bg-stone-200"}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSubStepIndicator = (phase: WizardPhase) => {
    const { step } = getStepState(phase);
    const subSteps = getSubSteps(phase);
    return (
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {subSteps.map((sub, i) => (
          <button
            key={i}
            onClick={() => {
              const { setStep } = getStepState(phase);
              if (i < step) setStep(i);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              i === step
                ? "bg-stone-900 text-white"
                : i < step
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-white text-stone-400 border border-stone-200"
            } ${i === step ? "animate-pop-in" : ""} hover:scale-105 active:scale-95`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {i < step ? (
                <i className="ri-check-line text-emerald-500 text-xs step-complete-icon"></i>
              ) : (
                <span className="text-[10px]">{i + 1}</span>
              )}
            </div>
            <span>{sub.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    const { step } = getStepState(activePhase);

    if (activePhase === "files") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">هل لديك تركيبة عطرية جاهزة؟</h2>
              <p className="text-stone-500 text-sm">أخبرنا عن حالة التركيبة لتحديد المسار المناسب لطلبك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formulaStatusOptions.map((opt, idx) => {
                const selected = selections.formulaStatus === opt.id;
                const statusColorMap: Record<string, string> = {
                  emerald: "border-emerald-200 bg-emerald-50/40",
                  amber: "border-amber-200 bg-amber-50/40",
                  rose: "border-rose-200 bg-rose-50/40",
                };
                const statusIconColorMap: Record<string, string> = {
                  emerald: "bg-emerald-100 text-emerald-600",
                  amber: "bg-amber-100 text-amber-600",
                  rose: "bg-rose-100 text-rose-600",
                };
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, formulaStatus: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : `border-stone-100 bg-white hover:${statusColorMap[opt.statusColor]}`
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : statusIconColorMap[opt.statusColor]}`}>
                        <i className={`${opt.icon} text-lg`}></i>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold ${
                        opt.statusColor === "emerald" ? "bg-emerald-100 text-emerald-700" :
                        opt.statusColor === "amber" ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }`}>{opt.tag}</span>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                    <p className="text-stone-500 text-xs leading-relaxed">{opt.desc}</p>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">هل لديك تصميم جاهز للعبوة والاستيكر؟</h2>
              <p className="text-stone-500 text-sm">ملفات التصميم تشمل العبوة، الاستيكر، والصندوق الخارجي</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {designStatusOptions.map((opt, idx) => {
                const selected = selections.designStatus === opt.id;
                const statusColorMap: Record<string, string> = {
                  emerald: "border-emerald-200 bg-emerald-50/40",
                  amber: "border-amber-200 bg-amber-50/40",
                  rose: "border-rose-200 bg-rose-50/40",
                };
                const statusIconColorMap: Record<string, string> = {
                  emerald: "bg-emerald-100 text-emerald-600",
                  amber: "bg-amber-100 text-amber-600",
                  rose: "bg-rose-100 text-rose-600",
                };
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, designStatus: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : `border-stone-100 bg-white hover:${statusColorMap[opt.statusColor]}`
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : statusIconColorMap[opt.statusColor]}`}>
                        <i className={`${opt.icon} text-lg`}></i>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold ${
                        opt.statusColor === "emerald" ? "bg-emerald-100 text-emerald-700" :
                        opt.statusColor === "amber" ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }`}>{opt.tag}</span>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                    <p className="text-stone-500 text-xs leading-relaxed">{opt.desc}</p>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    if (activePhase === "specs") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر كمية الإنتاج</h2>
              <p className="text-stone-500 text-sm">حجم الإنتاج يؤثر على التكلفة والجدول الزمني — كلما زادت الكمية انخفض سعر الوحدة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productionQtyOptions.map((opt, idx) => {
                const selected = selections.productionQty === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, productionQty: opt.id }))}
                    className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                    <div className="text-amber-700 font-black text-lg mb-2">{opt.qty}</div>
                    <p className="text-stone-500 text-xs mb-2">{opt.desc}</p>
                    <div className="text-emerald-600 text-xs font-bold bg-emerald-50 rounded-full px-3 py-1 inline-block">{opt.unitPrice}</div>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر المدة الزمنية</h2>
              <p className="text-stone-500 text-sm">السرعة مقابل التكلفة — اختر ما يناسب احتياجك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timelineOptions.map((opt, idx) => {
                const selected = selections.timeline === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, timeline: opt.id }))}
                    className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="font-black text-stone-900 text-sm">{opt.name}</span>
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full whitespace-nowrap">{opt.badge}</span>
                    </div>
                    <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                    <div className="text-amber-700 font-black text-lg mb-2">{opt.duration}</div>
                    <p className="text-stone-500 text-xs">{opt.desc}</p>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    if (activePhase === "quality") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر مستوى فحص الجودة</h2>
              <p className="text-stone-500 text-sm">كلما ارتفع مستوى الفحص زادت الثقة في المنتج النهائي</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {qualityLevelOptions.map((opt, idx) => {
                const selected = selections.qualityLevel === opt.id;
                const cardColors = [
                  "border-stone-200 hover:border-stone-300",
                  "border-amber-200 hover:border-amber-300",
                  "border-emerald-200 hover:border-emerald-300",
                ];
                const iconColors = [
                  "bg-stone-100 text-stone-500",
                  "bg-amber-100 text-amber-600",
                  "bg-emerald-100 text-emerald-600",
                ];
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, qualityLevel: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : `bg-white ${cardColors[idx]}`
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : iconColors[idx]}`}>
                        <i className={`${opt.icon} text-lg`}></i>
                      </div>
                      <div>
                        <div className="font-black text-stone-900 text-sm">{opt.name}</div>
                        <div className="text-stone-400 text-xs">{opt.en}</div>
                      </div>
                    </div>
                    <p className="text-stone-500 text-xs mb-3">{opt.desc}</p>
                    <div className="bg-stone-50 rounded-xl p-3 space-y-1.5">
                      <div className="text-stone-400 text-[10px] font-bold">الفحوصات:</div>
                      {opt.checks.map((check) => (
                        <div key={check} className="flex items-center gap-1.5 text-stone-600 text-xs">
                          <i className="ri-check-line text-emerald-500 text-[10px]"></i>
                          {check}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-amber-600 text-xs font-bold">
                      <i className="ri-timer-line"></i>
                      المدة: {opt.time}
                    </div>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر طريقة التعبئة</h2>
              <p className="text-stone-500 text-sm">طريقة التعبئة تؤثر على الدقة والسرعة والتكلفة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fillingMethodOptions.map((opt, idx) => {
                const selected = selections.fillingMethod === opt.id;
                const iconColors = [
                  "bg-stone-100 text-stone-500",
                  "bg-amber-100 text-amber-600",
                  "bg-emerald-100 text-emerald-600",
                ];
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSelections((prev) => ({ ...prev, fillingMethod: opt.id }))}
                    className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : iconColors[idx]}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                    <p className="text-stone-500 text-xs mb-3">{opt.desc}</p>
                    <div className="text-amber-700 font-black text-sm bg-amber-50 rounded-full px-3 py-1.5 inline-block">{opt.capacity}</div>
                    {selected && (
                      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    if (activePhase === "shipping") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">معلومات التسليم</h2>
              <p className="text-stone-500 text-sm">أدخل عنوان التسليم الكامل واختر طريقة الشحن المناسبة</p>
            </div>
            <div className="max-w-xl mx-auto space-y-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-pop-in">
                <div>
                  <label className="block text-stone-700 font-bold text-sm mb-1.5">
                    <i className="ri-map-pin-line ml-1 text-amber-600"></i>
                    عنوان التسليم الكامل
                  </label>
                  <input
                    type="text"
                    value={selections.shippingAddress}
                    onChange={(e) => updateSelections((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                    placeholder="مثال: شارع الملك فهد، حي العليا، الرياض"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold text-sm mb-1.5">
                    <i className="ri-building-line ml-1 text-amber-600"></i>
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={selections.shippingCity}
                    onChange={(e) => updateSelections((prev) => ({ ...prev, shippingCity: e.target.value }))}
                    placeholder="مثال: الرياض"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold text-sm mb-3 text-center">
                  <i className="ri-truck-line ml-1 text-amber-600"></i>
                  طريقة الشحن
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {shippingMethodOptions.map((opt, idx) => {
                    const selected = selections.shippingMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => updateSelections((prev) => ({ ...prev, shippingMethod: opt.id }))}
                        className={`selection-card text-center rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                          selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                        }`}
                        style={{ animationDelay: `${idx * 80}ms` }}
                      >
                        <div className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl mb-2 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                          <i className={`${opt.icon} text-lg`}></i>
                        </div>
                        <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                        <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="text-amber-700 font-bold"><i className="ri-timer-line ml-0.5"></i> {opt.time}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-500">{opt.cost}</span>
                        </div>
                        {selected && (
                          <div className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                            <i className="ri-check-line text-white text-[10px]"></i>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">مراجعة وتأكيد الطلب</h2>
              <p className="text-stone-500 text-sm">راجع جميع اختياراتك قبل تأكيد طلب التصنيع</p>
            </div>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pop-in">
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-flask-line ml-1 text-amber-600"></i>
                      حالة التركيبة
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {formulaStatusOptions.find((o) => o.id === selections.formulaStatus)?.name || "-"}
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-brush-line ml-1 text-amber-600"></i>
                      حالة التصميم
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {designStatusOptions.find((o) => o.id === selections.designStatus)?.name || "-"}
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-numbers-line ml-1 text-amber-600"></i>
                      كمية الإنتاج
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {productionQtyOptions.find((o) => o.id === selections.productionQty)?.name || "-"}
                      <span className="text-amber-700 mr-2 text-xs">
                        {productionQtyOptions.find((o) => o.id === selections.productionQty)?.qty}
                      </span>
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-calendar-check-line ml-1 text-amber-600"></i>
                      المدة الزمنية
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {timelineOptions.find((o) => o.id === selections.timeline)?.name || "-"}
                      <span className="text-amber-700 mr-2 text-xs">
                        {timelineOptions.find((o) => o.id === selections.timeline)?.duration}
                      </span>
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-shield-check-line ml-1 text-amber-600"></i>
                      مستوى الجودة
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {qualityLevelOptions.find((o) => o.id === selections.qualityLevel)?.name || "-"}
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-stone-400 text-xs font-bold mb-2">
                      <i className="ri-contrast-drop-line ml-1 text-amber-600"></i>
                      طريقة التعبئة
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {fillingMethodOptions.find((o) => o.id === selections.fillingMethod)?.name || "-"}
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4">
                  <div className="text-stone-400 text-xs font-bold mb-2">
                    <i className="ri-map-pin-line ml-1 text-amber-600"></i>
                    عنوان التسليم
                  </div>
                  <div className="font-bold text-stone-900 text-sm mb-1">{selections.shippingAddress || "-"}</div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-stone-500">
                      <i className="ri-building-line ml-0.5"></i> {selections.shippingCity || "-"}
                    </span>
                    <span className="text-amber-700 font-bold">
                      <i className="ri-truck-line ml-0.5"></i> {shippingMethodOptions.find((o) => o.id === selections.shippingMethod)?.name || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border-t border-amber-100 p-4 text-center">
                <p className="text-amber-800 text-sm font-bold">
                  بضغطة واحدة — سيتم إرسال طلبك لفريق التصنيع للبدء فوراً
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  const { step } = getStepState(activePhase);
  const subSteps = getSubSteps(activePhase);
  const isLastPhase = activePhase === "shipping";

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      <style>{animationStyles}</style>

      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer flex-shrink-0">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="hidden lg:flex items-center gap-1 mx-4 overflow-x-auto">
          {[
            { to: "/services", label: "الخدمات", icon: "ri-compass-3-line" },
            { to: "/workflow", label: "سير العمل", icon: "ri-git-branch-line" },
            { to: "/production", label: "تطوير عطر", icon: "ri-drop-line" },
            { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line" },
            { to: "/brand-creation", label: "بناء براند", icon: "ri-award-fill" },
            { to: "/visual-identity", label: "هوية بصرية", icon: "ri-palette-line" },
          ].map((link) => {
            const isCurrentPage = link.to === "/manufacturing";
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isCurrentPage
                    ? "bg-amber-100 text-amber-700"
                    : "text-stone-400 hover:text-stone-700 hover:bg-stone-50"
                }`}
              >
                <i className={`${link.icon} text-xs`}></i>
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline">التصنيع</span>
          {savingIndicator && (
            <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 hidden sm:flex">
              <i className="ri-check-line"></i>
              تم الحفظ
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/workspace" className="text-stone-500 hover:text-amber-700 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap hidden sm:block">
            workspace
          </Link>
          {user && (
            <div className="relative">
              <button
                onClick={() => setNavUserMenuOpen(!navUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-amber-700 rounded-full text-white text-xs font-bold">
                  {user.firstName.charAt(0)}
                </div>
                <span className="text-stone-700 text-xs font-semibold hidden sm:inline">{user.firstName}</span>
              </button>
              {navUserMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-stone-100 shadow-lg overflow-hidden z-50">
                  <Link to="/dashboard" onClick={() => setNavUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
                    <i className="ri-dashboard-line"></i> لوحة التحكم
                  </Link>
                  <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap">
                    <i className="ri-logout-box-line"></i> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Phase Progress */}
      {renderPhaseProgress()}

      {/* Quick Nav */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Link to="/" className="hover:text-amber-700 transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-[10px]"></i>
            <Link to="/services" className="hover:text-amber-700 transition-colors cursor-pointer">الخدمات</Link>
            <i className="ri-arrow-left-s-line text-[10px]"></i>
            <span className="text-amber-700 font-bold">تصنيع فقط</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-stone-300 text-xs ml-2">روابط سريعة:</span>
            {[
              { to: "/production", label: "تطوير عطر" },
              { to: "/brand-creation", label: "بناء براند" },
              { to: "/packaging-customizer", label: "التغليف" },
              { to: "/visual-identity", label: "هوية بصرية" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-all cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Phase header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 mb-4 animate-float">
            <i className={`${phasesList.find((p) => p.key === activePhase)?.icon || "ri-settings-3-line"} text-white text-2xl`}></i>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-1">{phasesList.find((p) => p.key === activePhase)?.label}</h1>
          <p className="text-stone-500 text-sm">{phasesList.find((p) => p.key === activePhase)?.desc}</p>
        </div>

        {/* Completion banner */}
        {allDone && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-3xl p-8 text-center animate-bounce-in">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100 mb-3">
              <i className="ri-check-double-line text-emerald-600 text-3xl"></i>
            </div>
            <h2 className="text-xl font-black text-stone-900 mb-2">تم تأكيد طلب التصنيع!</h2>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
              فريق التصنيع سيبدأ العمل على طلبك فوراً. سنرسل لك تحديثات دورية عن مراحل الإنتاج.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="bg-white rounded-xl px-4 py-2 border border-stone-200 text-sm text-stone-600">
                <i className="ri-file-list-3-line ml-1 text-amber-600"></i>
                رقم الطلب: <strong className="text-stone-900">MN-{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
              <Link to="/workflow" className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                <i className="ri-flow-chart"></i> متابعة سير العمل
              </Link>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/packaging-customizer" className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-arrow-right-line"></i> العودة للتغليف
                </Link>
                <Link to="/brand-creation" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-arrow-right-line"></i> العودة لبناء البراند
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-stone-200">
                <button onClick={() => {
                  clearState();
                  setSelections(emptySelections);
                  setActivePhaseState("files");
                  setFilesStepState(0);
                  setSpecsStepState(0);
                  setQualityStepState(0);
                  setShippingStepState(0);
                  setCompletedPhases([]);
                  setAllDone(false);
                  addToast("تم إعادة تعيين جميع البيانات", "info");
                }}
                  className="text-stone-400 hover:text-red-400 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                  طلب تصنيع جديد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub-step indicator */}
        {!allDone && renderSubStepIndicator(activePhase)}

        {/* Content */}
        {!allDone && (
          <div key={`${activePhase}-${step}`} className="step-transition-enter">
            {renderContent()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => handleStepBackward(activePhase)}
                disabled={step === 0}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  step === 0
                    ? "bg-stone-100 text-stone-300 cursor-default"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:scale-105 active:scale-95"
                }`}
              >
                <i className="ri-arrow-right-line ml-1"></i>
                السابق
              </button>
              <div className="flex items-center gap-2">
                <span className="text-stone-300 text-xs">
                  {step + 1} / {subSteps.length}
                </span>
                <button
                  onClick={() => handleStepForward(activePhase)}
                  disabled={!canGoNext(activePhase)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    canGoNext(activePhase)
                      ? step === subSteps.length - 1 && isLastPhase
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 active:scale-95"
                        : "bg-amber-700 hover:bg-amber-600 text-white hover:scale-105 active:scale-95"
                      : "bg-stone-100 text-stone-300 cursor-default"
                  }`}
                >
                  {step === subSteps.length - 1
                    ? (isLastPhase ? "تأكيد وإرسال الطلب" : `الانتقال لـ ${phasesList[phasesList.findIndex((p) => p.key === activePhase) + 1]?.label || ""}`)
                    : "التالي"}
                  <i className="ri-arrow-left-line mr-1"></i>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-amber-500 to-amber-700 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / subSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-stone-200 bg-white mt-6">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { to: "/services", label: "الخدمات", icon: "ri-compass-3-line", desc: "6 مسارات" },
              { to: "/workflow", label: "سير العمل", icon: "ri-git-branch-line", desc: "20 مرحلة" },
              { to: "/production", label: "تطوير عطر", icon: "ri-drop-line", desc: "معالج تفاعلي" },
              { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line", desc: "تصميم 3D" },
              { to: "/brand-creation", label: "بناء براند", icon: "ri-award-fill", desc: "شامل" },
              { to: "/visual-identity", label: "هوية بصرية", icon: "ri-palette-line", desc: "إبداعي" },
              { to: "/pricing", label: "التسعير", icon: "ri-price-tag-3-line", desc: "حاسبة" },
              { to: "/workspace", label: "مساحة العمل", icon: "ri-dashboard-3-line", desc: "14 وحدة" },
              { to: "/dashboard", label: "لوحة التحكم", icon: "ri-dashboard-line", desc: "مشاريعي" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 bg-stone-50/50 hover:bg-amber-50/50 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 group-hover:bg-amber-100 flex-shrink-0">
                  <i className={`${link.icon} text-stone-500 group-hover:text-amber-700 text-sm`}></i>
                </div>
                <div className="min-w-0">
                  <div className="text-stone-700 font-bold text-xs group-hover:text-amber-700">{link.label}</div>
                  <div className="text-stone-400 text-[10px]">{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {celebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="relative">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="confetti-particle"
                style={{
                  left: `${Math.random() * 240 - 60}px`,
                  top: `${Math.random() * -50}px`,
                  backgroundColor: ["#b45309", "#059669", "#d97706", "#dc2626", "#0d9488", "#eab308", "#2563eb", "#db2777", "#9333ea"][i % 9],
                  animationDelay: `${Math.random() * 2}s`,
                  width: `${4 + Math.random() * 10}px`,
                  height: `${4 + Math.random() * 10}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              ></div>
            ))}
            <div className="text-center animate-bounce-in bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 pointer-events-auto">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-amber-100 mb-3">
                <i className="ri-check-double-line text-amber-700 text-3xl"></i>
              </div>
              <div className="text-xl font-black text-stone-900 mb-1">تم تأكيد الطلب!</div>
              <p className="text-stone-500 text-sm">فريق التصنيع سيبدأ العمل على طلبك فوراً</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const colors: Record<string, string> = {
            success: "bg-emerald-600 text-white",
            info: "bg-stone-800 text-white",
            warning: "bg-amber-500 text-white",
          };
          return (
            <div
              key={toast.id}
              className={`${colors[toast.type]} px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap animate-toast-in`}
            >
              <i className={toast.icon}></i>
              {toast.message}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="text-center pb-8 pt-4">
        <button
          onClick={() => {
            clearState();
            setSelections(emptySelections);
            setActivePhaseState("files");
            setFilesStepState(0);
            setSpecsStepState(0);
            setQualityStepState(0);
            setShippingStepState(0);
            setCompletedPhases([]);
            setAllDone(false);
            addToast("تم إعادة تعيين جميع البيانات", "info");
          }}
          className="text-stone-300 hover:text-red-400 text-xs font-medium cursor-pointer transition-colors underline"
        >
          إعادة تعيين جميع البيانات
        </button>
      </div>
    </div>
  );
};

export default ManufacturingPage;