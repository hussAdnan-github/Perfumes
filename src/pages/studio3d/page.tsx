import { useState } from "react";
import { Link } from "react-router-dom";

type ViewAngle = "front" | "side" | "top" | "perspective";
type Template = "classic" | "modern" | "luxury" | "minimal" | "oriental";

const templates: { id: Template; label: string; desc: string; image: string }[] = [
  {
    id: "classic",
    label: "كلاسيكي",
    desc: "تصميم أنيق وخالد",
    image: "https://readdy.ai/api/search-image?query=classic%20luxury%20perfume%20bottle%20elegant%20tall%20rectangular%20glass%20gold%20cap%20minimalist%20white%20background%20product%20photography%203d%20render&width=300&height=400&seq=3d001&orientation=portrait",
  },
  {
    id: "modern",
    label: "عصري",
    desc: "خطوط حديثة وجريئة",
    image: "https://readdy.ai/api/search-image?query=modern%20contemporary%20perfume%20bottle%20geometric%20angular%20design%20silver%20metallic%20cap%20clear%20glass%20minimalist%20studio%20background%203d%20render%20product&width=300&height=400&seq=3d002&orientation=portrait",
  },
  {
    id: "luxury",
    label: "فاخر",
    desc: "تصميم ملكي راقٍ",
    image: "https://readdy.ai/api/search-image?query=ultra%20luxury%20perfume%20bottle%20ornate%20gold%20embossed%20crystal%20glass%20royal%20design%20dark%20background%20dramatic%20lighting%20premium%20fragrance%203d%20render&width=300&height=400&seq=3d003&orientation=portrait",
  },
  {
    id: "minimal",
    label: "مينيمال",
    desc: "بساطة وأناقة",
    image: "https://readdy.ai/api/search-image?query=minimalist%20perfume%20bottle%20simple%20clean%20design%20frosted%20glass%20matte%20black%20cap%20white%20background%20elegant%20understated%20luxury%20product%20photography&width=300&height=400&seq=3d004&orientation=portrait",
  },
  {
    id: "oriental",
    label: "شرقي",
    desc: "روح الشرق الأصيل",
    image: "https://readdy.ai/api/search-image?query=oriental%20arabic%20perfume%20bottle%20oud%20attar%20design%20ornate%20gold%20arabesque%20patterns%20dark%20amber%20glass%20traditional%20luxury%20middle%20eastern%20fragrance%203d%20render&width=300&height=400&seq=3d005&orientation=portrait",
  },
];

const viewImages: Record<ViewAngle, string> = {
  front: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20front%20view%20elegant%20gold%20cap%20clear%20glass%20minimalist%20white%20background%20professional%20product%20photography%20studio%20lighting&width=600&height=700&seq=3dview001&orientation=portrait",
  side: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20side%20profile%20view%20elegant%20glass%20gold%20details%20minimalist%20clean%20background%20professional%20product%20photography%20studio&width=600&height=700&seq=3dview002&orientation=portrait",
  top: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20top%20view%20overhead%20shot%20elegant%20cap%20design%20minimalist%20white%20background%20professional%20product%20photography%20studio&width=600&height=700&seq=3dview003&orientation=portrait",
  perspective: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20perspective%20angle%203d%20render%20elegant%20glass%20gold%20cap%20dramatic%20lighting%20dark%20background%20premium%20fragrance%20product&width=600&height=700&seq=3dview004&orientation=portrait",
};

const Studio3DPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("luxury");
  const [activeView, setActiveView] = useState<ViewAngle>("perspective");
  const [uploadedRef, setUploadedRef] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "revision">("pending");
  const [revisionNote, setRevisionNote] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  const handleApprove = () => {
    setApprovalStatus("approved");
    setShowRevisionForm(false);
  };

  const handleRevision = () => {
    if (revisionNote.trim()) {
      setApprovalStatus("revision");
      setShowRevisionForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950" dir="rtl">
      {/* Navbar */}
      <nav className="bg-stone-900 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="bg-amber-700/30 border border-amber-600/40 text-amber-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">المرحلة 10A</span>
          <span className="text-white/40 text-sm hidden md:block">3D Preview / Concept Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/packaging-customizer" className="text-white/50 hover:text-white text-sm font-medium cursor-pointer transition-colors whitespace-nowrap hidden md:block">
            <i className="ri-arrow-right-line ml-1"></i>
            العبوة
          </Link>
          <Link to="/pricing" className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all">
            التسعير
            <i className="ri-arrow-left-line mr-1"></i>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Concept Studio — 3D Preview</h1>
          <p className="text-white/40 text-sm">رؤية شبه واقعية لمنتجك قبل التنفيذ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Templates */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 rounded-2xl p-4 border border-white/10 mb-4">
              <h3 className="text-white font-black text-sm mb-4">القوالب الجاهزة</h3>
              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-right ${
                      selectedTemplate === tmpl.id
                        ? "bg-amber-700/20 border border-amber-600/50"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={tmpl.image} alt={tmpl.label} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${selectedTemplate === tmpl.id ? "text-amber-400" : "text-white/80"}`}>
                        {tmpl.label}
                      </div>
                      <div className="text-white/40 text-xs">{tmpl.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Reference */}
            <div className="bg-stone-900 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-black text-sm mb-3">رفع مرجع</h3>
              <div
                onClick={() => setUploadedRef(true)}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  uploadedRef
                    ? "border-emerald-500/50 bg-emerald-900/20"
                    : "border-white/20 hover:border-amber-500/50"
                }`}
              >
                {uploadedRef ? (
                  <div>
                    <i className="ri-checkbox-circle-line text-emerald-400 text-2xl mb-1 block"></i>
                    <div className="text-emerald-400 text-xs font-bold">تم الرفع</div>
                  </div>
                ) : (
                  <div>
                    <i className="ri-upload-cloud-2-line text-white/30 text-2xl mb-1 block"></i>
                    <div className="text-white/40 text-xs">اضغط لرفع صورة مرجعية</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900 rounded-2xl border border-white/10 overflow-hidden">
              {/* View Controls */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="flex gap-1 bg-stone-800 p-1 rounded-lg">
                  {(["front", "side", "top", "perspective"] as ViewAngle[]).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeView === view
                          ? "bg-amber-700 text-white"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {view === "front" ? "أمامي" : view === "side" ? "جانبي" : view === "top" ? "علوي" : "منظور"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg cursor-pointer transition-colors">
                    <i className="ri-zoom-in-line text-white/60 text-sm"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg cursor-pointer transition-colors">
                    <i className="ri-zoom-out-line text-white/60 text-sm"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg cursor-pointer transition-colors">
                    <i className="ri-refresh-line text-white/60 text-sm"></i>
                  </button>
                </div>
              </div>

              {/* 3D View */}
              <div className="relative h-[500px] bg-gradient-to-b from-stone-950 to-stone-900 flex items-center justify-center">
                <img
                  src={viewImages[activeView]}
                  alt="معاينة ثلاثية الأبعاد"
                  className="h-full w-full object-contain"
                />
                {/* Overlay Labels */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-amber-400 text-xs font-bold">
                    {templates.find((t) => t.id === selectedTemplate)?.label} — {
                      activeView === "front" ? "منظور أمامي" :
                      activeView === "side" ? "منظور جانبي" :
                      activeView === "top" ? "منظور علوي" : "منظور ثلاثي"
                    }
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-white/50 text-xs">3D Draft — براند الفجر</span>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white/70 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all">
                    <i className="ri-download-line"></i>
                    تحميل
                  </button>
                  <button className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white/70 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all">
                    <i className="ri-share-line"></i>
                    مشاركة
                  </button>
                </div>
                <div className="text-white/30 text-xs">3D Draft v1.0</div>
              </div>
            </div>
          </div>

          {/* Right: Approval Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Specs Applied */}
            <div className="bg-stone-900 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-black text-sm mb-4">المواصفات المطبقة</h3>
              <div className="space-y-2">
                {[
                  { label: "الحجم", value: "50ml" },
                  { label: "الشكل", value: "مستطيل" },
                  { label: "الزجاج", value: "كريستال" },
                  { label: "الغطاء", value: "معدني ذهبي" },
                  { label: "التشطيب", value: "لامع" },
                  { label: "العلبة", value: "مغناطيسية" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{item.label}</span>
                    <span className="text-white/80 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outputs */}
            <div className="bg-stone-900 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-black text-sm mb-4">المخرجات</h3>
              <div className="space-y-2">
                {[
                  { label: "3D Draft", ready: true },
                  { label: "Rendered Views", ready: true },
                  { label: "Scene Mockups", ready: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{item.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      item.ready ? "bg-emerald-900/50 text-emerald-400" : "bg-stone-800 text-white/30"
                    }`}>
                      {item.ready ? "جاهز" : "قريباً"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Decision */}
            <div className={`rounded-2xl p-4 border ${
              approvalStatus === "approved"
                ? "bg-emerald-900/20 border-emerald-600/30"
                : approvalStatus === "revision"
                ? "bg-amber-900/20 border-amber-600/30"
                : "bg-stone-900 border-white/10"
            }`}>
              <h3 className="text-white font-black text-sm mb-4">قرار الاعتماد</h3>

              {approvalStatus === "approved" && (
                <div className="text-center py-2">
                  <i className="ri-checkbox-circle-line text-emerald-400 text-3xl mb-2 block"></i>
                  <div className="text-emerald-400 font-black text-sm">تمت الموافقة!</div>
                  <div className="text-white/40 text-xs mt-1">الانتقال للتسعير</div>
                  <Link
                    to="/pricing"
                    className="mt-3 block bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm text-center"
                  >
                    التسعير التفصيلي
                  </Link>
                </div>
              )}

              {approvalStatus === "revision" && (
                <div className="text-center py-2">
                  <i className="ri-edit-circle-line text-amber-400 text-3xl mb-2 block"></i>
                  <div className="text-amber-400 font-black text-sm">طلب تعديل</div>
                  <div className="text-white/40 text-xs mt-1 mb-3">{revisionNote}</div>
                  <button
                    onClick={() => { setApprovalStatus("pending"); setRevisionNote(""); }}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-white/70 font-bold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    جولة تعديل جديدة
                  </button>
                </div>
              )}

              {approvalStatus === "pending" && !showRevisionForm && (
                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line"></i>
                    موافقة على الشكل النهائي
                  </button>
                  <button
                    onClick={() => setShowRevisionForm(true)}
                    className="w-full border border-white/20 hover:border-amber-500/50 text-white/60 hover:text-white font-semibold py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    طلب تعديل
                  </button>
                </div>
              )}

              {showRevisionForm && (
                <div>
                  <textarea
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="اكتب ملاحظات التعديل المطلوبة..."
                    rows={3}
                    maxLength={500}
                    className="w-full bg-stone-800 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-xs focus:outline-none focus:border-amber-500/50 resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleRevision}
                      className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-xs"
                    >
                      إرسال
                    </button>
                    <button
                      onClick={() => setShowRevisionForm(false)}
                      className="flex-1 bg-stone-800 hover:bg-stone-700 text-white/60 font-bold py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="bg-stone-900 rounded-2xl p-4 border border-white/10">
              <div className="text-white/40 text-xs mb-1">حالة النظام</div>
              <div className="text-amber-400 font-black text-sm">3D Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio3DPage;
