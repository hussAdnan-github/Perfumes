import { useState, useRef } from "react";

const CONTACT_FORM_URL = "https://readdy.ai/api/form/d980tsfk7gok24d49v30";

const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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
    <section id="contact" className="relative bg-stone-50 py-24 md:py-32 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-amber-500/3 blur-[120px]"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-amber-600/3 blur-[100px]"></div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <i className="ri-mail-send-line"></i>
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">
            دعنا نسمع
            <span className="text-amber-600"> منك</span>
          </h2>
          <p className="text-stone-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
            سواء كان لديك استفسار، فكرة مشروع، أو تريد فقط أن تقول مرحباً — نحن هنا دائماً
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl mb-3">
                <i className="ri-phone-line text-amber-700 text-lg"></i>
              </div>
              <h4 className="font-black text-stone-900 text-sm mb-1">اتصل بنا</h4>
              <p className="text-stone-400 text-xs font-light">+966 12 345 6789</p>
              <p className="text-stone-400 text-xs font-light">+966 50 123 4567</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl mb-3">
                <i className="ri-mail-line text-amber-700 text-lg"></i>
              </div>
              <h4 className="font-black text-stone-900 text-sm mb-1">البريد الإلكتروني</h4>
              <p className="text-stone-400 text-xs font-light">info@alfajr-perfume.com</p>
              <p className="text-stone-400 text-xs font-light">support@alfajr-perfume.com</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl mb-3">
                <i className="ri-map-pin-line text-amber-700 text-lg"></i>
              </div>
              <h4 className="font-black text-stone-900 text-sm mb-1">موقعنا</h4>
              <p className="text-stone-400 text-xs font-light">الرياض، المملكة العربية السعودية</p>
              <p className="text-stone-400 text-xs font-light">حي العليا، طريق الملك فهد</p>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100">
              <h4 className="font-black text-stone-900 text-sm mb-3">تابعنا</h4>
              <div className="flex gap-2">
                {[
                  { icon: "ri-instagram-line", href: "#" },
                  { icon: "ri-youtube-line", href: "#" },
                  { icon: "ri-twitter-x-line", href: "#" },
                  { icon: "ri-linkedin-line", href: "#" },
                  { icon: "ri-tiktok-line", href: "#" },
                ].map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    rel="nofollow"
                    className="w-9 h-9 flex items-center justify-center bg-stone-50 hover:bg-amber-100 text-stone-400 hover:text-amber-700 rounded-lg transition-all cursor-pointer"
                  >
                    <i className={`${social.icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-stone-100">
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
                  </div>

                  <div className="mb-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;