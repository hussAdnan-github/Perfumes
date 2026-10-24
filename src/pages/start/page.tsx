import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/hooks/useAuth";
import { serviceById } from "@/data/services";
import { submitForm } from "@/lib/forms";
import { briefQuestions, phoneOk, type Answers, type BriefQuestion } from "@/start/briefs";
import PhoneField from "@/components/feature/PhoneField";
import { formatPhone } from "@/lib/phone";
import { useServicePrice } from "@/pricing/usePrices";
import LegalConsent from "@/components/feature/LegalConsent";
import AccountAfterRequest from "@/start/AccountAfterRequest";

// «ابدأ هذا المسار»: الملخص أولاً (اختيارات سريعة)، ثم الاسم والجوال والبريد — دون كلمة مرور.
// الطلب يصل للفريق فور الإرسال؛ والحساب خطوة اختيارية بعده (كلمة مرور فقط) لمتابعة المشروع.

const field =
  "w-full bg-paper-50 border border-paper-200 focus:border-ink-900 focus:bg-white rounded-xl px-4 py-3 text-ink-900 placeholder:text-paper-400 transition-colors outline-none";

interface Details {
  brand: string;
  message: string;
  ref_link: string;
}
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
}
interface Draft {
  answers: Answers;
  details: Details;
  contact: Contact;
}
const draftKey = (track: string) => `pp_start_${track}`;
function readDraft(track: string): Draft | null {
  try {
    const raw = sessionStorage.getItem(draftKey(track));
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

// علامة صح مضمّنة (لا تعتمد على خط الأيقونات) — مؤشر الاختيار يجب أن يظهر دائماً
const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// بطاقة سؤال: رقم واضح، عنوان، تلميح نوع الاختيار، وخيارات كبيرة بمؤشر اختيار ظاهر (دائرة/مربع بعلامة صح)
function Choice({ q, index, total, value, onChange, invalid }: { q: BriefQuestion; index: number; total: number; value: string[]; onChange: (v: string[]) => void; invalid: boolean }) {
  const { pick, t, num } = useI18n();
  const name = useId();
  const done = value.length > 0;
  return (
    <fieldset
      id={`q-${q.id}`}
      data-answered={done || undefined}
      aria-invalid={invalid || undefined}
      className={`scroll-mt-44 rounded-[1.25rem] border bg-white p-5 sm:p-6 transition-[border-color,box-shadow] duration-300 ${
        invalid ? "border-red-300 shadow-[0_0_0_4px_rgba(185,28,28,0.06)]" : done ? "border-paper-300" : "border-paper-200"
      }`}
    >
      <legend className="float-start w-full">
        <span className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={`mt-0.5 w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm tabular-nums transition-colors duration-300 ${done ? "bg-ink-900 text-white" : "bg-paper-100 text-paper-600"}`}
          >
            {done ? <Check className="w-4 h-4" /> : num(index + 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-paper-500 tabular-nums">{t(`سؤال ${num(index + 1)} من ${num(total)}`, `Question ${index + 1} of ${total}`)}</span>
            <span className="mt-1 block text-lg leading-snug text-ink-900 font-medium [text-wrap:balance]">{pick(q.label).replace(/\s*\((اختر ما يناسب|pick any)\)/, "")}</span>
            <span className="mt-1 block text-sm text-paper-500">{q.multi ? t("يمكنك اختيار أكثر من إجابة", "You can pick more than one") : t("اختر إجابة واحدة", "Pick one")}</span>
          </span>
        </span>
      </legend>
      <div className="clear-both pt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {q.options.map((o) => {
          const on = value.includes(o.id);
          return (
            <label
              key={o.id}
              className={`group cursor-pointer rounded-xl border px-4 py-3.5 flex items-center gap-3 text-[0.95rem] transition-[border-color,background-color,transform] duration-200 active:scale-[0.985] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink-900/40 has-[:focus-visible]:ring-offset-2 ${
                on ? "border-ink-900 bg-paper-50 text-ink-900 shadow-[inset_0_0_0_1px_rgb(17_17_17)]" : "border-paper-200 text-paper-700 hover:border-paper-400 hover:bg-paper-50/60"
              }`}
            >
              <input
                type={q.multi ? "checkbox" : "radio"}
                name={name}
                value={o.id}
                checked={on}
                onChange={() => onChange(!q.multi ? [o.id] : on ? value.filter((x) => x !== o.id) : o.id === "unsure" ? ["unsure"] : [...value.filter((x) => x !== "unsure"), o.id])}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`w-5 h-5 shrink-0 flex items-center justify-center border transition-colors duration-200 ${q.multi ? "rounded-md" : "rounded-full"} ${on ? "bg-ink-900 border-ink-900 text-white" : "bg-white border-paper-300 group-hover:border-paper-500"}`}
              >
                {on && <Check className="w-3 h-3" />}
              </span>
              <span className={on ? "font-medium" : ""}>{pick(o.label)}</span>
            </label>
          );
        })}
      </div>
      {invalid && <p className="mt-3 text-sm text-red-700">{t("اختر إجابة للمتابعة — أو «لم أحدد بعد» إن وُجدت.", "Pick an answer to continue.")}</p>}
    </fieldset>
  );
}

// شريط تقدّم ثابت تحت القائمة: كم سؤالاً أُجيب وكم بقي
function Progress({ answered, total }: { answered: number; total: number }) {
  const { t, num } = useI18n();
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const complete = answered === total;
  return (
    <div className="sticky top-[4.25rem] z-30 mt-8 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-paper-50/90 backdrop-blur-md border-b border-paper-200">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink-900 tabular-nums" aria-live="polite">
          {complete ? (
            <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-accent2 text-white inline-flex items-center justify-center"><Check className="w-2.5 h-2.5" /></span>{t("اكتملت الإجابات — اضغط «التالي»", "All answered — press “Next”")}</span>
          ) : (
            t(`أجبت ${num(answered)} من ${num(total)}`, `${answered} of ${total} answered`)
          )}
        </span>
        <span className="text-paper-500 tabular-nums">{num(pct)}{t("٪", "%")}</span>
      </div>
      <div
        className="mt-2 h-1.5 rounded-full bg-paper-200 overflow-hidden"
        role="progressbar"
        aria-label={t("تقدّم الإجابات", "Answer progress")}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <div className="h-full rounded-full bg-ink-900 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Steps({ step }: { step: 1 | 2 | 3 }) {
  const { t, num } = useI18n();
  const labels = [t("مشروعك", "Your project"), t("بياناتك", "Your details"), t("تم", "Done")];
  return (
    <ol className="flex items-center gap-3 text-sm" aria-label={t("خطوات الطلب", "Request steps")}>
      {labels.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const state = n < step ? "done" : n === step ? "current" : "next";
        return (
          <li key={l} className="flex items-center gap-3" aria-current={state === "current" ? "step" : undefined}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${state === "next" ? "border border-paper-300 text-paper-500" : "bg-ink-900 text-white"}`}>
              {state === "done" ? <Check className="w-3.5 h-3.5" /> : num(n)}
            </span>
            <span className={state === "next" ? "text-paper-500" : "text-ink-900"}>{l}</span>
            {i < labels.length - 1 && <span className="w-6 sm:w-10 h-px bg-paper-300" aria-hidden="true"></span>}
          </li>
        );
      })}
    </ol>
  );
}

export default function StartPage() {
  const { track: trackId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t, pick, isAr } = useI18n();
  const priceOf = useServicePrice();
  const { user } = useAuth();
  const track = serviceById(trackId);
  const questions = useMemo(() => (track ? briefQuestions(track) : []), [track]);
  const isClient = !!user && user.role === "client";

  const initial = useMemo<Draft>(() => {
    const saved = track ? readDraft(track.id) : null;
    const pkg = params.get("package");
    const answers: Answers = { ...(saved?.answers ?? {}) };
    if (pkg !== null && track?.packages[Number(pkg)]) answers.package = [pkg];
    return {
      answers,
      details: saved?.details ?? { brand: "", message: "", ref_link: "" },
      contact: saved?.contact ?? { firstName: "", lastName: "", email: "", phone: user?.phone ?? "" },
    };
  }, [track, params, user]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Answers>(initial.answers);
  const [details, setDetails] = useState<Details>(initial.details);
  const [contact, setContact] = useState<Contact>(initial.contact);
  const [showDetails, setShowDetails] = useState(!!(initial.details.brand || initial.details.message || initial.details.ref_link));
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (track) document.title = `${t("ابدأ", "Start")}: ${pick(track.title)} | ${t("منصة العطور", "Perfume Platform")}`;
  }, [track, pick, t]);

  // المسودة تبقى حتى الإرسال (تحديث الصفحة أو الرجوع لا يضيّع الإجابات)
  useEffect(() => {
    if (!track || step === 3) return;
    try {
      sessionStorage.setItem(draftKey(track.id), JSON.stringify({ answers, details, contact }));
    } catch {
      /* التخزين غير متاح */
    }
  }, [track, answers, details, contact, step]);

  // الجلسة تُحمَّل بعد أول عرض: نملأ جوال العميل المسجّل متى وصلت
  const userPhone = user?.phone;
  useEffect(() => {
    if (userPhone) setContact((c) => (c.phone ? c : { ...c, phone: userPhone }));
  }, [userPhone]);

  useEffect(() => {
    headRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  if (!track) return <Navigate to="/services" replace />;

  const answeredCount = questions.filter((q) => answers[q.id]?.length).length;

  // إجابة سؤال: يختفي تنبيهه، وفي الاختيار المفرد ننتقل بهدوء إلى أول سؤال لم يُجب بعده
  const answer = (q: BriefQuestion, v: string[]) => {
    const nextAnswers = { ...answers, [q.id]: v };
    setAnswers(nextAnswers);
    setMissing((m) => m.filter((x) => x !== q.id));
    if (q.multi || answers[q.id]?.length) return;
    const at = questions.findIndex((x) => x.id === q.id);
    const nextQ = questions.slice(at + 1).find((x) => !nextAnswers[x.id]?.length);
    if (!nextQ) return;
    window.setTimeout(() => {
      document.getElementById(`q-${nextQ.id}`)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    }, 220);
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    const miss = questions.filter((q) => !answers[q.id]?.length).map((q) => q.id);
    setMissing(miss);
    if (miss.length) {
      document.getElementById(`q-${miss[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelector<HTMLInputElement>(`#q-${miss[0]} input`)?.focus({ preventScroll: true });
      return;
    }
    setStep(2);
  };

  const who = isClient ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: contact.phone } : contact;

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phoneOk(who.phone)) {
      setError(t("أدخل رقم جوال صحيحاً بعد اختيار الدولة.", "Enter a valid mobile number after choosing your country."));
      document.getElementById("st-phone")?.focus();
      return;
    }
    const form = new FormData();
    form.set("track", track.id);
    form.set("subject", track.id);
    form.set("track_title", pick(track.title));
    for (const q of questions) form.set(`a_${q.id}`, (answers[q.id] ?? []).join(","));
    if (details.brand.trim()) form.set("brand", details.brand.trim().slice(0, 80));
    if (details.message.trim()) form.set("message", details.message.trim().slice(0, 1500));
    if (details.ref_link.trim()) form.set("ref_link", details.ref_link.trim().slice(0, 300));
    form.set("firstName", who.firstName);
    form.set("lastName", who.lastName);
    form.set("email", who.email.trim().toLowerCase());
    form.set("phone", who.phone.replace(/[\s-]/g, ""));
    if (contact.country) form.set("country", contact.country);
    form.set("language", isAr ? "ar" : "en");
    setBusy(true);
    const r = await submitForm("brief", form);
    setBusy(false);
    if (!r.ok) {
      setError(t(r.message, "Couldn't send right now. Please try again shortly."));
      return;
    }
    try {
      sessionStorage.removeItem(draftKey(track.id));
    } catch {
      /* لا شيء */
    }
    // العميل المسجّل: يتحول طلبه إلى مشروع في حسابه مباشرة
    if (isClient) return navigate("/account?started=1", { replace: true });
    setStep(3);
  };

  const chip = "inline-flex items-center gap-1.5 rounded-full bg-white border border-paper-200 px-3 py-1.5 text-xs text-paper-600";

  return (
    <div className="min-h-screen bg-paper-50">
      <Navbar />
      <main className="pt-28 md:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-paper-500 mb-6" aria-label={t("مسار التصفح", "Breadcrumb")}>
            <Link to={`/services/${track.id}`} className="inline-flex items-center gap-1 hover:text-ink-900">
              <i className="ri-arrow-right-line rtl:rotate-0 ltr:rotate-180" aria-hidden="true"></i>
              {pick(track.title)}
            </Link>
          </nav>
          <Steps step={step} />

          {step === 1 && (
            <form onSubmit={next} noValidate className="mt-10">
              <p className="label-mono">{t(`ابدأ مسارك · ${track.no}`, `Start your track · ${track.no}`)}</p>
              <h1 ref={headRef} tabIndex={-1} className="mt-3 font-display text-4xl md:text-5xl text-ink-900 leading-tight outline-none">{pick(track.title)}</h1>
              <p className="mt-4 text-paper-600 leading-[1.8]">{t("أجب باختيارات سريعة — أقل من دقيقة — ليعود إليك الفريق بعرض واضح من أول اتصال.", "Answer with a few quick picks — under a minute — so the team comes back with a clear proposal on the first call.")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={chip}><i className="ri-price-tag-3-line" aria-hidden="true"></i>{pick(priceOf(track))}</span>
                <span className={chip}><i className="ri-time-line" aria-hidden="true"></i>{pick(track.duration)}</span>
              </div>

              <Progress answered={answeredCount} total={questions.length} />
              <div className="mt-6 space-y-4">
                {questions.map((q, i) => (
                  <Choice key={q.id} q={q} index={i} total={questions.length} value={answers[q.id] ?? []} invalid={missing.includes(q.id)} onChange={(v) => answer(q, v)} />
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-paper-200 bg-white">
                <button type="button" onClick={() => setShowDetails((s) => !s)} aria-expanded={showDetails} aria-controls="st-details" className="w-full flex items-center justify-between px-5 py-4 text-start text-ink-900">
                  <span>{t("أضف تفاصيل (اختياري)", "Add details (optional)")}</span>
                  <i className={`ri-add-line text-xl transition-transform ${showDetails ? "rotate-45" : ""}`} aria-hidden="true"></i>
                </button>
                {showDetails && (
                  <div id="st-details" className="px-5 pb-5 grid gap-4">
                    <div>
                      <label htmlFor="st-brand" className="block text-sm text-paper-600 mb-2">{t("اسم البراند (إن وُجد)", "Brand name (if any)")}</label>
                      <input id="st-brand" maxLength={80} value={details.brand} onChange={(e) => setDetails({ ...details, brand: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="st-msg" className="block text-sm text-paper-600 mb-2">{t("أخبرنا بفكرتك", "Tell us your idea")}</label>
                      <textarea id="st-msg" rows={3} maxLength={1500} value={details.message} onChange={(e) => setDetails({ ...details, message: e.target.value })} className={`${field} resize-none`} placeholder={t("مثال: عطر عود فاخر للإهداء، إطلاقه قبل رمضان.", "e.g. A luxury oud for gifting, launching before Ramadan.")} />
                    </div>
                    <div>
                      <label htmlFor="st-ref" className="block text-sm text-paper-600 mb-2">{t("رابط مرجع: عطر أو براند يعجبك", "Reference link: a scent or brand you like")}</label>
                      <input id="st-ref" dir="ltr" maxLength={300} value={details.ref_link} onChange={(e) => setDetails({ ...details, ref_link: e.target.value })} className={field} placeholder="https://" />
                    </div>
                  </div>
                )}
              </div>

              {missing.length > 0 && (
                <p role="alert" className="mt-6 text-sm text-red-700">{t("بقيت أسئلة بلا إجابة — اختر «لم أحدد بعد» إن لم تكن متأكداً.", "Some questions are unanswered — pick “Not sure yet” if you're unsure.")}</p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button type="submit" arrow>{t("التالي", "Next")}</Button>
                <Link to={`/book?track=${track.id}`} className="text-sm text-paper-600 underline underline-offset-4 hover:text-ink-900">{t("أفضّل مكالمة أولاً", "I'd rather talk first")}</Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={send} className="mt-10">
              <h1 ref={headRef} tabIndex={-1} className="font-display text-4xl text-ink-900 outline-none">{t("أين نتواصل معك؟", "Where can we reach you?")}</h1>
              <p className="mt-3 text-paper-600 leading-[1.8]">{t("مدير مشروع يتصل بك خلال يوم عمل. لا نطلب كلمة مرور الآن.", "A project manager will call you within one business day. No password needed now.")}</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {isClient ? (
                  <p className="sm:col-span-2 rounded-xl bg-white border border-paper-200 px-4 py-3 text-sm text-paper-600">
                    {t("سيُضاف الطلب إلى حسابك:", "The request goes to your account:")} <span className="text-ink-900">{user.firstName} {user.lastName}</span> · <span dir="ltr">{user.email}</span>
                  </p>
                ) : (
                  <>
                    <div>
                      <label htmlFor="st-first" className="block text-sm text-paper-600 mb-2">{t("الاسم الأول", "First name")}</label>
                      <input id="st-first" required maxLength={60} autoComplete="given-name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="st-last" className="block text-sm text-paper-600 mb-2">{t("اسم العائلة", "Last name")}</label>
                      <input id="st-last" required maxLength={60} autoComplete="family-name" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} className={field} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="st-email" className="block text-sm text-paper-600 mb-2">{t("البريد الإلكتروني", "Email")}</label>
                      <input id="st-email" type="email" required dir="ltr" maxLength={120} autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={field} />
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor="st-phone" className="block text-sm text-paper-600 mb-2">{t("الجوال (واتساب)", "Mobile (WhatsApp)")}</label>
                  <PhoneField id="st-phone" required defaultValue={who.phone} defaultCountry={contact.country} onChange={(phone, country) => setContact((c) => ({ ...c, phone, country }))} className={field} />
                </div>
              </div>
              {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button type="submit" arrow disabled={busy}>{busy ? t("جارٍ الإرسال…", "Sending…") : t("أرسل الطلب", "Send request")}</Button>
                <button type="button" onClick={() => setStep(1)} className="text-sm text-paper-600 underline underline-offset-4 hover:text-ink-900">{t("رجوع", "Back")}</button>
              </div>
              <LegalConsent action={{ ar: "بإرسال الطلب", en: "sending this request" }} className="mt-6" />
            </form>
          )}

          {step === 3 && (
            <div className="mt-10">
              <div role="status">
                <span className="w-14 h-14 rounded-full bg-ink-900 text-white flex items-center justify-center"><i className="ri-check-line text-2xl" aria-hidden="true"></i></span>
                <h1 ref={headRef} tabIndex={-1} className="mt-6 font-display text-4xl text-ink-900 outline-none">{t(`وصل طلبك يا ${contact.firstName}.`, `Request received, ${contact.firstName}.`)}</h1>
                <p className="mt-3 text-paper-600 leading-[1.8]">
                  {t("مدير مشروع يتصل بك خلال يوم عمل على", "A project manager will contact you within one business day on")} <span dir="ltr" className="text-ink-900">{formatPhone(contact.phone)}</span>.
                </p>
              </div>

              {!user && <AccountAfterRequest contact={contact} />}
              <Link to="/services" className="mt-8 inline-block text-sm text-paper-600 underline underline-offset-4 hover:text-ink-900">{t("العودة للخدمات", "Back to services")}</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
