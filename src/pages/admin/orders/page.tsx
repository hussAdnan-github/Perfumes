import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { orders } from "@/mocks/adminData";
import { orderTracking, orderMessages } from "@/mocks/orderTrackingData";
import { useAdminAuth, type AdminTeamMember } from "@/hooks/useAdminAuth";

const statuses = ["الكل", "قيد المراجعة", "تطوير الفورمولا", "مرحلة التصميم", "اختيار العبوات", "قيد التصنيع", "بانتظار الدفع", "مكتمل", "اكتمل التسليم"];
const paths = ["الكل", "براند كامل", "تطوير عطر", "تغليف وعبوة", "هوية بصرية", "تصنيع", "طباعة وتنفيذ"];
const priorities = ["الكل", "مرتفع", "متوسط", "منخفض"];

type OrderType = typeof orders[0];

const canAccessChat = (member: AdminTeamMember, order: OrderType): { canView: boolean; canSend: boolean; reason: string } => {
  const role = member.role;

  if (role === "مالك المنصة") {
    return { canView: true, canSend: true, reason: "" };
  }

  if (role === "منسق عملاء" || role === "منسقة عملاء" || role === "موظف دعم") {
    return { canView: true, canSend: true, reason: "" };
  }

  if (role.includes("مدير") && (member.department === "إدارة المشاريع" || role === "مدير مشاريع" || role === "مديرة مشاريع")) {
    const isManager = order.manager === member.name;
    return {
      canView: isManager,
      canSend: isManager,
      reason: isManager ? "" : `لا تملك صلاحية الوصول لمحادثات هذا الطلب. أنت لست مدير هذا المشروع (المدير: ${order.manager})`,
    };
  }

  if (role.includes("مصمم")) {
    const isDesigner = order.designer === member.name;
    return {
      canView: isDesigner,
      canSend: isDesigner,
      reason: isDesigner ? "" : `لا تملك صلاحية الوصول لمحادثات هذا الطلب. أنت لست المصمم المكلف بهذا المشروع${order.designer ? ` (المصمم: ${order.designer})` : ""}`,
    };
  }

  return {
    canView: false,
    canSend: false,
    reason: `دورك (${member.role}) لا يملك صلاحية الوصول إلى المحادثات الداخلية`,
  };
};

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [pathFilter, setPathFilter] = useState("الكل");
  const [priorityFilter, setPriorityFilter] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailTab, setDetailTab] = useState<"details" | "tracking" | "chat">("details");
  const [newMessage, setNewMessage] = useState("");

  const { currentMember } = useAdminAuth();

  const filteredOrders = orders.filter((order) => {
    const matchSearch = searchTerm === "" ||
      order.client.includes(searchTerm) ||
      order.id.includes(searchTerm) ||
      order.manager.includes(searchTerm);
    const matchStatus = statusFilter === "الكل" || order.status === statusFilter;
    const matchPath = pathFilter === "الكل" || order.path === pathFilter;
    const matchPriority = priorityFilter === "الكل" || order.priority === priorityFilter;
    return matchSearch && matchStatus && matchPath && matchPriority;
  });

  const getStatusDotColor = (status: string) => {
    if (status.includes("مكتمل") || status.includes("التسليم")) return "bg-emerald-500";
    if (status.includes("قيد") || status.includes("تطوير") || status.includes("تصميم")) return "bg-amber-500";
    if (status.includes("انتظار")) return "bg-rose-500";
    if (status.includes("تصنيع")) return "bg-orange-500";
    if (status.includes("اختيار")) return "bg-sky-500";
    return "bg-stone-400";
  };

  return (
    <div className="flex min-h-screen bg-stone-50" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-stone-900">إدارة الطلبات</h1>
            <p className="text-stone-400 text-xs">{orders.length} طلب إجمالي • {filteredOrders.length} طلب معروض</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              إضافة طلب جديد
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "جميع الطلبات", value: orders.length, color: "bg-stone-900" },
              { label: "قيد التنفيذ", value: orders.filter((o) => !o.status.includes("مكتمل") && !o.status.includes("التسليم")).length, color: "bg-amber-600" },
              { label: "مكتملة", value: orders.filter((o) => o.status.includes("مكتمل") || o.status.includes("التسليم")).length, color: "bg-emerald-600" },
              { label: "بانتظار الدفع", value: orders.filter((o) => o.paymentStatus === "غير مدفوع").length, color: "bg-rose-600" },
              { label: "إجمالي الإيرادات", value: `${orders.reduce((acc, o) => acc + o.paid, 0).toLocaleString()} ريال`, color: "bg-stone-900" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-stone-100">
                <div className={`w-1.5 h-1.5 rounded-full mb-2 ${stat.color}`}></div>
                <div className="text-lg font-black text-stone-900 mb-0.5">{stat.value}</div>
                <div className="text-stone-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-xs">
                <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="بحث عن عميل أو رقم طلب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-9 pl-4 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s === "الكل" ? "الحالة: الكل" : s}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Path Filter */}
                <div className="relative">
                  <select
                    value={pathFilter}
                    onChange={(e) => setPathFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {paths.map((p) => (
                      <option key={p} value={p}>{p === "الكل" ? "المسار: الكل" : p}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-xl py-2.5 pr-3 pl-8 text-xs font-semibold text-stone-600 outline-none focus:border-amber-400 transition-all cursor-pointer"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p === "الكل" ? "الأولوية: الكل" : p}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>

                {/* Clear */}
                {(searchTerm || statusFilter !== "الكل" || pathFilter !== "الكل" || priorityFilter !== "الكل") && (
                  <button
                    onClick={() => { setSearchTerm(""); setStatusFilter("الكل"); setPathFilter("الكل"); setPriorityFilter("الكل"); }}
                    className="text-rose-600 text-xs font-bold hover:text-rose-700 cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-close-circle-line"></i>
                    مسح الفلاتر
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">رقم الطلب</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">العميل</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المسار</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الحالة</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المبلغ</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الدفع</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المدير</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">المصمم</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">الأولوية</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">تاريخ التسليم</th>
                    <th className="text-right text-stone-400 text-xs font-bold px-6 py-4 whitespace-nowrap">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-stone-50 hover:bg-amber-50/50 transition-all">
                      <td className="px-6 py-4">
                        <span className="text-stone-500 text-xs font-mono">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-stone-900 text-sm font-bold">{order.client}</div>
                          <div className="text-stone-400 text-xs">{order.clientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-stone-100 rounded-lg px-2.5 py-1 text-stone-600 text-xs font-bold whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          {order.path}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-stone-900 text-sm font-bold whitespace-nowrap">{order.amount.toLocaleString()} ريال</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold whitespace-nowrap ${order.paymentColor}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-stone-700 text-xs font-semibold whitespace-nowrap">{order.manager}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-500 text-xs whitespace-nowrap">{order.designer || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold whitespace-nowrap ${order.priorityColor}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-500 text-xs whitespace-nowrap">{order.deadline}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setSelectedOrder(order); setDetailTab("details"); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all cursor-pointer"
                            title="عرض التفاصيل"
                          >
                            <i className="ri-eye-line text-sm"></i>
                          </button>
                          <button
                            onClick={() => { setSelectedOrder(order); setDetailTab("tracking"); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all cursor-pointer"
                            title="متابعة الطلب"
                          >
                            <i className="ri-road-map-line text-sm"></i>
                          </button>
                          {(() => {
                            const access = canAccessChat(currentMember, order);
                            if (!access.canView) {
                              return (
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-300 cursor-not-allowed relative"
                                  title={access.reason}
                                  disabled
                                >
                                  <i className="ri-lock-line text-sm"></i>
                                </button>
                              );
                            }
                            return (
                              <button
                                onClick={() => { setSelectedOrder(order); setDetailTab("chat"); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer relative"
                                title="المحادثات"
                              >
                                <i className="ri-chat-3-line text-sm"></i>
                                {orderMessages[order.id] && orderMessages[order.id].length > 0 && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {orderMessages[order.id].length}
                                  </span>
                                )}
                              </button>
                            );
                          })()}
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all cursor-pointer" title="تعديل">
                            <i className="ri-edit-line text-sm"></i>
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer" title="حذف">
                            <i className="ri-delete-bin-line text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-100 mx-auto mb-4">
                  <i className="ri-inbox-line text-stone-400 text-2xl"></i>
                </div>
                <p className="text-stone-500 font-semibold text-sm mb-1">لا توجد طلبات مطابقة</p>
                <p className="text-stone-400 text-xs">جرب تغيير معايير البحث أو الفلاتر</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
              <div className="text-stone-400 text-xs">
                عرض {filteredOrders.length} من {orders.length} طلب
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition-all cursor-pointer">
                  <i className="ri-arrow-right-s-line text-sm"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all cursor-pointer text-xs">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all cursor-pointer text-xs">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition-all cursor-pointer">
                  <i className="ri-arrow-left-s-line text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedOrder(null); setDetailTab("details"); }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[88vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(selectedOrder.status)}`}></div>
                  <div>
                    <h3 className="font-black text-stone-900 text-sm">{selectedOrder.id}</h3>
                    <p className="text-stone-400 text-xs">{selectedOrder.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDetailTab("details")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${detailTab === "details" ? "bg-amber-100 text-amber-700" : "text-stone-400 hover:bg-stone-50"}`}
                  >
                    <i className="ri-information-line ml-1"></i>
                    التفاصيل
                  </button>
                  <button
                    onClick={() => setDetailTab("tracking")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${detailTab === "tracking" ? "bg-sky-100 text-sky-700" : "text-stone-400 hover:bg-stone-50"}`}
                  >
                    <i className="ri-road-map-line ml-1"></i>
                    متابعة الطلب
                  </button>
                  <button
                    onClick={() => setDetailTab("chat")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                      detailTab === "chat"
                        ? "bg-emerald-100 text-emerald-700"
                        : (() => {
                            const access = canAccessChat(currentMember, selectedOrder);
                            return access.canView
                              ? "text-stone-400 hover:bg-stone-50"
                              : "text-stone-300 cursor-not-allowed";
                          })()
                    }`}
                    disabled={!canAccessChat(currentMember, selectedOrder).canView}
                    title={!canAccessChat(currentMember, selectedOrder).canView ? canAccessChat(currentMember, selectedOrder).reason : ""}
                  >
                    {canAccessChat(currentMember, selectedOrder).canView ? (
                      <i className="ri-chat-3-line ml-1"></i>
                    ) : (
                      <i className="ri-lock-line ml-1"></i>
                    )}
                    المحادثات
                    {(() => {
                      const msgs = orderMessages[selectedOrder.id];
                      if (msgs && msgs.length > 0 && canAccessChat(currentMember, selectedOrder).canView) {
                        return (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {msgs.length}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </button>
                  <button
                    onClick={() => { setSelectedOrder(null); setDetailTab("details"); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer mr-2"
                  >
                    <i className="ri-close-line text-stone-500"></i>
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Details Tab */}
                {detailTab === "details" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-stone-900 text-sm font-bold mb-3">حالة الطلب</h4>
                      <div className="flex items-center gap-0">
                        {["تم الاستلام", "قيد المراجعة", "قيد التنفيذ", "التسليم"].map((step, i) => {
                          const isDone = i < 2;
                          const isCurrent = i === 2 && selectedOrder.status.includes("قيد");
                          return (
                            <div key={step} className="flex-1 flex items-center">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                                  isDone ? "bg-emerald-500 text-white" :
                                  isCurrent ? "bg-amber-500 text-white" :
                                  "bg-stone-100 text-stone-400"
                                }`}>
                                  {isDone ? <i className="ri-check-line text-sm"></i> : i + 1}
                                </div>
                                <span className={`text-[10px] font-semibold whitespace-nowrap ${isDone ? "text-emerald-600" : isCurrent ? "text-amber-600" : "text-stone-400"}`}>
                                  {step}
                                </span>
                              </div>
                              {i < 3 && (
                                <div className={`flex-1 h-0.5 mx-1 ${i < 2 ? "bg-emerald-400" : "bg-stone-200"}`}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">العميل</div>
                        <div className="text-stone-900 text-sm font-bold">{selectedOrder.client}</div>
                        <div className="text-stone-500 text-xs">{selectedOrder.clientEmail}</div>
                        <div className="text-stone-500 text-xs">{selectedOrder.clientPhone}</div>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">المسار</div>
                        <div className="text-stone-900 text-sm font-bold">{selectedOrder.path}</div>
                        <div className="text-stone-500 text-xs">مسار {selectedOrder.pathLetter}</div>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">المبلغ</div>
                        <div className="text-stone-900 text-sm font-bold">{selectedOrder.amount.toLocaleString()} ريال</div>
                        <div className="text-stone-500 text-xs">المدفوع: {selectedOrder.paid.toLocaleString()} ريال</div>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">الفريق</div>
                        <div className="text-stone-900 text-xs font-bold">المدير: {selectedOrder.manager}</div>
                        <div className="text-stone-500 text-xs">المصمم: {selectedOrder.designer || "غير محدد"}</div>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">تاريخ الإنشاء</div>
                        <div className="text-stone-900 text-sm font-bold">{selectedOrder.createdDate}</div>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="text-stone-400 text-xs mb-1">الموعد النهائي</div>
                        <div className={`text-sm font-bold ${selectedOrder.priority === "مرتفع" ? "text-rose-600" : "text-stone-900"}`}>{selectedOrder.deadline}</div>
                      </div>
                    </div>

                    {selectedOrder.attachments > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-stone-900 text-sm font-bold">المرفقات</h4>
                          <span className="text-stone-400 text-xs">{selectedOrder.attachments} ملفات</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: Math.min(selectedOrder.attachments, 4) }).map((_, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-all">
                              <i className="ri-image-line text-stone-400 text-xl"></i>
                            </div>
                          ))}
                          {selectedOrder.attachments > 4 && (
                            <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-all">
                              <span className="text-stone-400 text-xs font-bold">+{selectedOrder.attachments - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedOrder.notes && (
                      <div>
                        <h4 className="text-stone-900 text-sm font-bold mb-2">ملاحظات</h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-amber-800 text-xs leading-relaxed">{selectedOrder.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tracking Tab */}
                {detailTab === "tracking" && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-100">
                        <i className="ri-road-map-line text-sky-600 text-sm"></i>
                      </div>
                      <div>
                        <h4 className="text-stone-900 text-sm font-bold">سجل متابعة الطلب</h4>
                        <p className="text-stone-400 text-xs">{selectedOrder.client} — {selectedOrder.id}</p>
                      </div>
                    </div>

                    {(() => {
                      const tracking = orderTracking[selectedOrder.id];
                      if (!tracking || tracking.length === 0) {
                        return (
                          <div className="py-12 text-center">
                            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-stone-100 mx-auto mb-3">
                              <i className="ri-road-map-line text-stone-400 text-xl"></i>
                            </div>
                            <p className="text-stone-500 text-sm font-semibold mb-1">لا توجد أحداث متابعة بعد</p>
                            <p className="text-stone-400 text-xs">سيتم تسجيل جميع مراحل الطلب هنا</p>
                          </div>
                        );
                      }
                      return (
                        <div className="relative pr-6">
                          <div className="absolute right-3 top-2 bottom-2 w-0.5 bg-stone-200"></div>
                          <div className="space-y-0">
                            {tracking.map((event, i) => (
                              <div key={i} className="relative pb-6 last:pb-0">
                                <div className={`absolute right-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${i === 0 ? "bg-sky-500" : i === tracking.length - 1 ? "bg-amber-500" : "bg-stone-300"}`}></div>
                                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-stone-100`}>
                                        <i className={`${event.icon} ${event.iconColor} text-xs`}></i>
                                      </div>
                                      <span className="text-stone-900 text-xs font-bold">{event.status}</span>
                                    </div>
                                    <span className="text-stone-400 text-[10px] whitespace-nowrap">{event.date} — {event.time}</span>
                                  </div>
                                  <p className="text-stone-600 text-xs leading-relaxed mb-2 pr-8">{event.description}</p>
                                  <div className="flex items-center gap-1.5 pr-8">
                                    <span className="text-stone-400 text-[10px]">بواسطة:</span>
                                    <span className="text-stone-500 text-[10px] font-bold">{event.user}</span>
                                    <span className="text-stone-300 text-[10px]">•</span>
                                    <span className="text-stone-400 text-[10px]">{event.userRole}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Add tracking event button */}
                    <div className="mt-5 pt-4 border-t border-stone-100">
                      <button className="w-full py-2.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <i className="ri-add-line"></i>
                        إضافة حدث متابعة جديد
                      </button>
                    </div>
                  </div>
                )}

                {/* Chat Tab */}
                {detailTab === "chat" && (
                  <div className="flex flex-col h-full">
                    {(() => {
                      const access = canAccessChat(currentMember, selectedOrder);

                      if (!access.canView) {
                        return (
                          <div className="py-16 text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-rose-50 mx-auto mb-4">
                              <i className="ri-lock-line text-rose-400 text-2xl"></i>
                            </div>
                            <p className="text-stone-700 text-sm font-bold mb-2">لا تملك صلاحية الوصول</p>
                            <p className="text-stone-400 text-xs max-w-sm mx-auto leading-relaxed">{access.reason}</p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-stone-50 rounded-xl px-4 py-2 border border-stone-100">
                              <span className="text-stone-500 text-xs">المستخدم الحالي:</span>
                              <span className="text-stone-700 text-xs font-bold">{currentMember.name}</span>
                              <span className="text-stone-300 text-xs">•</span>
                              <span className="text-stone-500 text-xs">{currentMember.role}</span>
                            </div>
                            <p className="text-stone-300 text-[10px] mt-3">يمكنك تغيير المستخدم من القائمة الجانبية</p>
                          </div>
                        );
                      }

                      return (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100">
                              <i className="ri-chat-3-line text-emerald-600 text-sm"></i>
                            </div>
                            <div>
                              <h4 className="text-stone-900 text-sm font-bold">المحادثات الداخلية</h4>
                              <p className="text-stone-400 text-xs">الفريق — {selectedOrder.client}</p>
                            </div>
                          </div>

                          {(() => {
                            const msgs = orderMessages[selectedOrder.id];
                            if (!msgs || msgs.length === 0) {
                              return (
                                <div className="py-12 text-center">
                                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-stone-100 mx-auto mb-3">
                                    <i className="ri-chat-3-line text-stone-400 text-xl"></i>
                                  </div>
                                  <p className="text-stone-500 text-sm font-semibold mb-1">لا توجد محادثات بعد</p>
                                  <p className="text-stone-400 text-xs">ابدأ محادثة مع الفريق حول هذا الطلب</p>
                                </div>
                              );
                            }

                            const groupedMsgs: Record<string, typeof msgs> = {};
                            msgs.forEach((msg) => {
                              if (!groupedMsgs[msg.date]) groupedMsgs[msg.date] = [];
                              groupedMsgs[msg.date].push(msg);
                            });

                            return (
                              <div className="flex-1 space-y-5 mb-4">
                                {Object.entries(groupedMsgs).map(([date, dateMsgs]) => (
                                  <div key={date}>
                                    <div className="flex items-center justify-center mb-3">
                                      <span className="bg-stone-100 text-stone-400 text-[10px] font-semibold px-3 py-1 rounded-full">{date}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                      {dateMsgs.map((msg) => {
                                        const isMine = msg.sender === currentMember.name;
                                        return (
                                          <div key={msg.id} className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.roleColor} text-[10px] font-bold`}>
                                              {msg.sender.charAt(0)}
                                            </div>
                                            <div className={`max-w-[75%] ${isMine ? "items-end" : ""}`}>
                                              <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="text-stone-700 text-[11px] font-bold">{msg.sender}</span>
                                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${msg.roleColor}`}>{msg.role}</span>
                                                <span className="text-stone-300 text-[10px]">{msg.time}</span>
                                              </div>
                                              <div className={`rounded-2xl px-3.5 py-2.5 ${isMine ? "bg-amber-50 border border-amber-100 rounded-tl-none" : "bg-stone-50 border border-stone-100 rounded-tr-none"}`}>
                                                <p className="text-stone-700 text-xs leading-relaxed">{msg.message}</p>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}

                          {/* Message Input */}
                          <div className="border-t border-stone-100 pt-3 mt-auto">
                            {access.canSend ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  placeholder="اكتب رسالتك..."
                                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-700 outline-none focus:border-emerald-400 transition-all"
                                  onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) { setNewMessage(""); } }}
                                />
                                <button
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${newMessage.trim() ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-stone-100 text-stone-400"}`}
                                  onClick={() => { if (newMessage.trim()) setNewMessage(""); }}
                                >
                                  <i className="ri-send-plane-fill text-sm"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
                                <i className="ri-information-line text-amber-500 text-sm"></i>
                                <span className="text-amber-700 text-xs font-medium">يمكنك مشاهدة المحادثات فقط — الإرسال غير متاح لدورك الحالي</span>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-white border-t border-stone-100 px-6 py-4 flex items-center justify-between rounded-b-3xl shrink-0">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer whitespace-nowrap">
                    حذف الطلب
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap">
                    طباعة
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedOrder(null); setDetailTab("details"); }}
                    className="px-4 py-2 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap"
                  >
                    إغلاق
                  </button>
                  <button className="px-5 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                    <i className="ri-edit-line text-sm"></i>
                    تعديل الطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <h3 className="font-black text-stone-900 text-sm">إضافة طلب جديد</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-stone-500"></i>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">اسم العميل</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="اسم الشركة أو العميل" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">البريد الإلكتروني</label>
                    <input type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">رقم الهاتف</label>
                    <input type="tel" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="05xxxxxxxx" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المسار</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      {paths.filter((p) => p !== "الكل").map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المبلغ الإجمالي (ريال)</label>
                    <input type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المبلغ المدفوع (ريال)</label>
                    <input type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">مدير المشروع</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      <option>أحمد الزهراني</option>
                      <option>سارة المطيري</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">المصمم</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      <option>بدون مصمم</option>
                      <option>نورة القحطاني</option>
                      <option>فهد العتيبي</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">الأولوية</label>
                    <select className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all cursor-pointer">
                      <option>متوسط</option>
                      <option>مرتفع</option>
                      <option>منخفض</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs font-bold mb-1.5 block">تاريخ التسليم</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-stone-500 text-xs font-bold mb-1.5 block">ملاحظات</label>
                  <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-amber-400 transition-all h-24 resize-none" placeholder="أي ملاحظات إضافية..."></textarea>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-stone-100 px-6 py-4 flex items-center justify-end gap-2 rounded-b-3xl">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                  <i className="ri-check-line"></i>
                  إنشاء الطلب
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;