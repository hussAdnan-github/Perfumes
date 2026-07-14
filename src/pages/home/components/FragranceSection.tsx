import { useState } from "react";
import { fragranceNotes } from "@/mocks/homeData";

const concentrations = ["Eau de Parfum", "Parfum", "Eau de Toilette", "Extrait"];
const seasons = ["ربيع", "صيف", "خريف", "شتاء", "كل المواسم"];
const sillageOptions = ["خفيف", "متوسط", "قوي", "كثيف"];

const sampleEvaluations = [
  { label: "الانطباع الأول", icon: "ri-star-line" },
  { label: "الثبات", icon: "ri-time-line" },
  { label: "الفوحان", icon: "ri-bubble-chart-line" },
  { label: "التميز", icon: "ri-award-line" },
  { label: "المناسبة للفئة", icon: "ri-user-heart-line" },
];

const FragranceSection = () => {
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [concentration, setConcentration] = useState("");
  const [season, setSeason] = useState("");
  const [sillage, setSillage] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"develop" | "evaluate">("develop");

  const toggleFamily = (family: string) => {
    setSelectedFamily((prev) =>
      prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]
    );
  };

  const setRating = (label: string, val: number) => {
    setRatings((prev) => ({ ...prev, [label]: val }));
  };

  return (
    <section id="fragrance" className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-600/50 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-drop-line"></i>
            تطوير العطر
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Fragrance Development
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            حدد توجهك العطري وسيبني خبراؤنا التركيبة المثالية لمشروعك
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-full p-1 max-w-sm mx-auto mb-12">
          {[
            { key: "develop", label: "تطوير العطر" },
            { key: "evaluate", label: "تقييم العينات" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "develop" | "evaluate")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-amber-700 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "develop" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Fragrance Builder */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-white font-black text-xl mb-6">محرر التوجه العطري</h3>

              {/* Fragrance Families */}
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-bold mb-3">العائلة العطرية (اختر أكثر من واحدة)</label>
                <div className="grid grid-cols-2 gap-3">
                  {fragranceNotes.map((note) => (
                    <button
                      key={note.family}
                      onClick={() => toggleFamily(note.family)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-right ${
                        selectedFamily.includes(note.family)
                          ? "border-amber-500 bg-amber-700/20 text-amber-300"
                          : "border-white/10 hover:border-white/30 text-white/60"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg flex-shrink-0">
                        <i className={`${note.icon} text-sm`}></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold">{note.family}</div>
                        <div className="text-xs opacity-60">{note.examples}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Concentration */}
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-bold mb-3">نوع التركيز</label>
                <div className="flex flex-wrap gap-2">
                  {concentrations.map((c) => (
                    <button
                      key={c}
                      onClick={() => setConcentration(c)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        concentration === c
                          ? "bg-amber-700 border-amber-700 text-white"
                          : "border-white/20 text-white/60 hover:border-amber-500"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-bold mb-3">موسم الاستخدام</label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        season === s
                          ? "bg-amber-700 border-amber-700 text-white"
                          : "border-white/20 text-white/60 hover:border-amber-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sillage */}
              <div className="mb-8">
                <label className="block text-white/60 text-xs font-bold mb-3">الفوحان المطلوب</label>
                <div className="flex gap-2">
                  {sillageOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSillage(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        sillage === s
                          ? "bg-amber-700 border-amber-700 text-white"
                          : "border-white/20 text-white/60 hover:border-amber-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-black py-4 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2">
                <i className="ri-magic-line"></i>
                إنشاء Fragrance Concept
              </button>
            </div>

            {/* Right: Profile Preview */}
            <div className="flex flex-col gap-6">
              {/* Concept Card */}
              <div className="bg-gradient-to-br from-amber-900/40 to-stone-900 border border-amber-700/30 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-black text-lg">Fragrance Profile</h3>
                  <span className="bg-amber-700/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Formula V1
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "العائلة العطرية", value: selectedFamily.length > 0 ? selectedFamily.join(" + ") : "لم يتم الاختيار" },
                    { label: "التركيز", value: concentration || "لم يتم الاختيار" },
                    { label: "الموسم", value: season || "لم يتم الاختيار" },
                    { label: "الفوحان", value: sillage || "لم يتم الاختيار" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/10">
                      <span className="text-white/50 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-white/50 text-xs mb-2">حالة النظام</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-amber-400 text-sm font-bold">Formula Development</span>
                  </div>
                </div>
              </div>

              {/* Sample Plan */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h4 className="text-white font-bold mb-4">Sample Plan</h4>
                <div className="space-y-3">
                  {[
                    { version: "Version 1", status: "قيد التطوير", color: "text-amber-400" },
                    { version: "Version 2", status: "في الانتظار", color: "text-white/30" },
                    { version: "Version 3", status: "في الانتظار", color: "text-white/30" },
                  ].map((v) => (
                    <div key={v.version} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70 text-sm font-semibold">{v.version}</span>
                      <span className={`text-xs font-bold ${v.color}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "evaluate" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black text-xl">تقييم العينة</h3>
                <span className="bg-amber-700/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Sample #1
                </span>
              </div>

              <div className="space-y-6 mb-8">
                {sampleEvaluations.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg">
                          <i className={`${item.icon} text-white/60 text-sm`}></i>
                        </div>
                        <span className="text-white/80 text-sm font-semibold">{item.label}</span>
                      </div>
                      <span className="text-amber-400 text-sm font-bold">
                        {ratings[item.label] ? `${ratings[item.label]}/5` : "—"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(item.label, star)}
                          className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                            (ratings[item.label] || 0) >= star
                              ? "bg-amber-500"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-white/60 text-xs font-bold mb-3">هل يحتاج تعديل؟</label>
                <div className="flex gap-3">
                  {["نعم، يحتاج تعديل", "لا، اعتمدت العينة"].map((opt) => (
                    <button
                      key={opt}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        opt.includes("اعتمدت")
                          ? "border-emerald-600 text-emerald-400 hover:bg-emerald-900/20"
                          : "border-amber-600 text-amber-400 hover:bg-amber-900/20"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-black py-4 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm">
                إرسال التقييم
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FragranceSection;
