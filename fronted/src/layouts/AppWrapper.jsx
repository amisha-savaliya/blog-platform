import { RoleProvider } from "../context/Rolecontext";
import { CategoryProvider } from "../context/Categorycontext";
import { AuthProvider } from "../context/Authcontext";
import { useEffect } from "react";
import AOS from "aos";

export default function AppWrapper({ children }) {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <RoleProvider>
      <CategoryProvider>
      <AuthProvider >
      {children}
      </AuthProvider></CategoryProvider>
    </RoleProvider>
  );
}
