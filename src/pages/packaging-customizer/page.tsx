import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SamplesGallery from "./components/SamplesGallery";
import type { PackagingOption } from "@/mocks/packagingData";

type Tab = "bottle" | "sticker" | "box";
type ViewAngle = "front" | "side" | "back" | "perspective";
type BottleShape = "rectangular" | "round" | "square" | "oval" | "geometric";

interface StickerData {
  brandName: string;
  fragranceName: string;
  concentration: string;
  volume: string;
  ingredients: string;
  madeIn: string;
  batchNo: string;
  barcode: string;
  website: string;
  warnings: string;
  slogan: string;
}

interface BottleOptions {
  shape: BottleShape;
  size: string;
  glassType: string;
  glassColor: string;
  capMaterial: string;
  capColor: string;
  sprayerColor: string;
  finish: string;
  decoration: string;
  engraving: string;
}

interface BoxOptions {
  boxType: string;
  exteriorMaterial: string;
  exteriorColor: string;
  exteriorFinish: string;
  interiorLining: string;
  interiorColor: string;
  closure: string;
  ribbon: string;
  insert: string;
  foilStamping: string;
}

/* ── accordion sections config ── */
interface AccSection {
  key: string;
  label: string;
  icon: string;
}

const bottleSections: AccSection[] = [
  { key: "size", label: "الحجم", icon: "ri-ruler-line" },
  { key: "glass", label: "الزجاج", icon: "ri-vip-diamond-line" },
  { key: "cap", label: "الغطاء", icon: "ri-vip-crown-line" },
  { key: "finish", label: "التشطيب", icon: "ri-brush-line" },
];

const boxSections: AccSection[] = [
  { key: "box", label: "الصندوق", icon: "ri-box-3-line" },
  { key: "exterior", label: "الخارجي", icon: "ri-palette-line" },
  { key: "interior", label: "الداخلي", icon: "ri-layout-grid-line" },
  { key: "details", label: "التفاصيل", icon: "ri-sparkling-line" },
];

const bottleShapeOptions: { id: BottleShape; label: string; icon: string }[] = [
  { id: "rectangular", label: "مستطيل", icon: "ri-checkbox-blank-line" },
  { id: "round", label: "دائري", icon: "ri-checkbox-blank-circle-line" },
  { id: "square", label: "مربع", icon: "ri-checkbox-blank-line" },
  { id: "oval", label: "بيضاوي", icon: "ri-radio-button-line" },
  { id: "geometric", label: "هندسي", icon: "ri-hexagon-line" },
];

const previewImages: Record<BottleShape, Record<ViewAngle, string>> = {
  rectangular: {
    front: "https://readdy.ai/api/search-image?query=elegant%20rectangular%20perfume%20bottle%20front%20view%20transparent%20glass%20gold%20metallic%20cap%20minimalist%20dark%20background%20premium%20product%20photography%20studio%20lighting%20high%20detail%20crystal%20clear%20glass%20reflections%20luxury%20fragrance&width=600&height=800&seq=pk3d-rect-front&orientation=portrait",
    side: "https://readdy.ai/api/search-image?query=elegant%20rectangular%20perfume%20bottle%20side%20profile%20view%20transparent%20glass%20gold%20cap%20studio%20dark%20background%20clean%20minimal%20premium%20product%20photography%20luxury%20fragrance%20bottle%20design&width=600&height=800&seq=pk3d-rect-side&orientation=portrait",
    back: "https://readdy.ai/api/search-image?query=elegant%20rectangular%20perfume%20bottle%20back%20view%20transparent%20glass%20showing%20liquid%20inside%20gold%20cap%20dark%20background%20minimalist%20studio%20lighting%20premium%20fragrance%20product&width=600&height=800&seq=pk3d-rect-back&orientation=portrait",
    perspective: "https://readdy.ai/api/search-image?query=elegant%20rectangular%20luxury%20perfume%20bottle%20perspective%20angle%203d%20view%20transparent%20crystal%20glass%20gold%20metallic%20cap%20dramatic%20dark%20background%20premium%20fragrance%20studio%20lighting%20reflections%20sophisticated%20product&width=600&height=800&seq=pk3d-rect-persp&orientation=portrait",
  },
  round: {
    front: "https://readdy.ai/api/search-image?query=elegant%20round%20circular%20perfume%20bottle%20front%20view%20transparent%20glass%20gold%20spherical%20cap%20minimalist%20dark%20background%20premium%20product%20photography%20studio%20lighting%20luxury%20fragrance%20design&width=600&height=800&seq=pk3d-round-front&orientation=portrait",
    side: "https://readdy.ai/api/search-image?query=elegant%20round%20circular%20perfume%20bottle%20side%20profile%20transparent%20glass%20gold%20cap%20dark%20background%20premium%20product%20photography%20studio%20lighting%20luxury%20fragrance%20design%20minimal&width=600&height=800&seq=pk3d-round-side&orientation=portrait",
    back: "https://readdy.ai/api/search-image?query=elegant%20round%20perfume%20bottle%20back%20view%20transparent%20glass%20luxurious%20gold%20details%20dark%20background%20minimalist%20studio%20lighting%20premium%20product%20photography&width=600&height=800&seq=pk3d-round-back&orientation=portrait",
    perspective: "https://readdy.ai/api/search-image?query=elegant%20round%20circular%20luxury%20perfume%20bottle%20dramatic%20perspective%20angle%203d%20rendering%20transparent%20glass%20gold%20metallic%20accents%20dark%20moody%20background%20premium%20fragrance%20product%20photography%20reflections&width=600&height=800&seq=pk3d-round-persp&orientation=portrait",
  },
  square: {
    front: "https://readdy.ai/api/search-image?query=elegant%20square%20geometric%20perfume%20bottle%20front%20view%20transparent%20glass%20silver%20metallic%20cap%20minimalist%20dark%20background%20premium%20product%20photography%20studio%20lighting%20luxury%20modern%20fragrance%20design&width=600&height=800&seq=pk3d-sq-front&orientation=portrait",
    side: "https://readdy.ai/api/search-image?query=elegant%20square%20perfume%20bottle%20side%20profile%20transparent%20glass%20silver%20cap%20clean%20dark%20background%20premium%20product%20photography%20minimalist%20luxury%20fragrance%20modern%20design&width=600&height=800&seq=pk3d-sq-side&orientation=portrait",
    back: "https://readdy.ai/api/search-image?query=elegant%20square%20perfume%20bottle%20back%20view%20transparent%20glass%20modern%20design%20dark%20background%20studio%20lighting%20premium%20minimalist%20fragrance%20product%20photography&width=600&height=800&seq=pk3d-sq-back&orientation=portrait",
    perspective: "https://readdy.ai/api/search-image?query=elegant%20square%20geometric%20luxury%20perfume%20bottle%20dramatic%20perspective%20angle%203d%20view%20transparent%20glass%20silver%20metallic%20details%20dark%20moody%20background%20premium%20modern%20fragrance%20studio%20lighting&width=600&height=800&seq=pk3d-sq-persp&orientation=portrait",
  },
  oval: {
    front: "https://readdy.ai/api/search-image?query=elegant%20oval%20shaped%20perfume%20bottle%20front%20view%20transparent%20glass%20gold%20cap%20curved%20smooth%20design%20minimalist%20dark%20background%20premium%20product%20photography%20studio%20lighting%20luxury%20fragrance&width=600&height=800&seq=pk3d-oval-front&orientation=portrait",
    side: "https://readdy.ai/api/search-image?query=elegant%20oval%20perfume%20bottle%20side%20profile%20transparent%20glass%20gold%20details%20smooth%20curves%20dark%20background%20premium%20product%20photography%20minimalist%20luxury%20fragrance%20design&width=600&height=800&seq=pk3d-oval-side&orientation=portrait",
    back: "https://readdy.ai/api/search-image?query=elegant%20oval%20perfume%20bottle%20back%20view%20transparent%20glass%20smooth%20elegant%20curves%20dark%20background%20studio%20lighting%20premium%20minimalist%20fragrance%20product%20photography&width=600&height=800&seq=pk3d-oval-back&orientation=portrait",
    perspective: "https://readdy.ai/api/search-image?query=elegant%20oval%20curved%20luxury%20perfume%20bottle%20dramatic%20perspective%20angle%203d%20rendering%20transparent%20glass%20golden%20cap%20dark%20moody%20background%20premium%20fragrance%20studio%20lighting%20sophisticated%20design&width=600&height=800&seq=pk3d-oval-persp&orientation=portrait",
  },
  geometric: {
    front: "https://readdy.ai/api/search-image?query=modern%20geometric%20angular%20perfume%20bottle%20front%20view%20faceted%20transparent%20glass%20black%20metallic%20cap%20minimalist%20dark%20background%20premium%20product%20photography%20studio%20lighting%20luxury%20contemporary%20fragrance&width=600&height=800&seq=pk3d-geo-front&orientation=portrait",
    side: "https://readdy.ai/api/search-image?query=modern%20geometric%20angular%20perfume%20bottle%20side%20profile%20faceted%20glass%20black%20cap%20dark%20background%20premium%20product%20photography%20minimalist%20luxury%20contemporary%20fragrance%20design&width=600&height=800&seq=pk3d-geo-side&orientation=portrait",
    back: "https://readdy.ai/api/search-image?query=modern%20geometric%20perfume%20bottle%20back%20view%20faceted%20transparent%20glass%20angular%20design%20dark%20background%20studio%20lighting%20premium%20contemporary%20fragrance%20product%20photography&width=600&height=800&seq=pk3d-geo-back&orientation=portrait",
    perspective: "https://readdy.ai/api/search-image?query=modern%20geometric%20angular%20luxury%20perfume%20bottle%20dramatic%20perspective%20angle%203d%20rendering%20faceted%20crystal%20glass%20black%20metallic%20accents%20dark%20moody%20background%20premium%20contemporary%20fragrance%20studio&width=600&height=800&seq=pk3d-geo-persp&orientation=portrait",
  },
};

const sizeOptions = ["5ml", "10ml", "30ml", "50ml", "75ml", "100ml", "150ml", "200ml"];
const glassTypeOptions = ["زجاج شفاف", "زجاج مصنفر", "كريستال فاخر", "زجاج مزدوج", "زجاج معاد تدويره"];
const glassColorOptions = ["شفاف", "أسود شفاف", "بني عنبري", "أخضر زمردي", "أزرق كوبالت", "وردي فاتح", "رمادي دخاني"];
const capMaterialOptions = ["معدني ذهبي", "معدني فضي", "معدني أسود", "خشب طبيعي", "كريستال شفاف", "سيراميك أبيض", "راتنج مخصص"];
const capColorOptions = ["ذهبي", "فضي", "أسود مطفي", "أبيض لؤلؤي", "نحاسي", "خشبي طبيعي", "شفاف"];
const sprayerColorOptions = ["فضي", "ذهبي", "أسود", "نحاسي", "أبيض"];
const finishOptions = ["لامع", "مطفي", "مخملي", "مطلي بالذهب", "مزخرف بالليزر", "محفور"];
const decorationOptions = ["بدون", "نقش بسيط", "زخرفة عربية", "خطوط هندسية", "شعار محفور", "أحجار كريمة"];
const engravingOptions = ["بدون نقش", "اسم البراند", "اسم العطر", "شعار البراند", "عبارة مخصصة"];

const boxTypeOptions = ["علبة مغناطيسية", "علبة درج منزلق", "علبة قلاب", "علبة أسطوانية", "علبة كتابية", "علبة هرمية"];
const exteriorMaterialOptions = ["ورق مقوى فاخر 400g", "ورق كرافت فاخر", "ورق مخملي ناعم", "ورق ميتاليك", "جلد صناعي", "خشب طبيعي"];
const exteriorColorOptions = ["أسود كلاسيكي", "أبيض ناصع", "ذهبي ملكي", "بني شوكولاتة", "أحمر عنابي", "أخضر زيتوني", "رمادي أنيق"];
const exteriorFinishOptions = ["مطفي ناعم", "لامع فاخر", "مخملي", "مطلي بالذهب", "نقش بارز", "طباعة UV"];
const interiorLiningOptions = ["مخمل أسود", "حرير أبيض", "إسفنج مخصص", "ورق كرافت", "ساتان فاخر", "جلد ناعم"];
const interiorColorOptions = ["أسود", "أبيض", "ذهبي", "أحمر", "بيج فاخر", "رمادي"];
const closureOptions = ["مغناطيسي مخفي", "شريط ساتان", "قفل معدني", "غطاء مفصلي", "رباط جلدي"];
const ribbonOptions = ["بدون شريط", "ساتان أسود", "ساتان ذهبي", "قطن طبيعي", "جلدي رفيع"];
const insertOptions = ["قالب إسفنجي", "قاعدة مخملية", "حامل أكريليك", "وسادة حريرية", "بدون"];
const foilStampingOptions = ["بدون", "ذهبي لامع", "فضي", "نحاسي", "هولوغرام", "أسود مطفي"];

const concentrationOptions = ["Eau de Parfum", "Eau de Toilette", "Extrait de Parfum", "Parfum Concentré", "Cologne Intense"];
const madeInOptions = ["صنع في السعودية", "صنع في الإمارات", "صنع في فرنسا", "صنع في إيطاليا", "صنع في الكويت"];

const PackagingCustomizerPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [navUserMenuOpen, setNavUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("bottle");
  const [viewAngle, setViewAngle] = useState<ViewAngle>("perspective");
  const [saved, setSaved] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);
  const [bottleExpanded, setBottleExpanded] = useState<Record<string, boolean>>({
    size: true, glass: true, cap: false, finish: false,
  });
  const [boxExpanded, setBoxExpanded] = useState<Record<string, boolean>>({
    box: true, exterior: false, interior: false, details: false,
  });
  const rotateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [bottle, setBottle] = useState<BottleOptions>({
    shape: "rectangular",
    size: "50ml",
    glassType: "زجاج شفاف",
    glassColor: "شفاف",
    capMaterial: "معدني ذهبي",
    capColor: "ذهبي",
    sprayerColor: "فضي",
    finish: "لامع",
    decoration: "نقش بسيط",
    engraving: "اسم البراند",
  });
  const [sticker, setSticker] = useState<StickerData>({
    brandName: "الفجر",
    fragranceName: "ليالي نجد",
    concentration: "Eau de Parfum",
    volume: "50ml",
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Limonene, Citronellol, Geraniol, Coumarin, Benzyl Benzoate",
    madeIn: "صنع في السعودية",
    batchNo: "BT-2026-0742",
    barcode: "6285120007429",
    website: "www.alfajr-perfumes.com",
    warnings: "للاستخدام الخارجي فقط. يُحفظ بعيداً عن متناول الأطفال. تجنب ملامسة العينين.",
    slogan: "جوهر الشرق في كل قطرة",
  });
  const [box, setBox] = useState<BoxOptions>({
    boxType: "علبة مغناطيسية",
    exteriorMaterial: "ورق مقوى فاخر 400g",
    exteriorColor: "أسود كلاسيكي",
    exteriorFinish: "مطفي ناعم",
    interiorLining: "مخمل أسود",
    interiorColor: "أسود",
    closure: "مغناطيسي مخفي",
    ribbon: "ساتان ذهبي",
    insert: "قالب إسفنجي",
    foilStamping: "ذهبي لامع",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSelectSample = (sample: PackagingOption) => {
    setSelectedSampleId(sample.id);
    const shapeMap: Record<string, BottleShape> = {
      "أسطواني": "rectangular",
      "دائري": "round",
      "مربع": "square",
      "بيضاوي": "oval",
    };
    const sizeMap: Record<string, string> = {
      "30 مل": "30ml",
      "50 مل": "50ml",
      "100 مل": "100ml",
    };
    setBottle((prev) => ({
      ...prev,
      shape: shapeMap[sample.shape] || prev.shape,
      size: sizeMap[sample.size] || prev.size,
    }));
    setViewAngle("perspective");
    const section = document.getElementById("samples-gallery");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const startAutoRotate = () => {
    if (rotating) return;
    setRotating(true);
    const angles: ViewAngle[] = ["front", "side", "back", "perspective"];
    let idx = angles.indexOf(viewAngle);
    rotateInterval.current = setInterval(() => {
      idx = (idx + 1) % angles.length;
      setViewAngle(angles[idx]);
    }, 1200);
  };

  const stopAutoRotate = () => {
    setRotating(false);
    if (rotateInterval.current) {
      clearInterval(rotateInterval.current);
      rotateInterval.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (rotateInterval.current) clearInterval(rotateInterval.current);
    };
  }, []);

  const toggleBottleSection = useCallback((key: string) => {
    setBottleExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleBoxSection = useCallback((key: string) => {
    setBoxExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const tabs: { id: Tab; label: string; icon: string; desc: string; count?: number }[] = [
    { id: "bottle", label: "العبوة", icon: "ri-flask-line", desc: "شكل وحجم وخامات العبوة", count: 10 },
    { id: "sticker", label: "الاستيكر", icon: "ri-price-tag-3-line", desc: "بيانات ومواصفات الملصق", count: 9 },
    { id: "box", label: "التغليف", icon: "ri-gift-2-line", desc: "الصندوق والتشطيبات", count: 10 },
  ];

  const viewLabels: Record<ViewAngle, string> = {
    front: "أمامي",
    side: "جانبي",
    back: "خلفي",
    perspective: "منظور 3D",
  };

  const steps = [
    { id: "bottle", label: "العبوة", icon: "ri-flask-line" },
    { id: "sticker", label: "الاستيكر", icon: "ri-price-tag-3-line" },
    { id: "box", label: "التغليف", icon: "ri-gift-2-line" },
    { id: "save", label: "الحفظ", icon: "ri-save-line" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activeTab);

  /* ── shared chip group component ── */
  const ChipGroup = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
            value === opt
              ? "bg-amber-700/30 text-amber-300 border-amber-600/40"
              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  /* ── accordion wrapper ── */
  const Accordion = ({
    section,
    expanded,
    onToggle,
    children,
  }: {
    section: AccSection;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border border-white/5 rounded-xl overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-800/50 hover:bg-stone-800 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center bg-amber-700/15 rounded-lg">
            <i className={`${section.icon} text-amber-400/70 text-sm`}></i>
          </div>
          <span className="text-white/70 text-xs font-bold">{section.label}</span>
        </div>
        <i
          className={`ri-arrow-down-s-line text-white/30 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        ></i>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950" dir="rtl">
      {/* ===== Navbar ===== */}
      <nav className="bg-stone-900/80 backdrop-blur-md border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer flex-shrink-0">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <span className="bg-amber-700/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">المرحلة 9A</span>
          <span className="text-white/30 text-sm">|</span>
          <span className="text-white/40 text-xs hidden lg:block">Packaging Customizer — 3D Preview Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/services" className="text-white/50 hover:text-white text-sm font-medium cursor-pointer transition-colors whitespace-nowrap hidden md:block">
            <i className="ri-arrow-right-line ml-1"></i>
            الخدمات
          </Link>
          {user && (
            <div className="relative">
              <button
                onClick={() => setNavUserMenuOpen(!navUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-amber-700 rounded-full text-white text-xs font-bold">
                  {user.firstName.charAt(0)}
                </div>
                <span className="text-white/80 text-xs font-semibold hidden sm:inline">{user.firstName}</span>
              </button>
              {navUserMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-stone-900 rounded-xl border border-white/10 shadow-lg overflow-hidden z-50">
                  <Link to="/dashboard" onClick={() => setNavUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 cursor-pointer whitespace-nowrap">
                    <i className="ri-dashboard-line"></i> لوحة التحكم
                  </Link>
                  <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer whitespace-nowrap">
                    <i className="ri-logout-box-line"></i> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
          <Link to="/studio-3d" className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all">
            Concept Studio
            <i className="ri-arrow-left-line mr-1"></i>
          </Link>
        </div>
      </nav>

      {/* ===== Hero / Header ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-amber-900/10 via-transparent to-transparent"></div>
        <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-lg shadow-amber-900/20">
                  <i className="ri-gift-2-line text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">مخصص العبوة والاستيكر والتغليف</h1>
                  <p className="text-white/35 text-sm mt-1">عرض 3D تفاعلي — خصّص كل تفاصيل منتجك باحترافية</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-1 bg-stone-900/80 rounded-2xl border border-white/8 p-2">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (step.id !== "save") setActiveTab(step.id as Tab);
                      if (step.id === "save") handleSave();
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-amber-700 text-white shadow-md"
                        : isDone
                        ? "bg-amber-700/15 text-amber-400"
                        : "text-white/30 hover:text-white/50 hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                        isActive
                          ? "bg-white text-amber-700"
                          : isDone
                          ? "bg-amber-500 text-white"
                          : "bg-white/10 text-white/30"
                      }`}
                    >
                      {isDone ? <i className="ri-check-line"></i> : idx + 1}
                    </div>
                    <span className="text-xs font-bold hidden sm:inline">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="max-w-[1440px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* ── Customization Panel ── Left Side ── 2 cols ── */}
          <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
            {/* Tab Switcher */}
            <div className="bg-stone-900 rounded-2xl border border-white/8 overflow-hidden">
              <div className="grid grid-cols-3 gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-3 flex flex-col items-center gap-1.5 transition-all cursor-pointer border-b-2 relative ${
                      activeTab === tab.id
                        ? "border-amber-500 bg-amber-700/5"
                        : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      activeTab === tab.id ? "bg-amber-700/20" : "bg-white/5"
                    }`}>
                      <i className={`${tab.icon} text-lg ${activeTab === tab.id ? "text-amber-400" : "text-white/30"}`}></i>
                    </div>
                    <span className={`text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? "text-amber-400" : "text-white/40"}`}>
                      {tab.label}
                    </span>
                    {tab.count && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        activeTab === tab.id ? "bg-amber-700/20 text-amber-300" : "bg-white/5 text-white/20"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Bottle Options ── */}
            {activeTab === "bottle" && (
              <div className="bg-stone-900 rounded-2xl border border-white/8 p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-700/15 rounded-xl">
                    <i className="ri-flask-line text-amber-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm">مواصفات العبوة الزجاجية</h3>
                    <p className="text-white/25 text-[11px]">{bottle.size} · {bottleShapeOptions.find(s => s.id === bottle.shape)?.label} · {bottle.glassType}</p>
                  </div>
                </div>

                {/* Shape selector */}
                <div className="mb-5">
                  <label className="block text-white/40 text-[11px] font-bold mb-2.5 uppercase tracking-wider">الشكل الأساسي</label>
                  <div className="grid grid-cols-5 gap-2">
                    {bottleShapeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBottle((p) => ({ ...p, shape: opt.id }))}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                          bottle.shape === opt.id
                            ? "bg-amber-700/20 border-amber-500/40 text-amber-400"
                            : "bg-stone-800/50 border-white/5 text-white/30 hover:border-white/15 hover:text-white/50"
                        }`}
                      >
                        <i className={`${opt.icon} text-base`}></i>
                        <span className="text-[10px] font-bold whitespace-nowrap">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accordion sections */}
                <Accordion
                  section={bottleSections[0]}
                  expanded={bottleExpanded.size}
                  onToggle={() => toggleBottleSection("size")}
                >
                  <ChipGroup
                    options={sizeOptions}
                    value={bottle.size}
                    onChange={(v) => setBottle((p) => ({ ...p, size: v }))}
                  />
                </Accordion>

                <Accordion
                  section={bottleSections[1]}
                  expanded={bottleExpanded.glass}
                  onToggle={() => toggleBottleSection("glass")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">نوع الزجاج</label>
                      <ChipGroup
                        options={glassTypeOptions}
                        value={bottle.glassType}
                        onChange={(v) => setBottle((p) => ({ ...p, glassType: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">لون الزجاج</label>
                      <ChipGroup
                        options={glassColorOptions}
                        value={bottle.glassColor}
                        onChange={(v) => setBottle((p) => ({ ...p, glassColor: v }))}
                      />
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  section={bottleSections[2]}
                  expanded={bottleExpanded.cap}
                  onToggle={() => toggleBottleSection("cap")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">خامة الغطاء</label>
                      <ChipGroup
                        options={capMaterialOptions}
                        value={bottle.capMaterial}
                        onChange={(v) => setBottle((p) => ({ ...p, capMaterial: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">لون الغطاء</label>
                      <ChipGroup
                        options={capColorOptions}
                        value={bottle.capColor}
                        onChange={(v) => setBottle((p) => ({ ...p, capColor: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">لون البخاخ</label>
                      <ChipGroup
                        options={sprayerColorOptions}
                        value={bottle.sprayerColor}
                        onChange={(v) => setBottle((p) => ({ ...p, sprayerColor: v }))}
                      />
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  section={bottleSections[3]}
                  expanded={bottleExpanded.finish}
                  onToggle={() => toggleBottleSection("finish")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">تشطيب السطح</label>
                      <ChipGroup
                        options={finishOptions}
                        value={bottle.finish}
                        onChange={(v) => setBottle((p) => ({ ...p, finish: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">الزخرفة</label>
                      <ChipGroup
                        options={decorationOptions}
                        value={bottle.decoration}
                        onChange={(v) => setBottle((p) => ({ ...p, decoration: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">النقش</label>
                      <ChipGroup
                        options={engravingOptions}
                        value={bottle.engraving}
                        onChange={(v) => setBottle((p) => ({ ...p, engraving: v }))}
                      />
                    </div>
                  </div>
                </Accordion>
              </div>
            )}

            {/* ── Sticker Options ── */}
            {activeTab === "sticker" && (
              <div className="bg-stone-900 rounded-2xl border border-white/8 p-5 space-y-4">
                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-700/15 rounded-xl">
                    <i className="ri-price-tag-3-line text-amber-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm">بيانات الاستيكر الاحترافية</h3>
                    <p className="text-white/25 text-[11px]">{sticker.brandName} · {sticker.fragranceName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">اسم البراند *</label>
                    <input
                      type="text"
                      value={sticker.brandName}
                      onChange={(e) => setSticker((p) => ({ ...p, brandName: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="مثال: الفجر"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">اسم العطر *</label>
                    <input
                      type="text"
                      value={sticker.fragranceName}
                      onChange={(e) => setSticker((p) => ({ ...p, fragranceName: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="مثال: ليالي نجد"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 text-[11px] font-bold mb-1.5">العبارة التسويقية</label>
                  <input
                    type="text"
                    value={sticker.slogan}
                    onChange={(e) => setSticker((p) => ({ ...p, slogan: e.target.value }))}
                    className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="مثال: جوهر الشرق في كل قطرة"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">التركيز</label>
                    <select
                      value={sticker.concentration}
                      onChange={(e) => setSticker((p) => ({ ...p, concentration: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer transition-all"
                    >
                      {concentrationOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">الحجم</label>
                    <input
                      type="text"
                      value={sticker.volume}
                      onChange={(e) => setSticker((p) => ({ ...p, volume: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 text-[11px] font-bold mb-1.5">المكونات (Ingredients)</label>
                  <textarea
                    value={sticker.ingredients}
                    onChange={(e) => setSticker((p) => ({ ...p, ingredients: e.target.value }))}
                    rows={2}
                    maxLength={500}
                    className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-amber-500/50 resize-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">بلد الصنع</label>
                    <select
                      value={sticker.madeIn}
                      onChange={(e) => setSticker((p) => ({ ...p, madeIn: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer transition-all"
                    >
                      {madeInOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">رقم التشغيلة</label>
                    <input
                      type="text"
                      value={sticker.batchNo}
                      onChange={(e) => setSticker((p) => ({ ...p, batchNo: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">الباركود</label>
                    <input
                      type="text"
                      value={sticker.barcode}
                      onChange={(e) => setSticker((p) => ({ ...p, barcode: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all font-mono tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-[11px] font-bold mb-1.5">الموقع الإلكتروني</label>
                    <input
                      type="text"
                      value={sticker.website}
                      onChange={(e) => setSticker((p) => ({ ...p, website: e.target.value }))}
                      className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 text-[11px] font-bold mb-1.5">التحذيرات</label>
                  <textarea
                    value={sticker.warnings}
                    onChange={(e) => setSticker((p) => ({ ...p, warnings: e.target.value }))}
                    rows={2}
                    maxLength={500}
                    className="w-full bg-stone-800 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-amber-500/50 resize-none transition-all"
                  />
                </div>

                {/* Sticker Preview Summary */}
                <div className="bg-stone-800/40 rounded-xl p-4 border border-white/5">
                  <h4 className="text-white/30 text-[11px] font-bold mb-3 flex items-center gap-2">
                    <i className="ri-eye-line"></i> معاينة ملخص الاستيكر
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between bg-stone-900/50 rounded-lg px-3 py-2">
                      <span className="text-white/20">البراند</span>
                      <span className="text-white/70 font-bold">{sticker.brandName || "—"}</span>
                    </div>
                    <div className="flex justify-between bg-stone-900/50 rounded-lg px-3 py-2">
                      <span className="text-white/20">العطر</span>
                      <span className="text-white/70 font-bold">{sticker.fragranceName || "—"}</span>
                    </div>
                    <div className="flex justify-between bg-stone-900/50 rounded-lg px-3 py-2">
                      <span className="text-white/20">التركيز</span>
                      <span className="text-white/60">{sticker.concentration}</span>
                    </div>
                    <div className="flex justify-between bg-stone-900/50 rounded-lg px-3 py-2">
                      <span className="text-white/20">بلد الصنع</span>
                      <span className="text-white/60">{sticker.madeIn}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Box Options ── */}
            {activeTab === "box" && (
              <div className="bg-stone-900 rounded-2xl border border-white/8 p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-700/15 rounded-xl">
                    <i className="ri-gift-2-line text-amber-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm">مواصفات الصندوق والتغليف</h3>
                    <p className="text-white/25 text-[11px]">{box.boxType} · {box.exteriorColor}</p>
                  </div>
                </div>

                <Accordion
                  section={boxSections[0]}
                  expanded={boxExpanded.box}
                  onToggle={() => toggleBoxSection("box")}
                >
                  <ChipGroup
                    options={boxTypeOptions}
                    value={box.boxType}
                    onChange={(v) => setBox((p) => ({ ...p, boxType: v }))}
                  />
                </Accordion>

                <Accordion
                  section={boxSections[1]}
                  expanded={boxExpanded.exterior}
                  onToggle={() => toggleBoxSection("exterior")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">خامة العلبة الخارجية</label>
                      <ChipGroup
                        options={exteriorMaterialOptions}
                        value={box.exteriorMaterial}
                        onChange={(v) => setBox((p) => ({ ...p, exteriorMaterial: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">لون العلبة الخارجي</label>
                      <ChipGroup
                        options={exteriorColorOptions}
                        value={box.exteriorColor}
                        onChange={(v) => setBox((p) => ({ ...p, exteriorColor: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">تشطيب العلبة الخارجي</label>
                      <ChipGroup
                        options={exteriorFinishOptions}
                        value={box.exteriorFinish}
                        onChange={(v) => setBox((p) => ({ ...p, exteriorFinish: v }))}
                      />
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  section={boxSections[2]}
                  expanded={boxExpanded.interior}
                  onToggle={() => toggleBoxSection("interior")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">بطانة العلبة الداخلية</label>
                      <ChipGroup
                        options={interiorLiningOptions}
                        value={box.interiorLining}
                        onChange={(v) => setBox((p) => ({ ...p, interiorLining: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">لون البطانة الداخلية</label>
                      <ChipGroup
                        options={interiorColorOptions}
                        value={box.interiorColor}
                        onChange={(v) => setBox((p) => ({ ...p, interiorColor: v }))}
                      />
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  section={boxSections[3]}
                  expanded={boxExpanded.details}
                  onToggle={() => toggleBoxSection("details")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">طريقة الإغلاق</label>
                      <ChipGroup
                        options={closureOptions}
                        value={box.closure}
                        onChange={(v) => setBox((p) => ({ ...p, closure: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">الشريط</label>
                      <ChipGroup
                        options={ribbonOptions}
                        value={box.ribbon}
                        onChange={(v) => setBox((p) => ({ ...p, ribbon: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">القاعدة الداخلية</label>
                      <ChipGroup
                        options={insertOptions}
                        value={box.insert}
                        onChange={(v) => setBox((p) => ({ ...p, insert: v }))}
                      />
                    </div>
                    <div>
                      <label className="block text-white/35 text-[10px] font-bold mb-1.5">الختم بالفويل</label>
                      <ChipGroup
                        options={foilStampingOptions}
                        value={box.foilStamping}
                        onChange={(v) => setBox((p) => ({ ...p, foilStamping: v }))}
                      />
                    </div>
                  </div>
                </Accordion>
              </div>
            )}

            {/* Sticky Action Bar (mobile) */}
            <div className="xl:hidden space-y-3">
              <button
                onClick={handleSave}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2"
              >
                {saved ? (
                  <><i className="ri-check-line"></i> تم الحفظ بنجاح!</>
                ) : (
                  <><i className="ri-save-line"></i> حفظ جميع المواصفات</>
                )}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/manufacturing" className="bg-emerald-700/20 hover:bg-emerald-700/40 border border-emerald-600/30 text-emerald-300 font-bold py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 text-sm">
                  <i className="ri-arrow-left-line"></i> للتصنيع
                </Link>
                <Link to="/studio-3d" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 text-sm">
                  <i className="ri-box-3-line"></i> استوديو 3D
                </Link>
              </div>
            </div>

            {/* Status Summary Card */}
            <div className="bg-stone-900 rounded-2xl border border-white/8 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/30 text-xs font-bold">ملخص التخصيص</span>
                <span className="bg-amber-700/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">9A</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-stone-800/60 rounded-xl py-2.5">
                  <div className="text-white/20 text-[10px] mb-0.5">العبوة</div>
                  <div className="text-white/70 text-xs font-bold">{bottle.size}</div>
                </div>
                <div className="bg-stone-800/60 rounded-xl py-2.5">
                  <div className="text-white/20 text-[10px] mb-0.5">الاستيكر</div>
                  <div className="text-white/70 text-xs font-bold truncate px-1">{sticker.brandName}</div>
                </div>
                <div className="bg-stone-800/60 rounded-xl py-2.5">
                  <div className="text-white/20 text-[10px] mb-0.5">التغليف</div>
                  <div className="text-white/70 text-xs font-bold">{box.exteriorColor.split(" ")[0]}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/15 text-[10px]">Packaging Customizer v2.0</span>
                <div className="flex gap-1.5">
                  <Link to="/visual-identity" className="text-white/20 hover:text-violet-400 text-[10px] font-medium cursor-pointer transition-colors whitespace-nowrap">
                    الهوية البصرية
                  </Link>
                  <span className="text-white/10">|</span>
                  <Link to="/brand-creation" className="text-white/20 hover:text-amber-400 text-[10px] font-medium cursor-pointer transition-colors whitespace-nowrap">
                    بناء البراند
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3D Viewer ── Right Side ── 3 cols ── */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="bg-stone-900 rounded-2xl border border-white/8 overflow-hidden">
              {/* View Controls Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
                  {(["front", "side", "back", "perspective"] as ViewAngle[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setViewAngle(v)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        viewAngle === v
                          ? "bg-amber-700 text-white shadow-sm"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <i className={
                        v === "front" ? "ri-eye-line" :
                        v === "side" ? "ri-eye-2-line" :
                        v === "back" ? "ri-contrast-2-line" :
                        "ri-box-3-line"
                      }></i>
                      {viewLabels[v]}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={rotating ? stopAutoRotate : startAutoRotate}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all ${
                      rotating ? "bg-amber-700 text-white" : "bg-stone-800 text-white/40 hover:text-white hover:bg-stone-700"
                    }`}
                    title={rotating ? "إيقاف التدوير" : "تدوير تلقائي"}
                  >
                    <i className={`text-sm ${rotating ? "ri-pause-line" : "ri-loop-right-line"}`}></i>
                  </button>
                  <Link to="/studio-3d" className="text-white/30 hover:text-white/60 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1">
                    <i className="ri-fullscreen-line"></i>
                    <span className="hidden sm:inline">استوديو 3D</span>
                  </Link>
                </div>
              </div>

              {/* 3D View Area */}
              <div className="relative h-[520px] lg:h-[640px] bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-amber-600/5 rounded-full blur-[120px]"></div>
                  <div className="absolute w-64 h-64 bg-amber-500/3 rounded-full blur-[80px] translate-x-20"></div>
                </div>

                {/* Grid floor effect */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-950/80 to-transparent z-[5]"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-[6]"></div>

                {/* Main bottle image */}
                <img
                  src={previewImages[bottle.shape][viewAngle]}
                  alt={`${bottle.shape} bottle ${viewAngle} view`}
                  className="relative z-10 h-[82%] w-auto object-contain transition-all duration-700 ease-out"
                />

                {/* Overlay: size badge */}
                <div className="absolute top-5 right-5 z-20 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="text-amber-400 text-xs font-black">{bottle.size}</span>
                  <span className="text-white/20 text-xs">|</span>
                  <span className="text-white/50 text-xs">
                    {bottleShapeOptions.find((s) => s.id === bottle.shape)?.label}
                  </span>
                </div>

                {/* Overlay: brand sticker */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-3.5 border border-white/8">
                  <div className="text-white/90 text-sm font-black text-center tracking-[0.2em]">{sticker.brandName || "اسم البراند"}</div>
                  <div className="text-amber-300/60 text-xs text-center mt-1 tracking-wider">{sticker.fragranceName || "اسم العطر"}</div>
                  <div className="text-white/20 text-[10px] text-center mt-1">{sticker.concentration} · {sticker.volume}</div>
                </div>

                {/* Overlay: view angle indicator */}
                <div className="absolute bottom-6 right-6 z-20">
                  <span className="bg-stone-800/70 backdrop-blur-sm text-white/40 text-xs px-4 py-2 rounded-full whitespace-nowrap border border-white/5 flex items-center gap-2">
                    <i className="ri-camera-3-line"></i>
                    {viewLabels[viewAngle]}
                    {rotating && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>}
                  </span>
                </div>

                {/* Overlay: selected options mini list */}
                <div className="absolute top-5 left-5 z-20 space-y-1.5">
                  <div className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60"></div>
                    <span className="text-white/40 text-[10px]">{bottle.glassColor}</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60"></div>
                    <span className="text-white/40 text-[10px]">{bottle.capColor}</span>
                  </div>
                </div>
              </div>

              {/* Bottom bar: quick shape switcher */}
              <div className="px-5 py-3.5 border-t border-white/8 flex items-center justify-between bg-stone-900/50">
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-[10px] font-bold ml-2 hidden sm:inline">الشكل:</span>
                  {bottleShapeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBottle((p) => ({ ...p, shape: opt.id }))}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        bottle.shape === opt.id
                          ? "bg-amber-700/25 text-amber-400 border border-amber-500/30"
                          : "bg-stone-800 text-white/25 hover:text-white/55 hover:bg-stone-700 border border-transparent"
                      }`}
                      title={opt.label}
                    >
                      <i className={opt.icon}></i>
                    </button>
                  ))}
                </div>
                <div className="text-white/15 text-xs flex items-center gap-1.5">
                  <i className="ri-information-line"></i>
                  <span className="hidden sm:inline">اضغط على الأشكال لتغيير العبوة</span>
                </div>
              </div>
            </div>

            {/* ── Desktop Sticky Action Bar ── */}
            <div className="hidden xl:flex items-center gap-3 mt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-black py-4 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
              >
                {saved ? (
                  <><i className="ri-check-double-line text-lg"></i> تم الحفظ بنجاح!</>
                ) : (
                  <><i className="ri-save-line text-lg"></i> حفظ جميع المواصفات</>
                )}
              </button>
              <Link to="/manufacturing" className="bg-emerald-700/15 hover:bg-emerald-700/30 border border-emerald-600/25 text-emerald-300 font-bold py-4 px-6 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 text-sm">
                <i className="ri-arrow-left-line"></i>
                للتصنيع
              </Link>
              <Link to="/studio-3d" className="bg-white/8 hover:bg-white/15 text-white/70 hover:text-white font-bold py-4 px-6 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 text-sm border border-white/8">
                <i className="ri-box-3-line"></i>
                استوديو 3D
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Samples Gallery Section ===== */}
      <div className="max-w-[1440px] mx-auto px-6">
        <SamplesGallery onSelectSample={handleSelectSample} selectedId={selectedSampleId} />
      </div>
    </div>
  );
};

export default PackagingCustomizerPage;