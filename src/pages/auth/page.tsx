import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register" | "forgot";

const AuthPage = () => {
  const { user, login, register, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regClientType, setRegClientType] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  if (user) {
    return <Navigate to="/services" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await login(loginEmail, loginPassword);
      if (result.success) {
        navigate("/services");
      } else {
        setLoginError(result.message);
      }
    } catch {
      setLoginError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);
    try {
      const result = await register(regFirstName, regLastName, regEmail, regPhone, regClientType, regPassword);
      if (result.success) {
        navigate("/services");
      } else {
        setRegError(result.message);
      }
    } catch {
      setRegError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
    } finally {
      setRegLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate("/services");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=luxury%20perfume%20brand%20creation%20studio%20dark%20elegant%20atmosphere%20golden%20amber%20light%20rays%20perfume%20bottles%20on%20black%20marble%20surface%20artistic%20moody%20photography%20high%20end%20fragrance%20workshop%20professional%20creative%20space%20warm%20tones&width=800&height=1080&seq=auth001&orientation=portrait"
          alt="منصة العطور"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <a href="/" className="cursor-pointer">
            <img
              src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
              alt="شعار المنصة"
              className="h-12 w-auto object-contain"
            />
          </a>
          <div>
            <div className="text-amber-400 text-xs font-bold mb-4 tracking-widest">منصة العطور الاحترافية</div>
            <h2 className="text-white text-4xl font-black leading-tight mb-4">
              ابنِ براندك
              <br />
              <span className="text-amber-400">من الفكرة</span>
              <br />
              إلى الإطلاق
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              انضم لأكثر من 200 عميل بنوا برانداتهم العطرية معنا بشكل احترافي
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { num: "+200", label: "مشروع" },
                { num: "+50", label: "براند" },
                { num: "98%", label: "رضا" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-amber-400">{s.num}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <a href="/" className="cursor-pointer inline-block">
              <img
                src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
                alt="شعار المنصة"
                className="h-10 w-auto object-contain mx-auto"
              />
            </a>
          </div>

          {mode === "login" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900 mb-2">مرحباً بعودتك</h1>
                <p className="text-stone-500 text-sm">سجّل دخولك لمتابعة مشاريعك</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <i className="ri-error-warning-line"></i>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors pr-10"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 flex items-center justify-center text-stone-400">
                        <i className="ri-mail-line text-base"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors pr-10 pl-10"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 flex items-center justify-center text-stone-400">
                        <i className="ri-lock-line text-base"></i>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 flex items-center justify-center text-stone-400 cursor-pointer"
                      >
                        <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} text-base`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-stone-500 text-sm">تذكرني</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-amber-700 hover:text-amber-600 text-sm font-semibold cursor-pointer transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full border-2 border-dashed border-amber-400/60 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-800 font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm mb-4 flex items-center justify-center gap-2"
              >
                <i className="ri-user-star-line text-lg"></i>
                دخول سريع كحساب تجريبي
              </button>

              <div className="relative flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-stone-200"></div>
                <span className="text-stone-400 text-xs">أو</span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>

              <button type="button" className="w-full border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm flex items-center justify-center gap-3 mb-6">
                <i className="ri-google-line text-lg text-red-500"></i>
                الدخول بـ Google
              </button>

              <p className="text-center text-stone-500 text-sm">
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setLoginError(""); }}
                  className="text-amber-700 hover:text-amber-600 font-bold cursor-pointer transition-colors"
                >
                  سجّل الآن
                </button>
              </p>
            </>
          )}

          {mode === "register" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900 mb-2">إنشاء حساب جديد</h1>
                <p className="text-stone-500 text-sm">ابدأ رحلتك في بناء براندك العطري</p>
              </div>

              {regError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <i className="ri-error-warning-line"></i>
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 text-sm font-semibold mb-2">الاسم الأول</label>
                      <input
                        type="text"
                        name="firstName"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="محمد"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 text-sm font-semibold mb-2">اسم العائلة</label>
                      <input
                        type="text"
                        name="lastName"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="الأحمد"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      name="phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">نوع العميل</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["فرد", "شركة", "موزع", "براند قائم"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setRegClientType(type)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer whitespace-nowrap ${
                            regClientType === type
                              ? "border-amber-600 bg-amber-50 text-amber-800"
                              : "border-stone-200 text-stone-600 hover:border-amber-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 text-sm font-semibold mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 أحرف على الأقل"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 flex items-center justify-center text-stone-400 cursor-pointer"
                      >
                        <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} text-base`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {regLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                </button>
              </form>

              <p className="text-center text-stone-400 text-xs mb-4">
                بالتسجيل، أنت توافق على{" "}
                <a href="#" className="text-amber-700 cursor-pointer">شروط الاستخدام</a>
                {" "}و{" "}
                <a href="#" className="text-amber-700 cursor-pointer">سياسة الخصوصية</a>
              </p>

              <p className="text-center text-stone-500 text-sm">
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setRegError(""); }}
                  className="text-amber-700 hover:text-amber-600 font-bold cursor-pointer transition-colors"
                >
                  سجّل دخولك
                </button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setForgotSent(false); }}
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm cursor-pointer transition-colors mb-6"
                >
                  <i className="ri-arrow-right-line"></i>
                  العودة لتسجيل الدخول
                </button>
                <h1 className="text-3xl font-black text-stone-900 mb-2">استعادة كلمة المرور</h1>
                <p className="text-stone-500 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة</p>
              </div>

              {forgotSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 text-center">
                  <i className="ri-checkbox-circle-line text-lg block mb-1"></i>
                  تم إرسال رابط الاستعادة إلى بريدك الإلكتروني
                </div>
              ) : (
                <form onSubmit={handleForgot}>
                  <div className="mb-6">
                    <label className="block text-stone-700 text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-sm"
                  >
                    إرسال رابط الاستعادة
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;