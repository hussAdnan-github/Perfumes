import { useState } from "react";
import { Link } from "react-router-dom";

const AfterSalesPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reorderRequested, setReorderRequested] = useState(false);
  const [reorderQty, setReorderQty] = useState(1000);
  const [activeTab, setActiveTab] = useState<"review" | "reorder" | "upsell">("review");

  const upsellServices = [
    {
      id: "new-scent",
      title: "تطوير عطر جديد",
      desc: "أضف SKU جديد لمجموعتك",
      icon: "ri-drop-line",
      price: "يبدأ من 15,000 ريال",
      badge: "الأكثر طلباً",
      badgeColor: "bg-amber-500",
      image: "https://readdy.ai/api/search-image?query=new%20perfume%20fragrance%20development%20second%20scent%20creation%20luxury%20bottles%20collection%20elegant%20studio%20dark%20background%20amber%20warm%20tones&width=400&height=250&seq=as001&orientation=landscape",
    },
    {
      id: "packaging-upgrade",
      title: "ترقية التغليف",
      desc: "تغليف هدايا موسمي أو محدود الإصدار",
      icon: "ri-gift-2-line",
      price: "يبدأ من 5,000 ريال",
      badge: null,
      badgeColor: "",
      image: "https://readdy.ai/api/search-image?query=luxury%20gift%20packaging%20upgrade%20seasonal%20limited%20edition%20perfume%20box%20elegant%20gold%20foil%20embossing%20premium%20materials%20dark%20background&width=400&height=250&seq=as002&orientation=landscape",
    },
    {
      id: "brand-extension",
      title: "توسيع البراند",
      desc: "منتجات مكملة: بخور، كريم، شمع",
      icon: "ri-award-line",
      price: "يبدأ من 20,000 ريال",
      badge: "جديد",
      badgeColor: "bg-emerald-600",
      image: "https://readdy.ai/api/search-image?query=brand%20extension%20luxury%20fragrance%20line%20incense%20candle%20body%20cream%20complementary%20products%20elegant%20collection%20dark%20background%20warm%20lighting&width=400&height=250&seq=as003&orientation=landscape",
    },
    {
      id: "marketing",
      title: "خطة تسويقية",
      desc: "إطلاق احترافي على السوشيال ميديا",
      icon: "ri-megaphone-line",
      price: "يبدأ من 8,000 ريال",
      badge: null,
      badgeColor: "",
      image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20marketing%20campaign%20social%20media%20professional%20photography%20elegant%20product%20shots%20dark%20moody%20aesthetic&width=400&height=250&seq=as004&orientation=landscape",
    },
  ];

  const handleSubmitReview = () => {
    if (rating > 0) {
      setReviewSubmitted(true);
    }
  };

  const handleReorder = () => {
    setReorderRequested(true);
  };

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="cursor-pointer">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">المرحلة 17A</span>
          <span className="text-stone-400 text-sm hidden md:block">ما بعد البيع</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/production" className="text-stone-500 hover:text-amber-700 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap hidden md:block">
            <i className="ri-arrow-right-line ml-1"></i>
            التسليم
          </Link>
          <Link to="/dashboard" className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all">
            لوحة التحكم
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative bg-stone-900 py-16 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20success%20celebration%20elegant%20bottles%20collection%20dark%20background%20gold%20light%20rays%20premium%20fragrance%20achievement&width=1400&height=400&seq=as_hero&orientation=landscape"
            alt="خلفية"
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 to-stone-900/90"></div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-emerald-700 rounded-full mx-auto mb-4">
            <i className="ri-checkbox-circle-line text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">مبروك! تم إغلاق المشروع</h1>
          <p className="text-white/60 text-lg mb-2">براند الفجر — #PRJ-2024-001</p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            <span><i className="ri-calendar-line ml-1"></i>مدة المشروع: 4 أشهر</span>
            <span><i className="ri-stack-line ml-1"></i>1,000 وحدة</span>
            <span><i className="ri-money-dollar-circle-line ml-1"></i>63,500 ريال</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 bg-stone-100 p-1 rounded-xl mb-8 w-fit">
          {[
            { id: "review" as const, label: "تقييم التجربة", icon: "ri-star-line" },
            { id: "reorder" as const, label: "إعادة الطلب", icon: "ri-refresh-line" },
            { id: "upsell" as const, label: "تطوير المشروع", icon: "ri-rocket-line" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id ? "bg-white text-amber-700" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Review Tab */}
        {activeTab === "review" && (
          <div className="max-w-2xl">
            {reviewSubmitted ? (
              <div className="bg-white rounded-3xl p-10 border border-stone-100 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-4">
                  <i className="ri-heart-line text-amber-700 text-3xl"></i>
                </div>
                <h3 className="font-black text-stone-900 text-2xl mb-3">شكراً على تقييمك!</h3>
                <p className="text-stone-500 mb-6">تقييمك يساعدنا على تحسين خدماتنا وبناء ثقة أكبر مع عملائنا الجدد</p>
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`ri-star-fill text-2xl ${star <= rating ? "text-amber-500" : "text-stone-200"}`}></i>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("reorder")}
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  إعادة الطلب
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-stone-100">
                <h3 className="font-black text-stone-900 text-xl mb-2">كيف كانت تجربتك معنا؟</h3>
                <p className="text-stone-400 text-sm mb-6">تقييمك يعني لنا الكثير</p>

                {/* Stars */}
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <i className={`ri-star-fill text-4xl ${
                        star <= (hoverRating || rating) ? "text-amber-500" : "text-stone-200"
                      }`}></i>
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="text-amber-700 font-bold text-sm mb-4">
                    {rating === 5 ? "ممتاز جداً!" : rating === 4 ? "جيد جداً" : rating === 3 ? "جيد" : rating === 2 ? "مقبول" : "يحتاج تحسين"}
                  </div>
                )}

                {/* Review Areas */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    "جودة المنتج",
                    "الالتزام بالمواعيد",
                    "التواصل والمتابعة",
                    "القيمة مقابل السعر",
                  ].map((area) => (
                    <div key={area} className="flex items-center justify-between bg-stone-50 rounded-xl p-3">
                      <span className="text-stone-700 text-xs font-bold">{area}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i key={s} className="ri-star-fill text-xs text-amber-400"></i>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="شاركنا تجربتك بالتفصيل..."
                  rows={4}
                  maxLength={500}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-amber-400 resize-none mb-5"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className={`w-full font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm ${
                    rating > 0
                      ? "bg-amber-700 hover:bg-amber-600 text-white"
                      : "bg-stone-100 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  إرسال التقييم
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reorder Tab */}
        {activeTab === "reorder" && (
          <div className="max-w-2xl">
            {reorderRequested ? (
              <div className="bg-white rounded-3xl p-10 border border-stone-100 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                  <i className="ri-refresh-line text-emerald-600 text-3xl"></i>
                </div>
                <h3 className="font-black text-stone-900 text-2xl mb-3">تم استلام طلب إعادة الطلب!</h3>
                <p className="text-stone-500 mb-2">سيتواصل معك فريقنا خلال 24 ساعة</p>
                <p className="text-stone-400 text-sm mb-6">الكمية المطلوبة: {reorderQty.toLocaleString()} وحدة</p>
                <Link
                  to="/dashboard"
                  className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                >
                  العودة للداشبورد
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-stone-100">
                <h3 className="font-black text-stone-900 text-xl mb-2">إعادة طلب براند الفجر</h3>
                <p className="text-stone-400 text-sm mb-6">نفس المواصفات المعتمدة — تسليم أسرع</p>

                <div className="bg-stone-50 rounded-2xl p-5 mb-6">
                  <div className="text-stone-500 text-xs font-bold mb-3">المواصفات المحفوظة</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: "العطر", value: "Formula V3 — Oriental Woody" },
                      { label: "العبوة", value: "50ml — زجاج كريستال" },
                      { label: "الغطاء", value: "معدني ذهبي" },
                      { label: "العلبة", value: "مغناطيسية مخملية" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-stone-400 text-xs">{item.label}</div>
                        <div className="font-bold text-stone-800 text-xs">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-stone-700 text-sm font-bold mb-3">
                    الكمية المطلوبة: <span className="text-amber-700">{reorderQty.toLocaleString()} وحدة</span>
                  </label>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={500}
                    value={reorderQty}
                    onChange={(e) => setReorderQty(Number(e.target.value))}
                    className="w-full accent-amber-700 cursor-pointer mb-2"
                  />
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>500</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">التكلفة التقديرية</span>
                    <span className="font-black text-amber-700">{(reorderQty * 63.5).toLocaleString(undefined, { maximumFractionDigits: 0 })} ريال</span>
                  </div>
                  <div className="text-stone-400 text-xs mt-1">خصم 10% لإعادة الطلب</div>
                </div>

                <button
                  onClick={handleReorder}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-2"
                >
                  <i className="ri-refresh-line"></i>
                  طلب إعادة الإنتاج
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upsell Tab */}
        {activeTab === "upsell" && (
          <div>
            <div className="mb-6">
              <h3 className="font-black text-stone-900 text-xl mb-2">طور مشروعك للمرحلة التالية</h3>
              <p className="text-stone-400 text-sm">اقتراحات مخصصة بناءً على مشروعك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upsellServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-300 transition-all cursor-pointer">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    {service.badge && (
                      <span className={`absolute top-3 right-3 ${service.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap`}>
                        {service.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center bg-amber-700 rounded-xl">
                      <i className={`${service.icon} text-white text-base`}></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-black text-stone-900 mb-1">{service.title}</h4>
                    <p className="text-stone-500 text-sm mb-4">{service.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700 font-black text-sm">{service.price}</span>
                      <Link
                        to="/auth"
                        className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap transition-all"
                      >
                        ابدأ الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Retention Record */}
            <div className="mt-8 bg-stone-900 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-white">سجل المشروع المرجعي</h4>
                <span className="bg-emerald-700/30 border border-emerald-600/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Retention Record
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "اسم المشروع", value: "براند الفجر" },
                  { label: "رقم المشروع", value: "#PRJ-2024-001" },
                  { label: "تاريخ الإغلاق", value: "5 أبريل 2024" },
                  { label: "الحالة", value: "Closed / Reorder Ready" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-white/40 text-xs mb-1">{item.label}</div>
                    <div className="text-white font-bold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfterSalesPage;
