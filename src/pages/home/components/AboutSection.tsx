import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const stats = [
  { num: "+200", label: "مشروع منجز" },
  { num: "+50", label: "براند تم إطلاقه" },
  { num: "98%", label: "نسبة رضا العملاء" },
  { num: "+15", label: "عاماً من الخبرة" },
];

const values = [
  {
    icon: "ri-award-line",
    title: "الجودة أولاً",
    desc: "نلتزم بأعلى معايير الجودة في كل مرحلة — من اختيار المكونات الخام حتى التسليم النهائي.",
  },
  {
    icon: "ri-lightbulb-flash-line",
    title: "الإبداع والابتكار",
    desc: "نبتكر تركيبات فريدة وتصاميم مبتكرة تجعل براندك يتميز في سوق العطور التنافسي.",
  },
  {
    icon: "ri-hand-heart-line",
    title: "الشفافية والنزاهة",
    desc: "نؤمن بالوضوح التام في التعامل — أسعار واضحة، جداول زمنية دقيقة، وتواصل مستمر.",
  },
  {
    icon: "ri-team-line",
    title: "شراكة حقيقية",
    desc: "لسنا مجرد منفذين، بل شركاء حقيقيون في رحلة بناء براندك — نستمع ونتفهم وننفذ بروح الفريق الواحد.",
  },
];

const AboutSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative bg-stone-50 py-24 md:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle at 70% 30%, #b45309 1px, transparent 1px), radial-gradient(circle at 30% 70%, #b45309 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}></div>
      <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-amber-500/3 blur-[100px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <i className="ri-building-2-line"></i>
            عن المنصة
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
            من نحن؟
          </h2>
          <p className="text-stone-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
            منصة احترافية متخصصة في بناء البراندات العطرية — نجمع بين الخبرة العميقة في صناعة العطور وأحدث التقنيات الرقمية لتقديم تجربة متكاملة وفريدة لعملائنا
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center border border-stone-100">
              <div className="text-3xl font-black text-amber-700 mb-1">{stat.num}</div>
              <div className="text-stone-400 text-sm font-light">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-black text-stone-900 mb-5">
              قصتنا
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4 font-light">
              بدأت رحلتنا من شغف عميق بصناعة العطور وإيمان راسخ بأن كل براند عطري يستحق أن يروى قصته بأجمل صورة. جمعنا فريقاً من أمهر خبراء العطور والمصممين والمهندسين في منصة واحدة لتقديم تجربة شاملة ومتكاملة.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed mb-4 font-light">
              نؤمن بأن بناء براند عطري ناجح يتطلب أكثر من مجرد تركيبة جميلة — إنه مزيج فريد من الإبداع والاستراتيجية والتنفيذ الدقيق. لهذا صممنا منصتنا لتغطي كل جانب من جوانب هذه الرحلة: من الفكرة الأولية حتى لحظة الإطلاق.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              اليوم، نفخر بكوننا الشريك الموثوق لأكثر من 200 مشروع عطري ناجح، ونسعى دوماً لتطوير أدواتنا وخدماتنا لنمنح عملائنا تجربة لا تُضاهى.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=elegant%20professional%20arabian%20perfume%20atelier%20workshop%20with%20warm%20amber%20lighting%2C%20skilled%20artisans%20crafting%20luxury%20fragrances%2C%20shelves%20filled%20with%20essential%20oils%20and%20ingredients%2C%20sophisticated%20creative%20studio%20environment%2C%20refined%20artistic%20atmosphere%20with%20golden%20tones%2C%20editorial%20photography%20style%2C%20soft%20natural%20light%20through%20windows&width=800&height=600&seq=about-story-01&orientation=landscape"
                alt="منصتنا"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="text-2xl font-black text-stone-900 mb-10 text-center">
            قيمنا
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-stone-100 text-center group hover:border-amber-200 transition-all duration-300">
                <div className="w-14 h-14 flex items-center justify-center bg-amber-100 rounded-2xl mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <i className={`${v.icon} text-amber-700 text-xl`}></i>
                </div>
                <h4 className="font-black text-stone-900 text-sm mb-2">{v.title}</h4>
                <p className="text-stone-400 text-xs leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
          >
            <i className="ri-user-add-line"></i>
            انضم إلينا وابدأ رحلتك
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;