import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  animationStyles, type WizardPhase, type IdentitySelections, type SavedState, type Toast,
  STORAGE_KEY, emptySelections, saveState, loadState, clearState,
  personalityOptions, logoStyleOptions, moodInspirationOptions,
  primaryColorOptions, secondaryColorOptions, accentColorOptions,
  arabicFontOptions, latinFontOptions, logoConceptOptions,
  logomarkTypeOptions, logoLayoutOptions, stationeryOptions,
  socialMediaOptions, packagingStyleOptions, signageOptions,
  brandGuideFormatOptions, sourceFileOptions, revisionOptions, phasesList,
} from "./data";

const VisualIdentityPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navUserMenuOpen, setNavUserMenuOpen] = useState(false);
  const saved = loadState();

  const [activePhase, setActivePhaseState] = useState<WizardPhase>(saved?.activePhase || "direction");
  const [directionStep, setDirectionStepState] = useState(saved?.directionStep || 0);
  const [colorStep, setColorStepState] = useState(saved?.colorStep || 0);
  const [typographyStep, setTypographyStepState] = useState(saved?.typographyStep || 0);
  const [logoStep, setLogoStepState] = useState(saved?.logoStep || 0);
  const [applicationsStep, setApplicationsStepState] = useState(saved?.applicationsStep || 0);
  const [deliveryStep, setDeliveryStepState] = useState(saved?.deliveryStep || 0);
  const [selections, setSelections] = useState<IdentitySelections>(saved?.selections || emptySelections);
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
    const map: Record<WizardPhase, { step: number; setStep: (v: number | ((p: number) => number)) => void }> = {
      direction: {
        step: directionStep,
        setStep: (v) => setDirectionStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ directionStep: n }); showSaving(); return n; }),
      },
      color: {
        step: colorStep,
        setStep: (v) => setColorStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ colorStep: n }); showSaving(); return n; }),
      },
      typography: {
        step: typographyStep,
        setStep: (v) => setTypographyStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ typographyStep: n }); showSaving(); return n; }),
      },
      logo: {
        step: logoStep,
        setStep: (v) => setLogoStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ logoStep: n }); showSaving(); return n; }),
      },
      applications: {
        step: applicationsStep,
        setStep: (v) => setApplicationsStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ applicationsStep: n }); showSaving(); return n; }),
      },
      delivery: {
        step: deliveryStep,
        setStep: (v) => setDeliveryStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ deliveryStep: n }); showSaving(); return n; }),
      },
    };
    return map[phase];
  };

  const getSubSteps = (phase: WizardPhase): { label: string; icon: string }[] => {
    const map: Record<WizardPhase, { label: string; icon: string }[]> = {
      direction: [
        { label: "شخصية البراند", icon: "ri-user-heart-line" },
        { label: "نمط الشعار", icon: "ri-pen-nib-line" },
        { label: "المود العام", icon: "ri-image-line" },
      ],
      color: [
        { label: "اللون الأساسي", icon: "ri-paint-fill" },
        { label: "اللون الثانوي", icon: "ri-contrast-drop-2-line" },
        { label: "اللون التمييزي", icon: "ri-mark-pen-line" },
      ],
      typography: [
        { label: "الخط العربي", icon: "ri-text" },
        { label: "الخط اللاتيني", icon: "ri-font-size-2" },
        { label: "تأكيد الاختيار", icon: "ri-check-double-line" },
      ],
      logo: [
        { label: "مفهوم الشعار", icon: "ri-lightbulb-line" },
        { label: "نوع الرمز", icon: "ri-shapes-line" },
        { label: "تنسيق الشعار", icon: "ri-layout-5-line" },
      ],
      applications: [
        { label: "القرطاسية", icon: "ri-file-text-line" },
        { label: "وسائل التواصل", icon: "ri-instagram-line" },
        { label: "التغليف واللافتات", icon: "ri-gift-line" },
      ],
      delivery: [
        { label: "دليل الهوية", icon: "ri-book-open-line" },
        { label: "صيغ التسليم", icon: "ri-folder-zip-line" },
        { label: "المراجعات", icon: "ri-loop-left-line" },
      ],
    };
    return map[phase];
  };

  const updateSelections = useCallback((val: IdentitySelections | ((prev: IdentitySelections) => IdentitySelections)) => {
    setSelections((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      saveState({ selections: next });
      return next;
    });
  }, []);

  const canGoNext = (phase: WizardPhase): boolean => {
    const s = getStepState(phase);
    switch (phase) {
      case "direction":
        if (s.step === 0) return selections.brandPersonality.length >= 1;
        if (s.step === 1) return selections.logoStyle !== null;
        if (s.step === 2) return selections.moodInspiration !== null;
        return true;
      case "color":
        if (s.step === 0) return selections.primaryColor !== null;
        if (s.step === 1) return selections.secondaryColor !== null;
        if (s.step === 2) return selections.accentColor !== null;
        return true;
      case "typography":
        if (s.step === 0) return selections.arabicFont !== null;
        if (s.step === 1) return selections.latinFont !== null;
        return true;
      case "logo":
        if (s.step === 0) return selections.logoConcept !== null;
        if (s.step === 1) return selections.logomarkType !== null;
        if (s.step === 2) return selections.logoLayout !== null;
        return true;
      case "applications":
        if (s.step === 0) return selections.stationery.length >= 1;
        if (s.step === 1) return selections.socialMedia.length >= 1;
        return true;
      case "delivery":
        if (s.step === 0) return selections.brandGuideFormat !== null;
        if (s.step === 1) return selections.sourceFiles.length >= 1;
        if (s.step === 2) return selections.revisions !== null;
        return true;
    }
  };

  const handleStepForward = (phase: WizardPhase) => {
    if (!canGoNext(phase)) { addToast("يرجى إكمال الاختيار أولاً", "warning"); return; }
    const { step, setStep } = getStepState(phase);
    const subSteps = getSubSteps(phase);
    if (step === subSteps.length - 1) {
      const newCompleted = completedPhases.includes(phase) ? completedPhases : [...completedPhases, phase];
      setCompletedPhases(newCompleted);
      saveState({ completedPhases: newCompleted });
      const phaseIdx = phasesList.findIndex((p) => p.key === phase);
      if (phaseIdx < phasesList.length - 1) {
        setActivePhase(phasesList[phaseIdx + 1].key);
        addToast(`أحسنت! انتقلنا إلى ${phasesList[phaseIdx + 1].label}`, "success");
      } else { setAllDone(true); setCelebration(true); addToast("اكتمل تصميم هويتك البصرية!", "success"); setTimeout(() => setCelebration(false), 4000); }
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

  const toggleArray = (field: "brandPersonality" | "stationery" | "socialMedia" | "sourceFiles", id: string, max: number, warnMsg: string) => {
    updateSelections((prev) => {
      const current = prev[field];
      if (current.includes(id)) return { ...prev, [field]: current.filter((p) => p !== id) };
      if (current.length >= max) { addToast(warnMsg, "warning"); return prev; }
      return { ...prev, [field]: [...current, id] };
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); handleStepForward(activePhase); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); handleStepBackward(activePhase); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhase, directionStep, colorStep, typographyStep, logoStep, applicationsStep, deliveryStep, selections]);

  const resetAll = () => {
    clearState();
    setSelections(emptySelections);
    setActivePhaseState("direction");
    setDirectionStepState(0);
    setColorStepState(0);
    setTypographyStepState(0);
    setLogoStepState(0);
    setApplicationsStepState(0);
    setDeliveryStepState(0);
    setCompletedPhases([]);
    setAllDone(false);
    addToast("تم إعادة تعيين جميع البيانات", "info");
  };

  const { step } = getStepState(activePhase);
  const subSteps = getSubSteps(activePhase);
  const isLastStepInPhase = step === subSteps.length - 1;
  const isLastPhase = activePhase === "delivery";

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      <style>{animationStyles}</style>
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer flex-shrink-0">
          <img src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png" alt="شعار المنصة" className="h-9 w-auto object-contain" />
        </Link>
        <div className="hidden lg:flex items-center gap-1 mx-4 overflow-x-auto">
          {[
            { to: "/services", label: "الخدمات", icon: "ri-compass-3-line" },
            { to: "/workflow", label: "سير العمل", icon: "ri-git-branch-line" },
            { to: "/production", label: "تطوير عطر", icon: "ri-drop-line" },
            { to: "/brand-creation", label: "بناء براند", icon: "ri-award-fill" },
            { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line" },
          ].map((link) => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-stone-400 hover:text-stone-700 hover:bg-stone-50`}>
              <i className={`${link.icon} text-xs`}></i>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline">هوية بصرية</span>
          {savingIndicator && (
            <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 hidden sm:flex"><i className="ri-check-line"></i> تم الحفظ</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <div className="relative">
              <button
                onClick={() => setNavUserMenuOpen(!navUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-violet-700 rounded-full text-white text-xs font-bold">
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

      {/* Phase Progress Bar */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {phasesList.map((phase, i) => {
              const isCurrent = activePhase === phase.key;
              const isDone = completedPhases.includes(phase.key);
              const clickable = isDone || phasesList.findIndex((p) => p.key === activePhase) > i;
              return (
                <div key={phase.key} className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => clickable && setActivePhase(phase.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isCurrent ? "bg-violet-700 text-white animate-pulse-glow" : isDone ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      : clickable ? "bg-stone-100 text-stone-500 border border-stone-200" : "bg-stone-50 text-stone-300 border border-stone-100 cursor-default"
                    } ${clickable ? "hover:scale-105 active:scale-95" : ""}`}>
                    <i className={`${isDone ? "ri-checkbox-circle-fill" : phase.icon}`}></i>
                    <span className="hidden sm:inline">{phase.label}</span>
                  </button>
                  {i < phasesList.length - 1 && <div className={`w-6 h-0.5 rounded-full transition-all duration-500 ${isDone ? "bg-emerald-300" : "bg-stone-200"}`}></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center gap-1 text-xs text-stone-400">
          <Link to="/" className="hover:text-violet-700 transition-colors cursor-pointer">الرئيسية</Link>
          <i className="ri-arrow-left-s-line text-[10px]"></i>
          <Link to="/services" className="hover:text-violet-700 transition-colors cursor-pointer">الخدمات</Link>
          <i className="ri-arrow-left-s-line text-[10px]"></i>
          <span className="text-violet-700 font-bold">هوية بصرية كاملة</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Phase Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 mb-4 animate-float">
            <i className={`${phasesList.find(p => p.key === activePhase)?.icon || "ri-palette-line"} text-white text-2xl`}></i>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-1">{phasesList.find(p => p.key === activePhase)?.label}</h1>
          <p className="text-stone-500 text-sm">{phasesList.find(p => p.key === activePhase)?.desc}</p>
        </div>

        {/* All Done Banner */}
        {allDone && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-violet-50 border border-emerald-200 rounded-3xl p-8 text-center animate-bounce-in">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100 mb-3">
              <i className="ri-check-double-line text-emerald-600 text-3xl"></i>
            </div>
            <h2 className="text-xl font-black text-stone-900 mb-2">اكتمل تصميم هويتك البصرية!</h2>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">اخترت كل تفاصيل الهوية من الألوان والخطوط حتى الشعار والتطبيقات. فريق التصميم جاهز للبدء.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/packaging-customizer" className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                <i className="ri-arrow-left-line"></i> الخطوة التالية: التغليف
              </Link>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/brand-creation" className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-arrow-right-line"></i> العودة لبناء البراند
                </Link>
                <Link to="/manufacturing" className="bg-sky-700 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-settings-3-line"></i> أو انتقل للتصنيع
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-stone-200">
                <Link to="/workflow" className="text-stone-500 hover:text-violet-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                  <i className="ri-flow-chart ml-1"></i> متابعة سير العمل
                </Link>
                <button onClick={resetAll} className="text-stone-400 hover:text-red-400 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                  بدء تصميم جديد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub-steps indicator */}
        {!allDone && (
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
            {subSteps.map((sub, i) => (
              <button key={i} onClick={() => { if (i < step) getStepState(activePhase).setStep(i); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  i === step ? "bg-stone-900 text-white" : i < step ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-white text-stone-400 border border-stone-200"
                } ${i === step ? "animate-pop-in" : ""}`}>
                <div className="w-4 h-4 flex items-center justify-center">
                  {i < step ? <i className="ri-check-line text-emerald-500 text-xs"></i> : <span className="text-[10px]">{i + 1}</span>}
                </div>
                <span>{sub.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        {!allDone && (
          <div key={`${activePhase}-${step}`} className="step-transition-enter">
            {renderPhaseContent()}

            {/* Nav buttons */}
            <div className="flex justify-between mt-8">
              <button onClick={() => handleStepBackward(activePhase)} disabled={step === 0}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${step === 0 ? "bg-stone-100 text-stone-300 cursor-default" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                <i className="ri-arrow-right-line ml-1"></i> السابق
              </button>
              <div className="flex items-center gap-2">
                <span className="text-stone-300 text-xs">{step + 1} / {subSteps.length}</span>
                <button onClick={() => handleStepForward(activePhase)} disabled={!canGoNext(activePhase)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    canGoNext(activePhase) ? (isLastStepInPhase && isLastPhase ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-violet-700 hover:bg-violet-600 text-white") : "bg-stone-100 text-stone-300 cursor-default"
                  }`}>
                  {isLastStepInPhase ? (isLastPhase ? "إنهاء التصميم" : `الانتقال لـ ${phasesList[phasesList.findIndex(p => p.key === activePhase) + 1]?.label || ""}`) : "التالي"}
                  <i className="ri-arrow-left-line mr-1"></i>
                </button>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-violet-500 to-violet-700 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step + 1) / subSteps.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-stone-200 bg-white mt-6">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { to: "/services", label: "الخدمات", icon: "ri-compass-3-line", desc: "6 مسارات" },
              { to: "/production", label: "تطوير عطر", icon: "ri-drop-line", desc: "معالج تفاعلي" },
              { to: "/brand-creation", label: "بناء براند", icon: "ri-award-fill", desc: "براند كامل" },
              { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line", desc: "عبوة واستيكر" },
              { to: "/dashboard", label: "لوحة التحكم", icon: "ri-dashboard-line", desc: "مشاريعي" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-violet-200 bg-stone-50/50 hover:bg-violet-50/50 transition-all cursor-pointer group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 group-hover:bg-violet-100 flex-shrink-0">
                  <i className={`${link.icon} text-stone-500 group-hover:text-violet-700 text-sm`}></i>
                </div>
                <div className="min-w-0">
                  <div className="text-stone-700 font-bold text-xs group-hover:text-violet-700">{link.label}</div>
                  <div className="text-stone-400 text-[10px]">{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration */}
      {celebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="relative">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="confetti-particle" style={{
                left: `${Math.random() * 240 - 60}px`, top: `${Math.random() * -50}px`,
                backgroundColor: ["#7c3aed","#059669","#d97706","#dc2626","#b8860b","#0d9488","#eab308","#c4a882","#db2777"][i % 9],
                animationDelay: `${Math.random() * 2}s`, width: `${4 + Math.random() * 10}px`, height: `${4 + Math.random() * 10}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}></div>
            ))}
            <div className="text-center animate-bounce-in bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-violet-200 pointer-events-auto">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-violet-100 mb-3">
                <i className="ri-check-double-line text-violet-700 text-3xl"></i>
              </div>
              <div className="text-xl font-black text-stone-900 mb-1">اكتملت الهوية!</div>
              <p className="text-stone-500 text-sm">تم اختيار كامل الهوية البصرية — المصممون جاهزون</p>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const colors: Record<string, string> = { success: "bg-emerald-600 text-white", info: "bg-stone-800 text-white", warning: "bg-violet-500 text-white" };
          return (
            <div key={toast.id} className={`${colors[toast.type]} px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap animate-toast-in`}>
              <i className={toast.icon}></i>{toast.message}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="text-center pb-8 pt-4">
        <button onClick={resetAll} className="text-stone-300 hover:text-red-400 text-xs font-medium cursor-pointer transition-colors underline">
          إعادة تعيين جميع البيانات
        </button>
      </div>
    </div>
  );

  function renderPhaseContent() {
    const s = getStepState(activePhase);

    if (activePhase === "direction") {
      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-stone-900 mb-1">ما هي شخصية براندك؟</h2>
            <p className="text-stone-500 text-sm">اختر ما يصل إلى ٣ سمات تصف هوية براندك البصرية</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 mt-2 inline-block">{selections.brandPersonality.length}/3</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {personalityOptions.map((opt, idx) => {
              const selected = selections.brandPersonality.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleArray("brandPersonality", opt.id, 3, "الحد الأقصى ٣ سمات")}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
                    </div>
                    <div><div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><div className="text-stone-400 text-xs mb-1">{opt.en}</div><p className="text-stone-500 text-xs">{opt.desc}</p></div>
                  </div>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-stone-900 mb-1">اختر نمط الشعار</h2>
            <p className="text-stone-500 text-sm">الشعار هو العمود الفقري للهوية البصرية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logoStyleOptions.map((opt, idx) => {
              const selected = selections.logoStyle === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, logoStyle: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                    <i className={`${opt.icon} text-xl`}></i>
                  </div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                  <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                  <p className="text-stone-500 text-xs mb-2">{opt.desc}</p>
                  <div className="text-stone-300 text-[10px]">مثل: {opt.examples}</div>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-stone-900 mb-1">اختر الإلهام البصري</h2>
            <p className="text-stone-500 text-sm">المود بورد هو النمط العام الذي سيلهم كامل الهوية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodInspirationOptions.map((opt, idx) => {
              const selected = selections.moodInspiration === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, moodInspiration: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                    <i className={`${opt.icon} text-lg`}></i>
                  </div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                  <p className="text-stone-500 text-xs mb-2">{opt.desc}</p>
                  <div className="flex flex-wrap gap-1.5">{opt.keywords.split("،").map((kw) => (<span key={kw} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-full whitespace-nowrap">{kw.trim()}</span>))}</div>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (activePhase === "color") {
      const renderColorGrid = (options: typeof primaryColorOptions, selected: string | null, onSelect: (id: string) => void) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {options.map((opt, idx) => {
            const isSelected = selected === opt.id;
            return (
              <button key={opt.id} onClick={() => onSelect(opt.id)}
                className={`selection-card text-center rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${isSelected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                style={{ animationDelay: `${idx * 80}ms` }}>
                <div className={`w-14 h-14 mx-auto rounded-2xl mb-3 color-swatch ${opt.class} ${isSelected ? "ring-4 ring-violet-300 ring-offset-2" : ""}`}></div>
                <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                <div className="text-stone-400 text-xs mb-2">{opt.hex}</div>
                <p className="text-stone-500 text-xs">{opt.desc}</p>
                {isSelected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
              </button>
            );
          })}
        </div>
      );

      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر اللون الأساسي</h2><p className="text-stone-500 text-sm">اللون الرئيسي الذي سيمثل براندك في كل مكان</p></div>
          {renderColorGrid(primaryColorOptions, selections.primaryColor, (id) => updateSelections((prev) => ({ ...prev, primaryColor: id })))}
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر اللون الثانوي</h2><p className="text-stone-500 text-sm">اللون المكمل — للخلفيات والعناصر الثانوية</p></div>
          {renderColorGrid(secondaryColorOptions, selections.secondaryColor, (id) => updateSelections((prev) => ({ ...prev, secondaryColor: id })))}
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر اللون التمييزي</h2><p className="text-stone-500 text-sm">للأزرار والروابط والعناصر التفاعلية</p></div>
          {renderColorGrid(accentColorOptions, selections.accentColor, (id) => updateSelections((prev) => ({ ...prev, accentColor: id })))}
          {selections.primaryColor && selections.secondaryColor && selections.accentColor && (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 animate-bounce-in">
              <div className="text-center mb-4"><span className="text-xs font-bold text-stone-400">معاينة لوحة الألوان</span></div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {[
                  { label: "أساسي", id: selections.primaryColor, opts: primaryColorOptions },
                  { label: "ثانوي", id: selections.secondaryColor, opts: secondaryColorOptions },
                  { label: "تمييزي", id: selections.accentColor, opts: accentColorOptions },
                ].map((c, i) => {
                  const found = c.opts.find(o => o.id === c.id);
                  return (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-stone-200">
                      <div className={`w-12 h-12 rounded-xl ${found?.class || ""}`}></div>
                      <div><div className="text-xs text-stone-400">{c.label}</div><div className="text-sm font-bold text-stone-800">{found?.name}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activePhase === "typography") {
      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر الخط العربي</h2><p className="text-stone-500 text-sm">الخط العربي هو روح الهوية</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arabicFontOptions.map((opt, idx) => {
              const selected = selections.arabicFont === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, arabicFont: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-4 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-600"}`}>
                    <span className="text-4xl font-black" style={{ fontFamily: "serif" }}>{opt.sample}</span>
                  </div>
                  <div className="text-center"><div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><div className="text-stone-400 text-xs mb-2">{opt.en}</div><p className="text-stone-500 text-xs mb-2">{opt.desc}</p><span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-full">{opt.style}</span></div>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر الخط اللاتيني</h2><p className="text-stone-500 text-sm">الخط الإنجليزي يكمل الهوية للوصول العالمي</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latinFontOptions.map((opt, idx) => {
              const selected = selections.latinFont === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, latinFont: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-4 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-600"}`}>
                    <span className="text-3xl font-black">{opt.sample}</span>
                  </div>
                  <div className="text-center"><div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><div className="text-stone-400 text-xs mb-2">{opt.en}</div><p className="text-stone-500 text-xs mb-2">{opt.desc}</p><span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-full">{opt.style}</span></div>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">تأكيد اختيار الخطوط</h2><p className="text-stone-500 text-sm">راجع اختياراتك للخطوط</p></div>
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 animate-bounce-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center border border-stone-200 bg-white rounded-2xl p-6">
                <div className="text-xs font-bold text-stone-400 mb-3">الخط العربي</div>
                <div className="text-5xl font-black text-stone-800 mb-3" style={{ fontFamily: "serif" }}>{arabicFontOptions.find(o => o.id === selections.arabicFont)?.sample || "..."}</div>
                <div className="font-black text-stone-900 text-sm">{arabicFontOptions.find(o => o.id === selections.arabicFont)?.name || "لم يتم الاختيار"}</div>
              </div>
              <div className="text-center border border-stone-200 bg-white rounded-2xl p-6">
                <div className="text-xs font-bold text-stone-400 mb-3">الخط اللاتيني</div>
                <div className="text-5xl font-black text-stone-800 mb-3">{latinFontOptions.find(o => o.id === selections.latinFont)?.sample || "..."}</div>
                <div className="font-black text-stone-900 text-sm">{latinFontOptions.find(o => o.id === selections.latinFont)?.name || "لم يتم الاختيار"}</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-stone-200">
                <i className="ri-link text-stone-400"></i>
                <span className="text-sm text-stone-600 font-bold">الاقتران: </span>
                <span className="text-sm text-stone-400">{arabicFontOptions.find(o => o.id === selections.arabicFont)?.name} + {latinFontOptions.find(o => o.id === selections.latinFont)?.name}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activePhase === "logo") {
      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر مفهوماً للشعار</h2><p className="text-stone-500 text-sm">سيعمل المصمم على تطوير ٣ مقترحات</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {logoConceptOptions.map((opt, idx) => {
              const selected = selections.logoConcept === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, logoConcept: opt.id }))}
                  className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-4 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                    <i className={`${opt.icon} text-2xl`}></i>
                  </div>
                  <div className="font-black text-stone-900 text-lg mb-2">{opt.name}</div>
                  {opt.badge && <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${selected ? "bg-violet-100 text-violet-700" : "bg-stone-100 text-stone-500"}`}>{opt.badge}</span>}
                  <p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر نوع الرمز</h2><p className="text-stone-500 text-sm">الرمز هو الأيقونة البصرية المصاحبة للشعار</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logomarkTypeOptions.map((opt, idx) => {
              const selected = selections.logomarkType === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, logomarkType: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                    <i className={`${opt.icon} text-xl`}></i>
                  </div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><div className="text-stone-400 text-xs mb-2">{opt.en}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر تنسيق الشعار</h2><p className="text-stone-500 text-sm">كيف سيتم ترتيب الرمز والنص معاً</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logoLayoutOptions.map((opt, idx) => {
              const selected = selections.logoLayout === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, logoLayout: opt.id }))}
                  className={`selection-card text-center rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-12 h-12 mx-auto flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                    <i className={`${opt.icon} text-xl`}></i>
                  </div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                  <p className="text-stone-500 text-xs mb-3">{opt.desc}</p>
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full whitespace-pre-line inline-block">{opt.sample}</span>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (activePhase === "applications") {
      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر القرطاسية</h2><p className="text-stone-500 text-sm">اختر ما تحتاجه من أدوات مكتبية بهوية براندك</p><span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 mt-2 inline-block">{selections.stationery.length}/6</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stationeryOptions.map((opt, idx) => {
              const selected = selections.stationery.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleArray("stationery", opt.id, 6, "الحد الأقصى ٦ عناصر")}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-lg`}></i></div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر منصات التواصل</h2><p className="text-stone-500 text-sm">جهّز حضورك الرقمي بهوية متكاملة</p><span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 mt-2 inline-block">{selections.socialMedia.length}/6</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialMediaOptions.map((opt, idx) => {
              const selected = selections.socialMedia.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleArray("socialMedia", opt.id, 6, "الحد الأقصى ٦ منصات")}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-lg`}></i></div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-8">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">التغليف واللافتات</h2><p className="text-stone-500 text-sm">اختر نمط التغليف ونوع اللافتات</p></div>
          <div>
            <h3 className="font-black text-stone-800 text-sm mb-1">نمط التغليف</h3><p className="text-stone-400 text-xs mb-4">كيف تريد أن تظهر الهوية على العبوات؟</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packagingStyleOptions.map((opt, idx) => {
                const selected = selections.packagingStyle === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, packagingStyle: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-4 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-lg`}></i></div>
                      <div><div className="font-black text-stone-900 text-sm">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p></div>
                    </div>
                    {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="font-black text-stone-800 text-sm mb-1">اللافتات</h3><p className="text-stone-400 text-xs mb-4">اختر اللافتات المناسبة</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {signageOptions.map((opt, idx) => {
                const selected = selections.signage === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, signage: selected ? null : opt.id }))}
                    className={`selection-card text-right rounded-2xl p-4 border-2 transition-all cursor-pointer ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-lg`}></i></div>
                      <div><div className="font-black text-stone-900 text-sm">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p></div>
                    </div>
                    {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activePhase === "delivery") {
      if (s.step === 0) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر صيغة دليل الهوية</h2><p className="text-stone-500 text-sm">الدليل الشامل لاستخدام الهوية البصرية</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandGuideFormatOptions.map((opt, idx) => {
              const selected = selections.brandGuideFormat === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, brandGuideFormat: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-xl`}></i></div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );

      if (s.step === 1) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر صيغ التسليم</h2><p className="text-stone-500 text-sm">ملفات المصدر مع كامل حقوق الملكية</p><span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 mt-2 inline-block">{selections.sourceFiles.length}/5</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sourceFileOptions.map((opt, idx) => {
              const selected = selections.sourceFiles.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleArray("sourceFiles", opt.id, 5, "الحد الأقصى ٥ صيغ")}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-lg`}></i></div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-right animate-fade-slide-in">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-amber-500 text-lg"></i>
              <div><div className="font-bold text-amber-800 text-xs mb-0.5">حقوق الملكية الكاملة</div><p className="text-amber-600 text-xs">جميع الملفات المصدرية تنتقل ملكيتها لك بالكامل بعد التسليم النهائي</p></div>
            </div>
          </div>
        </div>
      );

      if (s.step === 2) return (
        <div className="space-y-6">
          <div className="text-center mb-6"><h2 className="text-xl font-black text-stone-900 mb-1">اختر سياسة المراجعات</h2><p className="text-stone-500 text-sm">عدد جولات التعديل بعد التسليم الأولي</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revisionOptions.map((opt, idx) => {
              const selected = selections.revisions === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, revisions: opt.id }))}
                  className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${selected ? "border-violet-600 bg-violet-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-violet-200"}`}
                  style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-violet-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}><i className={`${opt.icon} text-xl`}></i></div>
                  <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div><div className="text-stone-400 text-xs mb-2">{opt.en}</div><p className="text-stone-500 text-xs">{opt.desc}</p>
                  {selected && <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-violet-700 animate-bounce-in"><i className="ri-check-line text-white text-xs"></i></div>}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }
};

export default VisualIdentityPage;