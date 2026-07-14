import { useState } from "react";
import { workspaceModules } from "@/mocks/homeData";

const WorkspaceSection = () => {
  const [activeModule, setActiveModule] = useState("Overview");

  return (
    <section id="workspace" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ri-layout-grid-line"></i>
            مساحة العمل
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Project Workspace
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            كل ما يحتاجه مشروعك في مكان واحد — منظم، واضح، وسهل الإدارة
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-6 bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 min-h-[600px]">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-stone-900 p-6 flex flex-col gap-1">
            {/* Project Info */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-xl">
                  <i className="ri-drop-line text-white text-lg"></i>
                </div>
                <div>
                  <div className="text-white text-sm font-bold">براند الفجر</div>
                  <div className="text-white/40 text-xs">#PRJ-2024-001</div>
                </div>
              </div>
              <span className="inline-block bg-amber-700/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                Project Initiated
              </span>
            </div>

            {/* Nav Items */}
            {workspaceModules.map((mod) => (
              <button
                key={mod.title}
                onClick={() => setActiveModule(mod.title)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-right ${
                  activeModule === mod.title
                    ? "bg-amber-700 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${mod.icon} text-base`}></i>
                  </div>
                  <span>{mod.title}</span>
                </div>
                {mod.badge && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                    {mod.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-stone-900">{activeModule}</h3>
                <p className="text-stone-400 text-sm mt-1">
                  {workspaceModules.find((m) => m.title === activeModule)?.desc}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors">
                  <i className="ri-notification-3-line text-stone-600 text-base"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors">
                  <i className="ri-settings-3-line text-stone-600 text-base"></i>
                </button>
              </div>
            </div>

            {/* Overview Content */}
            {activeModule === "Overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "حالة المشروع", value: "Project Initiated", icon: "ri-flag-line", color: "text-sky-600 bg-sky-50" },
                  { label: "المرحلة الحالية", value: "بناء البريف", icon: "ri-file-text-line", color: "text-violet-600 bg-violet-50" },
                  { label: "نسبة الإنجاز", value: "25%", icon: "ri-pie-chart-line", color: "text-amber-600 bg-amber-50" },
                  { label: "الفريق المعين", value: "3 أعضاء", icon: "ri-team-line", color: "text-emerald-600 bg-emerald-50" },
                  { label: "الموعد المتوقع", value: "مارس 2025", icon: "ri-calendar-line", color: "text-rose-600 bg-rose-50" },
                  { label: "الرقم المرجعي", value: "#PRJ-2024-001", icon: "ri-hashtag", color: "text-stone-600 bg-stone-100" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-4 ${item.color}`}>
                      <i className={`${item.icon} text-lg`}></i>
                    </div>
                    <div className="text-xs text-stone-400 mb-1">{item.label}</div>
                    <div className="font-bold text-stone-800">{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeModule !== "Overview" && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl mb-4">
                  <i className={`${workspaceModules.find((m) => m.title === activeModule)?.icon} text-amber-600 text-2xl`}></i>
                </div>
                <h4 className="text-stone-700 font-bold mb-2">{activeModule}</h4>
                <p className="text-stone-400 text-sm max-w-xs">
                  {workspaceModules.find((m) => m.title === activeModule)?.desc}
                </p>
                <button className="mt-6 bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-6 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all">
                  فتح القسم
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceSection;
