import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import type { adminProjects, adminProjectStats, adminProjectCategories } from "@/mocks/adminData";

type Project = typeof adminProjects[0];
type ProjectStats = typeof adminProjectStats;
type ProjectCategory = typeof adminProjectCategories[0];

function formatCurrency(value: number): string {
  return `${value.toLocaleString()} ريال`;
}

function getArabicLabel(categories: ProjectCategory[], key: string): string {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.label : key;
}

export function exportProjectsToExcel(
  projects: Project[],
  stats: ProjectStats,
  categories: ProjectCategory[]
) {
  const headers = [
    "رقم المشروع",
    "اسم المشروع",
    "العميل",
    "التصنيف",
    "الحالة",
    "نسبة الإنجاز",
    "الميزانية",
    "المدفوع",
    "المتبقي",
    "الأولوية",
    "مدير المشروع",
    "المصمم",
    "تاريخ الإنشاء",
    "موعد التسليم",
    "آخر تحديث",
    "مستوى الخطر",
    "الوصف",
    "الملاحظات",
  ];

  const rows = projects.map((p) => [
    p.id,
    p.name,
    p.client,
    getArabicLabel(categories, p.category),
    p.status,
    `${p.progress}%`,
    p.budget,
    p.paid,
    p.budget - p.paid,
    p.priority,
    p.manager,
    p.designer || "—",
    p.createdDate,
    p.deadline,
    p.lastUpdate,
    p.risk,
    p.description,
    p.notes || "—",
  ]);

  const summaryRows = [
    [],
    ["--- إحصائيات عامة ---", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["إجمالي المشاريع", stats.total, "", "النشطة", stats.active, "", "المكتملة", stats.completed, "", "المعرضة للخطر", stats.atRisk, "", "", "", "", "", "", ""],
    ["إجمالي الميزانية", formatCurrency(stats.totalBudget), "", "المدفوع", formatCurrency(stats.totalPaid), "", "المعلق", formatCurrency(stats.pendingAmount), "", "متوسط الإنجاز", `${stats.avgProgress}%`, "", "", "", "", "", "", ""],
  ];

  const allRows = [headers, ...rows, ...summaryRows];

  const ws = XLSX.utils.aoa_to_sheet(allRows);

  ws["!rtl"] = true;

  const colWidths = [18, 28, 22, 18, 18, 12, 14, 14, 14, 12, 20, 18, 14, 14, 14, 14, 40, 40];
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "تقرير المشاريع");

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  XLSX.writeFile(wb, `تقرير-المشاريع-${dateStr}.xlsx`);
}

export function exportProjectsToPDF(
  projects: Project[],
  stats: ProjectStats,
  categories: ProjectCategory[]
) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>تقرير المشاريع - ${dateStr}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Tajawal', sans-serif; padding: 40px; color: #1c1917; background: #fff; }
  .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #d97706; padding-bottom: 20px; }
  .header h1 { font-size: 28px; font-weight: 900; color: #1c1917; margin-bottom: 6px; }
  .header p { font-size: 14px; color: #78716c; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 30px; }
  .stat-card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-card .value { font-size: 22px; font-weight: 900; color: #1c1917; }
  .stat-card .label { font-size: 12px; color: #78716c; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
  thead { background: #fafaf9; }
  th { padding: 10px 8px; text-align: right; font-weight: 700; color: #57534e; border-bottom: 2px solid #e7e5e4; white-space: nowrap; font-size: 11px; }
  td { padding: 8px; border-bottom: 1px solid #f5f5f4; color: #44403c; }
  tr:nth-child(even) { background: #fafaf9; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .badge-high { background: #ffe4e6; color: #be123c; }
  .badge-medium { background: #fef3c7; color: #b45309; }
  .badge-low { background: #dcfce7; color: #15803d; }
  .badge-urgent { background: #fecaca; color: #dc2626; }
  .badge-complete { background: #d1fae5; color: #059669; }
  .progress-bar { width: 60px; height: 6px; background: #e7e5e4; border-radius: 3px; overflow: hidden; display: inline-block; vertical-align: middle; margin-left: 6px; }
  .progress-fill { height: 100%; border-radius: 3px; background: #d97706; }
  .progress-fill.done { background: #10b981; }
  .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e7e5e4; font-size: 11px; color: #a8a29e; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <h1>تقرير المشاريع</h1>
  <p>براند للإبداع — تاريخ التقرير: ${dateStr}</p>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="value">${stats.total}</div>
    <div class="label">إجمالي المشاريع</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.active}</div>
    <div class="label">نشطة</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.completed}</div>
    <div class="label">مكتملة</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.atRisk}</div>
    <div class="label">معرضة للخطر</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.avgProgress}%</div>
    <div class="label">متوسط الإنجاز</div>
  </div>
  <div class="stat-card">
    <div class="value">${formatCurrency(stats.totalBudget)}</div>
    <div class="label">إجمالي الميزانية</div>
  </div>
  <div class="stat-card">
    <div class="value">${formatCurrency(stats.totalPaid)}</div>
    <div class="label">المدفوع</div>
  </div>
  <div class="stat-card">
    <div class="value">${formatCurrency(stats.pendingAmount)}</div>
    <div class="label">المعلق</div>
  </div>
</div>

<table>
<thead>
<tr>
  <th>رقم المشروع</th>
  <th>اسم المشروع</th>
  <th>العميل</th>
  <th>التصنيف</th>
  <th>الحالة</th>
  <th>الإنجاز</th>
  <th>الميزانية</th>
  <th>المدفوع</th>
  <th>المتبقي</th>
  <th>الأولوية</th>
  <th>المدير</th>
  <th>موعد التسليم</th>
  <th>الخطر</th>
</tr>
</thead>
<tbody>
${projects
  .map(
    (p) => `
<tr>
  <td>${p.id}</td>
  <td style="font-weight:700">${p.name}</td>
  <td>${p.client}</td>
  <td>${getArabicLabel(categories, p.category)}</td>
  <td>${p.status}</td>
  <td>
    <div class="progress-bar"><div class="progress-fill${p.progress === 100 ? " done" : ""}" style="width:${p.progress}%"></div></div>
    ${p.progress}%
  </td>
  <td>${formatCurrency(p.budget)}</td>
  <td>${formatCurrency(p.paid)}</td>
  <td>${formatCurrency(p.budget - p.paid)}</td>
  <td><span class="badge ${p.priority === "عاجل" ? "badge-urgent" : p.priority === "عالي" ? "badge-high" : p.priority === "متوسط" ? "badge-medium" : p.priority === "مكتمل" ? "badge-complete" : "badge-low"}">${p.priority}</span></td>
  <td>${p.manager}</td>
  <td>${p.deadline}</td>
  <td>${p.risk}</td>
</tr>`
  )
  .join("")}
</tbody>
</table>

<div class="footer">
  <p>تم إنشاء هذا التقرير تلقائياً من لوحة إدارة منصة براند للإبداع</p>
  <p>${dateStr}</p>
</div>

<script>
  window.onload = function() {
    window.print();
  };
</script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}