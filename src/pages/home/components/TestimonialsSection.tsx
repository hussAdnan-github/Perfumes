const testimonials = [
  {
    id: 1,
    name: "أحمد العتيبي",
    role: "مؤسس براند مسك",
    image: "https://readdy.ai/api/search-image?query=professional%20arab%20businessman%20portrait%20warm%20smile%20elegant%20attire%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=100&height=100&seq=test1&orientation=squarish",
    content: "المنصة غيّرت مفهومي لإنشاء البراند. من الفكرة إلى الإطلاق في 4 أشهر فقط، والفريق كان محترفاً جداً في كل مرحلة.",
    rating: 5,
    project: "براند عطور كامل",
  },
  {
    id: 2,
    name: "سارة القحطاني",
    role: "صاحبة متجر نيش",
    image: "https://readdy.ai/api/search-image?query=professional%20arab%20businesswoman%20portrait%20confident%20elegant%20hijab%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=100&height=100&seq=test2&orientation=squarish",
    content: "Smart Onboarding ساعدني كثير في توضيح رؤيتي. التركيبة العطرية كانت بالضبط اللي كنت أبحث عنه. أنصح كل من يفكر يبدأ براند يستخدم المنصة.",
    rating: 5,
    project: "تطوير عطر نيش",
  },
  {
    id: 3,
    name: "فهد الدوسري",
    role: "شريك في شركة هدايا",
    image: "https://readdy.ai/api/search-image?query=professional%20arab%20man%20portrait%20business%20casual%20warm%20smile%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=100&height=100&seq=test3&orientation=squarish",
    content: "التعامل مع المنصة كان سلس جداً. Workspace يسهل متابعة كل شي، والتواصل مع الفريق كان ممتاز. النتيجة النهائية فاقت توقعاتي.",
    rating: 5,
    project: "تغليف وعبوة",
  },
  {
    id: 4,
    name: "نورة الشمري",
    role: "مصممة هوية بصرية",
    image: "https://readdy.ai/api/search-image?query=professional%20creative%20arab%20woman%20portrait%20modern%20style%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=100&height=100&seq=test4&orientation=squarish",
    content: "كمصممة، أقدر الاحترافية في الهوية البصرية. التصاميم كانت مبتكرة وعصرية، والتنفيذ كان دقيق جداً. بالتأكيد سأتعامل معهم مرة أخرى.",
    rating: 5,
    project: "هوية بصرية كاملة",
  },
  {
    id: 5,
    name: "عبدالله المالكي",
    role: "مؤسس براند عود",
    image: "https://readdy.ai/api/search-image?query=professional%20arab%20gentleman%20portrait%20traditional%20elegant%20attire%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=100&height=100&seq=test5&orientation=squarish",
    content: "منصة متكاملة بمعنى الكلمة. كل شي منظم وواضح، والجودة عالية في كل مرحلة. براندي الآن يتنافس في السوق بقوة.",
    rating: 5,
    project: "براند عطور كامل",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-heart-3-line"></i>
            آراء العملاء
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Testimonials
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            قصص نجاح من عملاء بنينا معهم براندات عطرية احترافية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { num: "+200", label: "مشروع مكتمل" },
            { num: "+50", label: "براند مُطلق" },
            { num: "98%", label: "نسبة الرضا" },
            { num: "4.9", label: "تقييم العملاء" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center border border-stone-100">
              <div className="text-3xl font-black text-amber-700 mb-1">{stat.num}</div>
              <div className="text-stone-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`bg-white rounded-3xl p-6 border border-stone-100 ${
                i === 0 || i === 3 ? "md:row-span-1" : ""
              }`}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mb-4">
                <i className="ri-double-quotes-l text-amber-600 text-lg"></i>
              </div>

              {/* Content */}
              <p className="text-stone-600 text-sm leading-relaxed mb-6">{t.content}</p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <i
                    key={j}
                    className={`ri-star-fill text-sm ${j < t.rating ? "text-amber-500" : "text-stone-200"}`}
                  ></i>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-stone-900 text-sm">{t.name}</div>
                  <div className="text-stone-400 text-xs">{t.role}</div>
                </div>
              </div>

              {/* Project Badge */}
              <div className="mt-4">
                <span className="inline-block bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {t.project}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mt-8 bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20arab%20businessman%20portrait%20warm%20smile%20elegant%20attire%20neutral%20background%20soft%20lighting%20high%20quality%20headshot&width=200&height=200&seq=featured&orientation=squarish"
                alt="عميل مميز"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-right">
              <div className="flex gap-1 mb-4 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-amber-300"></i>
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                "المنصة ليست مجرد أداة، بل شريك حقيقي في رحلة بناء البراند. من اليوم الأول حتى إطلاق المنتج، كان الفريق معي في كل خطوة."
              </p>
              <div>
                <div className="font-black text-lg">محمد الغامدي</div>
                <div className="text-amber-300 text-sm">مؤسس براند ليلى — براند عطور نسائية فاخرة</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
