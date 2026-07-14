import { useState, useRef } from "react";

const NEWSLETTER_FORM_URL = "https://readdy.ai/api/form/d94lp2dmi650so75e500";

const FooterSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypotField = formData.get("website_alt");
    if (honeypotField && String(honeypotField).trim() !== "") {
      setNewsletterStatus("success");
      form.reset();
      setTimeout(() => setNewsletterStatus("idle"), 2500);
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterError("");

    try {
      const response = await fetch(NEWSLETTER_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
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
          setNewsletterStatus("success");
          form.reset();
          setTimeout(() => setNewsletterStatus("idle"), 3000);
          return;
        }
      }

      if (serverMsg && (String(serverMsg).toLowerCase().includes("spam") || String(serverMsg).includes("form data is spam"))) {
        setNewsletterError("عذراً، تعذر الإرسال. يرجى المحاولة مرة أخرى.");
      } else if (serverMsg) {
        setNewsletterError(serverMsg);
      } else {
        setNewsletterError("حدث خطأ، يرجى المحاولة لاحقاً.");
      }
      setNewsletterStatus("error");
    } catch {
      setNewsletterError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setNewsletterStatus("error");
    }
  };

  return (
    <footer className="bg-stone-950 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
              alt="شعار المنصة"
              className="h-12 w-auto object-contain mb-4 brightness-0 invert opacity-80"
            />
            <p className="text-white/30 text-sm leading-relaxed mb-6 font-light">
              منصة متكاملة لإنشاء البراندات العطرية الاحترافية — من الفكرة إلى الإطلاق.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "ri-instagram-line", href: "#" },
                { icon: "ri-youtube-line", href: "#" },
                { icon: "ri-twitter-x-line", href: "#" },
                { icon: "ri-linkedin-line", href: "#" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  rel="nofollow"
                  className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-amber-700 hover:text-white text-white/30 rounded-xl transition-all cursor-pointer"
                >
                  <i className={`${social.icon} text-base`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-white/80 text-sm mb-4">المنصة</h4>
            <div className="flex flex-col gap-3">
              {["Customer Entry", "Smart Onboarding", "Project Workspace", "Brief Creation", "Brand Strategy", "Fragrance Development"].map((link) => (
                <a key={link} href="#" className="text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer font-light">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-white/80 text-sm mb-4">المسارات</h4>
            <div className="flex flex-col gap-3">
              {["براند عطور كامل", "تطوير عطر", "عبوة وتغليف", "هوية بصرية", "تصنيع", "طباعة وتنفيذ"].map((link) => (
                <a key={link} href="#" className="text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer font-light">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black text-white/80 text-sm mb-4">ابقَ على اطلاع</h4>
            <p className="text-white/30 text-sm mb-4 font-light">اشترك لتصلك آخر أخبار المنصة والعروض الحصرية</p>

            {newsletterStatus === "success" ? (
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 rounded-full mx-auto mb-2">
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-xl"></i>
                </div>
                <p className="text-emerald-400 text-sm font-bold">تم الاشتراك بنجاح!</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleNewsletterSubmit} data-readdy-form="">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="بريدك الإلكتروني"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {/* Honeypot */}
                  <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                    <input
                      type="text"
                      name="website_alt"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      readOnly
                    />
                  </div>
                  {newsletterStatus === "error" && newsletterError && (
                    <p className="text-red-400 text-xs">{newsletterError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800 text-white font-bold py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    {newsletterStatus === "loading" ? "جاري..." : "اشتراك"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm font-light">
            &copy; 2024 منصة العطور الاحترافية. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            {["سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"].map((link) => (
              <a key={link} href="#" className="text-white/20 hover:text-amber-400 text-sm transition-colors cursor-pointer whitespace-nowrap font-light">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
