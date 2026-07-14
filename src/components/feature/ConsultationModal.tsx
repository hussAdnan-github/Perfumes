import { useState, useRef } from "react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  title?: string;
  subtitle?: string;
  formUrl?: string;
}

const ConsultationModal = ({
  isOpen,
  onClose,
  preselectedService = "",
  title = "احجز استشارة",
  subtitle = "املأ بياناتك وسيتواصل معك أحد خبرائنا خلال 24 ساعة",
  formUrl = "https://readdy.ai/api/form/d94lp2dmi650so75e4vg",
}: ConsultationModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setFormStatus("idle");
    setFormError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypotField = formData.get("phone_alt");
    if (honeypotField && String(honeypotField).trim() !== "") {
      setFormStatus("success");
      form.reset();
      setTimeout(() => {
        setFormStatus("idle");
        setFormError("");
        onClose();
      }, 2000);
      return;
    }

    setFormStatus("loading");
    setFormError("");

    try {
      const response = await fetch(formUrl, {
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
        // Check parsed for success
        let code = "";
        try {
          const parsed = JSON.parse(responseText);
          code = parsed?.code || "";
        } catch { /* ignore */ }

        if (code === "OK") {
          setFormStatus("success");
          form.reset();
          setTimeout(() => {
            resetForm();
            onClose();
          }, 2500);
          return;
        }
      }

      // Error handling
      if (serverMsg && (String(serverMsg).toLowerCase().includes("spam") || String(serverMsg).includes("form data is spam"))) {
        setFormError("عذراً، تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.");
      } else if (serverMsg) {
        setFormError(serverMsg);
      } else {
        setFormError("حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
      }
      setFormStatus("error");
    } catch {
      setFormError("حدث خطأ في الاتصال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.");
      setFormStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 animate-[fadeIn_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors cursor-pointer"
        >
          <i className="ri-close-line"></i>
        </button>

        {/* Header */}
        <div className="mb-8 text-right">
          <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-2xl mb-4">
            <i className="ri-customer-service-2-line text-amber-700 text-xl"></i>
          </div>
          <h2 className="text-xl font-black text-stone-900 mb-1">{title}</h2>
          <p className="text-stone-500 text-sm">{subtitle}</p>
        </div>

        {/* Success State */}
        {formStatus === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-4">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">تم إرسال طلبك بنجاح!</h3>
            <p className="text-stone-500 text-sm">سيتواصل معك أحد خبرائنا خلال 24 ساعة</p>
          </div>
        ) : (
          /* Form */
          <form ref={formRef} onSubmit={handleSubmit} data-readdy-form="">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-stone-700 text-sm font-semibold mb-1.5" htmlFor="consult_name">
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input
                  id="consult_name"
                  name="name"
                  type="text"
                  required
                  placeholder="أدخل اسمك الكامل"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-stone-700 text-sm font-semibold mb-1.5" htmlFor="consult_email">
                  البريد الإلكتروني <span className="text-red-400">*</span>
                </label>
                <input
                  id="consult_email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@domain.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-stone-700 text-sm font-semibold mb-1.5" htmlFor="consult_phone">
                  رقم الجوال
                </label>
                <input
                  id="consult_phone"
                  name="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-stone-700 text-sm font-semibold mb-1.5" htmlFor="consult_service">
                  الخدمة المطلوبة
                </label>
                <select
                  id="consult_service"
                  name="service"
                  defaultValue={preselectedService}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white"
                >
                  <option value="">اختر الخدمة</option>
                  <option value="full_brand">إنشاء براند عطور كامل</option>
                  <option value="fragrance_dev">تطوير عطر فقط</option>
                  <option value="packaging">عبوة واستيكر وتغليف</option>
                  <option value="visual_identity">هوية بصرية كاملة</option>
                  <option value="manufacturing">تصنيع فقط</option>
                  <option value="printing">طباعة وتنفيذ</option>
                  <option value="consultation">استشارة عامة</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-stone-700 text-sm font-semibold mb-1.5" htmlFor="consult_message">
                  رسالتك
                </label>
                <textarea
                  id="consult_message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  placeholder="اكتب تفاصيل مشروعك أو استفسارك..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white"
                ></textarea>
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

              {/* Error */}
              {formStatus === "error" && formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm text-right">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
              >
                {formStatus === "loading" ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line"></i>
                    إرسال الطلب
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;