import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";

const CONTACT_FORM_URL = "https://readdy.ai/api/form/d980tsfk7gok24d49v30";

const contactInfo = [
  {
    icon: "ri-phone-line",
    title: "اتصل بنا",
    lines: ["+966 12 345 6789", "+966 50 123 4567"],
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: "ri-mail-line",
    title: "البريد الإلكتروني",
    lines: ["info@alfajr-perfume.com", "support@alfajr-perfume.com"],
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: "ri-map-pin-line",
    title: "موقعنا",
    lines: ["الرياض، المملكة العربية السعودية", "حي العليا، طريق الملك فهد"],
    color: "bg-rose-100 text-rose-700",
  },
];

const socialLinks = [
  { icon: "ri-instagram-line", href: "#", label: "Instagram" },
  { icon: "ri-youtube-line", href: "#", label: "YouTube" },
  { icon: "ri-twitter-x-line", href: "#", label: "Twitter" },
  { icon: "ri-linkedin-line", href: "#", label: "LinkedIn" },
  { icon: "ri-tiktok-line", href: "#", label: "TikTok" },
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

const ContactPage = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const hero = useVisible(0.1);
  const infoRef = useVisible(0.1);
  const formSection = useVisible(0.1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypotField = formData.get("phone_alt");
    if (honeypotField && String(honeypotField).trim() !== "") {
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(CONTACT_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      const responseText = await response.text();
      let serverMsg = "";
      try {
        const parsed = JSON.parse(responseText);
        serverMsg = parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText;
      } catch {
        serverMsg = responseText;
      }

      if (response.ok) {
        let code = "";
        try { const parsed = JSON.parse(responseText); code = parsed?.code || ""; } catch { /* */ }
        if (code === "OK") {
          setStatus("success");
          form.reset();
          setTimeout(() => setStatus("idle"), 3000);
          return;
        }
      }

      if (serverMsg && (String(serverMsg).toLowerCase().includes("spam") || String(serverMsg).includes("form data is spam"))) {
        setErrorMessage("عذراً، تعذر الإرسال. يرجى المحاولة مرة أخرى.");
      } else if (serverMsg) {
        setErrorMessage(serverMsg);
      } else {
        setErrorMessage("حدث خطأ، يرجى المحاولة لاحقاً.");
      }
      setStatus("error");
    } catch {
      setErrorMessage("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white to-stone-100/20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-200/8 blur-[120px]"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-stone-300/6 blur-[100px]"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className={`text-center transition-all duration-700 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <i className="ri-mail-send-line"></i>
              تواصل معنا
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-5 leading-tight">
              دعنا نسمع
              <br />
              <span className="text-amber-700">منك</span>
            </h1>
            <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto">
              سواء كان لديك استفسار، فكرة مشروع، أو تريد فقط أن تقول مرحباً — نحن هنا دائماً
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-y border-stone-100" ref={infoRef.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 transition-all duration-700 ${infoRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-amber-200 hover:bg-white transition-all duration-300 group">
                <div className={`w-12 h-12 flex items-center justify-center ${info.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${info.icon} text-lg`}></i>
                </div>
                <h3 className="font-black text-stone-900 text-sm mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-stone-500 text-xs leading-relaxed font-light">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 bg-stone-50" ref={formSection.ref}>
        <div className={`max-w-2xl mx-auto px-6 transition-all duration-700 ${formSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-100">
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-2xl mx-auto mb-4">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-stone-900 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-stone-500 text-sm font-light">شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} data-readdy-form="">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-first-name" className="block text-stone-700 text-xs font-bold mb-1.5">الاسم الأول *</label>
                    <input
                      id="contact-first-name"
                      type="text"
                      name="firstName"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="الاسم الأول"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-last-name" className="block text-stone-700 text-xs font-bold mb-1.5">الاسم الأخير *</label>
                    <input
                      id="contact-last-name"
                      type="text"
                      name="lastName"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="الاسم الأخير"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-stone-700 text-xs font-bold mb-1.5">البريد الإلكتروني *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-stone-700 text-xs font-bold mb-1.5">رقم الهاتف</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="+966 5xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact-subject" className="block text-stone-700 text-xs font-bold mb-1.5">الموضوع *</label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="استفسار عام">استفسار عام</option>
                      <option value="مشروع جديد">مشروع جديد</option>
                      <option value="دعم فني">دعم فني</option>
                      <option value="شراكة">شراكة</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <i className="ri-arrow-down-s-line text-stone-400"></i>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="contact-message" className="block text-stone-700 text-xs font-bold mb-1.5">الرسالة *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={500}
                    rows={5}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                  <p className="text-stone-400 text-[10px] mt-1 text-left">الحد الأقصى 500 حرف</p>
                </div>

                {/* Honeypot */}
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <input
                    type="text"
                    name="phone_alt"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    readOnly
                  />
                </div>

                {status === "error" && errorMessage && (
                  <p className="text-red-500 text-xs mb-3">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i>
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-10 text-center">
            <p className="text-stone-400 text-xs font-medium mb-4">أو تابعنا على منصات التواصل</p>
            <div className="flex items-center justify-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  rel="nofollow"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-stone-100 hover:bg-amber-50 hover:border-amber-200 text-stone-400 hover:text-amber-700 rounded-xl transition-all cursor-pointer"
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-stone-400 text-sm max-w-md mx-auto mb-7 font-light leading-relaxed">
            تواصل معنا اليوم ودعنا نحول فكرتك إلى براند عطري ناجح
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm group"
            >
              <i className="ri-rocket-2-line"></i>
              ابدأ مشروعك الآن
              <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm border border-white/20"
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
            to="/faq"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 rounded-full transition-colors">
              <i className="ri-arrow-right-line text-xl group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-light">الصفحة السابقة</div>
              <div className="text-sm font-bold">الأسئلة والاستفسارات</div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { label: "الرئيسية", path: "/" },
              { label: "عنا", path: "/about" },
              { label: "الخدمات", path: "/services" },
              { label: "نماذج الأعمال", path: "/portfolio" },
              { label: "الأسئلة", path: "/faq" },
              { label: "تواصل معنا", path: "/contact", active: true },
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
            to="/"
            className="group flex items-center gap-3 text-stone-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-light">الصفحة التالية</div>
              <div className="text-sm font-bold">الرئيسية</div>
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

export default ContactPage;