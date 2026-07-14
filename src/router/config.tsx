import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import AuthPage from "../pages/auth/page";
import DashboardPage from "../pages/dashboard/page";
import ProjectsPage from "../pages/dashboard/projects/page";
import ServicesPage from "../pages/services/page";
import ServiceDetail from "../pages/services/ServiceDetail";
import WorkspacePage from "../pages/workspace/page";
import Studio3DPage from "../pages/studio3d/page";
import PricingPage from "../pages/pricing/page";
import ProductionPage from "../pages/production/page";
import AfterSalesPage from "../pages/aftersales/page";
import WorkflowPage from "../pages/workflow/page";
import MessagesPage from "../pages/dashboard/messages/page";
import ApprovalsPage from "../pages/dashboard/approvals/page";
import InvoicesPage from "../pages/dashboard/invoices/page";
import SettingsPage from "../pages/dashboard/settings/page";
import BrandCreationPage from "../pages/brand-creation/page";
import PackagingCustomizerPage from "../pages/packaging-customizer/page";
import VisualIdentityPage from "../pages/visual-identity/page";
import ManufacturingPage from "../pages/manufacturing/page";
import ProjectManagementPage from "../pages/dashboard/project-management/page";
import AboutPage from "../pages/about/page";
import PortfolioPage from "../pages/portfolio/page";
import FAQPage from "../pages/faq/page";
import ContactPage from "../pages/contact/page";
import AuthGuard from "../components/feature/AuthGuard";
import AdminDashboardPage from "../pages/admin/page";
import AdminOrdersPage from "../pages/admin/orders/page";
import AdminTeamPage from "../pages/admin/team/page";
import AdminContentPage from "../pages/admin/content/page";
import AdminPaymentsPage from "../pages/admin/payments/page";
import AdminSettingsPage from "../pages/admin/settings/page";
import AdminReportsPage from "../pages/admin/reports/page";
import AdminProjectsPage from "../pages/admin/projects/page";

const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/services/:id",
    element: <ServiceDetail />,
  },
  {
    path: "/packaging",
    element: <Navigate to="/packaging-customizer" replace />,
  },
  {
    path: "/approval",
    element: <Navigate to="/dashboard/approvals" replace />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/portfolio",
    element: <PortfolioPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrdersPage />,
  },
  {
    path: "/admin/projects",
    element: <AdminProjectsPage />,
  },
  {
    path: "/admin/team",
    element: <AdminTeamPage />,
  },
  {
    path: "/admin/content",
    element: <AdminContentPage />,
  },
  {
    path: "/admin/payments",
    element: <AdminPaymentsPage />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "/admin/reports",
    element: <AdminReportsPage />,
  },
  // Protected routes - require login
  {
    path: "/dashboard",
    element: <AuthGuard><DashboardPage /></AuthGuard>,
  },
  {
    path: "/dashboard/projects",
    element: <AuthGuard><ProjectsPage /></AuthGuard>,
  },
  {
    path: "/dashboard/projects/manage",
    element: <AuthGuard><ProjectManagementPage /></AuthGuard>,
  },
  {
    path: "/dashboard/messages",
    element: <AuthGuard><MessagesPage /></AuthGuard>,
  },
  {
    path: "/dashboard/approvals",
    element: <AuthGuard><ApprovalsPage /></AuthGuard>,
  },
  {
    path: "/dashboard/invoices",
    element: <AuthGuard><InvoicesPage /></AuthGuard>,
  },
  {
    path: "/dashboard/settings",
    element: <AuthGuard><SettingsPage /></AuthGuard>,
  },
  {
    path: "/workspace/:projectId",
    element: <AuthGuard><WorkspacePage /></AuthGuard>,
  },
  {
    path: "/workspace",
    element: <AuthGuard><WorkspacePage /></AuthGuard>,
  },
  {
    path: "/studio-3d",
    element: <AuthGuard><Studio3DPage /></AuthGuard>,
  },
  {
    path: "/pricing",
    element: <AuthGuard><PricingPage /></AuthGuard>,
  },
  {
    path: "/production",
    element: <AuthGuard><ProductionPage /></AuthGuard>,
  },
  {
    path: "/after-sales",
    element: <AuthGuard><AfterSalesPage /></AuthGuard>,
  },
  {
    path: "/workflow",
    element: <AuthGuard><WorkflowPage /></AuthGuard>,
  },
  {
    path: "/packaging-customizer",
    element: <AuthGuard><PackagingCustomizerPage /></AuthGuard>,
  },
  {
    path: "/brand-creation",
    element: <AuthGuard><BrandCreationPage /></AuthGuard>,
  },
  {
    path: "/visual-identity",
    element: <AuthGuard><VisualIdentityPage /></AuthGuard>,
  },
  {
    path: "/manufacturing",
    element: <AuthGuard><ManufacturingPage /></AuthGuard>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;