import { Heart } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import type { ActiveSection } from "../App";

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  const links: { label: string; section: ActiveSection }[] = [
    { label: "Menu", section: "menu" },
    { label: "Reservations", section: "reservations" },
    { label: "About", section: "about" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-primary/30">
                <img
                  src="/assets/generated/brew-logo-transparent.dim_200x200.png"
                  alt="Brew"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-primary leading-none">
                  BREW
                </p>
                <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
                  Restaurant
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Where craft meets kitchen. Award-winning brews and exceptional
              food in the heart of San Francisco.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { Icon: SiInstagram, href: "#", label: "Instagram" },
                { Icon: SiFacebook, href: "#", label: "Facebook" },
                { Icon: SiX, href: "#", label: "X / Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  data-ocid={`footer.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground tracking-widest uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {links.map(({ label, section }) => (
                <li key={section}>
                  <button
                    type="button"
                    onClick={() => onNavigate(section)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-ocid={`footer.${section}.link`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground tracking-widest uppercase mb-4">
              Hours
            </h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex justify-between gap-4">
                <span>Mon – Thu</span>
                <span className="text-foreground">11:30 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Fri – Sat</span>
                <span className="text-foreground">11:30 AM – 11:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span>
                <span className="text-foreground">12:00 PM – 9:00 PM</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                142 Barrel Lane, Craft District
                <br />
                San Francisco, CA 94110
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-amber mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} Brew Restaurant. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Built with{" "}
            <Heart className="w-3 h-3 text-primary fill-primary mx-0.5" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
