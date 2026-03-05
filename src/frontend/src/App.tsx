import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection";
import ReservationSection from "./components/ReservationSection";
import AdminPanel from "./components/admin/AdminPanel";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

export type ActiveSection =
  | "home"
  | "menu"
  | "reservations"
  | "about"
  | "contact";

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const handleNavigation = (section: ActiveSection) => {
    setActiveSection(section);
    setShowAdmin(false);
    // Scroll to top when switching sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
  };

  const handleAdminBack = () => {
    setShowAdmin(false);
    setActiveSection("home");
  };

  if (showAdmin && identity) {
    return (
      <>
        <AdminPanel onBack={handleAdminBack} isAdmin={isAdmin ?? false} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.18 0.014 50)",
              border: "1px solid oklch(0.28 0.02 55)",
              color: "oklch(0.96 0.018 85)",
            },
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigation}
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin ?? false}
        showAdmin={showAdmin}
      />

      <main>
        {activeSection === "home" && (
          <HeroSection onNavigate={handleNavigation} />
        )}
        {activeSection === "menu" && <MenuSection />}
        {activeSection === "reservations" && <ReservationSection />}
        {activeSection === "about" && <AboutSection />}
        {activeSection === "contact" && <ContactSection />}
      </main>

      <Footer onNavigate={handleNavigation} />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.014 50)",
            border: "1px solid oklch(0.28 0.02 55)",
            color: "oklch(0.96 0.018 85)",
          },
        }}
      />
    </div>
  );
}
