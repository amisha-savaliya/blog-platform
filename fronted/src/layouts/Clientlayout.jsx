import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function ClientLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Render client pages here */}
      </main>
      <Footer />
    </>
  );
}
