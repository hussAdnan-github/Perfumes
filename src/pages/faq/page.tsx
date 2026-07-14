import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";
import ConsultationModal from "@/components/feature/ConsultationModal";

const faqs = [
  {
    question: "كم تستغرق عملية إنشاء براند عطور كامل؟",
    answer: "تستغرق عملية إنشاء براند عطور كامل من 3 إلى 6 أشهر حسب تعقيد المشروع. تشمل هذه المدة: استراتيجية البراند، تطوير العطر (مع العينات)، الهوية البصرية، تصميم العبوة، والتصنيع. يمكن تسريع بعض المراحل بناءً على احتياجاتك.",
  },
  {
    question: "هل يمكنني البدء بميزانية محدودة؟",
    answer: "نعم! المنصة توفر مسارات متعددة تناسب مختلف الميزانيات. يمكنك البدء بتطوير عطر فقط أو تصميم هوية بصرية، ثم التوسع لاحقاً. نقدم أيضاً خيارات تمويل مرنة للمشاريع الكبيرة.",
  },
  {
    question: "كيف يعمل نظام Smart Onboarding؟",
    answer: "Smart Onboarding هو مساعد ذكي يسألك 6 أسئلة أساسية لفهم احتياجاتك. بناءً على إجاباتك، يحدد النظام: نوع المشروع الأنسب، درجة جاهزيتك، الفريق المطلوب، والمراحل اللازمة. يستغرق الأمر أقل من 5 دقائق.",
  },
  {
    question: "هل أحتاج خبرة سابقة في العطور؟",
    answer: "لا تحتاج أي خبرة سابقة! فريقنا من خبراء العطور والتسويق سيرشدك في كل مرحلة. Smart Onboarding يساعدك في توضيح رؤيتك، والـ Workspace يبقيك على اطلاع دائم بكل تفاصيل مشروعك.",
  },
  {
    question: "ما هي سياسة العينات والتعديلات؟",
    answer: "نقدم عادةً 3 نسخ من العطر للتقييم. يمكنك طلب تعديلات على النسخ حتى الوصول للتركيبة المثالية. التعديلات ضمن النطاق المتفق عليه مشمولة في العقد، والتعديلات الكبيرة قد تتطلب تكلفة إضافية.",
  },
  {
    question: "هل تقدمون خدمات التصنيع والتوزيع؟",
    answer: "نعم، نقدم خدمات التصنيع من خلال شركائنا المعتمدين. يمكننا أيضاً مساعدتك في: إدارة المخزون، التغليف والشحن، والاستشارات التسويقية. ندعمك من الفكرة حتى وصول منتجك للعميل النهائي.",
  },
  {
    question: "كيف أتابع تقدم مشروعي؟",
    answer: "من خلال الـ Workspace الخاص بك، يمكنك متابعة كل مرحلة في الوقت الفعلي. ستجد: التحديثات اليومية، الملفات المرفقة، رسائل الفريق، طلبات الاعتماد، والجدول الزمني. كما تصلك إشعارات فورية بكل تحديث مهم.",
  },
  {
    question: "هل يمكنني تسجيل براندي رسمياً؟",
    answer: "نعم، نقدم خدمات استشارية في تسجيل العلامات التجارية والبراءات. نرشدك في إجراءات التسجيل المحلي والدولي، ونساعدك في حماية حقوق ملكيتك الفكرية.",
  },
];

const popularQuestions = [
  { icon: "ri-timer-line", text: "كم تستغرق عملية إنشاء براند عطور كامل؟" },
  { icon: "ri-money-dollar-circle-line", text: "هل يمكنني البدء بميزانية محدودة؟" },
  { icon: "ri-lightbulb-line", text: "كيف يعمل نظام Smart Onboarding؟" },
  { icon: "ri-flask-line", text: "ما هي سياسة العينات والتعديلات؟" },
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

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const hero = useVisible(0.1);
  const quickRef = useVisible(0.1);
  const listRef = useVisible(0.05);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white to-stone-100/20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-amber-200/8 blur-[120px]"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-stone-300/6 blur-[100px]"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className={`text-center transition-all duration-700 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <i className="ri-question-answer-line"></i>
              الأسئلة الشائعة
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-5 leading-tight">
              كل ما تريد
              <br />
              <span className="text-amber-700">معرفته</span>
            </h1>
            <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto">
              إجابات على الأسئلة الأكثر شيوعاً حول المنصة وعملية إنشاء البراند العطري
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-10 bg-white border-y border-stone-100" ref={quickRef.ref}>
        <div className="max-w-4xl mx-auto px-6">
          <div className={`transition-all duration-700 ${quickRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h3 className="text-sm font-black text-stone-700 mb-5 text-center">
              <i className="ri-flashlight-line text-amber-500 ml-1"></i>
              الأسئلة الأكثر بحثاً
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {popularQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const foundIndex = faqs.findIndex((f) => f.question === q.text);
                    if (foundIndex !== -1) {
                      setOpenIndex(foundIndex);
                      const el = document.getElementById("faq-list");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-stone-50 hover:bg-amber-50 border border-stone-100 hover:border-amber-200 text-stone-600 hover:text-amber-700 text-sm font-medium px-4 py-2.5 rounded-full cursor-pointer transition-all whitespace-nowrap"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-amber-100 rounded-full">
                    <i className={`${q.icon} text-amber-700 text-xs`}></i>
                  </div>
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section id="faq-list" className="py-16 md:py-20 bg-stone-50" ref={listRef.ref}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                  listRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${
                  openIndex === index
                    ? "bg-white border border-amber-200 shadow-sm"
                    : "bg-white/60 border border-stone-100 hover:border-stone-200 hover:bg-white"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-right cursor-pointer gap-4"
                >
                  <span className={`font-bold text-sm md:text-base transition-colors duration-300 ${
                    openIndex === index ? "text-amber-700" : "text-stone-700"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${
                    openIndex === index
                      ? "bg-amber-100 text-amber-700"
                      : "bg-stone-100 text-stone-400"
                  }`}>
                    <i className={`ri-${openIndex === index ? "subtract" : "add"}-line text-sm transition-transform duration-300`}></i>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <div className="h-px w-full bg-amber-100 mb-4"></div>
                    <p className="text-stone-500 text-sm leading-relaxed font-light">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {faqs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
                <i className="ri-question-line text-stone-400 text-2xl"></i>
              </div>
              <p className="text-stone-500 text-sm">لا توجد أسئلة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-amber-500/15 rounded-2xl mx-auto mb-5">
            <i className="ri-customer-service-2-line text-amber-400 text-xl"></i>
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
            لم تجد إجابتك؟
          </h2>
          <p className="text-stone-400 text-sm md:text-base max-w-lg mx-auto mb-8 font-light leading-relaxed">
            فريق الدعم جاهز للإجابة على كل استفساراتك — تواصل معنا وسنرد في أقرب وقت
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowConsultModal(true)}
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
            >
              <i className="ri-customer-service-2-line"></i>
              تواصل مع فريق الدعم
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm border border-white/20"
            >
              <i className="ri-mail-send-line"></i>
              صفحة التواصل
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Page Navigation */}
      <div className="bg-white border-t border-stone-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/portfolio"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-right-line text-xl group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-light">الصفحة السابقة</div>
              <div className="text-sm font-bold">نماذج من الأعمال</div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { label: "الرئيسية", path: "/" },
              { label: "عنا", path: "/about" },
              { label: "الخدمات", path: "/services" },
              { label: "نماذج الأعمال", path: "/portfolio" },
              { label: "الأسئلة", path: "/faq", active: true },
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
            to="/contact"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-light">الصفحة التالية</div>
              <div className="text-sm font-bold">تواصل معنا</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-left-line text-xl group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </Link>
        </div>
      </div>

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        title="تواصل مع فريق الدعم"
        subtitle="أرسل استفسارك وسنرد عليك في أقرب وقت ممكن"
        formUrl="https://readdy.ai/api/form/d94lp2dmi650so75e50g"
      />
      <FooterSection />
    </div>
  );
};

export default FAQPage;