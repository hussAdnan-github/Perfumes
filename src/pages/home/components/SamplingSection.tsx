import { useState } from "react";

const samples = [
  { id: 1, version: "Formula V1", status: "delivered", date: "2024-01-15", notes: "النسخة الأولى - التوجه العطري الأساسي" },
  { id: 2, version: "Formula V2", status: "in_progress", date: "2024-01-22", notes: "نسخة محسّنة بناءً على التقييم الأول" },
  { id: 3, version: "Formula V3", status: "pending", date: "—", notes: "نسخة نهائية للاعتماد" },
];

const evaluationCriteria = [
  { key: "firstImpression", label: "الانطباع الأول", icon: "ri-star-line" },
  { key: "longevity", label: "الثبات", icon: "ri-time-line" },
  { key: "sillage", label: "الفوحان", icon: "ri-bubble-chart-line" },
  { key: "uniqueness", label: "التميز", icon: "ri-award-line" },
  { key: "targetFit", label: "المناسبة للفئة", icon: "ri-user-heart-line" },
];

const SamplingSection = () => {
  const [selectedSample, setSelectedSample] = useState(1);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [needsRevision, setNeedsRevision] = useState<boolean | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const currentSample = samples.find((s) => s.id === selectedSample)!;

  return (
    <section id="sampling" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-test-tube-line"></i>
            العينات والاختيار
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Sampling & Selection
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            استلم العينات، قيّمها، واختر النسخة المعتمدة لمشروعك
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Samples List */}
          <div className="w-full lg:w-80 space-y-4">
            <h3 className="font-black text-stone-900 mb-4">نسخ العينات</h3>
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => { setSelectedSample(sample.id); setSubmitted(false); }}
                className={`w-full p-4 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  selectedSample === sample.id
                    ? "border-amber-600 bg-amber-50"
                    : "border-stone-100 bg-stone-50 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-900 text-sm">{sample.version}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    sample.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                    sample.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                    "bg-stone-200 text-stone-500"
                  }`}>
                    {sample.status === "delivered" && "تم التسليم"}
                    {sample.status === "in_progress" && "قيد التنفيذ"}
                    {sample.status === "pending" && "في الانتظار"}
                  </span>
                </div>
                <div className="text-stone-400 text-xs mb-1">{sample.notes}</div>
                <div className="text-stone-400 text-xs">{sample.date}</div>
              </button>
            ))}

            {/* Status Badge */}
            <div className="mt-6 p-4 bg-stone-100 rounded-2xl">
              <div className="text-xs text-stone-400 mb-2">حالة النظام</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  submitted && needsRevision === false ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}></div>
                <span className={`font-bold text-sm ${
                  submitted && needsRevision === false ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {submitted && needsRevision === false ? "Approved Formula" : "Sampling"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Evaluation Form */}
          <div className="flex-1 bg-stone-50 rounded-3xl p-8">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-stone-900">نموذج التقييم</h3>
                    <p className="text-stone-400 text-sm">{currentSample.version}</p>
                  </div>
                  <div className="w-14 h-14 flex items-center justify-center bg-amber-100 rounded-2xl">
                    <i className="ri-test-tube-line text-amber-700 text-2xl"></i>
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div className="space-y-6 mb-8">
                  {evaluationCriteria.map((criterion) => (
                    <div key={criterion.key}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                            <i className={`${criterion.icon} text-stone-400`}></i>
                          </div>
                          <span className="text-stone-700 text-sm font-semibold">{criterion.label}</span>
                        </div>
                        <span className="text-amber-700 font-bold text-sm">
                          {ratings[criterion.key] ? `${ratings[criterion.key]}/5` : "—"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(criterion.key, star)}
                            className={`flex-1 h-10 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                              (ratings[criterion.key] || 0) >= star
                                ? "bg-amber-600 text-white"
                                : "bg-white text-stone-300 hover:bg-stone-100"
                            }`}
                          >
                            <i className="ri-star-fill text-sm"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Revision Decision */}
                <div className="mb-6">
                  <label className="block text-stone-700 text-sm font-semibold mb-3">هل يحتاج تعديل؟</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNeedsRevision(true)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer whitespace-nowrap ${
                        needsRevision === true
                          ? "border-amber-600 bg-amber-50 text-amber-700"
                          : "border-stone-200 text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      نعم، يحتاج تعديل
                    </button>
                    <button
                      onClick={() => setNeedsRevision(false)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer whitespace-nowrap ${
                        needsRevision === false
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-stone-200 text-stone-600 hover:border-emerald-400"
                      }`}
                    >
                      لا، اعتمدت العينة
                    </button>
                  </div>
                </div>

                {/* Revision Notes */}
                {needsRevision === true && (
                  <div className="mb-6">
                    <label className="block text-stone-700 text-sm font-semibold mb-2">ملاحظات التعديل</label>
                    <textarea
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      placeholder="صف التعديلات المطلوبة..."
                      rows={3}
                      maxLength={500}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white"
                    />
                    <div className="text-xs text-stone-400 text-left mt-1">{revisionNotes.length}/500</div>
                  </div>
                )}

                {/* Final Ranking */}
                <div className="mb-8">
                  <label className="block text-stone-700 text-sm font-semibold mb-3">التقييم النهائي</label>
                  <div className="flex gap-2">
                    {["ممتاز", "جيد جداً", "جيد", "مقبول", "يحتاج تعديل"].map((rank) => (
                      <button
                        key={rank}
                        className="flex-1 py-2 rounded-lg text-xs font-bold border border-stone-200 hover:border-amber-400 text-stone-600 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {rank}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={needsRevision === null}
                  className={`w-full font-bold py-4 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2 ${
                    needsRevision === null
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-amber-700 hover:bg-amber-600 text-white"
                  }`}
                >
                  <i className="ri-send-plane-line"></i>
                  إرسال التقييم
                </button>
              </>
            ) : (
              /* Submitted State */
              <div className="text-center py-12">
                <div className="w-20 h-20 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-6">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-4xl"></i>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-3">
                  {needsRevision === false ? "تم اعتماد العينة!" : "تم إرسال طلب التعديل"}
                </h3>
                <p className="text-stone-500 mb-6">
                  {needsRevision === false 
                    ? "تم اعتماد Formula V1. سيتم الانتقال لمرحلة الهوية والتغليف."
                    : "سيتم تطوير نسخة جديدة بناءً على ملاحظاتك."
                  }
                </p>

                {/* Summary */}
                <div className="bg-white rounded-2xl p-6 text-right mb-6 max-w-md mx-auto">
                  <div className="text-xs text-stone-400 mb-4 font-bold">ملخص التقييم</div>
                  <div className="space-y-2">
                    {Object.entries(ratings).map(([key, val]) => {
                      const criterion = evaluationCriteria.find((c) => c.key === key);
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-stone-600 text-sm">{criterion?.label}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`ri-star-fill text-xs ${i < val ? "text-amber-500" : "text-stone-200"}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="border border-stone-200 hover:border-stone-400 text-stone-600 font-semibold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    تعديل التقييم
                  </button>
                  {needsRevision === false && (
                    <a
                      href="#brand"
                      className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm inline-flex items-center gap-2"
                    >
                      الانتقال للتغليف
                      <i className="ri-arrow-left-line"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SamplingSection;
