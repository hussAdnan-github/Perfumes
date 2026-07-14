import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const serviceTags = [
  { text: "براند عطور كامل", icon: "ri-award-fill" },
  { text: "تطوير تركيبة", icon: "ri-flask-fill" },
  { text: "عبوة وتغليف", icon: "ri-gift-fill" },
  { text: "هوية بصرية", icon: "ri-palette-fill" },
  { text: "تصنيع", icon: "ri-settings-fill" },
  { text: "طباعة وتنفيذ", icon: "ri-printer-fill" },
];

const stats = [
  { num: "+200", label: "مشروع منجز" },
  { num: "+50", label: "براند تم إطلاقه" },
  { num: "98%", label: "نسبة رضا العملاء" },
  { num: "20", label: "مرحلة عمل متكاملة" },
];

const ServiceHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-stone-50 overflow-hidden" dir="rtl">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "radial-gradient(circle at 30% 40%, #b45309 1px, transparent 1px), radial-gradient(circle at 70% 60%, #b45309 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}></div>

      {/* Side decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-amber-500/3 blur-[100px]"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amber-600/3 blur-[120px]"></div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-right">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <i className="ri-sparkling-2-line"></i>
              منصة إنشاء البراندات العطرية الاحترافية
            </span>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.1] mb-5">
              براندك العطري
              <br />
              <span className="bg-gradient-to-l from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                من الفكرة للإطلاق
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-500 text-sm md:text-base max-w-xl lg:max-w-none leading-relaxed mb-8 font-light">
              المنصة الأولى المتخصصة في بناء البراندات العطرية — نأخذك في رحلة متكاملة من تطوير التركيبة والهوية البصرية، مروراً بتصميم العبوة والتغليف، وصولاً إلى التصنيع والإطلاق الاحترافي.
            </p>

            {/* Service Tags */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
              {serviceTags.map((tag) => (
                <Link
                  key={tag.text}
                  to="/services"
                  className="inline-flex items-center gap-1.5 bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-stone-600 hover:text-amber-700 text-xs font-medium px-3.5 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all duration-300"
                >
                  <i className={`${tag.icon} text-[10px]`}></i>
                  {tag.text}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="group bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center gap-2"
                  >
                    <i className="ri-dashboard-line"></i>
                    لوحة التحكم
                    <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
                  </Link>
                  <Link
                    to="/services"
                    className="border border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-700 font-medium px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    تصفح الخدمات
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="group bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center gap-2"
                  >
                    ابدأ مشروعك الآن
                    <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
                  </Link>
                  <Link
                    to="/services"
                    className="border border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-700 font-medium px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    تصفح الخدمات
                  </Link>
                </>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-stone-200">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-right">
                  <div className="text-xl md:text-2xl font-black text-amber-700 mb-0.5">{stat.num}</div>
                  <div className="text-stone-400 text-xs font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="flex-1 relative">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=elegant%20luxury%20perfume%20bottle%20collection%20displayed%20on%20soft%20marble%20surface%20with%20golden%20ambient%20lighting%2C%20artistic%20arrangement%20of%20premium%20fragrance%20bottles%20in%20various%20shapes%2C%20sophisticated%20brand%20presentation%2C%20warm%20beige%20and%20amber%20tones%2C%20editorial%20product%20photography%20style%2C%20minimalist%20composition%20with%20refined%20aesthetic&width=800&height=1000&seq=service-hero-main-01&orientation=portrait"
                  alt="براند عطور فاخر"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent"></div>
              </div>

              {/* Floating Card 1 - Top Left */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                  <i className="ri-shield-check-line text-amber-700 text-lg"></i>
                </div>
                <div>
                  <div className="text-stone-900 font-black text-sm">100%</div>
                  <div className="text-stone-400 text-[10px]">تركيبة حصرية</div>
                </div>
              </div>

              {/* Floating Card 2 - Bottom Right */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 animate-float-slow-reverse">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                  <i className="ri-time-line text-amber-700 text-lg"></i>
                </div>
                <div>
                  <div className="text-stone-900 font-black text-sm">3-6</div>
                  <div className="text-stone-400 text-[10px]">أشهر للإطلاق</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default ServiceHero;