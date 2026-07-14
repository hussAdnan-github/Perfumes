import { useState } from "react";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import { contentLibrary, contentCategories, contentStats } from "@/mocks/contentLibraryData";

const categoryColors: Record<string, string> = {
  packaging: "bg-amber-100 text-amber-700",
  stickers: "bg-rose-100 text-rose-700",
  designs: "bg-violet-100 text-violet-700",
  samples: "bg-emerald-100 text-emerald-700",
  marketing: "bg-orange-100 text-orange-700",
};

const categoryLabels: Record<string, string> = {
  packaging: "عبوات وتغليف",
  stickers: "إستيكرات وملصقات",
  designs: "تصاميم وهويات",
  samples: "عينات وإنتاج",
  marketing: "محتوى تسويقي",
};

const AdminContentPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<typeof contentLibrary[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<typeof contentLibrary[0] | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filtered = contentLibrary.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      item.name.includes(searchQuery) ||
      item.description.includes(searchQuery) ||
      item.type.includes(searchQuery) ||
      item.tags.some((t) => t.includes(searchQuery)) ||
      item.relatedProject.includes(searchQuery) ||
      item.id.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return b.uploadedDate.localeCompare(a.uploadedDate);
    if (sortBy === "oldest") return a.uploadedDate.localeCompare(b.uploadedDate);
    if (sortBy === "name") return a.name.localeCompare(b.name, "ar");
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "downloads") return b.downloads - a.downloads;
    if (sortBy === "size") {
      const parseSize = (s: string) => parseFloat(s.replace(" MB", ""));
      return parseSize(b.size) - parseSize(a.size);
    }
    return 0;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === sorted.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sorted.map((i) => i.id)));
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex">
      <AdminSidebar />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-background-200/70 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground-950">مكتبة المحتوى</h1>
              <p className="text-sm text-foreground-600 mt-0.5">رفع وإدارة صور العبوات، الإستيكرات، والتصاميم</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-600">{selectedItems.size} عنصر محدد</span>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line ml-1"></i>
                    حذف
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-download-2-line ml-1"></i>
                    تحميل
                  </button>
                </div>
              )}
              <button
                onClick={() => setUploadOpen(true)}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-upload-cloud-2-line text-base"></i>
                رفع ملفات جديدة
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-background-200/70 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-gallery-line text-lg text-amber-600"></i>
              </div>
              <div className="min-w-0">
                <div className="text-foreground-600 text-xs">إجمالي الملفات</div>
                <div className="text-foreground-950 text-lg font-bold">{contentStats.totalFiles}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-background-200/70 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-archive-line text-lg text-amber-600"></i>
              </div>
              <div className="min-w-0">
                <div className="text-foreground-600 text-xs">العبوات</div>
                <div className="text-foreground-950 text-lg font-bold">{contentStats.packagingFiles}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-background-200/70 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-sticky-note-line text-lg text-rose-600"></i>
              </div>
              <div className="min-w-0">
                <div className="text-foreground-600 text-xs">الإستيكرات</div>
                <div className="text-foreground-950 text-lg font-bold">{contentStats.stickerFiles}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-background-200/70 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-palette-line text-lg text-violet-600"></i>
              </div>
              <div className="min-w-0">
                <div className="text-foreground-600 text-xs">التصاميم</div>
                <div className="text-foreground-950 text-lg font-bold">{contentStats.designFiles}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-background-200/70 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-hard-drive-3-line text-lg text-emerald-600"></i>
              </div>
              <div className="min-w-0">
                <div className="text-foreground-600 text-xs">المساحة المستخدمة</div>
                <div className="text-foreground-950 text-lg font-bold">{contentStats.storageUsed}</div>
              </div>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="bg-white rounded-xl border border-background-200/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-700 font-medium">المساحة التخزينية</span>
              <span className="text-sm text-foreground-600">{contentStats.storageUsed} / {contentStats.totalStorage}</span>
            </div>
            <div className="h-2 bg-background-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${contentStats.storagePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-background-200/70 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-1 bg-background-100 rounded-lg p-1 flex-wrap">
                {contentCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setActiveCategory(cat.key);
                      setSelectedItems(new Set());
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat.key
                        ? "bg-white text-foreground-950 shadow-sm"
                        : "text-foreground-600 hover:text-foreground-800"
                    }`}
                  >
                    <i className={`${cat.icon} text-sm`}></i>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="بحث بالاسم، النوع، المشروع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pr-9 pl-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-700 px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="name">الاسم</option>
                  <option value="views">الأكثر مشاهدة</option>
                  <option value="downloads">الأكثر تحميلاً</option>
                  <option value="size">الحجم</option>
                </select>

                <div className="flex bg-background-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-foreground-900" : "text-foreground-500"}`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-layout-grid-line text-sm"></i>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-foreground-900" : "text-foreground-500"}`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-list-check-3 text-sm"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className="bg-white rounded-xl border-2 border-dashed border-background-300 hover:border-amber-400 p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full bg-background-100 flex items-center justify-center">
                    <i className={`text-xl text-foreground-500 ${selectedItems.size === sorted.length ? "ri-checkbox-circle-fill text-amber-600" : "ri-checkbox-multiple-blank-line"}`}></i>
                  </div>
                  <span className="text-sm text-foreground-600 font-medium">
                    {selectedItems.size === sorted.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
                  </span>
                  <span className="text-xs text-foreground-400">{sorted.length} عنصر</span>
                </button>
              )}

              {sorted.map((item) => {
                const isSelected = selectedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border transition-all group cursor-pointer relative ${
                      isSelected ? "border-amber-500 ring-2 ring-amber-500/20" : "border-background-200/70 hover:border-background-300"
                    }`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                      className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                        isSelected ? "bg-amber-600 text-white" : "bg-white/80 text-foreground-400 opacity-0 group-hover:opacity-100 border border-background-200"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={`text-sm ${isSelected ? "ri-check-line" : "ri-checkbox-blank-line"}`}></i>
                      </div>
                    </button>

                    <div
                      onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                      className="aspect-square rounded-t-xl overflow-hidden bg-background-100 cursor-pointer"
                    >
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        title={`${item.name} — ${item.type}`}
                      />
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${categoryColors[item.category]}`}>
                          {categoryLabels[item.category]}
                        </span>
                        <span className="text-[10px] text-foreground-400 whitespace-nowrap">{item.type}</span>
                      </div>
                      <h3
                        onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                        className="text-sm font-bold text-foreground-900 leading-tight line-clamp-1 hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-foreground-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-foreground-400">{item.dimensions} · {item.size}</span>
                        <div className="flex items-center gap-2 text-foreground-400">
                          <span className="flex items-center gap-0.5 text-[10px]"><div className="w-3 h-3 flex items-center justify-center"><i className="ri-eye-line text-[10px]"></i></div>{item.views}</span>
                          <span className="flex items-center gap-0.5 text-[10px]"><div className="w-3 h-3 flex items-center justify-center"><i className="ri-download-2-line text-[10px]"></i></div>{item.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-background-200/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-background-200/70 bg-background-50">
                      <th className="w-10 p-3 text-right">
                        <button onClick={toggleSelectAll} className="cursor-pointer">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className={`text-sm text-foreground-400 ${selectedItems.size === sorted.length ? "ri-checkbox-fill text-amber-600" : "ri-checkbox-blank-line"}`}></i>
                          </div>
                        </button>
                      </th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">الملف</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">التصنيف</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">النوع</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">المشروع</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">الحجم</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">التاريخ</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">بواسطة</th>
                      <th className="p-3 text-right text-xs font-bold text-foreground-600 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((item) => {
                      const isSelected = selectedItems.has(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-background-100 hover:bg-background-50 transition-colors ${isSelected ? "bg-amber-50/50" : ""}`}
                        >
                          <td className="p-3">
                            <button onClick={() => toggleSelect(item.id)} className="cursor-pointer">
                              <div className="w-5 h-5 flex items-center justify-center">
                                <i className={`text-sm ${isSelected ? "ri-checkbox-fill text-amber-600" : "ri-checkbox-blank-line text-foreground-300"}`}></i>
                              </div>
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-background-100 overflow-hidden flex-shrink-0">
                                <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover object-top" />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className="text-sm font-bold text-foreground-900 line-clamp-1 hover:text-amber-700 transition-colors cursor-pointer"
                                  onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                                >
                                  {item.name}
                                </div>
                                <div className="text-xs text-foreground-500">{item.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${categoryColors[item.category]}`}>
                              {categoryLabels[item.category]}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-foreground-700 whitespace-nowrap">{item.type}</td>
                          <td className="p-3 text-sm text-foreground-600 whitespace-nowrap">{item.relatedProject}</td>
                          <td className="p-3 text-sm text-foreground-600 whitespace-nowrap">{item.size}</td>
                          <td className="p-3 text-sm text-foreground-600 whitespace-nowrap">{item.uploadedDate}</td>
                          <td className="p-3 text-sm text-foreground-600 whitespace-nowrap">{item.uploadedBy}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                                className="w-8 h-8 rounded-lg hover:bg-background-100 flex items-center justify-center text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer"
                                title="تفاصيل"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-eye-line text-sm"></i>
                                </div>
                              </button>
                              <button className="w-8 h-8 rounded-lg hover:bg-background-100 flex items-center justify-center text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer" title="تحميل">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-download-2-line text-sm"></i>
                                </div>
                              </button>
                              <button
                                onClick={() => { setDeleteTarget(item); setDeleteOpen(true); }}
                                className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-foreground-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state */}
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-background-100 flex items-center justify-center mb-4">
                <i className="ri-image-add-line text-3xl text-foreground-300"></i>
              </div>
              <h3 className="text-foreground-800 font-bold mb-1">لا توجد ملفات</h3>
              <p className="text-sm text-foreground-500 mb-4">
                {searchQuery ? "لا توجد نتائج تطابق بحثك. جرب كلمات مختلفة." : "لم يتم العثور على ملفات في هذا التصنيف"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-background-100 hover:bg-background-200 rounded-lg text-sm font-medium text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  مسح البحث
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {previewOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setPreviewOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-background-200/70" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full max-h-[90vh]">
              <div className="w-3/5 bg-stone-900 flex items-center justify-center p-6">
                <img
                  src={selectedItem.previewUrl}
                  alt={selectedItem.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              <div className="w-2/5 p-6 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${categoryColors[selectedItem.category]}`}>
                    {categoryLabels[selectedItem.category]}
                  </span>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-background-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-close-line text-lg text-foreground-500"></i>
                    </div>
                  </button>
                </div>

                <h2 className="text-lg font-bold text-foreground-950 mb-2">{selectedItem.name}</h2>
                <p className="text-sm text-foreground-600 mb-4 leading-relaxed">{selectedItem.description}</p>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">رقم الملف</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">النوع</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">الأبعاد</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">الحجم</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">المشروع المرتبط</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.relatedProject}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">تم الرفع بواسطة</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.uploadedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">تاريخ الرفع</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.uploadedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">المشاهدات</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.views}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-500">التحميلات</span>
                    <span className="text-foreground-800 font-medium">{selectedItem.downloads}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="text-xs text-foreground-500 mb-2 font-medium">الوسوم</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-background-100 text-foreground-700 px-2 py-1 rounded-md whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-background-200">
                  <button className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-download-2-line"></i>
                    </div>
                    تحميل
                  </button>
                  <button className="flex-1 py-2.5 bg-background-100 hover:bg-background-200 text-foreground-700 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-edit-line"></i>
                    </div>
                    تعديل
                  </button>
                  <button
                    onClick={() => { setPreviewOpen(false); setDeleteTarget(selectedItem); setDeleteOpen(true); }}
                    className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-delete-bin-line"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setUploadOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-background-200/70" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-background-200/70 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground-950">رفع ملفات جديدة</h2>
              <button
                onClick={() => setUploadOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-background-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line text-lg text-foreground-500"></i>
                </div>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-background-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-upload-cloud-2-line text-2xl text-amber-600"></i>
                </div>
                <p className="text-sm text-foreground-700 font-medium mb-1">اسحب وأفلت الملفات هنا</p>
                <p className="text-xs text-foreground-400 mb-3">أو اضغط للتصفح</p>
                <span className="text-xs text-foreground-400">JPG, PNG, PSD, AI, PDF حتى 10 MB</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">اسم الملف</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-amber-400"
                  placeholder="أدخل اسم الملف"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">الوصف</label>
                <textarea
                  className="w-full px-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-amber-400 resize-none"
                  rows={2}
                  placeholder="وصف مختصر للملف"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">التصنيف</label>
                  <select className="w-full px-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-700 focus:outline-none focus:border-amber-400 cursor-pointer">
                    <option value="">اختر التصنيف</option>
                    <option value="packaging">العبوات والتغليف</option>
                    <option value="stickers">الإستيكرات والملصقات</option>
                    <option value="designs">التصاميم والهويات</option>
                    <option value="samples">العينات والإنتاج</option>
                    <option value="marketing">المحتوى التسويقي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">المشروع المرتبط</label>
                  <select className="w-full px-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-700 focus:outline-none focus:border-amber-400 cursor-pointer">
                    <option value="">اختر المشروع</option>
                    <option value="براند الأصالة">براند الأصالة</option>
                    <option value="نفحات الخليج">نفحات الخليج</option>
                    <option value="ديوان العطور">ديوان العطور</option>
                    <option value="أريج الشرق">أريج الشرق</option>
                    <option value="عطر المسك">عطر المسك</option>
                    <option value="روائح الأصالة">روائح الأصالة</option>
                    <option value="مسك وعنبر">مسك وعنبر</option>
                    <option value="بخور الأصيل">بخور الأصيل</option>
                    <option value="عام">عام</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">الوسوم</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background-50 border border-background-200 rounded-lg text-sm text-foreground-800 placeholder:text-foreground-400 focus:outline-none focus:border-amber-400"
                  placeholder="أضف وسوماً مفصولة بفواصل"
                />
              </div>
            </div>

            <div className="p-6 border-t border-background-200/70 flex justify-end gap-3">
              <button
                onClick={() => setUploadOpen(false)}
                className="px-5 py-2.5 bg-background-100 hover:bg-background-200 text-foreground-700 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-upload-cloud-2-line"></i>
                </div>
                رفع الملفات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDeleteOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-background-200/70" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-2xl text-rose-500"></i>
              </div>
              <h3 className="text-lg font-bold text-foreground-950 mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-foreground-600 mb-1">
                هل أنت متأكد من حذف هذا الملف؟
              </p>
              <p className="text-xs text-foreground-500 mb-5">
                &quot;{deleteTarget.name}&quot; — لا يمكن التراجع عن هذا الإجراء
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="flex-1 py-2.5 bg-background-100 hover:bg-background-200 text-foreground-700 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;