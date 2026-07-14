import { useState } from "react";
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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showConsultModal, setShowConsultModal] = useState(false);

  return (
    <section id="faq" className="relative bg-stone-950 py-24 md:py-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-600/3 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-600/3 blur-[100px]"></div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-amber-500/30"></div>
            <span className="text-amber-400/60 text-xs font-light tracking-[0.25em] uppercase">
              الأسئلة الشائعة
            </span>
            <div className="h-px w-10 bg-amber-500/30"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            كل ما تريد
            <br />
            <span className="text-amber-400">معرفته</span>
          </h2>
          <p className="text-white/30 text-sm md:text-base max-w-md mx-auto leading-relaxed font-light">
            إجابات على أكثر الأسئلة شيوعاً حول المنصة وعملية إنشاء البراند العطري
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                openIndex === index
                  ? "bg-stone-900/80 border border-amber-500/15"
                  : "bg-stone-900/30 border border-white/5 hover:border-white/10 hover:bg-stone-900/50"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right cursor-pointer gap-4"
              >
                <span className={`font-bold text-sm transition-colors duration-300 ${
                  openIndex === index ? "text-amber-300" : "text-white/80"
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-500 ${
                  openIndex === index
                    ? "bg-amber-500/15 text-amber-400 rotate-0"
                    : "bg-white/5 text-white/40"
                }`}>
                  <i className={`ri-${openIndex === index ? "arrow-up-s" : "arrow-down-s"}-line transition-transform duration-300`}></i>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="h-px w-full bg-amber-500/10 mb-4"></div>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-14 text-center">
          <p className="text-white/25 text-sm mb-5 font-light">لم تجد إجابة على سؤالك؟</p>
          <button
            onClick={() => setShowConsultModal(true)}
            className="group inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all duration-500 text-sm"
          >
            <i className="ri-customer-service-2-line"></i>
            تواصل مع فريق الدعم
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"></i>
          </button>
        </div>
      </div>

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        title="تواصل مع فريق الدعم"
        subtitle="أرسل استفسارك وسنرد عليك في أقرب وقت ممكن"
        formUrl="https://readdy.ai/api/form/d94lp2dmi650so75e50g"
      />
    </section>
  );
};

export default FAQSection;