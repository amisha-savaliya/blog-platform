import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import AdminNavbar from "../components/Navbars/AdminNavbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import FooterAdmin from "../components/Footers/FooterAdmin.jsx";

export default function AdminLayout() {
  const { token } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only check token for now
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-blueGray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col min-h-screen md:ml-64">
        <AdminNavbar />

        <main className="flex-1 px-4 md:px-10 pt-20 md:pt-6 overflow-x-hidden">
          <Outlet />
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
}