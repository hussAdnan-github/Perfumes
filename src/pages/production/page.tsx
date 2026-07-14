import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

type WizardPhase = "design" | "samples" | "evaluation";

interface PerfumeSelections {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  concentration: string | null;
  family: string | null;
  season: string | null;
  gender: string | null;
}

const emptySelections: PerfumeSelections = {
  topNotes: [],
  heartNotes: [],
  baseNotes: [],
  concentration: null,
  family: null,
  season: null,
  gender: null,
};

const STORAGE_KEY = "perfume_wizard_state";

interface SavedState {
  activePhase: WizardPhase;
  designStep: number;
  selections: PerfumeSelections;
  sampleStatus: SampleStatus;
  sampleTracking: string;
  shippingAddress: string;
  shippingCity: string;
  evaluationRating: number;
  evaluationComment: string;
  evaluationApproved: boolean;
}

const noteOptions = {
  top: [
    { ar: "برغموت", en: "Bergamot" },
    { ar: "ليمون", en: "Lemon" },
    { ar: "نعناع", en: "Mint" },
    { ar: "لافندر", en: "Lavender" },
    { ar: "فلفل وردي", en: "Pink Pepper" },
    { ar: "جريب فروت", en: "Grapefruit" },
    { ar: "نيرولي", en: "Neroli" },
    { ar: "زهر البرتقال", en: "Orange Blossom" },
  ],
  heart: [
    { ar: "الورد", en: "Rose" },
    { ar: "الياسمين", en: "Jasmine" },
    { ar: "القرفة", en: "Cinnamon" },
    { ar: "الهيل", en: "Cardamom" },
    { ar: "إبرة الراعي", en: "Geranium" },
    { ar: "الخزامى", en: "Lavender Flower" },
    { ar: "زهرة السوسن", en: "Iris" },
    { ar: "الزعفران", en: "Saffron" },
  ],
  base: [
    { ar: "العود", en: "Oud" },
    { ar: "الصندل", en: "Sandalwood" },
    { ar: "العنبر", en: "Amber" },
    { ar: "المسك", en: "Musk" },
    { ar: "الفانيليا", en: "Vanilla" },
    { ar: "الباتشولي", en: "Patchouli" },
    { ar: "اللبان", en: "Frankincense" },
    { ar: "الأرز", en: "Cedarwood" },
  ],
};

const concentrationOptions = [
  { id: "parfum", name: "مركّز", en: "Parfum / Extrait", pct: "٢٠٪ - ٣٠٪+", longevity: "٨ - ١٢ ساعة+", tag: "فاخر", desc: "أعلى تركيز وأطول ثبات — مثالي للعطور الفاخرة والمناسبات الخاصة" },
  { id: "edp", name: "ماء عطر", en: "Eau de Parfum", pct: "١٥٪ - ٢٠٪", longevity: "٦ - ٨ ساعات", tag: "الأكثر رواجاً", desc: "التوازن المثالي بين الثبات والسعر — الخيار التجاري الأوسع انتشاراً" },
  { id: "edt", name: "ماء تواليت", en: "Eau de Toilette", pct: "٥٪ - ١٥٪", longevity: "٣ - ٥ ساعات", tag: "يومي", desc: "خفيف ومناسب للاستخدام اليومي — انتعاش متجدد طوال اليوم" },
  { id: "edc", name: "كولونيا", en: "Eau de Cologne", pct: "٢٪ - ٥٪", longevity: "٢ - ٣ ساعات", tag: "منعش", desc: "منعش جداً وصيفي — يحتاج إعادة رش لكنه حيوي ومبهج" },
  { id: "oil", name: "زيت / مدهن", en: "Oil — خالٍ من الكحول", pct: "١٠٪ - ٤٠٪+", longevity: "٦ - ١٠ ساعات", tag: "خليجي", desc: "خالٍ من الكحول — مناسب للسوق الخليجي والبشرة الحساسة" },
];

const familyOptions = [
  { id: "floral", name: "زهرية", en: "Floral", icon: "ri-plant-line", desc: "أنثوي، رومانسي، ناعم — ورد، ياسمين، فُل", color: "rose" },
  { id: "oriental", name: "شرقية", en: "Oriental / Amber", icon: "ri-star-line", desc: "دافئ، حسّي، فاخر — عنبر، فانيليا، بخور", color: "amber" },
  { id: "woody", name: "خشبية", en: "Woody", icon: "ri-tree-line", desc: "راقٍ، ثابت، محايد — صندل، عود، أرز", color: "stone" },
  { id: "fresh", name: "حمضية", en: "Fresh / Citrus", icon: "ri-sun-line", desc: "نظيف، حيوي، خفيف — برغموت، ليمون، جريب فروت", color: "emerald" },
  { id: "gourmand", name: "غورماند", en: "Gourmand", icon: "ri-cake-line", desc: "دافئ، سكّري، شهيّ — فانيليا، كراميل، كاكاو", color: "orange" },
  { id: "leather", name: "جلدية", en: "Leather / Tobacco", icon: "ri-shield-line", desc: "جريء، رجولي، فخم — جلد، تبغ، دخان", color: "slate" },
];

const seasonOptions = [
  { id: "summer", name: "صيفي", en: "Summer", icon: "ri-sun-line", desc: "منعش، حمضي، مائي — خفيف ويتنفس في الحر", tag: "☀ صيف" },
  { id: "winter", name: "شتوي", en: "Winter", icon: "ri-snowflake-line", desc: "دافئ، شرقي، خشبي — ثقيل وثابت في البرد", tag: "❄ شتاء" },
  { id: "all-year", name: "طوال العام", en: "All Year", icon: "ri-calendar-check-line", desc: "زهرية خشبية، أروماتيك معتدلة — مرن لكل المواسم", tag: "🍂 انتقالي" },
];

const genderOptions = [
  { id: "masculine", name: "رجالي", en: "Masculine", icon: "ri-men-line", desc: "فوجير، خشبية، جلدية — طابع جاف وقوي" },
  { id: "feminine", name: "نسائي", en: "Feminine", icon: "ri-women-line", desc: "زهرية، فاكهية، غورماند — ناعم وحلو" },
  { id: "unisex", name: "للجنسين", en: "Unisex", icon: "ri-user-heart-line", desc: "عود، مسك، عنبر — الأوسع انتشاراً خليجياً" },
];

type SampleStatus = "not-requested" | "requested" | "shipped" | "delivered" | "evaluated";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
  icon: string;
}

/* ───────────────────────────── animation keyframes ───────────────────────────── */
const animationStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-8px); }
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
  @keyframes toastOut {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(-20px) scale(0.95); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes confettiFall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(60px) rotate(720deg); opacity: 0; }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes stepCompletePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }
  .animate-fade-slide-in { animation: fadeSlideIn 0.4s ease-out forwards; }
  .animate-fade-slide-out { animation: fadeSlideOut 0.3s ease-in forwards; }
  .animate-pop-in { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
  .animate-toast-in { animation: toastIn 0.35s ease-out forwards; }
  .animate-toast-out { animation: toastOut 0.3s ease-in forwards; }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-step-complete { animation: stepCompletePulse 0.5s ease-out; }
  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
  .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
  .confetti-particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 2px;
    animation: confettiFall 1.5s ease-out forwards;
  }
  .data-saving {
    transition: all 0.2s ease;
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
  .note-chip {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .note-chip:active {
    transform: scale(0.92);
  }
  .step-transition-enter {
    animation: fadeSlideIn 0.45s ease-out forwards;
  }
`;

const saveState = (state: Partial<SavedState>) => {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
    const merged = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* localStorage may be unavailable */
  }
};

const loadState = (): Partial<SavedState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

const ProductionPage = () => {
  const saved = loadState();

  const [activePhase, setActivePhaseState] = useState<WizardPhase>(saved?.activePhase || "design");
  const [designStep, setDesignStepState] = useState(saved?.designStep || 0);
  const [selections, setSelections] = useState<PerfumeSelections>(saved?.selections || emptySelections);
  const [sampleStatus, setSampleStatusState] = useState<SampleStatus>(saved?.sampleStatus || "not-requested");
  const [sampleTracking, setSampleTrackingState] = useState(saved?.sampleTracking || "");
  const [shippingAddress, setShippingAddressState] = useState(saved?.shippingAddress || "");
  const [shippingCity, setShippingCityState] = useState(saved?.shippingCity || "");
  const [evaluationRating, setEvaluationRatingState] = useState(saved?.evaluationRating || 0);
  const [evaluationComment, setEvaluationCommentState] = useState(saved?.evaluationComment || "");
  const [evaluationApproved, setEvaluationApprovedState] = useState(saved?.evaluationApproved || false);
  const [showProduction, setShowProduction] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebration, setCelebration] = useState(false);
  const [stepAnimating, setStepAnimating] = useState(false);
  const [savingIndicator, setSavingIndicator] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  /* ──────────────── toast helper ──────────────── */
  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastIdRef.current;
    const icons: Record<string, string> = { success: "ri-checkbox-circle-fill", info: "ri-information-fill", warning: "ri-error-warning-fill" };
    setToasts((prev) => [...prev, { id, message, type, icon: icons[type] }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* ──────────────── localStorage persistence ──────────────── */
  const showSaving = useCallback(() => {
    setSavingIndicator(true);
    setTimeout(() => setSavingIndicator(false), 1200);
  }, []);

  const setActivePhase = useCallback((phase: WizardPhase) => {
    setActivePhaseState(phase);
    saveState({ activePhase: phase });
    showSaving();
  }, [showSaving]);

  const setDesignStep = useCallback((stepOrFn: number | ((prev: number) => number)) => {
    setDesignStepState((prev) => {
      const next = typeof stepOrFn === "function" ? stepOrFn(prev) : stepOrFn;
      saveState({ designStep: next });
      return next;
    });
    setStepAnimating(true);
    setTimeout(() => setStepAnimating(false), 450);
    showSaving();
  }, [showSaving]);

  const updateSelections = useCallback((val: PerfumeSelections | ((prev: PerfumeSelections) => PerfumeSelections)) => {
    setSelections((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      saveState({ selections: next });
      return next;
    });
  }, []);

  const setSampleStatus = useCallback((status: SampleStatus) => {
    setSampleStatusState(status);
    saveState({ sampleStatus: status });
    showSaving();
  }, [showSaving]);

  const setSampleTracking = useCallback((tracking: string) => {
    setSampleTrackingState(tracking);
    saveState({ sampleTracking: tracking });
    showSaving();
  }, [showSaving]);

  const setShippingAddress = useCallback((addr: string) => {
    setShippingAddressState(addr);
    saveState({ shippingAddress: addr });
  }, []);

  const setShippingCity = useCallback((city: string) => {
    setShippingCityState(city);
    saveState({ shippingCity: city });
  }, []);

  const setEvaluationRating = useCallback((rating: number) => {
    setEvaluationRatingState(rating);
    saveState({ evaluationRating: rating });
  }, []);

  const setEvaluationComment = useCallback((comment: string) => {
    setEvaluationCommentState(comment);
    saveState({ evaluationComment: comment });
  }, []);

  const setEvaluationApproved = useCallback((approved: boolean) => {
    setEvaluationApprovedState(approved);
    saveState({ evaluationApproved: approved });
  }, []);

  const designSubSteps = [
    { label: "الهرم العطري", icon: "ri-stack-line", desc: "اختر نوتات القمة والقلب والقاعدة" },
    { label: "التركيز", icon: "ri-contrast-drop-line", desc: "اختر نسبة المركّز العطري" },
    { label: "العائلة", icon: "ri-shapes-line", desc: "اختر التصنيف العام للعطر" },
    { label: "الموسم", icon: "ri-sun-line", desc: "متى سيُستخدم العطر؟" },
    { label: "الفئة", icon: "ri-user-line", desc: "لمن هذا العطر؟" },
    { label: "الملخص", icon: "ri-file-list-3-line", desc: "راجع اختياراتك وأكدها" },
  ];

  const toggleNote = (layer: "topNotes" | "heartNotes" | "baseNotes", noteAr: string) => {
    updateSelections((prev) => {
      const current = prev[layer];
      if (current.includes(noteAr)) {
        return { ...prev, [layer]: current.filter((n) => n !== noteAr) };
      }
      if (current.length >= 4) {
        addToast("الحد الأقصى ٤ نوتات لكل طبقة", "warning");
        return prev;
      }
      return { ...prev, [layer]: [...current, noteAr] };
    });
  };

  const canGoNext = (): boolean => {
    switch (designStep) {
      case 0: return selections.topNotes.length >= 1 && selections.heartNotes.length >= 1 && selections.baseNotes.length >= 1;
      case 1: return selections.concentration !== null;
      case 2: return selections.family !== null;
      case 3: return selections.season !== null;
      case 4: return selections.gender !== null;
      default: return true;
    }
  };

  const handleStepForward = () => {
    if (!canGoNext()) {
      addToast("يرجى إكمال الاختيار أولاً", "warning");
      return;
    }
    if (designStep === 5) {
      addToast("تم تصميم عطرك بنجاح! 🎉", "success");
      setActivePhase("samples");
      return;
    }
    setDesignStep((prev) => prev + 1);
    addToast(`تم حفظ ${designSubSteps[designStep].label} ✓`, "success");
  };

  const handleStepBackward = () => {
    if (designStep === 0) return;
    setDesignStep((prev) => prev - 1);
  };

  const handleRequestSamples = () => {
    const tracking = "SA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setSampleStatus("requested");
    setSampleTracking(tracking);
    addToast("تم تقديم طلب العينات بنجاح!", "success");
  };

  const handleEvaluationSubmit = () => {
    if (evaluationRating >= 4 && !evaluationApproved) {
      setEvaluationApproved(true);
      setSampleStatus("evaluated");
      setCelebration(true);
      addToast("تم اعتماد العطر! 🎉", "success");
      setTimeout(() => setCelebration(false), 3000);
    }
  };

  const selectionCount = (Object.keys(selections) as (keyof PerfumeSelections)[]).filter((key) => {
    const val = selections[key];
    if (Array.isArray(val)) return val.length > 0;
    return val !== null;
  }).length;

  const allDesignDone = selectionCount >= 5;

  /* ──────────────── keyboard navigation ──────────────── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activePhase !== "design") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handleStepBackward();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhase, designStep, selections]);

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
            { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line" },
            { to: "/studio-3d", label: "3D", icon: "ri-box-3-line" },
            { to: "/pricing", label: "التسعير", icon: "ri-price-tag-3-line" },
            { to: "/dashboard/approvals", label: "الاعتماد", icon: "ri-shield-check-line" },
            { to: "/after-sales", label: "ما بعد البيع", icon: "ri-heart-line" },
          ].map((link) => {
            const isCurrentPage = link.to === "/production";
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
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline">مختبر العطور</span>
          {savingIndicator && (
            <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 data-saving hidden sm:flex">
              <i className="ri-check-line"></i>
              تم الحفظ
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/workspace" className="text-stone-500 hover:text-amber-700 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap hidden sm:block">
            workspace
          </Link>
          <Link to="/dashboard" className="bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all hover:scale-105 active:scale-95">
            لوحة التحكم
          </Link>
        </div>
      </nav>

      {/* Main Wizard Progress Bar */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {(["design", "samples", "evaluation"] as WizardPhase[]).map((phase, i) => {
              const isActive = activePhase === phase;
              const isDone = (phase === "design" && allDesignDone) || (phase === "samples" && sampleStatus !== "not-requested") || (phase === "evaluation" && sampleStatus === "evaluated");
              const isPast = (i === 0 && activePhase !== "design") || (i === 1 && activePhase === "evaluation");
              const labels = {
                design: { ar: "تصميم العطر", icon: "ri-palette-line" },
                samples: { ar: "طلب العينات", icon: "ri-drop-line" },
                evaluation: { ar: "التقييم والاعتماد", icon: "ri-star-line" },
              };
              return (
                <div key={phase} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => {
                      if (i === 0 || (i === 1 && allDesignDone) || (i === 2 && sampleStatus === "delivered")) {
                        setActivePhase(phase);
                        addToast(`تم الانتقال إلى مرحلة ${labels[phase].ar}`, "info");
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95 ${
                      isActive
                        ? "bg-amber-700 text-white animate-pulse-glow"
                        : isDone || isPast
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    <i className={`${isDone || isPast ? "ri-checkbox-circle-fill" : labels[phase].icon} ${isActive ? "text-white" : ""}`}></i>
                    <span className="hidden sm:inline">{labels[phase].ar}</span>
                  </button>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-0.5 rounded-full transition-all duration-700 ${
                        isPast || isDone ? "bg-emerald-300" : "bg-stone-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Service Navigation Bar */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Link to="/" className="hover:text-amber-700 transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-[10px]"></i>
            <Link to="/services" className="hover:text-amber-700 transition-colors cursor-pointer">الخدمات</Link>
            <i className="ri-arrow-left-s-line text-[10px]"></i>
            <Link to="/workflow" className="hover:text-amber-700 transition-colors cursor-pointer">سير العمل</Link>
            <i className="ri-arrow-left-s-line text-[10px]"></i>
            <span className="text-amber-700 font-bold">تصنيع العطر</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-stone-300 text-xs ml-2">مراحل المشروع:</span>
            {[
              { to: "/packaging-customizer", label: "التغليف", num: "9A" },
              { to: "/studio-3d", label: "3D", num: "10A" },
              { to: "/pricing", label: "التسعير", num: "11A" },
              { to: "/dashboard/approvals", label: "الاعتماد", num: "12A" },
              { to: "/production", label: "الإنتاج", num: "13A", active: true },
              { to: "/after-sales", label: "ما بعد البيع", num: "17A" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  item.active
                    ? "bg-amber-100 text-amber-700"
                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className="opacity-60 text-[10px]">{item.num}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8" ref={mainRef}>
        {/* ==================================================================== */}
        {/* PHASE 1: DESIGN WIZARD */}
        {/* ==================================================================== */}
        {activePhase === "design" && (
          <div>
            {/* Design step indicators with animation */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
              {designSubSteps.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i < designStep) {
                      setDesignStep(i);
                    } else if (i === designStep + 1 && canGoNext()) {
                      handleStepForward();
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95 ${
                    i === designStep
                      ? "bg-stone-900 text-white"
                      : i < designStep
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-white text-stone-400 border border-stone-200"
                  } ${i === designStep ? "animate-pop-in" : ""}`}
                >
                  <div className={`w-4 h-4 flex items-center justify-center ${i < designStep ? "animate-step-complete" : ""}`}>
                    {i < designStep ? (
                      <i className="ri-check-line text-emerald-500 text-xs"></i>
                    ) : (
                      <span className={`rounded-full text-[10px] flex items-center justify-center w-full h-full ${i === designStep ? "bg-white/20" : "bg-stone-200 text-stone-500"}`}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            <div key={designStep} className="step-transition-enter">
              {/* Step 0: الهرم العطري */}
              {designStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">اختر نوتات عطرك</h2>
                    <p className="text-stone-500 text-sm">اختر حتى ٤ نوتات من كل طبقة — القمة للانطباع الأول، القلب للهوية، والقاعدة للثبات</p>
                    <p className="text-stone-300 text-xs mt-1">استخدم الأسهم يمين/يسار للتنقل بين الخطوات</p>
                  </div>

                  {([
                    { key: "topNotes" as const, label: "نوتات القمة", sub: "أول ما يشمّه من حولك — يتبخر خلال ١٥ دقيقة", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", tag: "bg-amber-100 text-amber-700", icon: "ri-sun-line", notes: noteOptions.top },
                    { key: "heartNotes" as const, label: "نوتات القلب", sub: "قلب العطر وهويته — يدوم من ٢ إلى ٤ ساعات", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", tag: "bg-rose-100 text-rose-700", icon: "ri-heart-line", notes: noteOptions.heart },
                    { key: "baseNotes" as const, label: "نوتات القاعدة", sub: "أساس الثبات — يدوم ٦ ساعات فأكثر", bg: "bg-stone-100", border: "border-stone-300", text: "text-stone-800", tag: "bg-stone-200 text-stone-700", icon: "ri-anchor-line", notes: noteOptions.base },
                  ] as const).map((layer) => (
                    <div key={layer.key} className={`rounded-2xl p-5 ${layer.bg} border ${layer.border} transition-all duration-300`}>
                      <div className="flex items-center gap-2 mb-1">
                        <i className={`${layer.icon} ${layer.text}`}></i>
                        <h3 className={`font-black ${layer.text}`}>{layer.label}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${layer.tag} transition-all duration-300`}>
                          {selections[layer.key].length}/4
                        </span>
                        {selections[layer.key].length === 4 && (
                          <span className="text-emerald-600 text-xs font-bold animate-pop-in">مكتمل!</span>
                        )}
                      </div>
                      <p className="text-stone-400 text-xs mb-4">{layer.sub}</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.notes.map((note) => {
                          const isSelected = selections[layer.key].includes(note.ar);
                          return (
                            <button
                              key={note.ar}
                              onClick={() => toggleNote(layer.key, note.ar)}
                              className={`note-chip px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                isSelected
                                  ? `${layer.text} bg-white border-2 ${layer.border} animate-pop-in`
                                  : "bg-white/60 text-stone-400 border border-stone-200 hover:border-stone-300 hover:bg-white hover:text-stone-600"
                              }`}
                            >
                              {note.ar}
                              {isSelected && <i className="ri-check-line mr-1 animate-pop-in"></i>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: التركيز */}
              {designStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">اختر تركيز العطر</h2>
                    <p className="text-stone-500 text-sm">نسبة المركّز تحدد ثبات العطر وفئته السعرية</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {concentrationOptions.map((opt, idx) => (
                      <button
                        key={opt.id}
                        onClick={() => updateSelections((prev) => ({ ...prev, concentration: opt.id }))}
                        className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                          selections.concentration === opt.id
                            ? "border-amber-600 bg-amber-50/30 animate-pulse-glow"
                            : "border-stone-100 bg-white hover:border-amber-200 hover:shadow-sm"
                        }`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                              selections.concentration === opt.id ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"
                            }`}>
                              <span className="font-black text-xs">{opt.pct.split(" ")[0]}</span>
                            </div>
                            <div>
                              <div className="font-black text-stone-900 text-sm">{opt.name}</div>
                              <div className="text-stone-400 text-xs">{opt.en}</div>
                            </div>
                          </div>
                          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full whitespace-nowrap">{opt.tag}</span>
                        </div>
                        <p className="text-stone-500 text-xs mr-13">{opt.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 mr-13">
                          <span><i className="ri-timer-line ml-1"></i>{opt.longevity}</span>
                        </div>
                        {selections.concentration === opt.id && (
                          <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-pop-in">
                            <i className="ri-check-line text-white text-xs"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: العائلة */}
              {designStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">اختر العائلة العطرية</h2>
                    <p className="text-stone-500 text-sm">التصنيف العام الذي يحدد شخصية عطرك وانطباعه الأول</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {familyOptions.map((opt, idx) => {
                      const colorMap: Record<string, { bg: string; border: string; text: string; light: string }> = {
                        rose: { bg: "bg-rose-500", border: "border-rose-300", text: "text-rose-700", light: "bg-rose-50" },
                        amber: { bg: "bg-amber-500", border: "border-amber-300", text: "text-amber-700", light: "bg-amber-50" },
                        stone: { bg: "bg-stone-600", border: "border-stone-300", text: "text-stone-700", light: "bg-stone-100" },
                        emerald: { bg: "bg-emerald-500", border: "border-emerald-300", text: "text-emerald-700", light: "bg-emerald-50" },
                        orange: { bg: "bg-orange-500", border: "border-orange-300", text: "text-orange-700", light: "bg-orange-50" },
                        slate: { bg: "bg-slate-600", border: "border-slate-300", text: "text-slate-700", light: "bg-slate-50" },
                      };
                      const c = colorMap[opt.color];
                      const selected = selections.family === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => updateSelections((prev) => ({ ...prev, family: opt.id }))}
                          className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative overflow-hidden ${
                            selected
                              ? `border-amber-600 ${c.light}`
                              : "border-stone-100 bg-white hover:border-amber-200 hover:shadow-sm"
                          } ${selected ? "animate-pop-in" : ""}`}
                          style={{ animationDelay: `${idx * 80}ms` }}
                        >
                          <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${c.bg} mb-3 transition-transform duration-300 ${selected ? "scale-110" : "group-hover:scale-105"}`}>
                            <i className={`${opt.icon} text-white text-lg`}></i>
                          </div>
                          <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                          <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
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
              )}

              {/* Step 3: الموسم */}
              {designStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">متى سيُستخدم العطر؟</h2>
                    <p className="text-stone-500 text-sm">الحرارة تؤثر على تطاير العطر — اختر الموسم المناسب</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {seasonOptions.map((opt, idx) => (
                      <button
                        key={opt.id}
                        onClick={() => updateSelections((prev) => ({ ...prev, season: opt.id }))}
                        className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                          selections.season === opt.id
                            ? "border-amber-600 bg-amber-50/30"
                            : "border-stone-100 bg-white hover:border-amber-200 hover:shadow-sm"
                        } ${selections.season === opt.id ? "animate-pop-in" : ""}`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${
                          opt.id === "summer" ? "bg-amber-400" : opt.id === "winter" ? "bg-stone-700" : "bg-emerald-500"
                        } ${selections.season === opt.id ? "scale-110" : ""}`}>
                          <i className={`${opt.icon} text-white text-xl`}></i>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-stone-900 text-sm">{opt.name}</span>
                          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full whitespace-nowrap">{opt.tag}</span>
                        </div>
                        <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                        <p className="text-stone-500 text-xs">{opt.desc}</p>
                        {selections.season === opt.id && (
                          <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                            <i className="ri-check-line text-white text-xs"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: الفئة */}
              {designStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">لمن هذا العطر؟</h2>
                    <p className="text-stone-500 text-sm">تحديد الفئة المستهدفة يوجه التصميم والتسويق</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {genderOptions.map((opt, idx) => (
                      <button
                        key={opt.id}
                        onClick={() => updateSelections((prev) => ({ ...prev, gender: opt.id }))}
                        className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                          selections.gender === opt.id
                            ? "border-amber-600 bg-amber-50/30"
                            : "border-stone-100 bg-white hover:border-amber-200 hover:shadow-sm"
                        } ${selections.gender === opt.id ? "animate-pop-in" : ""}`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${
                          selections.gender === opt.id ? "bg-amber-700 scale-110" : "bg-stone-100"
                        }`}>
                          <i className={`${opt.icon} text-xl ${selections.gender === opt.id ? "text-white" : "text-stone-500"}`}></i>
                        </div>
                        <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                        <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                        <p className="text-stone-500 text-xs">{opt.desc}</p>
                        {selections.gender === opt.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-amber-700 animate-bounce-in">
                            <i className="ri-check-line text-white text-xs"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: الملخص */}
              {designStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-stone-900 mb-1">ملخص عطرك</h2>
                    <p className="text-stone-500 text-sm">راجع اختياراتك قبل إرسال طلب العينات</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pop-in">
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">نوتات القمة</span>
                          <div className="flex flex-wrap gap-1">
                            {selections.topNotes.map((n) => (
                              <span key={n} className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200">{n}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">نوتات القلب</span>
                          <div className="flex flex-wrap gap-1">
                            {selections.heartNotes.map((n) => (
                              <span key={n} className="bg-rose-50 text-rose-800 text-xs px-2.5 py-1 rounded-full border border-rose-200">{n}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">نوتات القاعدة</span>
                          <div className="flex flex-wrap gap-1">
                            {selections.baseNotes.map((n) => (
                              <span key={n} className="bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-300">{n}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">التركيز</span>
                          <div className="font-bold text-stone-900 text-sm">
                            {concentrationOptions.find((c) => c.id === selections.concentration)?.name || "-"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">العائلة العطرية</span>
                          <div className="font-bold text-stone-900 text-sm">
                            {familyOptions.find((f) => f.id === selections.family)?.name || "-"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">الموسم</span>
                          <div className="font-bold text-stone-900 text-sm">
                            {seasonOptions.find((s) => s.id === selections.season)?.name || "-"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 text-xs">الفئة</span>
                          <div className="font-bold text-stone-900 text-sm">
                            {genderOptions.find((g) => g.id === selections.gender)?.name || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border-t border-amber-100 p-4 text-center">
                      <p className="text-amber-800 text-sm font-bold">
                        رائع! عطرك جاهز للتصميم. انتقل للمرحلة التالية لطلب العينات.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleStepBackward}
                  disabled={designStep === 0}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    designStep === 0
                      ? "bg-stone-100 text-stone-300 cursor-default"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:scale-105 active:scale-95"
                  }`}
                >
                  <i className="ri-arrow-right-line ml-1"></i>
                  السابق
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-stone-300 text-xs">
                    {designStep + 1} / {designSubSteps.length}
                  </span>
                  {designStep < 5 ? (
                    <button
                      onClick={handleStepForward}
                      disabled={!canGoNext()}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        canGoNext()
                          ? "bg-amber-700 hover:bg-amber-600 text-white hover:scale-105 active:scale-95"
                          : "bg-stone-100 text-stone-300 cursor-default"
                      }`}
                    >
                      التالي
                      <i className="ri-arrow-left-line mr-1"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToast("تم تصميم عطرك بنجاح! 🎉", "success");
                        setActivePhase("samples");
                      }}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
                    >
                      تأكيد وطلب العينات
                      <i className="ri-arrow-left-line mr-1"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Step progress bar */}
              <div className="mt-6">
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-amber-500 to-amber-700 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((designStep + 1) / designSubSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 2: SAMPLES */}
        {/* ==================================================================== */}
        {activePhase === "samples" && (
          <div key="samples" className="step-transition-enter space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">طلب العينات</h2>
              <p className="text-stone-500 text-sm">سنرسل لك ٣ عينات مختلفة لتجربتها على بشرتك قبل الاعتماد النهائي</p>
            </div>

            {sampleStatus === "not-requested" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl mx-auto space-y-4 animate-pop-in">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 flex-shrink-0">
                    <i className="ri-information-line text-amber-700 text-lg"></i>
                  </div>
                  <div>
                    <div className="font-black text-amber-800 text-sm mb-1">كيف تعمل العينات؟</div>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      بعد تقديم الطلب، سيجهز خبراؤنا ٣ عينات مختلفة بناءً على اختياراتك. كل عينة ٢ مل — تكفي لتجربتها عدة مرات. مدة التجهيز من ٥ إلى ٧ أيام عمل.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold text-sm mb-1.5">عنوان الشحن الكامل</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="مثال: شارع الملك فهد، حي العليا، الرياض"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold text-sm mb-1.5">المدينة</label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="مثال: الرياض"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleRequestSamples}
                  disabled={!shippingAddress || !shippingCity}
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
                    shippingAddress && shippingCity
                      ? "bg-amber-700 hover:bg-amber-600 text-white hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-stone-100 text-stone-300 cursor-default"
                  }`}
                >
                  تأكيد طلب العينات
                  <i className="ri-arrow-left-line mr-1"></i>
                </button>
              </div>
            )}

            {sampleStatus === "requested" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl mx-auto text-center space-y-4 animate-pop-in">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-amber-100">
                  <i className="ri-contrast-drop-line text-amber-700 text-2xl"></i>
                </div>
                <div>
                  <div className="font-black text-stone-900 text-lg mb-1">تم استلام طلبك!</div>
                  <p className="text-stone-500 text-sm">فريقنا بدأ بتجهيز العينات — سنرسلها خلال ٥-٧ أيام عمل</p>
                  <div className="mt-3 inline-block bg-stone-100 rounded-xl px-4 py-2">
                    <span className="text-stone-400 text-xs">رقم التتبع: </span>
                    <span className="font-bold text-stone-700 text-sm">{sampleTracking}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSampleStatus("shipped");
                      addToast("تم تحديث حالة الشحن", "info");
                    }}
                    className="text-amber-700 hover:text-amber-600 text-sm font-bold cursor-pointer transition-colors hover:scale-105 active:scale-95"
                  >
                    تم شحن العينات ←
                  </button>
                </div>
              </div>
            )}

            {sampleStatus === "shipped" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl mx-auto text-center space-y-4 animate-pop-in">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100">
                  <i className="ri-truck-line text-emerald-600 text-2xl"></i>
                </div>
                <div>
                  <div className="font-black text-stone-900 text-lg mb-1">العينات في الطريق!</div>
                  <p className="text-stone-500 text-sm">رقم التتبع: <strong className="text-stone-700">{sampleTracking}</strong></p>
                  <p className="text-stone-400 text-xs mt-1">المدينة: {shippingCity} — {shippingAddress}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "تم تجهيز العينات", date: "اليوم", done: true },
                    { label: "تم تسليمها لشركة الشحن", date: "غداً", done: true },
                    { label: "في الطريق", date: "خلال ٢-٣ أيام", done: false },
                    { label: "تم التسليم", date: "خلال ٣-٥ أيام", done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${
                        step.done ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"
                      }`}>
                        {step.done ? <i className="ri-check-line text-sm"></i> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`text-sm font-bold ${step.done ? "text-stone-900" : "text-stone-400"}`}>{step.label}</div>
                        <div className="text-stone-400 text-xs">{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSampleStatus("delivered");
                      addToast("تم تأكيد استلام العينات", "success");
                    }}
                    className="text-emerald-600 hover:text-emerald-500 text-sm font-bold cursor-pointer transition-colors hover:scale-105 active:scale-95"
                  >
                    تم استلام العينات ←
                  </button>
                </div>
              </div>
            )}

            {sampleStatus === "delivered" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl mx-auto text-center space-y-4 animate-pop-in">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100">
                  <i className="ri-checkbox-circle-line text-emerald-600 text-2xl"></i>
                </div>
                <div>
                  <div className="font-black text-stone-900 text-lg mb-1">تم استلام العينات!</div>
                  <p className="text-stone-500 text-sm">جرب العينات على بشرتك لعدة أيام، ثم قيّمها في المرحلة التالية</p>
                </div>

                <button
                  onClick={() => {
                    setActivePhase("evaluation");
                    addToast("انتقل إلى مرحلة التقييم", "info");
                  }}
                  className="w-full py-3.5 rounded-xl font-black text-sm bg-amber-700 hover:bg-amber-600 text-white transition-all cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  تقييم العينات الآن
                  <i className="ri-arrow-left-line mr-1"></i>
                </button>
              </div>
            )}

            {sampleStatus === "evaluated" && (
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 max-w-xl mx-auto text-center space-y-4 animate-pop-in">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100">
                  <i className="ri-check-double-line text-emerald-600 text-2xl"></i>
                </div>
                <div>
                  <div className="font-black text-stone-900 text-lg mb-1">تم التقييم والاعتماد!</div>
                  <p className="text-stone-500 text-sm">العطر معتمد وجاهز للإنتاج — انتقل لمرحلة التصنيع</p>
                </div>
                <button
                  onClick={() => {
                    setShowProduction(true);
                    addToast("تم فتح لوحة تتبع الإنتاج", "success");
                  }}
                  className="w-full py-3.5 rounded-xl font-black text-sm bg-stone-900 hover:bg-stone-800 text-white transition-all cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  متابعة مراحل الإنتاج
                  <i className="ri-settings-3-line mr-1"></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 3: EVALUATION */}
        {/* ==================================================================== */}
        {activePhase === "evaluation" && (
          <div key="evaluation" className="step-transition-enter space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">تقييم العينات</h2>
              <p className="text-stone-500 text-sm">جرّب العينات على بشرتك ثم قيّمها — تقييمك يحدد الاعتماد النهائي</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl mx-auto space-y-6 animate-pop-in">
              {/* Rating with interactive hover */}
              <div>
                <label className="block text-stone-700 font-bold text-sm mb-3 text-center">ما هو تقييمك العام للعطر؟</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEvaluationRating(star)}
                      onMouseEnter={() => {
                        /* visual preview - handled by CSS */
                      }}
                      className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 ${
                        star <= evaluationRating
                          ? "bg-amber-100 text-amber-500"
                          : "bg-stone-50 text-stone-300 hover:bg-stone-100 hover:text-amber-300"
                      } ${star === evaluationRating ? "animate-pop-in" : ""}`}
                    >
                      <i className={star <= evaluationRating ? "ri-star-fill" : "ri-star-line"}></i>
                    </button>
                  ))}
                </div>
                {evaluationRating > 0 && (
                  <p className="text-center text-stone-500 text-xs mt-3 animate-fade-slide-in">
                    {evaluationRating <= 2 ? (
                      <span className="text-red-500 font-bold">نحتاج تحسينات — سنعيد التعديل حسب ملاحظاتك</span>
                    ) : evaluationRating === 3 ? (
                      <span className="text-amber-600 font-bold">جيد، لكن قابل للتحسين — أخبرنا بتفاصيل أكثر</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">ممتاز! جاهز للاعتماد والانتقال للإنتاج</span>
                    )}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-stone-700 font-bold text-sm mb-1.5">ملاحظاتك وتفاصيل أكثر</label>
                <textarea
                  value={evaluationComment}
                  onChange={(e) => setEvaluationComment(e.target.value)}
                  placeholder="اكتب ملاحظاتك عن الرائحة، الثبات، الفوحان... أو أي تعديلات ترغب فيها"
                  rows={4}
                  maxLength={500}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                ></textarea>
                <div className="text-stone-300 text-xs mt-1 text-left">
                  <span className={evaluationComment.length > 450 ? "text-amber-500 font-bold" : ""}>
                    {evaluationComment.length}
                  </span>
                  /500
                </div>
              </div>

              {!evaluationApproved ? (
                <button
                  onClick={handleEvaluationSubmit}
                  disabled={evaluationRating < 4}
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
                    evaluationRating >= 4
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
                      : "bg-stone-100 text-stone-300 cursor-default"
                  }`}
                >
                  {evaluationRating >= 4 ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-check-line"></i>
                      اعتماد العطر والانتقال للإنتاج
                    </span>
                  ) : (
                    "التقييم يحتاج ٤ نجوم على الأقل للاعتماد"
                  )}
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center animate-bounce-in">
                  <i className="ri-checkbox-circle-fill text-emerald-500 text-2xl mb-1 block"></i>
                  <div className="text-emerald-700 font-black text-sm">تم الاعتماد بنجاح!</div>
                  <p className="text-emerald-600 text-xs mt-1">سينتقل المشروع إلى مرحلة الإنتاج فوراً</p>
                  <button
                    onClick={() => {
                      setSampleStatus("evaluated");
                      setActivePhase("samples");
                    }}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-all hover:scale-105 active:scale-95"
                  >
                    متابعة مراحل الإنتاج
                  </button>
                </div>
              )}

              {/* Evaluation progress bar */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                  <span>اكتمال التقييم</span>
                  <span>{evaluationRating > 0 ? (evaluationApproved ? "100%" : `${(evaluationRating / 5) * 100}%`) : "0%"}</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      evaluationApproved ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: evaluationApproved ? "100%" : `${(evaluationRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PRODUCTION TRACKING (shown after approval) */}
        {/* ==================================================================== */}
        {showProduction && (
          <div className="mt-12 border-t border-stone-200 pt-10 animate-fade-slide-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-stone-900 rounded-xl">
                <i className="ri-settings-3-line text-white text-lg"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900">مراحل الإنتاج</h2>
                <p className="text-stone-400 text-sm">المراحل 13A-16A — تتبع تنفيذ طلبك</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { to: "/packaging-customizer", num: "9A", title: "تصميم العبوة والتغليف", desc: "مواصفات العبوة والاستيكر والصندوق", icon: "ri-gift-2-line", status: "مكتمل", statusColor: "bg-emerald-100 text-emerald-700" },
                { to: "/studio-3d", num: "10A", title: "معاينة ثلاثية الأبعاد", desc: "رؤية شبه واقعية للمنتج النهائي", icon: "ri-box-3-line", status: "مكتمل", statusColor: "bg-emerald-100 text-emerald-700" },
                { to: "/pricing", num: "11A", title: "التسعير التفصيلي", desc: "حاسبة التكاليف وعرض السعر", icon: "ri-price-tag-3-line", status: "مكتمل", statusColor: "bg-emerald-100 text-emerald-700" },
                { to: "/dashboard/approvals", num: "12A", title: "الموافقة والدفع", desc: "اعتماد البنود وتجميد المشروع", icon: "ri-shield-check-line", status: "مكتمل", statusColor: "bg-emerald-100 text-emerald-700" },
                { to: "/production", num: "13A", title: "التصنيع", desc: "إنتاج الدفعة الأولى", icon: "ri-settings-3-line", status: "قيد التنفيذ", statusColor: "bg-amber-100 text-amber-700", active: true },
                { to: "/production", num: "14A", title: "ضبط الجودة", desc: "فحص المطابقة والمواصفات", icon: "ri-shield-check-line", status: "قيد الانتظار", statusColor: "bg-stone-100 text-stone-500" },
                { to: "/production", num: "15A", title: "الشحن", desc: "تجهيز الطلبية وتسليمها", icon: "ri-truck-line", status: "قيد الانتظار", statusColor: "bg-stone-100 text-stone-500" },
                { to: "/after-sales", num: "17A", title: "ما بعد البيع", desc: "تقييم وإعادة طلب وتطوير", icon: "ri-heart-line", status: "قيد الانتظار", statusColor: "bg-stone-100 text-stone-500" },
              ].map((item) => (
                <Link key={item.num} to={item.to} className={`rounded-2xl p-5 border-2 transition-all cursor-pointer group ${item.active ? "border-amber-300 bg-amber-50/50" : "border-stone-100 bg-white hover:border-amber-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${item.active ? "bg-amber-700" : "bg-stone-100 group-hover:bg-amber-50"}`}>
                      <i className={`${item.icon} ${item.active ? "text-white" : "text-stone-500 group-hover:text-amber-700"} text-base`}></i>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${item.statusColor}`}>{item.status}</span>
                  </div>
                  <div className="text-stone-400 text-[10px] font-bold mb-1">المرحلة {item.num}</div>
                  <div className="font-black text-stone-900 text-sm mb-1">{item.title}</div>
                  <p className="text-stone-400 text-xs">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Quick Navigation */}
      <div className="border-t border-stone-200 bg-white mt-6">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { to: "/services", label: "الخدمات", icon: "ri-compass-3-line", desc: "6 مسارات" },
              { to: "/workflow", label: "سير العمل", icon: "ri-git-branch-line", desc: "20 مرحلة" },
              { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line", desc: "المرحلة 9A" },
              { to: "/studio-3d", label: "استوديو 3D", icon: "ri-box-3-line", desc: "المرحلة 10A" },
              { to: "/pricing", label: "التسعير", icon: "ri-price-tag-3-line", desc: "المرحلة 11A" },
              { to: "/dashboard/approvals", label: "الاعتماد", icon: "ri-shield-check-line", desc: "المرحلة 12A" },
              { to: "/after-sales", label: "ما بعد البيع", icon: "ri-heart-line", desc: "المرحلة 17A" },
              { to: "/workspace", label: "مساحة العمل", icon: "ri-dashboard-3-line", desc: "14 وحدة" },
              { to: "/dashboard", label: "لوحة التحكم", icon: "ri-dashboard-line", desc: "مشاريعي" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 bg-stone-50/50 hover:bg-amber-50/50 transition-all cursor-pointer group">
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

      {/* ==================================================================== */}
      {/* CELEBRATION OVERLAY */}
      {/* ==================================================================== */}
      {celebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="relative">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti-particle"
                style={{
                  left: `${Math.random() * 200 - 40}px`,
                  top: `${Math.random() * -40}px`,
                  backgroundColor: ["#b45309", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0d9488", "#eab308"][i % 7],
                  animationDelay: `${Math.random() * 1.5}s`,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              ></div>
            ))}
            <div className="text-center animate-bounce-in bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 pointer-events-auto">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-amber-100 mb-3">
                <i className="ri-check-double-line text-amber-700 text-3xl"></i>
              </div>
              <div className="text-xl font-black text-stone-900 mb-1">مبروك! 🎉</div>
              <p className="text-stone-500 text-sm">تم اعتماد عطرك بنجاح — سينتقل إلى مرحلة الإنتاج</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOAST NOTIFICATIONS */}
      {/* ==================================================================== */}
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

      {/* Reset button (footer-like) */}
      <div className="text-center pb-8 pt-4">
        <button
          onClick={() => {
            clearState();
            setSelections(emptySelections);
            setDesignStepState(0);
            setActivePhaseState("design");
            setSampleStatusState("not-requested");
            setSampleTrackingState("");
            setShippingAddressState("");
            setShippingCityState("");
            setEvaluationRatingState(0);
            setEvaluationCommentState("");
            setEvaluationApprovedState(false);
            setShowProduction(false);
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

export default ProductionPage;