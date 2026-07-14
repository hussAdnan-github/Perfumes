export interface PackagingOption {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  shape: string;
  size: string;
  image: string;
  description: string;
}

export const packagingOptions: PackagingOption[] = [
  {
    id: "pkg-001",
    name: "زجاجة كلاسيكية",
    nameEn: "Classic Flacon",
    type: "زجاجية",
    shape: "أسطواني",
    size: "100 مل",
    image: "https://readdy.ai/api/search-image?query=elegant%20clear%20glass%20perfume%20bottle%20classic%20cylindrical%20shape%20with%20golden%20cap%20and%20amber%20liquid%20perfume%20inside%2C%20minimal%20studio%20lighting%20on%20white%20background%2C%20luxury%20fragrance%20packaging%2C%20product%20photography%20style%2C%20clean%20simple%20composition%2C%20no%20text%20no%20logos&width=400&height=500&seq=pkg-001-classic&orientation=portrait",
    description: "زجاجة كلاسيكية أسطوانية بغطاء ذهبي، تناسب العطور الشرقية الفاخرة",
  },
  {
    id: "pkg-002",
    name: "كريستال ملكي",
    nameEn: "Royal Crystal",
    type: "كريستال",
    shape: "مربع",
    size: "100 مل",
    image: "https://readdy.ai/api/search-image?query=luxury%20square%20crystal%20perfume%20bottle%20with%20faceted%20diamond%20cut%20design%2C%20silver%20metallic%20cap%2C%20transparent%20glass%20showing%20pale%20golden%20fragrance%2C%20premium%20product%20photography%20on%20clean%20white%20background%2C%20elegant%20sharp%20edges%2C%20high%20end%20aesthetic%2C%20no%20text&width=400&height=500&seq=pkg-002-crystal&orientation=portrait",
    description: "زجاجة كريستال مربعة بتصميم ماسي فاخر، مثالية للبراندات الفاخرة",
  },
  {
    id: "pkg-003",
    name: "معدنية عصرية",
    nameEn: "Modern Metallic",
    type: "معدنية",
    shape: "بيضاوي",
    size: "50 مل",
    image: "https://readdy.ai/api/search-image?query=sleek%20modern%20oval%20metallic%20perfume%20bottle%20in%20brushed%20rose%20gold%20finish%2C%20minimalist%20Scandinavian%20design%2C%20matte%20texture%2C%20compact%20travel%20size%2C%20studio%20lighting%20on%20white%20background%2C%20contemporary%20luxury%20aesthetic%2C%20no%20text%20no%20branding&width=400&height=500&seq=pkg-003-metallic&orientation=portrait",
    description: "زجاجة معدنية بيضاوية بتصميم عصري بسيط، خفيفة ومناسبة للسفر",
  },
  {
    id: "pkg-004",
    name: "زجاجية دائرية",
    nameEn: "Round Glass",
    type: "زجاجية",
    shape: "دائري",
    size: "50 مل",
    image: "https://readdy.ai/api/search-image?query=round%20spherical%20clear%20glass%20perfume%20bottle%20with%20short%20silver%20neck%20and%20cap%2C%20thick%20heavy%20glass%20base%2C%20elegant%20minimal%20design%2C%20soft%20studio%20lighting%20on%20white%20background%2C%20premium%20product%20photography%2C%20delicate%20feminine%20aesthetic%2C%20no%20text%20no%20logos&width=400&height=500&seq=pkg-004-round&orientation=portrait",
    description: "زجاجة دائرية كروية بغطاء فضي، تصميم أنيق يناسب العطور النسائية",
  },
  {
    id: "pkg-005",
    name: "كريستال طويل",
    nameEn: "Tall Crystal",
    type: "كريستال",
    shape: "أسطواني",
    size: "100 مل",
    image: "https://readdy.ai/api/search-image?query=tall%20slender%20crystal%20perfume%20bottle%20with%20elongated%20elegant%20neck%2C%20gold%20metallic%20accents%2C%20transparent%20glass%20with%20warm%20amber%20fragrance%20visible%20inside%2C%20luxury%20product%20photography%20on%20white%20background%2C%20sophisticated%20refined%20design%2C%20no%20text%20no%20branding&width=400&height=500&seq=pkg-005-tall&orientation=portrait",
    description: "زجاجة كريستال طويلة ونحيفة برقبة ممدودة، تصميم راقٍ للعطور الفاخرة",
  },
  {
    id: "pkg-006",
    name: "معدنية مربعة",
    nameEn: "Square Metal",
    type: "معدنية",
    shape: "مربع",
    size: "100 مل",
    image: "https://readdy.ai/api/search-image?query=matte%20black%20square%20metal%20perfume%20bottle%20with%20brushed%20gunmetal%20cap%2C%20industrial%20luxury%20design%2C%20sharp%20clean%20edges%2C%20premium%20minimalist%20packaging%2C%20studio%20lighting%20on%20white%20background%2C%20masculine%20bold%20aesthetic%2C%20no%20text%20no%20logos&width=400&height=500&seq=pkg-006-metal-square&orientation=portrait",
    description: "زجاجة معدنية مربعة سوداء غير لامعة، تصميم جريء يناسب العطور الرجالية",
  },
  {
    id: "pkg-007",
    name: "زجاجية بيضاوية",
    nameEn: "Oval Glass",
    type: "زجاجية",
    shape: "بيضاوي",
    size: "50 مل",
    image: "https://readdy.ai/api/search-image?query=oval%20shaped%20frosted%20glass%20perfume%20bottle%20with%20wooden%20cap%2C%20natural%20organic%20design%2C%20soft%20curves%2C%20eco%20friendly%20aesthetic%2C%20warm%20studio%20lighting%20on%20white%20background%2C%20artisanal%20craft%20feel%2C%20no%20text%20no%20branding&width=400&height=500&seq=pkg-007-oval&orientation=portrait",
    description: "زجاجة زجاجية بيضاوية بلوري مع غطاء خشبي، تصميم طبيعي صديق للبيئة",
  },
  {
    id: "pkg-008",
    name: "كريستال دائري",
    nameEn: "Round Crystal",
    type: "كريستال",
    shape: "دائري",
    size: "30 مل",
    image: "https://readdy.ai/api/search-image?query=small%20round%20crystal%20perfume%20bottle%20like%20a%20precious%20gemstone%2C%20faceted%20surface%20catching%20light%2C%20tiny%20gold%20cap%2C%20delicate%20miniature%20size%2C%20jewelry%20like%20luxury%20packaging%2C%20bright%20studio%20lighting%20on%20white%20background%2C%20exquisite%20detail%2C%20no%20text&width=400&height=500&seq=pkg-008-round-crystal&orientation=portrait",
    description: "زجاجة كريستال دائرية صغيرة كالجوهرة، مثالية للعطور المركزة والهدايا",
  },
  {
    id: "pkg-009",
    name: "معدنية أسطوانية",
    nameEn: "Cylinder Metal",
    type: "معدنية",
    shape: "أسطواني",
    size: "100 مل",
    image: "https://readdy.ai/api/search-image?query=cylindrical%20polished%20brass%20metal%20perfume%20bottle%20with%20vintage%20art%20deco%20pattern%20engraving%2C%20warm%20metallic%20glow%2C%20retro%20luxury%20design%2C%20rich%20golden%20reflections%2C%20studio%20lighting%20on%20white%20background%2C%20collectors%20edition%20feel%2C%20no%20text&width=400&height=500&seq=pkg-009-cylinder&orientation=portrait",
    description: "زجاجة معدنية أسطوانية بنقوش آرت ديكو، تصميم عتيق فاخر لهواة الجمع",
  },
  {
    id: "pkg-010",
    name: "زجاجية صغيرة",
    nameEn: "Mini Glass",
    type: "زجاجية",
    shape: "دائري",
    size: "30 مل",
    image: "https://readdy.ai/api/search-image?query=small%20cute%20round%20glass%20perfume%20bottle%20miniature%20size%20with%20simple%20silver%20cap%2C%20delicate%20compact%20design%2C%20travel%20friendly%2C%20soft%20studio%20lighting%20on%20white%20background%2C%20elegant%20simplicity%2C%20sample%20size%20luxury%20packaging%2C%20no%20text%20no%20logos&width=400&height=500&seq=pkg-010-mini&orientation=portrait",
    description: "زجاجة زجاجية صغيرة الحجم، مثالية للعينات والسفر، تصميم بسيط وأنيق",
  },
  {
    id: "pkg-011",
    name: "معدنية بيضاوية",
    nameEn: "Oval Metal",
    type: "معدنية",
    shape: "بيضاوي",
    size: "50 مل",
    image: "https://readdy.ai/api/search-image?query=smooth%20oval%20copper%20toned%20metal%20perfume%20bottle%20with%20hammered%20texture%20finish%2C%20artisan%20handcrafted%20look%2C%20warm%20earthy%20metallic%20colors%2C%20unique%20organic%20shape%2C%20studio%20lighting%20on%20white%20background%2C%20boutique%20niche%20fragrance%20packaging%2C%20no%20text&width=400&height=500&seq=pkg-011-oval-metal&orientation=portrait",
    description: "زجاجة معدنية بيضاوية بملمس يدوي مطروق، تصميم حرفي فريد للعطور المتخصصة",
  },
  {
    id: "pkg-012",
    name: "كريستال مربع",
    nameEn: "Square Crystal",
    type: "كريستال",
    shape: "مربع",
    size: "50 مل",
    image: "https://readdy.ai/api/search-image?query=square%20crystal%20perfume%20bottle%20with%20thick%20heavy%20glass%20base%20and%20minimal%20platinum%20cap%2C%20architectural%20geometric%20design%2C%20sharp%20precise%20angles%2C%20luxury%20niche%20fragrance%20packaging%2C%20premium%20studio%20lighting%20on%20white%20background%2C%20sculptural%20art%20piece%20feel%2C%20no%20text&width=400&height=500&seq=pkg-012-square-crystal&orientation=portrait",
    description: "زجاجة كريستال مربعة بقاعدة زجاجية ثقيلة، تصميم معماري هندسي فاخر",
  },
];

export const filterCategories = [
  {
    key: "type",
    label: "نوع العبوة",
    options: ["الكل", "زجاجية", "معدنية", "كريستال"],
  },
  {
    key: "shape",
    label: "الشكل",
    options: ["الكل", "أسطواني", "دائري", "مربع", "بيضاوي"],
  },
  {
    key: "size",
    label: "الحجم",
    options: ["الكل", "30 مل", "50 مل", "100 مل"],
  },
];