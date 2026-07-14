import { useState } from "react";
import { onboardingQuestions } from "@/mocks/homeData";

const OnboardingSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQ]: answer };
    setAnswers(newAnswers);
    if (currentQ < onboardingQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setTimeout(() => setCompleted(true), 300);
    }
  };

  const progress = ((currentQ + (answers[currentQ] ? 1 : 0)) / onboardingQuestions.length) * 100;

  return (
    <section id="onboarding" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-robot-2-line"></i>
            المساعد الذكي
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Smart Onboarding
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            أجب على 6 أسئلة فقط وسيحدد النظام المسار الأنسب لمشروعك
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!completed ? (
            <div className="bg-white rounded-3xl p-10 border border-stone-100">
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-stone-400 text-sm">
                  السؤال {currentQ + 1} من {onboardingQuestions.length}
                </span>
                <div className="flex gap-1.5">
                  {onboardingQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i < currentQ
                          ? "w-8 bg-amber-600"
                          : i === currentQ
                          ? "w-8 bg-amber-400"
                          : "w-4 bg-stone-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-1 mb-10">
                <div
                  className="bg-amber-600 h-1 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Question */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl mx-auto mb-6">
                  <i className={`${onboardingQuestions[currentQ].icon} text-amber-700 text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-2">
                  {onboardingQuestions[currentQ].question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {onboardingQuestions[currentQ].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 rounded-xl border-2 text-sm font-semibold text-right transition-all cursor-pointer whitespace-nowrap ${
                      answers[currentQ] === option
                        ? "border-amber-600 bg-amber-50 text-amber-800"
                        : "border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-current flex-shrink-0">
                        {answers[currentQ] === option && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 block"></span>
                        )}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {/* Back Button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  className="mt-6 text-stone-400 hover:text-stone-600 text-sm cursor-pointer transition-colors flex items-center gap-2"
                >
                  <i className="ri-arrow-right-line"></i>
                  السؤال السابق
                </button>
              )}
            </div>
          ) : (
            /* Completion Card */
            <div className="bg-white rounded-3xl p-10 border border-stone-100 text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-6">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">تم تحليل مشروعك!</h3>
              <p className="text-stone-500 mb-8">
                بناءً على إجاباتك، يُنصح بمسار: <strong className="text-amber-700">إنشاء براند عطور كامل</strong>
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "نوع المشروع", value: "براند كامل", icon: "ri-award-line" },
                  { label: "درجة الجاهزية", value: "75%", icon: "ri-bar-chart-line" },
                  { label: "المسار المقترح", value: "Full Brand", icon: "ri-route-line" },
                ].map((item) => (
                  <div key={item.label} className="bg-stone-50 rounded-2xl p-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl mx-auto mb-3">
                      <i className={`${item.icon} text-amber-700`}></i>
                    </div>
                    <div className="text-xs text-stone-400 mb-1">{item.label}</div>
                    <div className="font-bold text-stone-800 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                <a
                  href="#workspace"
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  افتح Workspace المشروع
                </a>
                <button
                  onClick={() => { setCurrentQ(0); setAnswers({}); setCompleted(false); }}
                  className="border border-stone-200 hover:border-stone-400 text-stone-600 font-semibold px-6 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  إعادة التقييم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {[
            { label: "New Lead", color: "bg-amber-100 text-amber-800 border-amber-200" },
            { label: "Qualified", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
            { label: "Project Initiated", color: "bg-sky-100 text-sky-800 border-sky-200" },
            { label: "Brief In Progress", color: "bg-violet-100 text-violet-800 border-violet-200" },
            { label: "Formula Development", color: "bg-rose-100 text-rose-800 border-rose-200" },
            { label: "Approved Formula", color: "bg-green-100 text-green-800 border-green-200" },
          ].map((s) => (
            <span key={s.label} className={`text-xs font-bold px-4 py-1.5 rounded-full border ${s.color}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnboardingSection;
