export const animationStyles = `
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
    0%, 100% { box-shadow: 0 0 0 0 rgba(109, 40, 217, 0.3); }
    50% { box-shadow: 0 0 0 8px rgba(109, 40, 217, 0); }
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
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  .animate-fade-slide-in { animation: fadeSlideIn 0.4s ease-out forwards; }
  .animate-pop-in { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
  .animate-toast-in { animation: toastIn 0.35s ease-out forwards; }
  .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
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
  .chip {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .chip:active {
    transform: scale(0.92);
  }
  .step-transition-enter {
    animation: fadeSlideIn 0.45s ease-out forwards;
  }
  .color-swatch {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .color-swatch:hover {
    transform: scale(1.12);
  }
`;

export type WizardPhase = "direction" | "color" | "typography" | "logo" | "applications" | "delivery";

export interface IdentitySelections {
  brandPersonality: string[];
  logoStyle: string | null;
  moodInspiration: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  colorMood: string | null;
  arabicFont: string | null;
  latinFont: string | null;
  fontPair: string | null;
  logoConcept: string | null;
  logomarkType: string | null;
  logoLayout: string | null;
  stationery: string[];
  socialMedia: string[];
  packagingStyle: string | null;
  signage: string | null;
  brandGuideFormat: string | null;
  sourceFiles: string[];
  revisions: string | null;
}

export interface SavedState {
  activePhase: WizardPhase;
  directionStep: number;
  colorStep: number;
  typographyStep: number;
  logoStep: number;
  applicationsStep: number;
  deliveryStep: number;
  selections: IdentitySelections;
  completedPhases: WizardPhase[];
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
  icon: string;
}

export const STORAGE_KEY = "visual_identity_wizard_state";

export const emptySelections: IdentitySelections = {
  brandPersonality: [],
  logoStyle: null,
  moodInspiration: null,
  primaryColor: null,
  secondaryColor: null,
  accentColor: null,
  colorMood: null,
  arabicFont: null,
  latinFont: null,
  fontPair: null,
  logoConcept: null,
  logomarkType: null,
  logoLayout: null,
  stationery: [],
  socialMedia: [],
  packagingStyle: null,
  signage: null,
  brandGuideFormat: null,
  sourceFiles: [],
  revisions: null,
};

export const saveState = (state: Partial<SavedState>) => {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
    const merged = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
};

export const loadState = (): Partial<SavedState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
};

export const clearState = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
};

export const personalityOptions = [
  { id: "luxury", name: "فاخر", en: "Luxury", icon: "ri-vip-crown-line", desc: "راقٍ، حصري، فخم — للعلامات التي تستهدف الشريحة العليا", color: "#b8860b" },
  { id: "minimal", name: "مينيمالي", en: "Minimalist", icon: "ri-shapes-line", desc: "بسيط، نظيف، عصري — أقل هو أكثر", color: "#2d2d2d" },
  { id: "artistic", name: "فني / إبداعي", en: "Artistic / Creative", icon: "ri-brush-line", desc: "جريء، معبّر، غير تقليدي — للبراندات التي تتحدى المألوف", color: "#c41e3a" },
  { id: "classic", name: "كلاسيكي", en: "Classic / Timeless", icon: "ri-hourglass-line", desc: "أصيل، خالد، موثوق — أناقة لا تتغير مع الزمن", color: "#5c4033" },
  { id: "modern", name: "عصري / تقني", en: "Modern / Tech", icon: "ri-flashlight-line", desc: "مستقبلي، ديناميكي، مبتكر — للبراندات الرقمية أولاً", color: "#0d9488" },
  { id: "organic", name: "طبيعي / عضوي", en: "Natural / Organic", icon: "ri-leaf-line", desc: "دافئ، أرضي، مستدام — للبراندات الصديقة للبيئة", color: "#65a30d" },
];

export const logoStyleOptions = [
  { id: "wordmark", name: "علامة نصية", en: "Wordmark", icon: "ri-font-size", desc: "شعار يعتمد على اسم البراند بخط مميز", examples: "Google, Calvin Klein, Zara" },
  { id: "symbol", name: "رمز / أيقونة", en: "Symbol / Icon", icon: "ri-shapes-line", desc: "رمز بصري مجرد أو تصويري يمثل البراند", examples: "Apple, Nike, Twitter" },
  { id: "combination", name: "مدمج", en: "Combination Mark", icon: "ri-layout-line", desc: "دمج بين الرمز والاسم — مرونة في الاستخدام", examples: "Adidas, Lacoste, Puma" },
  { id: "emblem", name: "شعار / درع", en: "Emblem / Crest", icon: "ri-shield-line", desc: "تصميم تقليدي داخل درع أو ختم", examples: "Porsche, Harvard, Starbucks" },
  { id: "arabic", name: "خط عربي", en: "Arabic Calligraphy", icon: "ri-pen-nib-line", desc: "حروف عربية أصيلة بتصميم فني", examples: "Al Jazeera, Aramco, Arab Bank" },
  { id: "abstract", name: "تجريدي / هندسي", en: "Abstract / Geometric", icon: "ri-hexagon-line", desc: "أشكال هندسية مجردة — عصرية وغامضة", examples: "Chanel, Mitsubishi, Mastercard" },
];

export const moodInspirationOptions = [
  { id: "dark-luxe", name: "فخامة داكنة", icon: "ri-moon-line", desc: "خلفيات سوداء، ذهبي، إضاءة درامية — غموض وجاذبية", keywords: "أسود، ذهبي، مخمل، دراما" },
  { id: "light-pure", name: "نقاء فاتح", icon: "ri-sun-line", desc: "أبيض، مساحات واسعة، إضاءة طبيعية — صفاء وثقة", keywords: "أبيض، فاتح، نظيف، واسع" },
  { id: "earthy-warm", name: "دفء ترابي", icon: "ri-earth-line", desc: "بني، بيج، أخضر زيتوني — أصالة ودفء", keywords: "ترابي، دافئ، طبيعي، حرفي" },
  { id: "vibrant-bold", name: "حيوي وجريء", icon: "ri-fire-line", desc: "ألوان مشبعة، تباين عالي — طاقة وشباب", keywords: "جريء، ملون، حيوي، شبابي" },
  { id: "soft-pastel", name: "باستيل ناعم", icon: "ri-contrast-drop-line", desc: "ألوان هادئة، تدرجات ناعمة — رقة وأنوثة", keywords: "ناعم، باستيل، رومانسي، راق" },
  { id: "mono-chic", name: "أحادي أنيق", icon: "ri-contrast-line", desc: "رمادي، أبيض، أسود — احترافية وعصرية", keywords: "رمادي، بروفشنال، نظيف، حديث" },
];

export const primaryColorOptions = [
  { id: "gold", name: "ذهبي ملكي", hex: "#b8860b", class: "bg-[#b8860b]", desc: "فخامة، ثراء، قيمة عالية" },
  { id: "crimson", name: "أحمر قرمزي", hex: "#c41e3a", class: "bg-[#c41e3a]", desc: "جرأة، شغف، طاقة" },
  { id: "emerald", name: "زمردي", hex: "#0d9488", class: "bg-[#0d9488]", desc: "توازن، نمو، فخامة هادئة" },
  { id: "midnight", name: "أزرق داكن", hex: "#1e3a5f", class: "bg-[#1e3a5f]", desc: "ثقة، احترافية، عمق" },
  { id: "terracotta", name: "طيني", hex: "#c4704c", class: "bg-[#c4704c]", desc: "دفء، أصالة، ترابية" },
  { id: "plum", name: "برقوقي", hex: "#6b2d5c", class: "bg-[#6b2d5c]", desc: "غموض، إبداع، رفاهية" },
  { id: "charcoal", name: "أسود فحمي", hex: "#2d2d2d", class: "bg-[#2d2d2d]", desc: "أناقة، قوة، كلاسيكية" },
  { id: "sand", name: "رملي", hex: "#c4a882", class: "bg-[#c4a882]", desc: "دفء، طبيعة، فخامة ناعمة" },
];

export const secondaryColorOptions = [
  { id: "silver", name: "فضي", hex: "#a8a8a8", class: "bg-[#a8a8a8]", desc: "توازن، حداثة، هدوء" },
  { id: "cream", name: "كريمي", hex: "#f5f0e8", class: "bg-[#f5f0e8]", desc: "نعومة، دفء، أناقة" },
  { id: "navy", name: "كحلي", hex: "#1e293b", class: "bg-[#1e293b]", desc: "عمق، سلطة، ثقة" },
  { id: "sage", name: "ميرمية", hex: "#8b9a7d", class: "bg-[#8b9a7d]", desc: "هدوء، طبيعة، توازن" },
  { id: "blush", name: "وردي خافت", hex: "#e8c4c4", class: "bg-[#e8c4c4]", desc: "رقة، أنوثة، نعومة" },
  { id: "bronze", name: "برونزي", hex: "#8b6914", class: "bg-[#8b6914]", desc: "دفء، عراقة، أصالة" },
];

export const accentColorOptions = [
  { id: "copper", name: "نحاسي", hex: "#c77d3c", class: "bg-[#c77d3c]", desc: "دفء، تميز، إبداع" },
  { id: "teal", name: "فيروزي غامق", hex: "#0f766e", class: "bg-[#0f766e]", desc: "انتعاش، توازن، هدوء" },
  { id: "coral", name: "مرجاني", hex: "#e87d5e", class: "bg-[#e87d5e]", desc: "حيوية، دفء، شباب" },
  { id: "lilac", name: "لافندر", hex: "#9b7cb8", class: "bg-[#9b7cb8]", desc: "إبداع، غموض، أناقة" },
  { id: "mustard", name: "خردلي", hex: "#c9a026", class: "bg-[#c9a026]", desc: "جرأة، دفء، تميز" },
  { id: "rosegold", name: "ذهب وردي", hex: "#b8787e", class: "bg-[#b8787e]", desc: "رقة، فخامة، عصرية" },
];

export const arabicFontOptions = [
  { id: "thuluth", name: "خط الثلث", en: "Thuluth", sample: "بسم الله", desc: "خط أصيل فخم — مثالي للشعارات التقليدية والفاخرة", style: "نقوش معقدة، انسيابية عالية" },
  { id: "diwani", name: "الديواني", en: "Diwani", sample: "براند", desc: "خط ملكي راقٍ — استُخدم في الدواوين السلطانية", style: "مرونة عالية، زخرفة غنية" },
  { id: "kufi", name: "كوفي", en: "Kufic", sample: "عطر", desc: "خط هندسي قوي — مثالي للبراندات العصرية والجريئة", style: "زوايا حادة، تناظر هندسي" },
  { id: "naskh", name: "نسخ", en: "Naskh", sample: "العربية", desc: "الخط الأكثر وضوحاً — مثالي للنصوص الطويلة والثانوية", style: "واضح، منتظم، سهل القراءة" },
  { id: "modern-arabic", name: "عربي عصري", en: "Modern Arabic", sample: "مودرن", desc: "تصميم حديث مستوحى من الحرف العربي", style: "بسيط، جريء، مينيمالي" },
  { id: "custom-arabic", name: "عربي مخصص", en: "Custom Arabic", sample: "خاص", desc: "خط مصمم خصيصاً لبراندك — هوية لا تُنسخ", style: "حسب الطلب، فريد تماماً" },
];

export const latinFontOptions = [
  { id: "serif-elegant", name: "Didot / Bodoni", en: "Elegant Serif", sample: "Aa", desc: "سيرف عالي التباين — فخامة كلاسيكية", style: "رقيق، أنيق، عريق" },
  { id: "sans-modern", name: "Futura / Montserrat", en: "Modern Sans", sample: "Aa", desc: "sans-serif هندسي — عصري ونظيف", style: "هندسي، واضح، معاصر" },
  { id: "serif-classic", name: "Garamond / Caslon", en: "Classic Serif", sample: "Aa", desc: "سيرف قديم الطراز — ثقة وعريقة", style: "دافئ، سهل القراءة، كلاسيكي" },
  { id: "grotesk", name: "Helvetica / Univers", en: "Neo-Grotesk", sample: "Aa", desc: "محايد ومحترف — الخيار الآمن والعالمي", style: "محايد، عملي، متعدد الاستخدامات" },
  { id: "display", name: "Display / Decorative", en: "Display Font", sample: "Aa", desc: "خط عرضي فريد — للعناوين", style: "فريد، زخرفي، مميز" },
  { id: "minimal-lite", name: "Light / Thin", en: "Light Minimal", sample: "Aa", desc: "خفيف ورقيق — أناقة بسيطة", style: "رقيق، فاخر، مينيمالي" },
];

export const logoConceptOptions = [
  { id: "concept-a", name: "مقترح A", desc: "تصميم كلاسيكي يجمع بين الخط العربي الفاخر والزخرفة الذهبية", badge: "الأكثر طلباً", icon: "ri-star-line" },
  { id: "concept-b", name: "مقترح B", desc: "مينيمالي عصري بخطوط نظيفة وأشكال هندسية", badge: "عصري", icon: "ri-shapes-line" },
  { id: "concept-c", name: "مقترح C", desc: "دمج إبداعي بين الحرف العربي واللاتيني بتصميم فريد", badge: "مبتكر", icon: "ri-palette-line" },
];

export const logomarkTypeOptions = [
  { id: "monogram", name: "حروف متداخلة", en: "Monogram / Initials", icon: "ri-font-size-2", desc: "دمج الحروف الأولى من اسم البراند في رمز واحد" },
  { id: "pictorial", name: "رمز تصويري", en: "Pictorial Mark", icon: "ri-image-line", desc: "رمز بصري يعبر عن طبيعة البراند" },
  { id: "geometric", name: "هندسي مجرد", en: "Abstract Geometric", icon: "ri-hexagon-line", desc: "شكل هندسي مجرد لا يمثل شيئاً محدداً" },
  { id: "mascot", name: "تميمة / شخصية", en: "Mascot", icon: "ri-user-smile-line", desc: "شخصية أو تميمة تمثل البراند" },
];

export const logoLayoutOptions = [
  { id: "horizontal", name: "أفقي", icon: "ri-layout-right-line", desc: "الرمز بجانب النص — الأكثر استخداماً", sample: "■ ← اسم البراند" },
  { id: "stacked", name: "مكدس / رأسي", icon: "ri-layout-top-line", desc: "الرمز فوق النص — للمساحات المربعة", sample: "■\nاسم البراند" },
  { id: "integrated", name: "مدمج", icon: "ri-layout-masonry-line", desc: "الرمز داخل النص — تصميم فريد", sample: "اس■م البراند" },
  { id: "icon-only", name: "أيقونة فقط", icon: "ri-focus-line", desc: "الرمز فقط — كأيقونة تطبيق", sample: "■ فقط" },
];

export const stationeryOptions = [
  { id: "letterhead", name: "ترويسة رسمية", icon: "ri-file-text-line", desc: "A4 مع شعار وألوان البراند" },
  { id: "business-card", name: "بطاقة عمل", icon: "ri-id-card-line", desc: "بطاقة فاخرة بلمسات خاصة" },
  { id: "envelope", name: "ظهرية", icon: "ri-mail-line", desc: "تصميم ظرف رسمي DL" },
  { id: "folder", name: "ملف تعريفي", icon: "ri-folder-line", desc: "ملف عرض للعملاء" },
  { id: "stamp", name: "ختم", icon: "ri-checkbox-circle-line", desc: "ختم رسمي بخامة فاخرة" },
  { id: "notebook", name: "دفتر ملاحظات", icon: "ri-booklet-line", desc: "دفتر مخصص بهوية البراند" },
];

export const socialMediaOptions = [
  { id: "instagram", name: "انستغرام", icon: "ri-instagram-line", desc: "صورة بروفايل + قالب القصص" },
  { id: "twitter", name: "تويتر / X", icon: "ri-twitter-x-line", desc: "صورة بروفايل + غلاف" },
  { id: "linkedin", name: "لينكدإن", icon: "ri-linkedin-line", desc: "شعار + غلاف للشركة" },
  { id: "tiktok", name: "تيكتوك", icon: "ri-tiktok-line", desc: "صورة بروفايل + قوالب فيديو" },
  { id: "snapchat", name: "سناب شات", icon: "ri-snapchat-line", desc: "فلتر + أيقونة مخصصة" },
  { id: "youtube", name: "يوتيوب", icon: "ri-youtube-line", desc: "غلاف قناة + شعار مائي" },
];

export const packagingStyleOptions = [
  { id: "minimal-elegant", name: "مينيمالي فاخر", icon: "ri-shapes-line", desc: "خلفية بيضاء، شعار صغير، لمسة ذهبية" },
  { id: "full-wrap", name: "تغليف كامل", icon: "ri-layout-line", desc: "الهوية تغطي كامل العبوة — حضور بصري قوي" },
  { id: "transparent", name: "شفاف / زجاجي", icon: "ri-contrast-drop-line", desc: "عرض المنتج بشفافية مع استيكر بسيط" },
  { id: "craft", name: "يدوي / كرافت", icon: "ri-brush-line", desc: "ورق كرافت، خيوط، أختام شمع" },
];

export const signageOptions = [
  { id: "storefront", name: "واجهة محل", icon: "ri-store-line", desc: "لافتة خارجية بإضاءة" },
  { id: "interior", name: "ديكور داخلي", icon: "ri-building-line", desc: "جداريات وعناصر داخلية" },
  { id: "exhibition", name: "معرض / إكسبو", icon: "ri-flag-line", desc: "بوث عرض في المعارض" },
  { id: "vehicle", name: "تغليف سيارة", icon: "ri-car-line", desc: "تصميم خارجي كامل" },
];

export const brandGuideFormatOptions = [
  { id: "digital-pdf", name: "PDF رقمي", icon: "ri-file-pdf-line", desc: "ملف دليل هوية تفاعلي للاستخدام الرقمي" },
  { id: "printed", name: "مطبوع فاخر", icon: "ri-book-open-line", desc: "كتيب مطبوع بجودة عالية مع خامات متنوعة" },
  { id: "web-portal", name: "بوابة إلكترونية", icon: "ri-window-line", desc: "موقع خاص بدليل الهوية يمكن تحديثه" },
  { id: "one-page", name: "ملخص من صفحة", icon: "ri-file-list-line", desc: "صفحة واحدة مختصرة للاستخدام السريع" },
];

export const sourceFileOptions = [
  { id: "ai", name: "Adobe Illustrator (.ai)", icon: "ri-pen-nib-line", desc: "الملفات الأصلية للتعديل والطباعة" },
  { id: "eps", name: "EPS", icon: "ri-shapes-line", desc: "للاستخدام مع برامج التصميم المختلفة" },
  { id: "svg", name: "SVG", icon: "ri-code-s-slash-line", desc: "للاستخدامات الرقمية والمواقع" },
  { id: "png", name: "PNG شفاف", icon: "ri-image-line", desc: "بدقة عالية 300DPI للاستخدامات العامة" },
  { id: "pdf", name: "PDF", icon: "ri-file-pdf-line", desc: "للطباعة والعروض التقديمية" },
];

export const revisionOptions = [
  { id: "unlimited", name: "غير محدودة", en: "Unlimited", icon: "ri-refresh-line", desc: "تعديلات حتى ترضى تماماً" },
  { id: "premium", name: "٣ مراحل", en: "3 Rounds", icon: "ri-loop-left-line", desc: "ثلاث جولات تعديل منظمة" },
  { id: "lite", name: "جولة واحدة", en: "1 Round", icon: "ri-check-double-line", desc: "تعديل واحد شامل بعد التسليم الأولي" },
];

export const phasesList: { key: WizardPhase; label: string; icon: string; desc: string }[] = [
  { key: "direction", label: "الاتجاه الإبداعي", icon: "ri-compass-3-line", desc: "حدد شخصية البراند ونمط الشعار والمود العام" },
  { key: "color", label: "نظام الألوان", icon: "ri-palette-line", desc: "اختر الألوان الأساسية والثانوية والتمييزية" },
  { key: "typography", label: "الخطوط", icon: "ri-font-size", desc: "اختر الخط العربي واللاتيني المناسبين" },
  { key: "logo", label: "تصميم الشعار", icon: "ri-pen-nib-line", desc: "اختر مفهوماً للشعار، الرمز، والتنسيق" },
  { key: "applications", label: "التطبيقات", icon: "ri-smartphone-line", desc: "اختر التطبيقات التي تحتاجها" },
  { key: "delivery", label: "التسليم", icon: "ri-gift-line", desc: "اختر صيغ التسليم والمراجعات" },
];