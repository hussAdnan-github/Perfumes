import colors from "tailwindcss/colors";

// لوحة "الحبر والورق": تحل محل البرتقالي في كامل التطبيق.
// الدرجات الفاتحة رملية دافئة، والداكنة حبر شبه أسود — للأزرار والعناوين والإبراز.
const ink = {
  50: "#F7F6F3",
  100: "#EFEDE8",
  200: "#E3DFD7",
  300: "#CFC8BB",
  400: "#A89F90",
  500: "#7D7466",
  600: "#57514A",
  700: "#2B2925",
  800: "#1C1B19",
  900: "#111111",
  950: "#0B0B0A",
};

// رمادي دافئ بخلفية ورقية
const paper = {
  ...colors.stone,
  50: "#F7F6F3",
  100: "#F1EFEA",
  200: "#EAEAEA",
  300: "#D9D6CF",
  400: "#9A968E",
  500: "#787774",
  600: "#5A5955",
  700: "#3F3E3B",
  800: "#2F3437",
  900: "#1E1F20",
  950: "#141414",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: ink,
        stone: paper,
        ink,
        paper,
        sand: { DEFAULT: "#E9E3D8", soft: "#F2EEE6" },
        // لون إبراز واحد دافئ (تيراكوتا) — للتفاصيل الحية فقط
        accent2: { DEFAULT: "#C2612F", soft: "#F6E6DC", ink: "#8A3F18" },
        // رموز دلالية تستخدمها صفحات الإدارة والعميل
        background: paper,
        foreground: paper,
        primary: ink,
        secondary: colors.emerald,
        accent: colors.orange,
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        // عصري هندسي بحرفين عربي ولاتيني متناسقين
        display: ['"Readex Pro"', '"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', '"IBM Plex Sans Arabic"', "ui-monospace", "monospace"],
      },
      // ظلال شبه معدومة — العمق يأتي من الحدود والمساحات
      boxShadow: {
        sm: "0 1px 2px rgba(17,17,17,0.03)",
        DEFAULT: "0 1px 3px rgba(17,17,17,0.04)",
        md: "0 2px 8px rgba(17,17,17,0.04)",
        lg: "0 4px 16px rgba(17,17,17,0.05)",
        xl: "0 8px 24px rgba(17,17,17,0.05)",
        "2xl": "0 12px 32px rgba(17,17,17,0.06)",
      },
      letterSpacing: {
        label: "0.08em",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
