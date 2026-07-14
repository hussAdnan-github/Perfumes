import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/pages/admin/components/AdminSidebar';
import { paymentStats, bankAccounts, payments, paymentTimeline, monthlyPaymentChart } from '@/mocks/adminData';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ar-SA').format(amount) + ' ريال';
}

function getMaxMonthlyAmount() {
  return Math.max(...monthlyPaymentChart.map(m => m.amount), 1);
}

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionTarget, setActionTarget] = useState<typeof payments[0] | null>(null);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [hoveredChartBar, setHoveredChartBar] = useState<number | null>(null);

  const maxAmount = getMaxMonthlyAmount();

  const filteredPayments = useMemo(() => {
    let result = payments;
    if (activeTab === 'confirmed') result = result.filter(p => p.status === 'مؤكد');
    if (activeTab === 'pending') result = result.filter(p => p.status === 'بانتظار التأكيد' || p.status === 'غير مدفوع');
    if (activeTab === 'rejected') result = result.filter(p => p.status === 'مرفوض');
    if (selectedBank !== 'all') result = result.filter(p => p.bank === selectedBank);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.transferRef.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, searchQuery, selectedBank]);

  const openDetail = (p: typeof payments[0]) => {
    setSelectedPayment(p);
    setShowDetailModal(true);
  };

  const openConfirm = (p: typeof payments[0]) => {
    setActionTarget(p);
    setShowConfirmModal(true);
  };

  const openReject = (p: typeof payments[0]) => {
    setActionTarget(p);
    setShowRejectModal(true);
  };

  const handleConfirmTransfer = () => {
    setShowConfirmModal(false);
    setActionTarget(null);
  };

  const handleRejectTransfer = () => {
    setShowRejectModal(false);
    setActionTarget(null);
  };

  const uniqueBanks = useMemo(() => {
    const banks = new Set(payments.map(p => p.bank).filter(b => b !== '—'));
    return Array.from(banks);
  }, []);

  return (
    <div className="flex min-h-screen bg-background-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-background-50 border-b border-background-200/70 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground-950">المدفوعات والحوالات</h1>
              <p className="text-sm text-foreground-600 mt-1">تتبع المدفوعات واستقبال الحوالات البنكية وإدارة الحسابات</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTimelinePanel(!showTimelinePanel)}
                className="px-4 py-2.5 rounded-lg border border-background-200/70 text-sm font-semibold text-foreground-700 hover:bg-background-100 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-history-line text-base"></i>
                </div>
                سجل النشاطات
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-lg bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line text-base"></i>
                </div>
                تسجيل حوالة جديدة
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background-50 rounded-xl border border-background-200/70 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-check-double-line text-emerald-600 text-xl"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground-600">المدفوعات المؤكدة</div>
                  <div className="text-xl font-black text-foreground-950">{paymentStats.completedPayments}</div>
                  <div className="text-xs text-foreground-600">{formatCurrency(paymentStats.totalCollected)}</div>
                </div>
              </div>
              <div className="bg-background-50 rounded-xl border border-background-200/70 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-hourglass-line text-amber-600 text-xl"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground-600">بانتظار التأكيد</div>
                  <div className="text-xl font-black text-foreground-950">{paymentStats.pendingPayments}</div>
                  <div className="text-xs text-foreground-600">{formatCurrency(paymentStats.pendingAmount)}</div>
                </div>
              </div>
              <div className="bg-background-50 rounded-xl border border-background-200/70 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-bank-line text-sky-600 text-xl"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground-600">الحوالات البنكية</div>
                  <div className="text-xl font-black text-foreground-950">{paymentStats.totalBankTransfers}</div>
                  <div className="text-xs text-foreground-600">{paymentStats.confirmedTransfers} حوالة مؤكدة</div>
                </div>
              </div>
              <div className="bg-background-50 rounded-xl border border-background-200/70 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-close-circle-line text-rose-600 text-xl"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground-600">المرفوضة</div>
                  <div className="text-xl font-black text-foreground-950">{paymentStats.rejectedPayments}</div>
                  <div className="text-xs text-foreground-600">من إجمالي {paymentStats.totalPayments}</div>
                </div>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-background-50 rounded-xl border border-background-200/70 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                    <i className="ri-building-line text-accent-600 text-lg"></i>
                  </div>
                  <h3 className="text-base font-bold text-foreground-950">الحسابات البنكية</h3>
                  <span className="text-xs font-semibold text-foreground-600 bg-background-100 px-2 py-0.5 rounded">{bankAccounts.length} حسابات</span>
                </div>
                <button className="px-3 py-2 rounded-lg border border-background-200/70 text-xs font-semibold text-foreground-600 hover:bg-background-100 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-add-line text-sm"></i>
                  </div>
                  إضافة حساب
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bankAccounts.map((acc) => (
                  <div key={acc.id} className={`rounded-xl border p-4 transition-all ${acc.isPrimary ? 'border-accent-300 bg-accent-50/30' : 'border-background-200/70 hover:border-background-300/60'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${acc.isPrimary ? 'bg-accent-500' : 'bg-secondary-500'}`}>
                          <i className={`${acc.bankIcon} text-white text-base`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground-950">{acc.bank}</div>
                          <div className="text-[11px] text-foreground-600">{acc.branch}</div>
                        </div>
                      </div>
                      {acc.isPrimary && (
                        <span className="bg-accent-100 text-accent-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">أساسي</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground-600">صاحب الحساب</span>
                        <span className="font-semibold text-foreground-950">{acc.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground-600">رقم الآيبان</span>
                        <button
                          className="font-mono text-xs font-semibold text-foreground-800 hover:text-accent-600 cursor-pointer whitespace-nowrap flex items-center gap-1"
                          onClick={() => navigator.clipboard.writeText(acc.iban.replace(/\s/g, ''))}
                        >
                          {acc.iban}
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-file-copy-line text-[10px]"></i>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-background-50 rounded-xl border border-background-200/70 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center">
                    <i className="ri-bar-chart-line text-secondary-600 text-lg"></i>
                  </div>
                  <h3 className="text-base font-bold text-foreground-950">المدفوعات الشهرية — ٢٠٢٦</h3>
                </div>
                {hoveredChartBar !== null && monthlyPaymentChart[hoveredChartBar] && monthlyPaymentChart[hoveredChartBar].amount > 0 && (
                  <div className="text-sm font-semibold text-foreground-700 bg-background-100 px-3 py-1.5 rounded-lg">
                    {monthlyPaymentChart[hoveredChartBar].month}: {formatCurrency(monthlyPaymentChart[hoveredChartBar].amount)} — {monthlyPaymentChart[hoveredChartBar].transfers} حوالة
                  </div>
                )}
              </div>
              <div className="flex items-end gap-2 h-48 px-1">
                {monthlyPaymentChart.map((item, i) => {
                  const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                  const hasData = item.amount > 0;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                      onMouseEnter={() => setHoveredChartBar(i)}
                      onMouseLeave={() => setHoveredChartBar(null)}
                    >
                      <span className="text-[10px] font-semibold text-foreground-600 opacity-0 group-hover:opacity-100 transition-opacity">{hasData ? formatCurrency(item.amount) : ''}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${hasData ? (hoveredChartBar === i ? 'bg-primary-500' : 'bg-primary-400') : 'bg-background-200/70'}`}
                        style={{ height: `${Math.max(pct, hasData ? 4 : 2)}%` }}
                      ></div>
                      <span className="text-[10px] font-semibold text-foreground-600">{item.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-xs text-foreground-600">
                  <div className="w-3 h-3 rounded bg-primary-400"></div>
                  المبلغ المحصل
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-600">
                  <div className="w-3 h-3 rounded bg-background-200"></div>
                  قيد الانتظار
                </div>
              </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
              {/* Tabs + Filters */}
              <div className="px-5 pt-5 pb-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center bg-background-100 rounded-full p-1">
                    {([
                      { key: 'all', label: 'الكل', count: paymentStats.totalPayments },
                      { key: 'confirmed', label: 'مؤكد', count: paymentStats.completedPayments },
                      { key: 'pending', label: 'بانتظار التأكيد', count: paymentStats.pendingPayments },
                      { key: 'rejected', label: 'مرفوض', count: paymentStats.rejectedPayments },
                    ] as const).map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          activeTab === tab.key
                            ? 'bg-background-50 text-foreground-950 shadow-sm'
                            : 'text-foreground-600 hover:text-foreground-900'
                        }`}
                      >
                        {tab.label}
                        <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-foreground-600' : 'text-foreground-500'}`}>({tab.count})</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i className="ri-search-line text-foreground-500 text-sm"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="بحث بالرقم، العميل، رقم الحوالة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pr-9 pl-4 py-2 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 focus:outline-none focus:border-primary-400 transition-colors"
                      />
                    </div>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 focus:outline-none focus:border-primary-400 cursor-pointer"
                    >
                      <option value="all">جميع البنوك</option>
                      {uniqueBanks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="px-5 py-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/70">
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">رقم العملية</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">الطلب</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">العميل</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">المبلغ</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">النوع</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">البنك المستلم</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">تاريخ التحويل</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">الحالة</th>
                      <th className="text-right py-3 px-3 text-xs font-bold text-foreground-600 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="border-b border-background-100 hover:bg-background-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <button onClick={() => openDetail(p)} className="font-mono text-xs font-bold text-primary-500 hover:text-primary-600 cursor-pointer whitespace-nowrap">{p.id}</button>
                        </td>
                        <td className="py-3 px-3">
                          <Link to="/admin/orders" className="font-mono text-xs text-foreground-600 hover:text-primary-500 whitespace-nowrap">{p.orderId}</Link>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm font-semibold text-foreground-900 whitespace-nowrap">{p.client}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="whitespace-nowrap">
                            <span className="text-sm font-bold text-foreground-950">{formatCurrency(p.amount)}</span>
                            {p.isPartial && p.amount > 0 && (
                              <span className="block text-[11px] text-foreground-600">من {formatCurrency(p.totalOrder)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${p.typeColor}`}>
                            <div className="w-3 h-3 flex items-center justify-center">
                              <i className={`${p.typeIcon} text-[11px]`}></i>
                            </div>
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm text-foreground-800 whitespace-nowrap">{p.bank}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-foreground-700 whitespace-nowrap">{p.paymentDate || '—'}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${p.statusColor}`}>
                            <div className="w-3 h-3 flex items-center justify-center">
                              <i className={`${p.statusIcon} text-[11px]`}></i>
                            </div>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openDetail(p)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-500 hover:text-primary-500 hover:bg-background-100 transition-all cursor-pointer"
                              title="عرض التفاصيل"
                            >
                              <i className="ri-eye-line text-base"></i>
                            </button>
                            {p.status === 'بانتظار التأكيد' && (
                              <>
                                <button
                                  onClick={() => openConfirm(p)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                                  title="تأكيد الحوالة"
                                >
                                  <i className="ri-check-line text-base"></i>
                                </button>
                                <button
                                  onClick={() => openReject(p)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                  title="رفض الحوالة"
                                >
                                  <i className="ri-close-line text-base"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPayments.length === 0 && (
                  <div className="text-center py-12 text-foreground-500 text-sm">لا توجد نتائج مطابقة للبحث</div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-background-200/70 flex items-center justify-between">
                <span className="text-xs text-foreground-600">عرض {filteredPayments.length} من {payments.length} عملية</span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-500 hover:bg-background-100 transition-all cursor-pointer disabled:opacity-30" disabled>
                    <i className="ri-arrow-right-s-line text-base"></i>
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold bg-primary-500 text-background-50 rounded-lg">١</span>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-500 hover:bg-background-100 transition-all cursor-pointer">
                    <i className="ri-arrow-left-s-line text-base"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Side Panel */}
          {showTimelinePanel && (
            <div className="w-80 border-r-0 border-l border-background-200/70 bg-background-50 p-5 overflow-y-auto max-h-[calc(100vh-60px)] sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent-100 flex items-center justify-center">
                    <i className="ri-history-line text-accent-600 text-sm"></i>
                  </div>
                  <h3 className="text-sm font-bold text-foreground-950">آخر النشاطات</h3>
                </div>
                <button
                  onClick={() => setShowTimelinePanel(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-500 hover:bg-background-100 transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
              <div className="space-y-1">
                {paymentTimeline.map((item, i) => (
                  <div key={item.id} className="relative flex gap-3 pb-4">
                    {i < paymentTimeline.length - 1 && (
                      <div className="absolute top-8 right-3.5 w-px h-full bg-background-200/70"></div>
                    )}
                    <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 relative z-10`}>
                      <i className={`${item.icon} text-white text-[10px]`}></i>
                    </div>
                    <div className="min-w-0 pb-1">
                      <div className="text-sm font-semibold text-foreground-900">{item.action}</div>
                      {item.amount !== '—' && (
                        <div className="text-xs font-bold text-foreground-800 mt-0.5">{item.amount}</div>
                      )}
                      {item.client !== '—' && (
                        <div className="text-xs text-foreground-600 mt-0.5">{item.client}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-foreground-500">{item.time}</span>
                        <span className="text-[11px] text-foreground-500">— {item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setShowDetailModal(false)}></div>
          <div className="relative bg-background-50 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-background-200/70 mx-4">
            <div className="sticky top-0 bg-background-50 border-b border-background-200/70 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPayment.statusColor}`}>
                  <i className={`${selectedPayment.statusIcon} text-lg`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground-950">تفاصيل العملية</h3>
                  <span className="font-mono text-xs text-foreground-600">{selectedPayment.id}</span>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-500 hover:bg-background-100 transition-all cursor-pointer">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status Banner */}
              <div className={`rounded-xl p-4 border border-background-200/70 ${selectedPayment.statusColor.replace('text-', 'bg-').replace('100', '50/50')}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPayment.statusColor}`}>
                    <i className={`${selectedPayment.statusIcon} text-lg`}></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground-950">حالة العملية: {selectedPayment.status}</div>
                    <div className="text-xs text-foreground-600 mt-0.5">{selectedPayment.notes}</div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">العميل</div>
                  <div className="text-sm font-bold text-foreground-950">{selectedPayment.client}</div>
                  <div className="text-xs text-foreground-600 mt-0.5">{selectedPayment.clientEmail}</div>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">رقم الطلب</div>
                  <Link to="/admin/orders" className="font-mono text-sm font-bold text-primary-500 hover:text-primary-600">{selectedPayment.orderId}</Link>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">المبلغ المحول</div>
                  <div className="text-lg font-black text-foreground-950">{formatCurrency(selectedPayment.amount)}</div>
                  {selectedPayment.isPartial && selectedPayment.amount > 0 && (
                    <div className="text-xs text-foreground-600 mt-0.5">من إجمالي {formatCurrency(selectedPayment.totalOrder)} — المتبقي {formatCurrency(selectedPayment.remainingAmount)}</div>
                  )}
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">نوع العملية</div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${selectedPayment.typeColor}`}>
                    <i className={`${selectedPayment.typeIcon} text-[11px]`}></i>
                    {selectedPayment.type}
                  </span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">البنك المستلم</div>
                  <div className="text-sm font-bold text-foreground-950">{selectedPayment.bank}</div>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">اسم المحول</div>
                  <div className="text-sm font-bold text-foreground-950">{selectedPayment.senderName}</div>
                  <div className="text-xs text-foreground-600 mt-0.5">من بنك: {selectedPayment.senderBank}</div>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">رقم مرجع الحوالة</div>
                  <button
                    className="font-mono text-sm font-bold text-foreground-950 hover:text-primary-500 cursor-pointer flex items-center gap-1.5"
                    onClick={() => navigator.clipboard.writeText(selectedPayment.transferRef)}
                  >
                    {selectedPayment.transferRef}
                    <i className="ri-file-copy-line text-xs"></i>
                  </button>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">تاريخ التحويل</div>
                  <div className="text-sm font-bold text-foreground-950">{selectedPayment.paymentDate || '—'}</div>
                  {selectedPayment.receivedDate && (
                    <div className="text-xs text-foreground-600 mt-0.5">تم الاستلام: {selectedPayment.receivedDate}</div>
                  )}
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-background-200/70">
                  <div className="text-xs font-semibold text-foreground-600 mb-1">تم التأكيد بواسطة</div>
                  <div className="text-sm font-bold text-foreground-950">{selectedPayment.verifiedBy || '—'}</div>
                </div>
              </div>

              {selectedPayment.status === 'بانتظار التأكيد' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowDetailModal(false); openConfirm(selectedPayment); }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line text-base"></i>
                    تأكيد الحوالة
                  </button>
                  <button
                    onClick={() => { setShowDetailModal(false); openReject(selectedPayment); }}
                    className="flex-1 py-3 rounded-xl border border-rose-300 text-rose-600 text-sm font-bold hover:bg-rose-50 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-line text-base"></i>
                    رفض الحوالة
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-background-50 rounded-2xl w-full max-w-md shadow-2xl border border-background-200/70 mx-4 p-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-double-line text-emerald-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-foreground-950 mb-2">تأكيد الحوالة</h3>
              <p className="text-sm text-foreground-600 mb-4">
                هل أنت متأكد من تأكيد استلام الحوالة بقيمة <strong className="text-foreground-950">{formatCurrency(actionTarget.amount)}</strong> من <strong className="text-foreground-950">{actionTarget.client}</strong>؟
              </p>
              <div className="bg-background-100 rounded-xl p-3 mb-5 text-right">
                <div className="text-xs text-foreground-600">رقم المرجع: <span className="font-mono font-bold text-foreground-950">{actionTarget.transferRef}</span></div>
                <div className="text-xs text-foreground-600 mt-1">البنك المستلم: <span className="font-bold text-foreground-950">{actionTarget.bank}</span></div>
              </div>
              <p className="text-xs text-foreground-500 mb-5">سيتم تحديث حالة الطلب تلقائياً وإشعار العميل بتأكيد الاستلام</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-background-200/70 text-sm font-semibold text-foreground-700 hover:bg-background-100 transition-all cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all cursor-pointer whitespace-nowrap"
              >
                نعم، تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}></div>
          <div className="relative bg-background-50 rounded-2xl w-full max-w-md shadow-2xl border border-background-200/70 mx-4 p-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-close-circle-line text-rose-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-foreground-950 mb-2">رفض الحوالة</h3>
              <p className="text-sm text-foreground-600 mb-4">
                هل أنت متأكد من رفض الحوالة بقيمة <strong className="text-foreground-950">{formatCurrency(actionTarget.amount)}</strong> من <strong className="text-foreground-950">{actionTarget.client}</strong>؟
              </p>
              <div className="bg-background-100 rounded-xl p-3 mb-5 text-right">
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">سبب الرفض</label>
                <textarea
                  className="w-full px-3 py-2 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 resize-none focus:outline-none focus:border-rose-300"
                  rows={3}
                  placeholder="اكتب سبب رفض الحوالة..."
                ></textarea>
              </div>
              <p className="text-xs text-foreground-500 mb-5">سيتم إشعار العميل بسبب الرفض وإرجاع المبلغ</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-background-200/70 text-sm font-semibold text-foreground-700 hover:bg-background-100 transition-all cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectTransfer}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-all cursor-pointer whitespace-nowrap"
              >
                نعم، رفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-background-50 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border border-background-200/70 mx-4">
            <div className="sticky top-0 bg-background-50 border-b border-background-200/70 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <i className="ri-bank-line text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-foreground-950">تسجيل حوالة جديدة</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-500 hover:bg-background-100 transition-all cursor-pointer">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">رقم الطلب</label>
                  <select className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 focus:outline-none focus:border-primary-400 cursor-pointer">
                    <option value="">اختر الطلب...</option>
                    <option value="ORD-2026-089">ORD-2026-089 — شركة الأصالة</option>
                    <option value="ORD-2026-088">ORD-2026-088 — نفحات الخليج</option>
                    <option value="ORD-2026-086">ORD-2026-086 — أريج الشرق</option>
                    <option value="ORD-2026-084">ORD-2026-084 — روائح الأصالة</option>
                    <option value="ORD-2026-083">ORD-2026-083 — بخور الأصيل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">البنك المستلم</label>
                  <select className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 focus:outline-none focus:border-primary-400 cursor-pointer">
                    <option value="">اختر البنك...</option>
                    {bankAccounts.map(acc => (
                      <option key={acc.id} value={acc.bank}>{acc.bank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">المبلغ (ريال)</label>
                  <input type="number" className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 focus:outline-none focus:border-primary-400" placeholder="٠.٠٠" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">تاريخ التحويل</label>
                  <input type="date" className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 focus:outline-none focus:border-primary-400 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">اسم المحول</label>
                  <input type="text" className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 focus:outline-none focus:border-primary-400" placeholder="اسم المحول كما يظهر في الحوالة" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">البنك المحول منه</label>
                  <input type="text" className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 focus:outline-none focus:border-primary-400" placeholder="اسم البنك المحول منه" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">رقم مرجع الحوالة</label>
                  <input type="text" className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 focus:outline-none focus:border-primary-400" placeholder="TRF..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1.5">الحالة</label>
                  <select className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 focus:outline-none focus:border-primary-400 cursor-pointer">
                    <option value="pending">بانتظار التأكيد</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1.5">ملاحظات</label>
                <textarea className="w-full px-3 py-2.5 text-sm rounded-lg border border-background-200/70 bg-background-50 text-foreground-950 placeholder:text-foreground-500 resize-none focus:outline-none focus:border-primary-400" rows={2} placeholder="أي ملاحظات إضافية..."></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-background-200/70 text-sm font-semibold text-foreground-700 hover:bg-background-100 transition-all cursor-pointer whitespace-nowrap">إلغاء</button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <i className="ri-save-line text-base"></i>
                  حفظ العملية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;