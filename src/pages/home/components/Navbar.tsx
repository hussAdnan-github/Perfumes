import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const serviceLinks = [
  { label: "براند عطور كامل", desc: "من الفكرة إلى الإطلاق", href: "/services/A", icon: "ri-award-fill" },
  { label: "تطوير عطر", desc: "تركيبة حصرية مخصصة", href: "/services/B", icon: "ri-drop-fill" },
  { label: "عبوة وتغليف", desc: "تصميم وتنفيذ احترافي", href: "/services/C", icon: "ri-gift-fill" },
  { label: "هوية بصرية", desc: "شعار وألوان وخطوط", href: "/services/D", icon: "ri-palette-fill" },
  { label: "تصنيع", desc: "جودة عالية وتسليم دقيق", href: "/services/E", icon: "ri-settings-fill" },
  { label: "طباعة وتنفيذ", desc: "ملفاتك جاهزة بأعلى جودة", href: "/services/F", icon: "ri-printer-fill" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <img
            src="https://public.readdy.ai/ai/img_res/d731bdfe-bbad-4a91-b6ce-fc896c33896a.png"
            alt="شعار المنصة"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7">
          <Link to="/" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            الرئيسية
          </Link>

          <Link to="/about" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            عنا
          </Link>

          {/* Services Dropdown */}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <Link
              to="/services"
              className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
            >
              الخدمات
              <i className={`ri-arrow-down-s-line text-xs transition-transform ${servicesOpen ? "rotate-180" : ""}`}></i>
            </Link>

            {servicesOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl border border-stone-100 shadow-lg overflow-hidden z-50">
                <div className="p-2">
                  <Link
                    to="/services"
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-amber-700 font-bold hover:bg-amber-50 transition-colors cursor-pointer border-b border-stone-50 mb-1"
                  >
                    <i className="ri-stack-line"></i>
                    كل الخدمات
                    <i className="ri-arrow-left-line mr-auto text-xs"></i>
                  </Link>
                  {serviceLinks.map((svc) => (
                    <Link
                      key={svc.href}
                      to={svc.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                        <i className={`${svc.icon} text-stone-500 group-hover:text-amber-700 text-sm transition-colors`}></i>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">{svc.label}</div>
                        <div className="text-stone-400 text-[10px]">{svc.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/portfolio" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            نماذج من الأعمال
          </Link>
          <Link to="/faq" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            الأسئلة والاستفسارات
          </Link>
          <Link to="/contact" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            تواصل معنا
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all inline-flex items-center gap-2"
              >
                <i className="ri-dashboard-line"></i>
                لوحة التحكم
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 w-10 h-10 justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  <div className="w-7 h-7 flex items-center justify-center bg-amber-700 rounded-full text-white text-xs font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl border border-stone-100 shadow-lg overflow-hidden">
                    <div className="p-3 border-b border-stone-100">
                      <div className="font-bold text-stone-900 text-sm">{user.firstName} {user.lastName}</div>
                      <div className="text-stone-400 text-xs">{user.email}</div>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <i className="ri-dashboard-line text-stone-400"></i>
                        لوحة التحكم
                      </Link>
                      <Link
                        to="/dashboard/projects"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <i className="ri-folder-3-line text-stone-400"></i>
                        مشاريعي
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <i className="ri-settings-3-line text-stone-400"></i>
                        الإعدادات
                      </Link>
                    </div>
                    <div className="p-1 border-t border-stone-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <i className="ri-logout-box-line"></i>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-semibold px-4 py-2 rounded-full text-stone-600 hover:text-amber-700 transition-all whitespace-nowrap cursor-pointer"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/auth"
                className="bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
              >
                التسجيل
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-stone-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            الرئيسية
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            عنا
          </Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            الخدمات
          </Link>
          <div className="mr-3 border-r-2 border-stone-100 pr-3 flex flex-col gap-2">
            {serviceLinks.map((svc) => (
              <Link
                key={svc.href}
                to={svc.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-medium cursor-pointer"
              >
                <i className={`${svc.icon} text-[10px]`}></i>
                {svc.label}
              </Link>
            ))}
          </div>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            عنا
          </Link>
          <Link to="/portfolio" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            نماذج من الأعمال
          </Link>
          <Link to="/faq" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            الأسئلة والاستفسارات
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer">
            تواصل معنا
          </Link>

          <div className="border-t border-stone-100 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-amber-700 rounded-full text-white text-xs font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                  <span className="text-stone-700 text-sm font-bold">{user.firstName} {user.lastName}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer block mb-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="ri-dashboard-line ml-1"></i> لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-500 text-sm font-medium cursor-pointer"
                >
                  <i className="ri-logout-box-line ml-1"></i> تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block text-stone-700 hover:text-amber-700 text-sm font-medium cursor-pointer mb-3"
                  onClick={() => setMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/auth"
                  className="bg-amber-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full text-center whitespace-nowrap cursor-pointer block"
                  onClick={() => setMenuOpen(false)}
                >
                  التسجيل
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;