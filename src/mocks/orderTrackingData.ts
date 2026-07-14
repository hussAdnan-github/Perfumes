export const orderTracking: Record<string, Array<{ date: string; time: string; status: string; description: string; user: string; userRole: string; type: string; icon: string; iconColor: string }>> = {
  "ORD-2026-089": [
    { date: "2026-07-08", time: "10:30", status: "تم انشاء الطلب", description: "تم استلام الطلب من العميل شركة الاصالة عبر المنصة", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-07-08", time: "10:45", status: "تاكيد الدفعة الاولى", description: "تم تاكيد استلام الدفعة الاولى بقيمة 45,000 ريال عبر حوالة بنكية", user: "عبدالله الحربي", userRole: "المالية", type: "payment", icon: "ri-bank-card-line", iconColor: "text-emerald-500" },
    { date: "2026-07-08", time: "11:00", status: "قيد المراجعة", description: "بدا فريق ادارة المشاريع بمراجعة متطلبات العميل وتفاصيل البريف", user: "احمد الزهراني", userRole: "مدير مشروع", type: "status", icon: "ri-search-eye-line", iconColor: "text-amber-500" },
    { date: "2026-07-08", time: "14:30", status: "تعيين المصمم", description: "تم تعيين المصممة نورة القحطاني للعمل على الهوية البصرية للمشروع", user: "احمد الزهراني", userRole: "مدير مشروع", type: "assign", icon: "ri-user-add-line", iconColor: "text-violet-500" },
    { date: "2026-07-09", time: "09:00", status: "بدء مرحلة التصميم", description: "بدات المصممة العمل على المقترحات الاولية للهوية البصرية", user: "نورة القحطاني", userRole: "مصممة", type: "progress", icon: "ri-palette-line", iconColor: "text-orange-500" },
    { date: "2026-07-09", time: "16:15", status: "طلب تعديل من العميل", description: "العميل طلب تعديل على الهوية البصرية - تغيير درجة لونية في الشعار", user: "شركة الاصالة", userRole: "العميل", type: "revision", icon: "ri-edit-line", iconColor: "text-rose-500" },
    { date: "2026-07-10", time: "08:30", status: "تعديل التصميم", description: "جاري العمل على تعديلات العميل في مقترحات الهوية البصرية", user: "نورة القحطاني", userRole: "مصممة", type: "progress", icon: "ri-palette-line", iconColor: "text-orange-500" },
  ],
  "ORD-2026-088": [
    { date: "2026-07-06", time: "09:15", status: "تم انشاء الطلب", description: "تم استلام طلب تطوير عطر جديد من نفحات الخليج", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-07-06", time: "09:30", status: "تاكيد الدفع كاملا", description: "تم تاكيد استلام المبلغ كاملا 45,000 ريال", user: "ماجد القاسم", userRole: "المالية", type: "payment", icon: "ri-bank-card-line", iconColor: "text-emerald-500" },
    { date: "2026-07-06", time: "10:00", status: "تطوير الفورمولا", description: "بدا فريق التطوير في صياغة تركيبة العطر حسب متطلبات العميل", user: "سارة المطيري", userRole: "مديرة مشروع", type: "progress", icon: "ri-flask-line", iconColor: "text-orange-500" },
    { date: "2026-07-07", time: "11:30", status: "ارسال عينات اولية", description: "تم ارسال 3 عينات اولية للعميل للتقييم واختيار الانسب", user: "سارة المطيري", userRole: "مديرة مشروع", type: "sample", icon: "ri-drop-line", iconColor: "text-sky-500" },
    { date: "2026-07-09", time: "15:00", status: "بانتظار تقييم العميل", description: "بانتظار ملاحظات العميل على العينات المرسلة", user: "سارة المطيري", userRole: "مديرة مشروع", type: "waiting", icon: "ri-time-line", iconColor: "text-amber-500" },
  ],
  "ORD-2026-087": [
    { date: "2026-07-01", time: "08:00", status: "تم انشاء الطلب", description: "تم استلام طلب براند كامل من ديوان العطور", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-07-01", time: "09:30", status: "تاكيد الدفع كاملا", description: "تم تاكيد استلام المبلغ كاملا 120,000 ريال", user: "عبدالله الحربي", userRole: "المالية", type: "payment", icon: "ri-bank-card-line", iconColor: "text-emerald-500" },
    { date: "2026-07-01", time: "11:00", status: "مرحلة التصميم", description: "بدا المصمم فهد العتيبي العمل على تصاميم الهوية والعبوات", user: "فهد العتيبي", userRole: "مصمم", type: "progress", icon: "ri-palette-line", iconColor: "text-orange-500" },
    { date: "2026-07-03", time: "14:00", status: "عرض التصاميم الاولية", description: "تم تجهيز عرض التصاميم الاولية جاهز للعرض على العميل", user: "فهد العتيبي", userRole: "مصمم", type: "review", icon: "ri-eye-line", iconColor: "text-violet-500" },
    { date: "2026-07-05", time: "10:30", status: "اعتماد مبدئي", description: "العميل اعتمد 3 مقترحات من اصل 5 للتطوير النهائي", user: "احمد الزهراني", userRole: "مدير مشروع", type: "approved", icon: "ri-check-double-line", iconColor: "text-emerald-500" },
    { date: "2026-07-08", time: "16:00", status: "تطوير التصاميم", description: "جاري تطوير المقترحات المعتمدة للنسخة النهائية", user: "فهد العتيبي", userRole: "مصمم", type: "progress", icon: "ri-palette-line", iconColor: "text-orange-500" },
  ],
  "ORD-2026-086": [
    { date: "2026-06-28", time: "11:00", status: "تم انشاء الطلب", description: "تم استلام طلب تغليف وعبوة من اريج الشرق", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-06-28", time: "14:00", status: "تاكيد الدفعة الاولى", description: "تم تاكيد استلام 16,000 ريال كدفعة اولى", user: "ماجد القاسم", userRole: "المالية", type: "payment", icon: "ri-bank-card-line", iconColor: "text-emerald-500" },
    { date: "2026-06-29", time: "09:00", status: "مرحلة التصميم", description: "المصممة نورة القحطاني بدات في تصميم العبوات المقترحة", user: "نورة القحطاني", userRole: "مصممة", type: "progress", icon: "ri-palette-line", iconColor: "text-orange-500" },
    { date: "2026-07-02", time: "15:30", status: "عرض العبوات", description: "تم عرض 4 مقترحات للعبوات على العميل للاختيار", user: "سارة المطيري", userRole: "مديرة مشروع", type: "review", icon: "ri-eye-line", iconColor: "text-violet-500" },
    { date: "2026-07-05", time: "10:00", status: "اختيار العبوات", description: "العميل اختار تصميمين مفضلين جاري تطوير العينة المادية", user: "اريج الشرق", userRole: "العميل", type: "selection", icon: "ri-checkbox-circle-line", iconColor: "text-emerald-500" },
    { date: "2026-07-08", time: "13:00", status: "بانتظار اختيار العبوة النهائية", description: "بانتظار قرار العميل النهائي بين التصميمين المختارين", user: "سارة المطيري", userRole: "مديرة مشروع", type: "waiting", icon: "ri-time-line", iconColor: "text-amber-500" },
  ],
  "ORD-2026-084": [
    { date: "2026-06-10", time: "08:30", status: "تم انشاء الطلب", description: "تم استلام طلب تصنيع من روائح الاصالة", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-06-10", time: "10:00", status: "تاكيد الدفعة الاولى", description: "تم تاكيد استلام 90,000 ريال كدفعة اولى للتصنيع", user: "ماجد القاسم", userRole: "المالية", type: "payment", icon: "ri-bank-card-line", iconColor: "text-emerald-500" },
    { date: "2026-06-12", time: "09:00", status: "مراجعة الملفات", description: "جاري مراجعة الملفات الفنية للتاكد من جاهزيتها للتصنيع", user: "سارة المطيري", userRole: "مديرة مشروع", type: "review", icon: "ri-file-search-line", iconColor: "text-violet-500" },
    { date: "2026-06-15", time: "14:00", status: "ارسال للتصنيع", description: "تم ارسال الملفات للمصنع وبدء عملية الانتاج", user: "سارة المطيري", userRole: "مديرة مشروع", type: "progress", icon: "ri-settings-3-line", iconColor: "text-orange-500" },
    { date: "2026-06-22", time: "11:00", status: "قيد التصنيع", description: "عملية التصنيع جارية حسب الجدول الزمني المحدد", user: "المصنع", userRole: "شريك تصنيع", type: "progress", icon: "ri-settings-3-line", iconColor: "text-orange-500" },
  ],
  "ORD-2026-083": [
    { date: "2026-07-07", time: "09:00", status: "تم انشاء الطلب", description: "تم استلام طلب طباعة وتنفيذ من بخور الاصيل", user: "النظام", userRole: "النظام", type: "created", icon: "ri-add-circle-line", iconColor: "text-sky-500" },
    { date: "2026-07-07", time: "10:30", status: "بانتظار الدفع", description: "بانتظار تحويل العميل للدفعة الاولى لبدء العمل", user: "احمد الزهراني", userRole: "مدير مشروع", type: "waiting", icon: "ri-time-line", iconColor: "text-amber-500" },
    { date: "2026-07-08", time: "09:00", status: "ارسال تذكير", description: "تم ارسال تذكير للعميل بضرورة تحويل الدفعة الاولى", user: "غادة العنزي", userRole: "خدمة العملاء", type: "reminder", icon: "ri-notification-3-line", iconColor: "text-rose-500" },
  ],
};

export const orderMessages: Record<string, Array<{ id: string; sender: string; role: string; roleColor: string; message: string; time: string; date: string; isInternal: boolean }>> = {
  "ORD-2026-089": [
    { id: "MSG-089-01", sender: "ريم السبيعي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "مرحبا استاذ احمد، تم استلام طلب شركة الاصالة للبراند الكامل. هل نبدا بمراجعة البريف مباشرة؟", time: "10:35", date: "2026-07-08", isInternal: true },
    { id: "MSG-089-02", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "اهلا ريم، نعم ابدئي بالتواصل مع العميل لتاكيد استلام الطلب واخباره بالخطوات القادمة. انا ساخصص نورة كمصممة للمشروع.", time: "10:40", date: "2026-07-08", isInternal: true },
    { id: "MSG-089-03", sender: "نورة القحطاني", role: "مصممة", roleColor: "bg-violet-100 text-violet-700", message: "شكرا على التكليف. هل فيه توجيهات محددة من العميل بخصوص الالوان او نمط الهوية اللي مفضلينه؟", time: "11:15", date: "2026-07-08", isInternal: true },
    { id: "MSG-089-04", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "العميل يفضل الوان دافئة - درجات العسلي والذهبي مع لمسات من الاسود. ويبغون شي فخم يعكس الاصالة والتراث.", time: "11:30", date: "2026-07-08", isInternal: true },
    { id: "MSG-089-05", sender: "غادة العنزي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "العميل تواصل معي اليوم الصباح وطلب يضيف عبوة اصدار محدود تكون ضمن المشروع. هل نقدر نضيفها؟", time: "08:45", date: "2026-07-09", isInternal: true },
    { id: "MSG-089-06", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "نقدر ان شاء الله. غادة تواصلي مع العميل بخصوص التكلفة الاضافية. نورة ابداي فكري في تصاميم للعبوة المحدودة تكون مكملة للهوية الاساسية.", time: "09:10", date: "2026-07-09", isInternal: true },
    { id: "MSG-089-07", sender: "نورة القحطاني", role: "مصممة", roleColor: "bg-violet-100 text-violet-700", message: "تم. بدات في المقترحات الاولية للهوية. سارسلك عرضا اوليا غدا ان شاء الله قبل ما نعرض على العميل.", time: "16:30", date: "2026-07-09", isInternal: true },
    { id: "MSG-089-08", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "ممتاز نورة، منتظرين العرض. مهم نكون دقيقين في المرحلة هذي عشان العميل ما يطلب تعديلات كثير.", time: "16:45", date: "2026-07-09", isInternal: true },
  ],
  "ORD-2026-088": [
    { id: "MSG-088-01", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "تم استلام طلب تطوير عطر من نفحات الخليج. العميل يريد عطر شرقي مميز بالعود والمسك.", time: "09:20", date: "2026-07-06", isInternal: true },
    { id: "MSG-088-02", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "تم ارسال 3 عينات اولية للعميل اليوم. العينات تشمل توليفة عود-مسك، وعود-ورد، وعود-عنبر.", time: "11:30", date: "2026-07-07", isInternal: true },
    { id: "MSG-088-03", sender: "غادة العنزي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "تواصلت مع العميل وقال انه متحمس جدا للتوليفات. سيختبر العينات مع فريقه ويرجع لنا برد خلال يومين.", time: "15:15", date: "2026-07-07", isInternal: true },
    { id: "MSG-088-04", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "جميل، متابعتك ممتازة غادة. ابقي على تواصل معهم واذا احتاجوا عينات اضافية انا جاهزة.", time: "15:30", date: "2026-07-07", isInternal: true },
  ],
  "ORD-2026-087": [
    { id: "MSG-087-01", sender: "فهد العتيبي", role: "مصمم", roleColor: "bg-violet-100 text-violet-700", message: "استاذ احمد، انتهيت من 5 مقترحات اولية لبراند ديوان العطور. متى نعرضها على العميل؟", time: "13:00", date: "2026-07-03", isInternal: true },
    { id: "MSG-087-02", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "ممتاز فهد. دعنا نراجعها داخليا اولا يوم الاحد وبعدين نحدد موعد مع العميل.", time: "13:15", date: "2026-07-03", isInternal: true },
    { id: "MSG-087-03", sender: "ريم السبيعي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "العميل اعتمد 3 مقترحات من اصل 5. اختار التصاميم اللي فيها طابع كلاسيكي مع لمسات عصرية.", time: "10:45", date: "2026-07-05", isInternal: true },
    { id: "MSG-087-04", sender: "فهد العتيبي", role: "مصمم", roleColor: "bg-violet-100 text-violet-700", message: "تمام، ساركز على المقترحات الثلاثة هذي واطورها للنسخة النهائية. ساحتاج بضعة ايام.", time: "11:00", date: "2026-07-05", isInternal: true },
    { id: "MSG-087-05", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "خذ وقتك فهد، الجودة اهم من السرعة. العميل ليس مستعجلا.", time: "11:15", date: "2026-07-05", isInternal: true },
  ],
  "ORD-2026-086": [
    { id: "MSG-086-01", sender: "نورة القحطاني", role: "مصممة", roleColor: "bg-violet-100 text-violet-700", message: "سارة، انتهيت من 4 تصميمات للعبوات. متى نرسلها للعميل اريج الشرق؟", time: "14:00", date: "2026-07-02", isInternal: true },
    { id: "MSG-086-02", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "نورة، التصاميم رائعة! ارسليها لي وانا ساخصص عرضا على العميل في اجتماع الغد.", time: "14:30", date: "2026-07-02", isInternal: true },
    { id: "MSG-086-03", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "العميل اختار تصميمين: العبوة الزجاجية الدائرية والعبوة الكريستالية المربعة. يريد مشاهدة عينة مادية قبل القرار النهائي.", time: "10:30", date: "2026-07-05", isInternal: true },
    { id: "MSG-086-04", sender: "نورة القحطاني", role: "مصممة", roleColor: "bg-violet-100 text-violet-700", message: "تمام، ساخضر ملفات الطباعة ثلاثية الابعاد للعينات. كم المدة المتوقعة لانتاج العينات؟", time: "10:45", date: "2026-07-05", isInternal: true },
  ],
  "ORD-2026-084": [
    { id: "MSG-084-01", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "تم ارسال ملفات التصنيع للمعمل اليوم. الانتاج سياخذ حوالي 3 اسابيع.", time: "14:30", date: "2026-06-15", isInternal: true },
    { id: "MSG-084-02", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "وصلتنا عينة من الدفعة الاولى من المصنع - الجودة ممتازة ومطابقة للمواصفات.", time: "10:00", date: "2026-06-28", isInternal: true },
    { id: "MSG-084-03", sender: "غادة العنزي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "العميل روائح الاصالة يسال اذا نقدر نسرع الشحن عشان يوصل قبل رمضان.", time: "11:30", date: "2026-07-03", isInternal: true },
    { id: "MSG-084-04", sender: "سارة المطيري", role: "مديرة مشروع", roleColor: "bg-sky-100 text-sky-700", message: "حسنا ساخبرك بعد التحقق مع المصنع بخصوص امكانية تسريع الانتاج.", time: "11:45", date: "2026-07-03", isInternal: true },
  ],
  "ORD-2026-083": [
    { id: "MSG-083-01", sender: "غادة العنزي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "ارسلت تذكير للعميل بخور الاصيل بخصوص تحويل الدفعة الاولى. قال سيحول خلال اليومين القادمين.", time: "09:30", date: "2026-07-08", isInternal: true },
    { id: "MSG-083-02", sender: "احمد الزهراني", role: "مدير مشروع", roleColor: "bg-sky-100 text-sky-700", message: "متابعة ممتازة غادة. ارسلي لي تاكيد عندما يصل التحويل لنبدا العمل فورا.", time: "09:45", date: "2026-07-08", isInternal: true },
    { id: "MSG-083-03", sender: "غادة العنزي", role: "خدمة العملاء", roleColor: "bg-orange-100 text-orange-700", message: "العميل لم يرد على التذكير اليوم. ساخاول التواصل معه غدا مرة اخرى عبر الهاتف.", time: "16:00", date: "2026-07-09", isInternal: true },
  ],
};