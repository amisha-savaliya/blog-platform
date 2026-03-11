import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function ClientLayout() {
  return (
    <>
     <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet /> {/* Render client pages here */}
      </main>
      <Footer />
      </div>
    </>
  );
}
