import Sidebar from './Sidebar';

function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="dashboard-layout d-flex min-vh-100">
      <Sidebar />
      <div className="dashboard-content flex-grow-1">
        <header className="dashboard-header px-4 py-3 border-bottom">
          {title && <h1 className="h4 mb-0 fw-semibold">{title}</h1>}
          {subtitle && <p className="text-muted mb-0 mt-1 small">{subtitle}</p>}
        </header>
        <main className="dashboard-main p-4">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
