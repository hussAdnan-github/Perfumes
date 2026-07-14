import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type WizardPhase = "strategy" | "fragrance" | "identity" | "packaging" | "production";

interface BrandSelections {
  targetMarket: string | null;
  brandPersonality: string[];
  brandPositioning: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  concentration: string | null;
  family: string | null;
  logoStyle: string | null;
  colorPalette: string | null;
  typography: string | null;
  bottleShape: string | null;
  boxStyle: string | null;
  materialFinish: string | null;
  productionQty: string | null;
  timeline: string | null;
  marketingChannels: string[];
}

const emptySelections: BrandSelections = {
  targetMarket: null,
  brandPersonality: [],
  brandPositioning: null,
  topNotes: [],
  heartNotes: [],
  baseNotes: [],
  concentration: null,
  family: null,
  logoStyle: null,
  colorPalette: null,
  typography: null,
  bottleShape: null,
  boxStyle: null,
  materialFinish: null,
  productionQty: null,
  timeline: null,
  marketingChannels: [],
};

const STORAGE_KEY = "brand_creation_wizard_state";

interface SavedState {
  activePhase: WizardPhase;
  strategyStep: number;
  fragranceStep: number;
  identityStep: number;
  packagingStep: number;
  productionStep: number;
  selections: BrandSelections;
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

/* ────────── option data ────────── */
const targetMarketOptions = [
  { id: "gulf", name: "الخليج العربي", en: "GCC — Gulf Market", icon: "ri-earth-line", desc: "سوق فاخر يفضل العطور الشرقية والخشبية والعود — قوة شرائية عالية وولاء للبراندات الفاخرة", color: "amber" },
  { id: "mena", name: "الشرق الأوسط وشمال أفريقيا", en: "MENA Region", icon: "ri-global-line", desc: "أسواق متنوعة تجمع بين الذوق الشرقي والغربي — فرص توسع كبيرة", color: "emerald" },
  { id: "europe", name: "أوروبا", en: "European Market", icon: "ri-building-2-line", desc: "أسواق ناضجة تفضل العطور النظيفة والمستدامة — تركيز على الجودة والمكونات", color: "rose" },
  { id: "global", name: "عالمي", en: "Global — Worldwide", icon: "ri-flight-takeoff-line", desc: "استهداف الأسواق العالمية مع استراتيجية متعددة القنوات — أقصى انتشار", color: "slate" },
];

const personalityOptions = [
  { id: "luxury", name: "فاخر", en: "Luxury", icon: "ri-vip-crown-line", desc: "رقي، تفرد، حصرية — للعملاء الذين يقدرون الأفضل", color: "amber" },
  { id: "modern", name: "عصري", en: "Modern", icon: "ri-flashlight-line", desc: "جرأة، ابتكار، مواكبة للموضة — للشباب الطموح", color: "emerald" },
  { id: "classic", name: "كلاسيكي", en: "Classic", icon: "ri-hourglass-line", desc: "أصالة، أناقة خالدة، تراث — للذواقة المحافظين", color: "stone" },
  { id: "artistic", name: "فني", en: "Artistic / Niche", icon: "ri-brush-line", desc: "إبداع، تمرد على المألوف، تعبير فني — لعشاق الفن", color: "rose" },
  { id: "natural", name: "طبيعي / نظيف", en: "Natural / Clean", icon: "ri-leaf-line", desc: "استدامة، نقاء، مكونات طبيعية — للواعين بيئياً", color: "emerald" },
  { id: "bold", name: "جريء", en: "Bold / Statement", icon: "ri-fire-line", desc: "قوة، حضور، ثقة — لمن يريد أن يُلاحَظ", color: "orange" },
];

const positioningOptions = [
  { id: "premium", name: "فاخر / بريميوم", en: "Premium — High-end", icon: "ri-star-line", desc: "سعر مرتفع، جودة استثنائية، تجربة حصرية — أعلى شريحة سعرية", tag: "200+ $" },
  { id: "mid-luxury", name: "فاخر متوسط", en: "Accessible Luxury", icon: "ri-medal-line", desc: "جودة عالية بسعر معقول — الوصول لشريحة أوسع مع الحفاظ على الفخامة", tag: "80-200 $" },
  { id: "prestige", name: "نيش / برستيج", en: "Niche / Prestige", icon: "ri-vip-diamond-line", desc: "إصدارات محدودة، تجارب عطرية فريدة — لعشاق التميز المطلق", tag: "300+ $" },
  { id: "commercial", name: "تجاري واسع", en: "Mass Commercial", icon: "ri-store-2-line", desc: "انتشار واسع، سعر منافس — الوصول لأكبر عدد من المستهلكين", tag: "30-80 $" },
];

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
    { ar: "زعفران", en: "Saffron" },
    { ar: "هيل", en: "Cardamom" },
  ],
  heart: [
    { ar: "الورد", en: "Rose" },
    { ar: "الياسمين", en: "Jasmine" },
    { ar: "القرفة", en: "Cinnamon" },
    { ar: "إبرة الراعي", en: "Geranium" },
    { ar: "زهرة السوسن", en: "Iris" },
    { ar: "الخزامى", en: "Lavender Flower" },
    { ar: "البنفسج", en: "Violet" },
    { ar: "الإيلنغ", en: "Ylang Ylang" },
    { ar: "الخوخ", en: "Peach" },
    { ar: "التفاح الأخضر", en: "Green Apple" },
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
    { ar: "الجلد", en: "Leather" },
    { ar: "التبغ", en: "Tobacco" },
  ],
};

const concentrationOptions = [
  { id: "parfum", name: "مركّز", en: "Parfum / Extrait", pct: "٢٠٪ - ٣٠٪+", longevity: "٨ - ١٢ ساعة+", tag: "فاخر", desc: "أعلى تركيز وأطول ثبات — مثالي للعطور الفاخرة والمناسبات الخاصة" },
  { id: "edp", name: "ماء عطر", en: "Eau de Parfum", pct: "١٥٪ - ٢٠٪", longevity: "٦ - ٨ ساعات", tag: "الأكثر رواجاً", desc: "التوازن المثالي بين الثبات والسعر — الخيار التجاري الأوسع انتشاراً" },
  { id: "edt", name: "ماء تواليت", en: "Eau de Toilette", pct: "٥٪ - ١٥٪", longevity: "٣ - ٥ ساعات", tag: "يومي", desc: "خفيف ومناسب للاستخدام اليومي" },
  { id: "oil", name: "زيت / مدهن", en: "Oil — خالٍ من الكحول", pct: "١٠٪ - ٤٠٪+", longevity: "٦ - ١٠ ساعات", tag: "خليجي", desc: "خالٍ من الكحول — مناسب للسوق الخليجي والبشرة الحساسة" },
];

const familyOptions = [
  { id: "floral", name: "زهرية", en: "Floral", icon: "ri-plant-line", desc: "أنثوي، رومانسي، ناعم", color: "rose" },
  { id: "oriental", name: "شرقية", en: "Oriental / Amber", icon: "ri-star-line", desc: "دافئ، حسّي، فاخر", color: "amber" },
  { id: "woody", name: "خشبية", en: "Woody", icon: "ri-tree-line", desc: "راقٍ، ثابت، محايد", color: "stone" },
  { id: "fresh", name: "حمضية", en: "Fresh / Citrus", icon: "ri-sun-line", desc: "نظيف، حيوي، خفيف", color: "emerald" },
  { id: "gourmand", name: "غورماند", en: "Gourmand", icon: "ri-cake-line", desc: "دافئ، سكّري، شهيّ", color: "orange" },
  { id: "leather", name: "جلدية", en: "Leather / Tobacco", icon: "ri-shield-line", desc: "جريء، رجولي، فخم", color: "slate" },
];

const logoStyleOptions = [
  { id: "minimal", name: "مينيمالي", en: "Minimalist", icon: "ri-shapes-line", desc: "خطوط نظيفة، مساحات واسعة، بسيط ولا يُنسى", examples: "Byredo, Le Labo, Aesop" },
  { id: "luxe", name: "فاخر / كلاسيكي", en: "Luxurious / Classic", icon: "ri-vip-crown-line", desc: "خطوط سيرف، زخارف ذهبية، طابع ملكي", examples: "Creed, Tom Ford, Amouage" },
  { id: "modern", name: "عصري / جريء", en: "Modern / Bold", icon: "ri-flashlight-line", desc: "أشكال هندسية، ألوان قوية، حضور بصري", examples: "Comme des Garçons, Off-White" },
  { id: "calligraphy", name: "خط عربي", en: "Arabic Calligraphy", icon: "ri-pen-nib-line", desc: "حروف عربية أصيلة، زخرفة شرقية، هوية عربية", examples: "Ajmal, Arabian Oud" },
];

const colorPaletteOptions = [
  { id: "warm-gold", name: "ذهبي دافئ", en: "Warm Gold & Black", colors: ["#b8860b", "#1a1a1a", "#f5f0e8"], icon: "ri-sun-line", desc: "فخامة دافئة — مناسب للبراندات الشرقية والفاخرة" },
  { id: "cool-mono", name: "أحادي بارد", en: "Cool Monochrome", colors: ["#2d2d2d", "#e8e8e8", "#ffffff"], icon: "ri-moon-line", desc: "أناقة عصرية — مناسب للبراندات المينيمالية والنظيفة" },
  { id: "earthy", name: "ترابي طبيعي", en: "Earthy / Natural", colors: ["#5c4033", "#d4c5b9", "#f0ebe3"], icon: "ri-leaf-line", desc: "دفء واتصال بالطبيعة — مناسب للبراندات العضوية والمستدامة" },
  { id: "bold-color", name: "جرئ بالألوان", en: "Bold & Colorful", colors: ["#c41e3a", "#1a1a2e", "#f5f5f5"], icon: "ri-palette-line", desc: "شخصية قوية وجريئة — للبراندات الشبابية والعصرية" },
  { id: "royal", name: "ملكي / أرجواني", en: "Royal Purple & Gold", colors: ["#4a0e4e", "#c9a84c", "#faf5f0"], icon: "ri-vip-crown-line", desc: "طابع ملكي وفخم — للبراندات عالية الرفاهية" },
];

const typographyOptions = [
  { id: "serif", name: "خط سيرف كلاسيكي", en: "Classic Serif", icon: "ri-font-size", desc: "حروف تقليدية أنيقة — توحي بالعراقة والثقة", sample: "Aa", sampleClass: "font-serif" },
  { id: "sans", name: "خط sans-serif عصري", en: "Modern Sans-Serif", icon: "ri-font-size-2", desc: "نظيف ومعاصر — سهل القراءة ومتعدد الاستخدامات", sample: "Aa", sampleClass: "font-sans" },
  { id: "arabic", name: "خط عربي تقليدي", en: "Traditional Arabic", icon: "ri-text", desc: "خطوط عربية أصيلة — ثري بالزخرفة والهوية", sample: "بـا", sampleClass: "font-serif" },
  { id: "custom", name: "خط مخصص / هجين", en: "Custom / Hybrid", icon: "ri-brush-line", desc: "مزيج بين العربي واللاتيني — هوية فريدة ومخصصة", sample: "Aa ب", sampleClass: "font-sans" },
];

const bottleShapeOptions = [
  { id: "classic-rect", name: "مستطيل كلاسيكي", en: "Classic Rectangular", icon: "ri-layout-line", desc: "أنيق، خالد، سهل التصنيع — الأكثر انتشاراً في السوق", imageTag: "rect" },
  { id: "round", name: "دائري / بيضاوي", en: "Round / Oval", icon: "ri-circle-line", desc: "ناعم، حسّي، مريح في اليد — مناسب للعطور الأنثوية", imageTag: "round" },
  { id: "geometric", name: "هندسي / فني", en: "Geometric / Artistic", icon: "ri-hexagon-line", desc: "جريء، ملفت، فريد — للبراندات التي تريد التميز البصري", imageTag: "geo" },
  { id: "luxury-heavy", name: "فاخر ثقيل", en: "Heavy Luxury / Crystal", icon: "ri-vip-diamond-line", desc: "زجاج ثقيل، قطع كريستالية، غطاء معدني — فخامة مطلقة", imageTag: "lux" },
];

const boxStyleOptions = [
  { id: "rigid", name: "صندوق صلب", en: "Rigid Box / Magnetic", icon: "ri-archive-line", desc: "كرتون سميك، غطاء مغناطيسي، مبطن بالمخمل — تجربة فتح فاخرة" },
  { id: "sleeve", name: "غلاف منزلق", en: "Slipcase / Sleeve", icon: "ri-layout-column-line", desc: "غلاف خارجي ينزلق عن الصندوق الداخلي — طبقتان من التصميم" },
  { id: "fold", name: "علبة طيّ", en: "Folding Carton", icon: "ri-folders-line", desc: "خفيف، اقتصادي، مناسب للكميات الكبيرة — شائع في التجزئة" },
  { id: "wood", name: "صندوق خشبي", en: "Wooden Box", icon: "ri-tree-line", desc: "خشب طبيعي، محفور بالليزر، مبطن — للإصدارات المحدودة والفاخرة" },
];

const materialFinishOptions = [
  { id: "gold-foil", name: "ذهب / فويل", en: "Gold Foil & Embossing", icon: "ri-star-line", desc: "نقش ذهبي بارز، طباعة فويل — اللمسة الفاخرة الكلاسيكية" },
  { id: "matte", name: "مطفي / مات", en: "Matte / Soft Touch", icon: "ri-contrast-drop-line", desc: "ملمس ناعم مخملي، غير لامع — أناقة عصرية هادئة" },
  { id: "gloss", name: "لميع / UV", en: "Glossy / Spot UV", icon: "ri-shining-line", desc: "لمعان عالي، طباعة UV انتقائية — تباين بصري قوي" },
  { id: "textured", name: "ملمس / محبب", en: "Textured / Grain", icon: "ri-bring-to-front", desc: "ورق محبب، ملمس طبيعي، أختام شمع — حرفية يدوية" },
];

const productionQtyOptions = [
  { id: "small", name: "دفعة محدودة", en: "Limited Batch", qty: "100 - 500", icon: "ri-numbers-line", desc: "إصدار أولي، اختبار السوق، حصرية — مناسب للبراندات الجديدة" },
  { id: "medium", name: "إنتاج متوسط", en: "Medium Production", qty: "500 - 3000", icon: "ri-stack-line", desc: "حجم تجاري مناسب — يلبي الطلب مع الحفاظ على الجودة" },
  { id: "large", name: "إنتاج كبير", en: "Large Scale", qty: "3000 - 10000+", icon: "ri-database-2-line", desc: "إنتاج ضخم، تكلفة منخفضة للوحدة — للتوزيع الواسع" },
];

const timelineOptions = [
  { id: "express", name: "سريع", en: "Express — 3 أشهر", icon: "ri-rocket-line", desc: "مسار سريع، فرق متوازية — للأوقات الحرجة والمواسم" },
  { id: "standard", name: "قياسي", en: "Standard — 4-5 أشهر", icon: "ri-calendar-check-line", desc: "الوتيرة المثالية — توازن بين السرعة والجودة" },
  { id: "extended", name: "ممتد", en: "Extended — 6+ أشهر", icon: "ri-hourglass-line", desc: "وقت كافٍ لكل تفصيلة — للبراندات التي تريد الكمال" },
];

const marketingChannelOptions = [
  { id: "social", name: "وسائل التواصل", en: "Social Media", icon: "ri-instagram-line", desc: "انستغرام، تيكتوك، سناب — الوصول المباشر للجمهور" },
  { id: "influencer", name: "المؤثرين", en: "Influencer Marketing", icon: "ri-user-star-line", desc: "تعاون مع مؤثرين في عالم العطور والجمال" },
  { id: "retail", name: "متاجر التجزئة", en: "Retail / Department Stores", icon: "ri-store-2-line", desc: "التواجد في متاجر التجزئة الفاخرة" },
  { id: "ecommerce", name: "متجر إلكتروني", en: "E-commerce", icon: "ri-shopping-cart-2-line", desc: "متجر خاص، منصات إلكترونية — وصول عالمي" },
  { id: "events", name: "فعاليات وإطلاق", en: "Events / Launch Party", icon: "ri-calendar-event-line", desc: "حفل إطلاق، معارض، pop-up stores" },
  { id: "subscription", name: "صناديق شهرية", en: "Subscription Boxes", icon: "ri-gift-line", desc: "تعاون مع صناديق العطور الشهرية للوصول لعملاء جدد" },
];

const phasesList: { key: WizardPhase; label: string; icon: string; desc: string }[] = [
  { key: "strategy", label: "استراتيجية البراند", icon: "ri-compass-3-line", desc: "حدد السوق والشخصية والتموضع" },
  { key: "fragrance", label: "تصميم العطر", icon: "ri-drop-line", desc: "اختر النوتات والتركيز والعائلة" },
  { key: "identity", label: "الهوية البصرية", icon: "ri-palette-line", desc: "الشعار، الألوان، والخطوط" },
  { key: "packaging", label: "التغليف", icon: "ri-gift-2-line", desc: "العبوة، الصندوق، والتشطيبات" },
  { key: "production", label: "الإنتاج والإطلاق", icon: "ri-rocket-line", desc: "الكمية، المدة، والتسويق" },
];

const BrandCreationPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const saved = loadState();
  const [navUserMenuOpen, setNavUserMenuOpen] = useState(false);

  const [activePhase, setActivePhaseState] = useState<WizardPhase>(saved?.activePhase || "strategy");
  const [strategyStep, setStrategyStepState] = useState(saved?.strategyStep || 0);
  const [fragranceStep, setFragranceStepState] = useState(saved?.fragranceStep || 0);
  const [identityStep, setIdentityStepState] = useState(saved?.identityStep || 0);
  const [packagingStep, setPackagingStepState] = useState(saved?.packagingStep || 0);
  const [productionStep, setProductionStepState] = useState(saved?.productionStep || 0);
  const [selections, setSelections] = useState<BrandSelections>(saved?.selections || emptySelections);
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
      case "strategy": return { step: strategyStep, setStep: (v: number | ((p: number) => number)) => { setStrategyStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ strategyStep: n }); return n; }); showSaving(); } };
      case "fragrance": return { step: fragranceStep, setStep: (v: number | ((p: number) => number)) => { setFragranceStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ fragranceStep: n }); return n; }); showSaving(); } };
      case "identity": return { step: identityStep, setStep: (v: number | ((p: number) => number)) => { setIdentityStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ identityStep: n }); return n; }); showSaving(); } };
      case "packaging": return { step: packagingStep, setStep: (v: number | ((p: number) => number)) => { setPackagingStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ packagingStep: n }); return n; }); showSaving(); } };
      case "production": return { step: productionStep, setStep: (v: number | ((p: number) => number)) => { setProductionStepState((prev) => { const n = typeof v === "function" ? v(prev) : v; saveState({ productionStep: n }); return n; }); showSaving(); } };
    }
  };

  const getSubSteps = (phase: WizardPhase): { label: string; icon: string }[] => {
    switch (phase) {
      case "strategy": return [
        { label: "السوق المستهدف", icon: "ri-earth-line" },
        { label: "شخصية البراند", icon: "ri-user-heart-line" },
        { label: "التموضع السوقي", icon: "ri-funds-line" },
      ];
      case "fragrance": return [
        { label: "الهرم العطري", icon: "ri-stack-line" },
        { label: "التركيز", icon: "ri-contrast-drop-line" },
        { label: "العائلة العطرية", icon: "ri-shapes-line" },
      ];
      case "identity": return [
        { label: "نمط الشعار", icon: "ri-pen-nib-line" },
        { label: "لوحة الألوان", icon: "ri-palette-line" },
        { label: "الخطوط", icon: "ri-font-size" },
      ];
      case "packaging": return [
        { label: "شكل العبوة", icon: "ri-drop-line" },
        { label: "نمط الصندوق", icon: "ri-archive-line" },
        { label: "الخامات والتشطيب", icon: "ri-bring-to-front" },
      ];
      case "production": return [
        { label: "كمية الإنتاج", icon: "ri-numbers-line" },
        { label: "المدة الزمنية", icon: "ri-calendar-check-line" },
        { label: "قنوات التسويق", icon: "ri-megaphone-line" },
      ];
    }
  };

  const updateSelections = useCallback((val: BrandSelections | ((prev: BrandSelections) => BrandSelections)) => {
    setSelections((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      saveState({ selections: next });
      return next;
    });
  }, []);

  const canGoNext = (phase: WizardPhase): boolean => {
    const s = getStepState(phase);
    switch (phase) {
      case "strategy":
        if (s.step === 0) return selections.targetMarket !== null;
        if (s.step === 1) return selections.brandPersonality.length >= 2;
        if (s.step === 2) return selections.brandPositioning !== null;
        return true;
      case "fragrance":
        if (s.step === 0) return selections.topNotes.length >= 1 && selections.heartNotes.length >= 1 && selections.baseNotes.length >= 1;
        if (s.step === 1) return selections.concentration !== null;
        if (s.step === 2) return selections.family !== null;
        return true;
      case "identity":
        if (s.step === 0) return selections.logoStyle !== null;
        if (s.step === 1) return selections.colorPalette !== null;
        if (s.step === 2) return selections.typography !== null;
        return true;
      case "packaging":
        if (s.step === 0) return selections.bottleShape !== null;
        if (s.step === 1) return selections.boxStyle !== null;
        if (s.step === 2) return selections.materialFinish !== null;
        return true;
      case "production":
        if (s.step === 0) return selections.productionQty !== null;
        if (s.step === 1) return selections.timeline !== null;
        if (s.step === 2) return selections.marketingChannels.length >= 1;
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
        setAllDone(true);
        setCelebration(true);
        addToast("اكتمل تصميم براندك! 🎉", "success");
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

  const toggleNote = (layer: "topNotes" | "heartNotes" | "baseNotes", noteAr: string) => {
    updateSelections((prev) => {
      const current = prev[layer];
      if (current.includes(noteAr)) return { ...prev, [layer]: current.filter((n) => n !== noteAr) };
      if (current.length >= 4) {
        addToast("الحد الأقصى ٤ نوتات لكل طبقة", "warning");
        return prev;
      }
      return { ...prev, [layer]: [...current, noteAr] };
    });
  };

  const togglePersonality = (id: string) => {
    updateSelections((prev) => {
      const current = prev.brandPersonality;
      if (current.includes(id)) {
        if (current.length <= 2) { addToast("اختر شخصيتين على الأقل", "warning"); return prev; }
        return { ...prev, brandPersonality: current.filter((p) => p !== id) };
      }
      if (current.length >= 4) { addToast("الحد الأقصى ٤ شخصيات", "warning"); return prev; }
      return { ...prev, brandPersonality: [...current, id] };
    });
  };

  const toggleMarketingChannel = (id: string) => {
    updateSelections((prev) => {
      const current = prev.marketingChannels;
      if (current.includes(id)) return { ...prev, marketingChannels: current.filter((c) => c !== id) };
      if (current.length >= 5) { addToast("الحد الأقصى ٥ قنوات", "warning"); return prev; }
      return { ...prev, marketingChannels: [...current, id] };
    });
  };

  const isPhaseComplete = (phase: WizardPhase): boolean => {
    const s = getStepState(phase);
    const subSteps = getSubSteps(phase);
    return completedPhases.includes(phase) || s.step === subSteps.length - 1;
  };

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
            <div className={`w-4 h-4 flex items-center justify-center`}>
              {i < step ? (
                <i className="ri-check-line text-emerald-500 text-xs"></i>
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

  /* ────────── keyboard nav ────────── */
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
  }, [activePhase, strategyStep, fragranceStep, identityStep, packagingStep, productionStep, selections]);

  const renderContent = () => {
    const { step } = getStepState(activePhase);

    /* ──────────────── STRATEGY ──────────────── */
    if (activePhase === "strategy") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">من هو جمهورك المستهدف؟</h2>
              <p className="text-stone-500 text-sm">تحديد السوق بدقة يوجه كل قرارات البراند من التصميم حتى التسعير</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetMarketOptions.map((opt, idx) => {
                const selected = selections.targetMarket === opt.id;
                const colorMap: Record<string, string> = {
                  amber: "border-amber-200 bg-amber-50/40",
                  emerald: "border-emerald-200 bg-emerald-50/40",
                  rose: "border-rose-200 bg-rose-50/40",
                  slate: "border-stone-300 bg-stone-100/40",
                };
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, targetMarket: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? `border-amber-600 bg-amber-50/30 animate-pulse-glow` : `border-stone-100 bg-white hover:${colorMap[opt.color]}`
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
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
              <h2 className="text-xl font-black text-stone-900 mb-1">ما هي شخصية براندك؟</h2>
              <p className="text-stone-500 text-sm">اختر من ٢ إلى ٤ سمات تصف جوهر براندك — هذه الشخصية ستظهر في كل شيء من العطر حتى التغليف</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${selections.brandPersonality.length >= 2 ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                  {selections.brandPersonality.length}/4
                </span>
                {selections.brandPersonality.length >= 2 && <span className="text-emerald-600 text-xs font-bold">✓ ممتاز</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {personalityOptions.map((opt, idx) => {
                const selected = selections.brandPersonality.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => togglePersonality(opt.id)}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 60}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
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
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">كيف يتموضع براندك في السوق؟</h2>
              <p className="text-stone-500 text-sm">التموضع يحدد شريحتك السعرية ومنافسيك واستراتيجيتك بالكامل</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {positioningOptions.map((opt, idx) => {
                const selected = selections.brandPositioning === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, brandPositioning: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                          <i className={`${opt.icon} text-lg`}></i>
                        </div>
                        <div>
                          <div className="font-black text-stone-900 text-sm">{opt.name}</div>
                          <div className="text-stone-400 text-xs">{opt.en}</div>
                        </div>
                      </div>
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full whitespace-nowrap">{opt.tag}</span>
                    </div>
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

    /* ──────────────── FRAGRANCE ──────────────── */
    if (activePhase === "fragrance") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر نوتات عطرك</h2>
              <p className="text-stone-500 text-sm">اختر حتى ٤ نوتات من كل طبقة</p>
            </div>
            {([
              { key: "topNotes" as const, label: "نوتات القمة", sub: "أول ما يشمّه من حولك", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", tag: "bg-amber-100 text-amber-700", icon: "ri-sun-line", notes: noteOptions.top },
              { key: "heartNotes" as const, label: "نوتات القلب", sub: "قلب العطر وهويته", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", tag: "bg-rose-100 text-rose-700", icon: "ri-heart-line", notes: noteOptions.heart },
              { key: "baseNotes" as const, label: "نوتات القاعدة", sub: "أساس الثبات", bg: "bg-stone-100", border: "border-stone-300", text: "text-stone-800", tag: "bg-stone-200 text-stone-700", icon: "ri-anchor-line", notes: noteOptions.base },
            ] as const).map((layer) => (
              <div key={layer.key} className={`rounded-2xl p-5 ${layer.bg} border ${layer.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <i className={`${layer.icon} ${layer.text}`}></i>
                  <h3 className={`font-black ${layer.text}`}>{layer.label}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${layer.tag}`}>{selections[layer.key].length}/4</span>
                </div>
                <p className="text-stone-400 text-xs mb-4">{layer.sub}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.notes.map((note) => {
                    const isSelected = selections[layer.key].includes(note.ar);
                    return (
                      <button key={note.ar} onClick={() => toggleNote(layer.key, note.ar)}
                        className={`note-chip px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSelected ? `${layer.text} bg-white border-2 ${layer.border} animate-pop-in` : "bg-white/60 text-stone-400 border border-stone-200 hover:border-stone-300 hover:bg-white hover:text-stone-600"
                        }`}>
                        {note.ar}
                        {isSelected && <i className="ri-check-line mr-1"></i>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر تركيز العطر</h2>
              <p className="text-stone-500 text-sm">نسبة المركّز تحدد ثبات العطر وفئته السعرية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {concentrationOptions.map((opt, idx) => (
                <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, concentration: opt.id }))}
                  className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                    selections.concentration === opt.id ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : "border-stone-100 bg-white hover:border-amber-200"
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${selections.concentration === opt.id ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
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
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر العائلة العطرية</h2>
              <p className="text-stone-500 text-sm">التصنيف العام الذي يحدد شخصية عطرك</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {familyOptions.map((opt, idx) => {
                const colorMap: Record<string, { bg: string; light: string }> = {
                  rose: { bg: "bg-rose-500", light: "bg-rose-50" },
                  amber: { bg: "bg-amber-500", light: "bg-amber-50" },
                  stone: { bg: "bg-stone-600", light: "bg-stone-100" },
                  emerald: { bg: "bg-emerald-500", light: "bg-emerald-50" },
                  orange: { bg: "bg-orange-500", light: "bg-orange-50" },
                  slate: { bg: "bg-slate-600", light: "bg-slate-50" },
                };
                const c = colorMap[opt.color];
                const selected = selections.family === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, family: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? `border-amber-600 ${c.light} animate-pop-in` : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${c.bg} mb-3 transition-transform duration-300 ${selected ? "scale-110" : ""}`}>
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
        );
      }
    }

    /* ──────────────── IDENTITY ──────────────── */
    if (activePhase === "identity") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر نمط الشعار</h2>
              <p className="text-stone-500 text-sm">الشعار هو وجه براندك — اختر النمط الذي يعكس شخصيته</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logoStyleOptions.map((opt, idx) => {
                const selected = selections.logoStyle === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, logoStyle: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
                    <p className="text-stone-500 text-xs mb-2">{opt.desc}</p>
                    <div className="text-stone-300 text-[10px]">مستوحى من: {opt.examples}</div>
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
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر لوحة الألوان</h2>
              <p className="text-stone-500 text-sm">الألوان تنقل المشاعر — اختر الباليت الذي يمثل روح براندك</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorPaletteOptions.map((opt, idx) => {
                const selected = selections.colorPalette === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, colorPalette: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex items-center gap-2 mb-3">
                      {opt.colors.map((color, ci) => (
                        <div key={ci} className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <i className={`${opt.icon} text-stone-500`}></i>
                      <span className="font-black text-stone-900 text-sm">{opt.name}</span>
                    </div>
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
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر نمط الخطوط</h2>
              <p className="text-stone-500 text-sm">الطباعة تكمل الهوية — اختر النمط المناسب لشخصية براندك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typographyOptions.map((opt, idx) => {
                const selected = selections.typography === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, typography: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-600"}`}>
                        <span className="text-2xl font-black">{opt.sample}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <i className={`${opt.icon} text-stone-500`}></i>
                          <span className="font-black text-stone-900 text-sm">{opt.name}</span>
                        </div>
                        <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                        <p className="text-stone-500 text-xs">{opt.desc}</p>
                      </div>
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
    }

    /* ──────────────── PACKAGING ──────────────── */
    if (activePhase === "packaging") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر شكل العبوة</h2>
              <p className="text-stone-500 text-sm">العبوة هي أول ما يلمسه العميل — اجعلها لا تُنسى</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bottleShapeOptions.map((opt, idx) => {
                const selected = selections.bottleShape === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, bottleShape: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pulse-glow" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
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

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر نمط الصندوق</h2>
              <p className="text-stone-500 text-sm">الصندوق يخلق تجربة الفتح الأولى — لحظة لا تُنسى</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boxStyleOptions.map((opt, idx) => {
                const selected = selections.boxStyle === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, boxStyle: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
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

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر الخامات والتشطيبات</h2>
              <p className="text-stone-500 text-sm">التشطيبات تضيف اللمسة الأخيرة من الفخامة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materialFinishOptions.map((opt, idx) => {
                const selected = selections.materialFinish === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, materialFinish: opt.id }))}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-2">{opt.en}</div>
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

    /* ──────────────── PRODUCTION ──────────────── */
    if (activePhase === "production") {
      if (step === 0) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر كمية الإنتاج</h2>
              <p className="text-stone-500 text-sm">حجم الإنتاج يحدد التكلفة واستراتيجية التوزيع</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productionQtyOptions.map((opt, idx) => {
                const selected = selections.productionQty === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, productionQty: opt.id }))}
                    className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                    <div className="font-black text-stone-900 text-sm mb-0.5">{opt.name}</div>
                    <div className="text-stone-400 text-xs mb-1">{opt.en}</div>
                    <div className="text-amber-700 font-black text-lg mb-2">{opt.qty}</div>
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

      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر المدة الزمنية</h2>
              <p className="text-stone-500 text-sm">السرعة مقابل التفاصيل — اختر الوتيرة المناسبة لمشروعك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timelineOptions.map((opt, idx) => {
                const selected = selections.timeline === opt.id;
                return (
                  <button key={opt.id} onClick={() => updateSelections((prev) => ({ ...prev, timeline: opt.id }))}
                    className={`selection-card text-center rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-xl`}></i>
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
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-stone-900 mb-1">اختر قنوات التسويق</h2>
              <p className="text-stone-500 text-sm">اختر حتى ٥ قنوات لإطلاق براندك</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${selections.marketingChannels.length >= 1 ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                  {selections.marketingChannels.length}/5
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {marketingChannelOptions.map((opt, idx) => {
                const selected = selections.marketingChannels.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => toggleMarketingChannel(opt.id)}
                    className={`selection-card text-right rounded-2xl p-5 border-2 transition-all cursor-pointer relative ${
                      selected ? "border-amber-600 bg-amber-50/30 animate-pop-in" : "border-stone-100 bg-white hover:border-amber-200"
                    }`}
                    style={{ animationDelay: `${idx * 60}ms` }}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${selected ? "bg-amber-700 text-white scale-110" : "bg-stone-100 text-stone-500"}`}>
                      <i className={`${opt.icon} text-lg`}></i>
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
        );
      }
    }

    return null;
  };

  const { step } = getStepState(activePhase);
  const subSteps = getSubSteps(activePhase);
  const isLastStepInPhase = step === subSteps.length - 1;
  const isLastPhase = activePhase === "production";

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
            { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line" },
            { to: "/pricing", label: "التسعير", icon: "ri-price-tag-3-line" },
            { to: "/dashboard/approvals", label: "الاعتماد", icon: "ri-shield-check-line" },
            { to: "/after-sales", label: "ما بعد البيع", icon: "ri-heart-line" },
          ].map((link) => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                link.to === "/brand-creation" ? "bg-amber-100 text-amber-700" : "text-stone-400 hover:text-stone-700 hover:bg-stone-50"
              }`}>
              <i className={`${link.icon} text-xs`}></i>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline">بناء البراند</span>
          {savingIndicator && (
            <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 hidden sm:flex">
              <i className="ri-check-line"></i> تم الحفظ
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
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-stone-100 shadow-lg overflow-hidden z-50">
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
            <span className="text-amber-700 font-bold">بناء براند كامل</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Phase header */}
        <div className="text-center mb-8">
          <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 mb-4 animate-float`}>
            <i className={`${phasesList.find(p => p.key === activePhase)?.icon || "ri-compass-3-line"} text-white text-2xl`}></i>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-1">{phasesList.find(p => p.key === activePhase)?.label}</h1>
          <p className="text-stone-500 text-sm">{phasesList.find(p => p.key === activePhase)?.desc}</p>
        </div>

        {/* Completion banner */}
        {allDone && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-3xl p-8 text-center animate-bounce-in">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-100 mb-3">
              <i className="ri-check-double-line text-emerald-600 text-3xl"></i>
            </div>
            <h2 className="text-xl font-black text-stone-900 mb-2">اكتمل تصميم براندك بالكامل!</h2>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">لقد اخترت كل تفاصيل براندك — من الاستراتيجية حتى التسويق. فريقنا جاهز للبدء في التنفيذ.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/visual-identity" className="bg-violet-700 hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                <i className="ri-arrow-left-line"></i> الخطوة التالية: الهوية البصرية
              </Link>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/packaging-customizer" className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-gift-2-line"></i> أو انتقل للتغليف
                </Link>
                <Link to="/manufacturing" className="bg-sky-700 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center justify-center gap-2">
                  <i className="ri-settings-3-line"></i> أو انتقل للتصنيع
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-stone-200">
                <Link to="/workflow" className="text-stone-500 hover:text-amber-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                  <i className="ri-flow-chart ml-1"></i> متابعة سير العمل
                </Link>
                <button onClick={() => {
                  clearState();
                  setSelections(emptySelections);
                  setActivePhaseState("strategy");
                  setStrategyStepState(0);
                  setFragranceStepState(0);
                  setIdentityStepState(0);
                  setPackagingStepState(0);
                  setProductionStepState(0);
                  setCompletedPhases([]);
                  setAllDone(false);
                  addToast("تم إعادة تعيين جميع البيانات", "info");
                }}
                  className="text-stone-400 hover:text-red-400 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                  بدء تصميم جديد
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
                  step === 0 ? "bg-stone-100 text-stone-300 cursor-default" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:scale-105 active:scale-95"
                }`}>
                <i className="ri-arrow-right-line ml-1"></i> السابق
              </button>
              <div className="flex items-center gap-2">
                <span className="text-stone-300 text-xs">{step + 1} / {subSteps.length}</span>
                <button
                  onClick={() => handleStepForward(activePhase)}
                  disabled={!canGoNext(activePhase)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    canGoNext(activePhase)
                      ? isLastStepInPhase && isLastPhase
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 active:scale-95"
                        : "bg-amber-700 hover:bg-amber-600 text-white hover:scale-105 active:scale-95"
                      : "bg-stone-100 text-stone-300 cursor-default"
                  }`}>
                  {isLastStepInPhase ? (isLastPhase ? "إنهاء التصميم" : `الانتقال لـ ${phasesList[phasesList.findIndex(p => p.key === activePhase) + 1]?.label || ""}`) : "التالي"}
                  <i className="ri-arrow-left-line mr-1"></i>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-amber-500 to-amber-700 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / subSteps.length) * 100}%` }}></div>
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
              { to: "/packaging-customizer", label: "التغليف", icon: "ri-gift-2-line", desc: "المرحلة 9A" },
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

      {/* Celebration Overlay */}
      {celebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="relative">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="confetti-particle"
                style={{
                  left: `${Math.random() * 240 - 60}px`,
                  top: `${Math.random() * -50}px`,
                  backgroundColor: ["#b45309", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0d9488", "#eab308", "#2563eb", "#db2777"][i % 9],
                  animationDelay: `${Math.random() * 2}s`,
                  width: `${4 + Math.random() * 10}px`,
                  height: `${4 + Math.random() * 10}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}></div>
            ))}
            <div className="text-center animate-bounce-in bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 pointer-events-auto">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-amber-100 mb-3">
                <i className="ri-check-double-line text-amber-700 text-3xl"></i>
              </div>
              <div className="text-xl font-black text-stone-900 mb-1">مبروك! 🎉</div>
              <p className="text-stone-500 text-sm">تم تصميم براندك بالكامل — فريقنا جاهز للتنفيذ</p>
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
            <div key={toast.id} className={`${colors[toast.type]} px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap animate-toast-in`}>
              <i className={toast.icon}></i>
              {toast.message}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="text-center pb-8 pt-4">
        <button onClick={() => {
          clearState();
          setSelections(emptySelections);
          setActivePhaseState("strategy");
          setStrategyStepState(0);
          setFragranceStepState(0);
          setIdentityStepState(0);
          setPackagingStepState(0);
          setProductionStepState(0);
          setCompletedPhases([]);
          setAllDone(false);
          addToast("تم إعادة تعيين جميع البيانات", "info");
        }}
          className="text-stone-300 hover:text-red-400 text-xs font-medium cursor-pointer transition-colors underline">
          إعادة تعيين جميع البيانات
        </button>
      </div>
    </div>
  );
};

export default BrandCreationPage;