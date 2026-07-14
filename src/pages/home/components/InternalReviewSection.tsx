import { useState } from "react";

const InternalReviewSection = () => {
  const [reviewStatus, setReviewStatus] = useState<"pending" | "reviewing" | "approved" | "needsInput" | "consultation">("pending");

  const reviewSteps = [
    { label: "استلام البريف", status: "completed", icon: "ri-inbox-archive-line" },
    { label: "مراجعة المدير", status: reviewStatus === "pending" ? "pending" : "completed", icon: "ri-user-star-line" },
    { label: "تحديد المسار", status: reviewStatus === "approved" ? "completed" : "pending", icon: "ri-route-line" },
    { label: "إشعار العميل", status: reviewStatus === "approved" ? "completed" : "pending", icon: "ri-mail-send-line" },
  ];

  return (
    <section id="review" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-shield-check-line"></i>
            المراجعة الداخلية
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Internal Review
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            مراجعة احترافية من فريق الخبراء قبل الدخول في التنفيذ
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Review Process */}
          <div className="flex-1 bg-white rounded-3xl p-8 border border-stone-100">
            <h3 className="text-xl font-black text-stone-900 mb-6">سير المراجعة</h3>
            
            <div className="space-y-4">
              {reviewSteps.map((step, index) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${
                    step.status === "completed" 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-stone-100 text-stone-400"
                  }`}>
                    <i className={`${step.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${step.status === "completed" ? "text-stone-900" : "text-stone-400"}`}>
                        {step.label}
                      </span>
                      {step.status === "completed" && (
                        <i className="ri-check-line text-emerald-500"></i>
                      )}
                    </div>
                    {index < reviewSteps.length - 1 && (
                      <div className={`h-8 w-0.5 mr-6 mt-1 ${step.status === "completed" ? "bg-emerald-200" : "bg-stone-200"}`}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Display */}
            <div className="mt-8 p-4 bg-stone-50 rounded-2xl">
              <div className="text-xs text-stone-400 mb-2">حالة النظام الحالية</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  reviewStatus === "approved" ? "bg-emerald-500" : 
                  reviewStatus === "needsInput" ? "bg-amber-500" :
                  reviewStatus === "consultation" ? "bg-rose-500" : "bg-sky-500 animate-pulse"
                }`}></div>
                <span className={`font-bold ${
                  reviewStatus === "approved" ? "text-emerald-600" :
                  reviewStatus === "needsInput" ? "text-amber-600" :
                  reviewStatus === "consultation" ? "text-rose-600" : "text-sky-600"
                }`}>
                  {reviewStatus === "pending" && "Awaiting Review"}
                  {reviewStatus === "reviewing" && "Under Review"}
                  {reviewStatus === "approved" && "Ready for Service Path"}
                  {reviewStatus === "needsInput" && "Awaiting Client Input"}
                  {reviewStatus === "consultation" && "Paid Consultation Required"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Decision Panel */}
          <div className="w-full lg:w-[420px] bg-stone-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-black mb-2">قرار المراجعة</h3>
            <p className="text-white/50 text-sm mb-6">حدد نتيجة مراجعة البريف</p>

            <div className="space-y-3 mb-8">
              {[
                { key: "approved", label: "المشروع واضح", desc: "الانتقال للمسار المتخصص", color: "emerald", icon: "ri-check-double-line" },
                { key: "needsInput", label: "يحتاج استكمال", desc: "طلب بيانات إضافية من العميل", color: "amber", icon: "ri-question-line" },
                { key: "consultation", label: "استشارة مدفوعة", desc: "المشروع يحتاج جلسة تفصيلية", color: "rose", icon: "ri-vip-crown-line" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setReviewStatus(option.key as typeof reviewStatus)}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all cursor-pointer ${
                    reviewStatus === option.key
                      ? `border-${option.color}-500 bg-${option.color}-500/20`
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      reviewStatus === option.key ? `bg-${option.color}-500 text-white` : "bg-white/10 text-white/60"
                    }`}>
                      <i className={`${option.icon} text-lg`}></i>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{option.label}</div>
                      <div className="text-white/50 text-xs">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                إرسال القرار للعميل
              </button>
              <button className="w-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                طلب رأي فريق آخر
              </button>
            </div>

            {/* Validation Result */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="text-white/50 text-xs mb-3">نتيجة التحقق</div>
              <div className="space-y-2">
                {[
                  { label: "البيانات التجارية", status: "مكتملة", ok: true },
                  { label: "السوق المستهدف", status: "محدد", ok: true },
                  { label: "الميزانية", status: "متوافقة", ok: true },
                  { label: "الجدول الزمني", status: "قابل للتنفيذ", ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{item.label}</span>
                    <span className={item.ok ? "text-emerald-400" : "text-amber-400"}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternalReviewSection;
