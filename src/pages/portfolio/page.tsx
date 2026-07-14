import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";

interface PortfolioItem {
  id: number;
  title: string;
  brand: string;
  category: string;
  categoryLabel: string;
  image: string;
  images: string[];
  description: string;
  services: string[];
  year: string;
  location: string;
  color: string;
}

const categories = [
  { key: "all", label: "الكل" },
  { key: "brand", label: "براند كامل" },
  { key: "fragrance", label: "تطوير عطر" },
  { key: "identity", label: "هوية بصرية" },
  { key: "packaging", label: "عبوة وتغليف" },
  { key: "manufacturing", label: "تصنيع" },
];

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "عطر ليل الرياض",
    brand: "ليل الرياض",
    category: "brand",
    categoryLabel: "براند كامل",
    image: "https://readdy.ai/api/search-image?query=Luxury%20arabian%20perfume%20brand%20packaging%20collection%2C%20elegant%20gold%20and%20black%20glass%20bottles%20with%20ornate%20caps%20on%20marble%20surface%2C%20premium%20product%20photography%2C%20warm%20amber%20lighting%2C%20sophisticated%20editorial%20style%2C%20rich%20dark%20background%20with%20golden%20accents&width=600&height=600&seq=portfolio-1-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Luxury%20arabian%20perfume%20bottle%20close-up%2C%20intricate%20gold%20cap%20detail%2C%20dark%20elegant%20background%2C%20warm%20studio%20lighting%2C%20premium%20product%20photography%20with%20soft%20shadows&width=600&height=600&seq=portfolio-1-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Premium%20perfume%20gift%20box%20packaging%2C%20black%20and%20gold%20embossed%20design%2C%20velvet%20interior%2C%20luxury%20unboxing%20experience%20photography%2C%20warm%20ambient%20lighting&width=600&height=600&seq=portfolio-1-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Elegant%20perfume%20brand%20identity%20mockup%2C%20business%20cards%20and%20packaging%20on%20dark%20marble%2C%20gold%20foil%20printing%2C%20sophisticated%20brand%20collateral%20photography&width=600&height=600&seq=portfolio-1-3&orientation=squarish",
    ],
    description: "براند عطري فاخر مستوحى من أجواء الرياض الليلية. تم العمل على التركيبة العطرية بنوتات العود والعنبر، وتصميم هوية بصرية كاملة تعكس الفخامة العربية الأصيلة.",
    services: ["تطوير تركيبة", "هوية بصرية", "عبوة وتغليف", "تصنيع"],
    year: "2025",
    location: "الرياض، السعودية",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: 2,
    title: "روح الجنوب",
    brand: "روح الجنوب",
    category: "fragrance",
    categoryLabel: "تطوير عطر",
    image: "https://readdy.ai/api/search-image?query=Artisan%20perfume%20laboratory%20with%20glass%20bottles%20and%20essential%20oils%2C%20amber%20colored%20liquids%20in%20crystal%20containers%2C%20warm%20natural%20lighting%20through%20windows%2C%20sophisticated%20fragrance%20creation%20workspace%2C%20editorial%20photography%20style&width=600&height=600&seq=portfolio-2-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Perfume%20notes%20pyramid%20visualization%2C%20ingredients%20and%20botanical%20elements%20arranged%20artistically%2C%20warm%20earthy%20tones%2C%20editorial%20product%20photography&width=600&height=600&seq=portfolio-2-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Luxury%20perfume%20testing%20strips%20with%20amber%20liquid%2C%20elegant%20glass%20bottles%20in%20background%2C%20warm%20studio%20lighting%2C%20professional%20fragrance%20development%20photography&width=600&height=600&seq=portfolio-2-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Natural%20perfume%20ingredients%20collection%2C%20dried%20flowers%20spices%20and%20woods%2C%20warm%20rustic%20aesthetic%2C%20artisan%20fragrance%20creation%20elements%20photography&width=600&height=600&seq=portfolio-2-3&orientation=squarish",
    ],
    description: "تركيبة عطرية فريدة تجمع بين نوتات البخور والتوابل الجنوبية. تم تطويرها عبر 12 مرحلة اختبار لتحقيق التوازن المثالي بين الأصالة والحداثة.",
    services: ["تطوير تركيبة", "اختبارات جودة"],
    year: "2024",
    location: "جدة، السعودية",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    id: 3,
    title: "أصيلة",
    brand: "أصيلة",
    category: "identity",
    categoryLabel: "هوية بصرية",
    image: "https://readdy.ai/api/search-image?query=Complete%20brand%20identity%20system%20for%20luxury%20arabian%20perfume%2C%20logo%20on%20packaging%20mockups%2C%20business%20cards%20letterhead%20and%20boxes%2C%20minimalist%20elegant%20design%20with%20gold%20accents%2C%20professional%20brand%20collateral%20photography%20on%20light%20background&width=600&height=600&seq=portfolio-3-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Arabic%20calligraphy%20logo%20design%20for%20perfume%20brand%2C%20elegant%20typography%20on%20cream%20paper%2C%20gold%20ink%2C%20sophisticated%20brand%20identity%20photography&width=600&height=600&seq=portfolio-3-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Brand%20color%20palette%20and%20typography%20guidelines%2C%20design%20system%20elements%20arranged%20aesthetically%2C%20warm%20neutral%20tones%2C%20professional%20brand%20guidelines%20photography&width=600&height=600&seq=portfolio-3-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20stationery%20set%2C%20embossed%20business%20cards%20and%20packaging%20tags%2C%20cream%20and%20gold%20color%20scheme%2C%20elegant%20flat%20lay%20photography&width=600&height=600&seq=portfolio-3-3&orientation=squarish",
    ],
    description: "هوية بصرية كاملة لبراند عطري يحتفي بالتراث العربي. الشعار مستوحى من الخط العربي الأصيل، والألوان تعكس دفء الصحراء وأناقتها.",
    services: ["شعار وتصميم", "ألوان وخطوط", "مواد تسويقية"],
    year: "2025",
    location: "دبي، الإمارات",
    color: "bg-rose-100 text-rose-800",
  },
  {
    id: 4,
    title: "مسك الخليج",
    brand: "مسك الخليج",
    category: "packaging",
    categoryLabel: "عبوة وتغليف",
    image: "https://readdy.ai/api/search-image?query=Premium%20perfume%20packaging%20design%20collection%2C%20crystal%20glass%20bottles%20with%20metallic%20caps%20in%20velvet%20boxes%2C%20luxury%20gift%20wrapping%20with%20silk%20ribbons%2C%20sophisticated%20product%20photography%20with%20dramatic%20lighting&width=600&height=600&seq=portfolio-4-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Elegant%20perfume%20bottle%20design%2C%20faceted%20crystal%20glass%20with%20gold%20accents%2C%20dark%20background%2C%20dramatic%20product%20photography%20with%20reflections&width=600&height=600&seq=portfolio-4-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Luxury%20perfume%20outer%20packaging%20box%2C%20embossed%20leather%20texture%20with%20metallic%20logo%2C%20rich%20dark%20tones%2C%20premium%20unboxing%20photography&width=600&height=600&seq=portfolio-4-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20packaging%20inserts%20and%20accessories%2C%20silk%20pouches%20and%20certificate%20cards%2C%20elegant%20presentation%20photography%20with%20warm%20lighting&width=600&height=600&seq=portfolio-4-3&orientation=squarish",
    ],
    description: "تصميم وتنفيذ عبوة وتغليف فاخر للبراندات العطرية. العبوة من الكريستال المصنّع يدوياً، والصندوق الخارجي من الجلد المغشى بورق فاخر.",
    services: ["تصميم 3D", "عبوة زجاجية", "تغليف خارجي", "تغليف داخلي"],
    year: "2024",
    location: "المنامة، البحرين",
    color: "bg-violet-100 text-violet-800",
  },
  {
    id: 5,
    title: "نبض الشرق",
    brand: "نبض الشرق",
    category: "brand",
    categoryLabel: "براند كامل",
    image: "https://readdy.ai/api/search-image?query=Full%20perfume%20brand%20launch%20campaign%2C%20multiple%20products%20arranged%20artistically%2C%20social%20media%20visuals%20and%20marketing%20materials%2C%20modern%20arabian%20aesthetic%20with%20bold%20colors%2C%20professional%20editorial%20photography&width=600&height=600&seq=portfolio-5-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20social%20media%20campaign%20visuals%2C%20elegant%20lifestyle%20photography%20with%20model%20holding%20fragrance%2C%20warm%20desert%20tones%2C%20professional%20marketing%20photography&width=600&height=600&seq=portfolio-5-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20retail%20display%20design%2C%20elegant%20counter%20arrangement%20with%20lighting%2C%20luxury%20store%20interior%2C%20professional%20retail%20photography&width=600&height=600&seq=portfolio-5-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20advertising%20billboard%20mockup%2C%20elegant%20brand%20campaign%20visual%2C%20urban%20setting%20with%20dramatic%20lighting%2C%20professional%20marketing%20photography&width=600&height=600&seq=portfolio-5-3&orientation=squarish",
    ],
    description: "براند عطري شاب يستهدف جيل الألفية. رحلة كاملة من التسمية والتركيبة إلى التصنيع والتسويق — كل شيء تحت سقف واحد.",
    services: ["تسمية وبراند", "تطوير تركيبة", "تصنيع", "تسويق"],
    year: "2025",
    location: "الكويت",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: 6,
    title: "درة العود",
    brand: "درة العود",
    category: "manufacturing",
    categoryLabel: "تصنيع",
    image: "https://readdy.ai/api/search-image?query=Perfume%20manufacturing%20facility%20interior%2C%20modern%20production%20line%20with%20glass%20bottles%20and%20filling%20machines%2C%20clean%20industrial%20environment%20with%20warm%20lighting%2C%20professional%20factory%20photography%2C%20stainless%20steel%20equipment&width=600&height=600&seq=portfolio-6-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Perfume%20quality%20control%20laboratory%2C%20technician%20testing%20fragrance%20samples%2C%20modern%20equipment%20and%20glassware%2C%20clean%20professional%20laboratory%20photography&width=600&height=600&seq=portfolio-6-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20bottling%20production%20line%2C%20automated%20filling%20and%20capping%20machines%2C%20rows%20of%20glass%20bottles%2C%20industrial%20manufacturing%20photography%20with%20warm%20tones&width=600&height=600&seq=portfolio-6-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Finished%20perfume%20products%20on%20conveyor%20belt%2C%20quality%20inspection%20stage%2C%20elegant%20bottles%20ready%20for%20packaging%2C%20professional%20manufacturing%20photography&width=600&height=600&seq=portfolio-6-3&orientation=squarish",
    ],
    description: "تصنيع 10,000 وحدة من عطر العود الفاخر. العملية شملت الاختبارات الميكروبية، التعبئة الآمنة، والتغليف النهائي وفق معايير GMP.",
    services: ["تصنيع", "اختبارات جودة", "تعبئة"],
    year: "2024",
    location: "الدمام، السعودية",
    color: "bg-sky-100 text-sky-800",
  },
  {
    id: 7,
    title: "سحر الليل",
    brand: "سحر الليل",
    category: "packaging",
    categoryLabel: "عبوة وتغليف",
    image: "https://readdy.ai/api/search-image?query=Dark%20elegant%20perfume%20packaging%2C%20midnight%20blue%20and%20silver%20color%20scheme%2C%20crystal%20bottle%20with%20moon-shaped%20cap%2C%20velvet%20presentation%20box%2C%20dramatic%20moody%20lighting%2C%20luxury%20product%20photography&width=600&height=600&seq=portfolio-7-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Midnight%20blue%20perfume%20bottle%20close-up%2C%20silver%20metallic%20details%2C%20dark%20background%20with%20subtle%20reflections%2C%20dramatic%20product%20photography&width=600&height=600&seq=portfolio-7-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20packaging%20gift%20set%2C%20multiple%20sizes%20in%20elegant%20box%2C%20midnight%20blue%20and%20silver%20theme%2C%20luxury%20unboxing%20photography&width=600&height=600&seq=portfolio-7-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20label%20design%20detail%2C%20silver%20foil%20on%20dark%20blue%20paper%2C%20elegant%20typography%2C%20macro%20product%20photography&width=600&height=600&seq=portfolio-7-3&orientation=squarish",
    ],
    description: "تصميم عبوة مستوحاة من سحر الليل العربي. الألوان الداكنة والتفاصيل الفضية تعكس جمال السماء الصافية في ليالي الصحراء.",
    services: ["تصميم 3D", "عبوة زجاجية", "تغليف", "طباعة"],
    year: "2025",
    location: "الدوحة، قطر",
    color: "bg-violet-100 text-violet-800",
  },
  {
    id: 8,
    title: "زهر الربيع",
    brand: "زهر الربيع",
    category: "fragrance",
    categoryLabel: "تطوير عطر",
    image: "https://readdy.ai/api/search-image?query=Floral%20perfume%20creation%20process%2C%20fresh%20rose%20and%20jasmine%20petals%20with%20essential%20oil%20bottles%2C%20bright%20natural%20lighting%2C%20soft%20feminine%20aesthetic%2C%20professional%20botanical%20fragrance%20photography%20on%20light%20background&width=600&height=600&seq=portfolio-8-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Fresh%20rose%20petals%20and%20perfume%20ingredients%2C%20soft%20pink%20and%20white%20tones%2C%20delicate%20floral%20arrangement%2C%20professional%20botanical%20photography&width=600&height=600&seq=portfolio-8-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20distillation%20process%2C%20glass%20laboratory%20equipment%20with%20floral%20extracts%2C%20bright%20clean%20aesthetic%2C%20professional%20fragrance%20development%20photography&width=600&height=600&seq=portfolio-8-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Finished%20floral%20perfume%20in%20elegant%20bottle%2C%20surrounded%20by%20fresh%20flowers%2C%20soft%20natural%20lighting%2C%20feminine%20product%20photography&width=600&height=600&seq=portfolio-8-3&orientation=squarish",
    ],
    description: "تركيبة زهرية نقية تجمع بين الياسمين الدمشقي والورد الطائفي. تم تطويرها بأسلوب النوتات الثلاثية الكلاسيكي مع لمسة عصرية.",
    services: ["تطوير تركيبة", "اختبارات حساسية"],
    year: "2024",
    location: "تبوك، السعودية",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    id: 9,
    title: "مملكة العطر",
    brand: "مملكة العطر",
    category: "identity",
    categoryLabel: "هوية بصرية",
    image: "https://readdy.ai/api/search-image?query=Grand%20perfume%20brand%20identity%2C%20royal%20gold%20and%20deep%20burgundy%20colors%2C%20ornate%20arabic%20patterns%2C%20premium%20stationery%20and%20packaging%20suite%2C%20luxurious%20brand%20collateral%20flat%20lay%20photography%20with%20rich%20dark%20tones&width=600&height=600&seq=portfolio-9-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Ornate%20arabic%20pattern%20design%20for%20perfume%20brand%2C%20gold%20geometric%20motifs%20on%20dark%20background%2C%20traditional%20islamic%20art%20influence%2C%20professional%20graphic%20design%20photography&width=600&height=600&seq=portfolio-9-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Luxury%20brand%20packaging%20suite%2C%20multiple%20boxes%20and%20bags%20in%20burgundy%20and%20gold%2C%20premium%20shopping%20experience%20photography&width=600&height=600&seq=portfolio-9-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20signage%20and%20storefront%20design%2C%20elegant%20gold%20lettering%20on%20dark%20facade%2C%20luxury%20retail%20brand%20photography&width=600&height=600&seq=portfolio-9-3&orientation=squarish",
    ],
    description: "هوية بصرية ملكية لبراند عطري يستهدف الفئة الفاخرة. التصميم يعتمد على الزخارف العربية التقليدية مع معالجة عصرية تليق بمكانة البراند.",
    services: ["شعار وتصميم", "أنظمة هوية", "مواد تسويقية", "تصميم متجر"],
    year: "2025",
    location: "أبوظبي، الإمارات",
    color: "bg-rose-100 text-rose-800",
  },
  {
    id: 10,
    title: "بخور الأصالة",
    brand: "بخور الأصالة",
    category: "manufacturing",
    categoryLabel: "تصنيع",
    image: "https://readdy.ai/api/search-image?query=Traditional%20arabian%20incense%20and%20oud%20production%2C%20hand-crafted%20bakhoor%20in%20ornate%20containers%2C%20warm%20workshop%20lighting%2C%20smoke%20and%20aromatic%20atmosphere%2C%20artisan%20manufacturing%20photography%20with%20rich%20warm%20tones&width=600&height=600&seq=portfolio-10-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Hand%20crafting%20traditional%20arabian%20incense%2C%20artisan%20working%20with%20natural%20ingredients%20and%20resins%2C%20warm%20workshop%20environment%2C%20documentary%20style%20photography&width=600&height=600&seq=portfolio-10-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Finished%20bakhoor%20and%20oud%20products%20in%20traditional%20packaging%2C%20ornate%20wooden%20and%20metal%20containers%2C%20warm%20ambient%20lighting%2C%20product%20photography&width=600&height=600&seq=portfolio-10-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Arabian%20incense%20burning%20with%20smoke%2C%20traditional%20mabkhara%20burner%2C%20warm%20atmospheric%20photography%20with%20golden%20light&width=600&height=600&seq=portfolio-10-3&orientation=squarish",
    ],
    description: "تصنيع البخور التقليدي بأسلوب حرفي يحافظ على الأصالة. استخدمنا أجود أنواع العود والمكونات الطبيعية لإنتاج تشكيلة فريدة.",
    services: ["تصنيع يدوي", "تغليف تقليدي", "اختبارات جودة"],
    year: "2024",
    location: "مسقط، عمان",
    color: "bg-sky-100 text-sky-800",
  },
  {
    id: 11,
    title: "عنبر المساء",
    brand: "عنبر المساء",
    category: "brand",
    categoryLabel: "براند كامل",
    image: "https://readdy.ai/api/search-image?query=Complete%20luxury%20perfume%20brand%20launch%2C%20amber%20and%20bronze%20color%20scheme%2C%20multiple%20products%20with%20marketing%20materials%2C%20warm%20sunset-like%20lighting%2C%20sophisticated%20brand%20campaign%20photography%20with%20elegant%20composition&width=600&height=600&seq=portfolio-11-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20lifestyle%20campaign%2C%20elegant%20model%20in%20warm%20amber%20lighting%2C%20desert%20sunset%20backdrop%2C%20professional%20fashion%20and%20fragrance%20photography&width=600&height=600&seq=portfolio-11-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20website%20and%20digital%20presence%20mockup%2C%20elegant%20web%20design%20on%20devices%2C%20warm%20amber%20color%20scheme%2C%20professional%20digital%20marketing%20photography&width=600&height=600&seq=portfolio-11-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20brand%20event%20launch%20setup%2C%20elegant%20venue%20with%20brand%20decorations%2C%20warm%20ambient%20lighting%2C%20professional%20event%20photography&width=600&height=600&seq=portfolio-11-3&orientation=squarish",
    ],
    description: "براند عطري نسائي يحتفي بأناقة المساء العربي. رحلة شاملة من الفكرة إلى الإطلاق التجاري، تشمل التركيبة والهوية والتغليف والتصنيع.",
    services: ["تسمية وبراند", "تطوير تركيبة", "هوية بصرية", "تصنيع", "تسويق"],
    year: "2025",
    location: "الشارقة، الإمارات",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: 12,
    title: "طلّ الضحى",
    brand: "طلّ الضحى",
    category: "packaging",
    categoryLabel: "عبوة وتغليف",
    image: "https://readdy.ai/api/search-image?query=Bright%20morning-inspired%20perfume%20packaging%2C%20soft%20peach%20and%20gold%20colors%2C%20elegant%20frosted%20glass%20bottle%20with%20minimal%20design%2C%20clean%20white%20background%2C%20fresh%20and%20airy%20product%20photography%20with%20natural%20lighting&width=600&height=600&seq=portfolio-12-main&orientation=squarish",
    images: [
      "https://readdy.ai/api/search-image?query=Soft%20frosted%20glass%20perfume%20bottle%2C%20peach%20and%20cream%20tones%2C%20minimal%20elegant%20design%2C%20clean%20product%20photography%20with%20soft%20shadows&width=600&height=600&seq=portfolio-12-1&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Light%20colored%20perfume%20packaging%20box%2C%20peach%20and%20gold%20accents%2C%20soft%20unboxing%20photography%20with%20natural%20morning%20light&width=600&height=600&seq=portfolio-12-2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=Perfume%20bottle%20with%20fresh%20morning%20flowers%2C%20soft%20airy%20composition%2C%20bright%20and%20clean%20product%20photography%20with%20pastel%20tones&width=600&height=600&seq=portfolio-12-3&orientation=squarish",
    ],
    description: "تصميم عبوة يعكس نضارة الصباح. الزجاج الم frosted مع تدرجات اللون الخوخي تعطي إحساساً بالانتعاش والأناقة البسيطة.",
    services: ["تصميم 3D", "عبوة زجاجية", "تغليف", "طباعة UV"],
    year: "2025",
    location: "المدينة المنورة",
    color: "bg-violet-100 text-violet-800",
  },
];

const useVisible = (threshold = 0.1) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const hero = useVisible(0.1);
  const gridRef = useVisible(0.05);

  const filteredItems = activeCategory === "all"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  const openDetail = useCallback((item: PortfolioItem) => {
    setSelectedItem(item);
    setActiveImage(0);
    document.body.style.overflow = "hidden";
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedItem(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeDetail]);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white to-stone-100/20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-200/8 blur-[120px]"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className={`transition-all duration-700 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                <i className="ri-folder-image-line"></i>
                نماذج من الأعمال
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-5 leading-tight">
                أعمالنا تتحدث
                <br />
                <span className="text-amber-700">عن جودتنا</span>
              </h1>
              <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                استكشف مشاريعنا المنجزة عبر مسارات متنوعة — من البراندات الكاملة إلى التركيبات الحصرية والتصاميم الفريدة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-[60px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-100 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.label}
                {cat.key !== "all" && (
                  <span className={`mr-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.key ? "bg-white/20 text-white" : "bg-stone-200 text-stone-500"
                  }`}>
                    {portfolioItems.filter((i) => i.category === cat.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16" ref={gridRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openDetail(item)}
                className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  gridRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index % 4) * 75}ms`, transitionDuration: "700ms" }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 backdrop-blur text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <i className="ri-eye-line ml-1"></i>
                      عرض التفاصيل
                    </span>
                  </div>
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${item.color}`}>
                    {item.categoryLabel}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-stone-400 text-[10px] font-light mb-1">{item.brand}</div>
                  <h3 className="font-bold text-stone-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-light line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-stone-400 text-[10px]">
                    <span><i className="ri-calendar-line ml-0.5"></i>{item.year}</span>
                    <span><i className="ri-map-pin-line ml-0.5"></i>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
                <i className="ri-search-line text-stone-400 text-2xl"></i>
              </div>
              <p className="text-stone-500 text-sm font-medium">لا توجد مشاريع في هذا التصنيف</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            مشروعك القادم هنا
          </h2>
          <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
            انضم إلى قائمة عملائنا المميزين وابدأ رحلة بناء براندك العطري مع فريق من الخبراء
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
            >
              <i className="ri-rocket-2-line"></i>
              ابدأ مشروعك
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm border border-white/20"
            >
              <i className="ri-stack-line"></i>
              تصفح الخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Page Navigation */}
      <div className="bg-white border-t border-stone-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/services"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-right-line text-xl group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-light">الصفحة السابقة</div>
              <div className="text-sm font-bold">الخدمات</div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { label: "الرئيسية", path: "/" },
              { label: "عنا", path: "/about" },
              { label: "الخدمات", path: "/services" },
              { label: "نماذج الأعمال", path: "/portfolio", active: true },
              { label: "الأسئلة", path: "/faq" },
              { label: "تواصل معنا", path: "/contact" },
            ].map((dot, i) => (
              <Link
                key={dot.path}
                to={dot.path}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${dot.active ? "bg-amber-700 w-5" : "bg-stone-300 hover:bg-amber-400"}`}
                title={dot.label}
              />
            ))}
          </div>

          <Link
            to="/faq"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-light">الصفحة التالية</div>
              <div className="text-sm font-bold">الأسئلة والاستفسارات</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-left-line text-xl group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </Link>
        </div>
      </div>

      <FooterSection />

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-scale-in"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selectedItem.color}`}>
                  {selectedItem.categoryLabel}
                </span>
                <span className="text-stone-900 font-bold text-sm">{selectedItem.title}</span>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="p-6">
              {/* Image Gallery */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-stone-100">
                <img
                  src={selectedItem.images[activeImage]}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mb-6">
                {selectedItem.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === i ? "border-amber-500" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-black text-stone-900 mb-3">{selectedItem.title}</h2>
                  <p className="text-stone-600 text-sm leading-relaxed font-light mb-5">
                    {selectedItem.description}
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm mb-3">الخدمات المقدمة</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.services.map((svc) => (
                      <span
                        key={svc}
                        className="bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        <i className="ri-check-line ml-1 text-amber-600"></i>
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-5">
                  <h4 className="font-bold text-stone-900 text-sm mb-4">تفاصيل المشروع</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                        <i className="ri-building-line text-stone-400 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">البراند</div>
                        <div className="text-stone-700 text-xs font-medium">{selectedItem.brand}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                        <i className="ri-calendar-line text-stone-400 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">السنة</div>
                        <div className="text-stone-700 text-xs font-medium">{selectedItem.year}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                        <i className="ri-map-pin-line text-stone-400 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">الموقع</div>
                        <div className="text-stone-700 text-xs font-medium">{selectedItem.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                        <i className="ri-stack-line text-stone-400 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">التصنيف</div>
                        <div className="text-stone-700 text-xs font-medium">{selectedItem.categoryLabel}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/auth"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    <i className="ri-rocket-2-line"></i>
                    ابدأ مشروع مشابه
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;