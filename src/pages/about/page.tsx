import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";

const stats = [
  { num: "200+", label: "مشروع منجز", icon: "ri-briefcase-4-line" },
  { num: "50+", label: "براند تم إطلاقه", icon: "ri-rocket-2-line" },
  { num: "98%", label: "نسبة رضا العملاء", icon: "ri-emotion-happy-line" },
  { num: "15+", label: "عاماً من الخبرة", icon: "ri-calendar-check-line" },
  { num: "30+", label: "خبير ومتخصص", icon: "ri-user-star-line" },
  { num: "12", label: "دولة نخدمها", icon: "ri-global-line" },
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
    desc: "لسنا مجرد منفذين، بل شركاء حقيقيون في رحلة بناء براندك — نستمع ونتفهم وننفذ بروح الفريق.",
  },
];

const team = [
  { name: "خالد العمري", role: "مؤسس ومدير تنفيذي", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20confident%20middle-eastern%20businessman%20in%20elegant%20dark%20suit%2C%20warm%20studio%20lighting%2C%20soft%20neutral%20background%2C%20sophisticated%20executive%20portrait%20photography%2C%20high%20quality%20corporate%20headshot&width=300&height=300&seq=team-khaled&orientation=squarish" },
  { name: "سارة الشمري", role: "خبيرة عطور رئيسية", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20confident%20middle-eastern%20woman%20perfumer%20in%20elegant%20white%20lab%20coat%2C%20warm%20studio%20lighting%2C%20soft%20neutral%20background%2C%20sophisticated%20portrait%20photography%2C%20high%20quality%20corporate%20headshot&width=300&height=300&seq=team-sarah&orientation=squarish" },
  { name: "عمر الراشد", role: "مدير التصميم", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20creative%20middle-eastern%20male%20designer%20with%20stylish%20glasses%2C%20warm%20studio%20lighting%2C%20soft%20neutral%20background%2C%20sophisticated%20portrait%20photography%2C%20high%20quality%20corporate%20headshot&width=300&height=300&seq=team-omar&orientation=squarish" },
  { name: "نورة الحربي", role: "مديرة العلاقات", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20confident%20middle-eastern%20businesswoman%20with%20warm%20smile%2C%20elegant%20attire%2C%20warm%20studio%20lighting%2C%20soft%20neutral%20background%2C%20sophisticated%20portrait%20photography%2C%20high%20quality%20corporate%20headshot&width=300&height=300&seq=team-nora&orientation=squarish" },
];

const milestones = [
  { year: "2010", title: "البداية", desc: "انطلقت رؤيتنا من ورشة عطور صغيرة في قلب الرياض" },
  { year: "2015", title: "التوسع", desc: "أطلقنا أول منصة رقمية لتصميم العبوات العطرية" },
  { year: "2019", title: "الشراكات", desc: "تعاونا مع أكبر 10 دور عطور عالمية في المنطقة" },
  { year: "2023", title: "المنصة", desc: "أطلقنا المنصة المتكاملة لبناء البراندات العطرية" },
  { year: "2026", title: "المستقبل", desc: "نطمح لنكون الشريك الأول لكل باحث عن براند عطري ناجح" },
];

const useVisible = (threshold = 0.15) => {
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

const AboutPage = () => {
  const hero = useVisible(0.1);
  const story = useVisible(0.1);
  const valuesRef = useVisible(0.1);
  const teamRef = useVisible(0.1);
  const timeline = useVisible(0.1);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-stone-100/30"></div>
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-200/10 blur-[120px]"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-stone-300/10 blur-[100px]"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className={`transition-all duration-700 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                <i className="ri-building-2-line"></i>
                عن المنصة
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 leading-tight">
                نبني البراندات العطرية
                <br />
                <span className="text-amber-700">من الفكرة إلى الإطلاق</span>
              </h1>
              <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                المنصة الأولى المتخصصة في إنشاء البراندات العطرية الاحترافية — نجمع بين الخبرة العميقة في صناعة العطور وأحدث التقنيات الرقمية لتقديم تجربة متكاملة وفريدة
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
                >
                  <i className="ri-user-add-line"></i>
                  انضم إلينا
                  <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm border border-stone-200"
                >
                  <i className="ri-stack-line"></i>
                  اكتشف خدماتنا
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-2xl mx-auto mb-3 group-hover:bg-amber-100 transition-colors">
                  <i className={`${stat.icon} text-amber-700 text-lg`}></i>
                </div>
                <div className="text-2xl md:text-3xl font-black text-stone-900 mb-1">{stat.num}</div>
                <div className="text-stone-400 text-xs font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28 bg-stone-50 overflow-hidden" ref={story.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${story.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                <i className="ri-book-open-line"></i>
                قصتنا
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6 leading-tight">
                شغف عميق بصناعة العطور
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-4 font-light">
                بدأت رحلتنا من شغف عميق بعالم العطور وإيمان راسخ بأن كل براند عطري يستحق أن يروي قصته بأجمل صورة. جمعنا فريقاً من أمهر خبراء العطور والمصممين والمهندسين في منصة واحدة.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed mb-4 font-light">
                نؤمن بأن بناء براند عطري ناجح يتطلب أكثر من مجرد تركيبة جميلة — إنه مزيج فريد من الإبداع والاستراتيجية والتنفيذ الدقيق.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed font-light">
                اليوم، نفخر بكوننا الشريك الموثوق لأكثر من 200 مشروع عطري ناجح، ونسعى دوماً لتطوير أدواتنا وخدماتنا.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
                  <i className="ri-check-double-line text-amber-600"></i>
                  تركيبات حصرية
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
                  <i className="ri-check-double-line text-amber-600"></i>
                  تصنيع دقيق
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
                  <i className="ri-check-double-line text-amber-600"></i>
                  تغليف فاخر
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Elegant%20professional%20arabian%20perfume%20atelier%20workshop%20interior%20with%20warm%20amber%20golden%20lighting%2C%20skilled%20artisans%20and%20perfumers%20working%20with%20essential%20oils%20and%20glass%20bottles%2C%20sophisticated%20creative%20laboratory%20environment%20with%20brass%20and%20marble%20details%2C%20editorial%20photography%20style%2C%20soft%20natural%20light%2C%20warm%20neutral%20tones&width=800&height=600&seq=about-story-main&orientation=landscape"
                  alt="ورشة العطور"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-white" ref={valuesRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-14 transition-all duration-700 ${valuesRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              <i className="ri-shield-star-line"></i>
              قيمنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
              المبادئ التي نلتزم بها
            </h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              ثوابت لا تتغير تُوجه كل قرار نتخذه وكل مشروع ننفذه
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-100 ${valuesRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {values.map((v) => (
              <div key={v.title} className="bg-stone-50 rounded-2xl p-6 text-center group hover:bg-white hover:border-amber-200 border border-transparent transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 flex items-center justify-center bg-amber-100 rounded-2xl mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <i className={`${v.icon} text-amber-700 text-xl`}></i>
                </div>
                <h4 className="font-black text-stone-900 text-sm mb-3">{v.title}</h4>
                <p className="text-stone-400 text-xs leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-stone-50 overflow-hidden" ref={timeline.ref}>
        <div className="max-w-5xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${timeline.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              <i className="ri-time-line"></i>
              رحلتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
              محطات في رحلة النجاح
            </h2>
          </div>
          <div className="relative">
            {/* Desktop line */}
            <div className="hidden md:block absolute top-8 right-1/2 w-px h-[calc(100%-2rem)] bg-stone-200"></div>
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 last:mb-0 transition-all duration-700 ${timeline.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Year bubble */}
                <div className={`md:w-1/2 flex ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"} order-1 ${i % 2 === 0 ? "" : "md:order-2"}`}>
                  <div className="flex items-center gap-4">
                    {i % 2 === 0 ? (
                      <>
                        <div className="hidden md:flex w-12 h-12 items-center justify-center bg-amber-700 text-white font-black rounded-full text-sm border-4 border-white shadow-lg z-10">
                          {m.year}
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-stone-100 max-w-sm">
                          <h4 className="font-black text-stone-900 text-sm mb-1">{m.title}</h4>
                          <p className="text-stone-400 text-xs leading-relaxed font-light">{m.desc}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-white rounded-2xl p-5 border border-stone-100 max-w-sm text-left md:text-right">
                          <h4 className="font-black text-stone-900 text-sm mb-1">{m.title}</h4>
                          <p className="text-stone-400 text-xs leading-relaxed font-light">{m.desc}</p>
                        </div>
                        <div className="hidden md:flex w-12 h-12 items-center justify-center bg-amber-700 text-white font-black rounded-full text-sm border-4 border-white shadow-lg z-10">
                          {m.year}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Empty half */}
                <div className="hidden md:block md:w-1/2 order-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 bg-white" ref={teamRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-14 transition-all duration-700 ${teamRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              <i className="ri-user-3-line"></i>
              فريقنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
              خبراء يقودون الرؤية
            </h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              فريق متنوع من الكفاءات يجمع بين الخبرة العميقة والشغف بالتفاصيل
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-100 ${teamRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {team.map((t) => (
              <div key={t.name} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-stone-100">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{t.name}</h4>
                <p className="text-stone-400 text-xs font-light">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight">
            جاهز تبني براندك العطري؟
          </h2>
          <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto mb-10 font-light leading-relaxed">
            انضم إلى مئات العملاء الذين وثقوا بنا في رحلتهم — من الفكرة الأولى حتى لحظة الإطلاق.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
            >
              <i className="ri-rocket-2-line"></i>
              ابدأ مشروعك الآن
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm border border-white/20"
            >
              <i className="ri-stack-line"></i>
              تصفح خدماتنا
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Page Navigation */}
      <div className="bg-white border-t border-stone-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-right-line text-xl group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-light">الصفحة السابقة</div>
              <div className="text-sm font-bold">الرئيسية</div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { label: "الرئيسية", path: "/" },
              { label: "عنا", path: "/about", active: true },
              { label: "الخدمات", path: "/services" },
              { label: "نماذج الأعمال", path: "/portfolio" },
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
            to="/services"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-light">الصفحة التالية</div>
              <div className="text-sm font-bold">الخدمات</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-left-line text-xl group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </Link>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default AboutPage;