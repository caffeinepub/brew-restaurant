import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ActiveSection } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  showAdmin: boolean;
}

const NAV_ITEMS: { label: string; section: ActiveSection }[] = [
  { label: "Home", section: "home" },
  { label: "Menu", section: "menu" },
  { label: "Reservations", section: "reservations" },
  { label: "About", section: "about" },
  { label: "Contact", section: "contact" },
];

export default function Header({
  activeSection,
  onNavigate,
  onAdminClick,
  isAdmin,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (section: ActiveSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-deep"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group"
            data-ocid="nav.link"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all">
              <img
                src="/assets/generated/brew-logo-transparent.dim_200x200.png"
                alt="Brew Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl text-primary leading-none font-bold tracking-wide">
                BREW
              </span>
              <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase font-sans">
                Restaurant
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ label, section }) => (
              <button
                type="button"
                key={section}
                onClick={() => handleNavClick(section)}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-md ${
                  activeSection === section
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`nav.${section}.link`}
              >
                {label}
                {activeSection === section && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Auth + Admin buttons */}
          <div className="hidden md:flex items-center gap-2">
            {identity ? (
              <>
                {isAdmin && (
                  <Button
                    onClick={onAdminClick}
                    variant="outline"
                    size="sm"
                    className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 gap-2"
                    data-ocid="nav.admin.button"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Button>
                )}
                <Button
                  onClick={clear}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground gap-2"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-amber"
                data-ocid="nav.login.button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground rounded-md"
            aria-label="Toggle menu"
            data-ocid="nav.mobile.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, section }) => (
                <button
                  type="button"
                  key={section}
                  onClick={() => handleNavClick(section)}
                  className={`px-4 py-3 text-left text-sm font-medium rounded-md transition-colors ${
                    activeSection === section
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  data-ocid={`nav.mobile.${section}.link`}
                >
                  {label}
                </button>
              ))}
              <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
                {identity ? (
                  <>
                    {isAdmin && (
                      <Button
                        onClick={() => {
                          onAdminClick();
                          setMobileOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-primary/40 text-primary gap-2"
                        data-ocid="nav.mobile.admin.button"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                      variant="ghost"
                      className="w-full gap-2"
                      data-ocid="nav.mobile.logout.button"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full bg-primary text-primary-foreground gap-2"
                    data-ocid="nav.mobile.login.button"
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoggingIn ? "Signing in..." : "Sign In"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
