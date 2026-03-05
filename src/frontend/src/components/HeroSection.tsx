import { Button } from "@/components/ui/button";
import { ChevronDown, Star } from "lucide-react";
import { motion } from "motion/react";
import type { ActiveSection } from "../App";
import { DEFAULT_RESTAURANT_INFO } from "../data/sampleData";
import { useRestaurantInfo } from "../hooks/useQueries";

interface HeroSectionProps {
  onNavigate: (section: ActiveSection) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { data: restaurantInfo } = useRestaurantInfo();
  const info = restaurantInfo ?? DEFAULT_RESTAURANT_INFO;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/brew-hero.dim_1200x600.jpg"
          alt="Brew Restaurant interior"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Decorative vertical amber line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-60"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex gap-0.5">
              {(["s1", "s2", "s3", "s4", "s5"] as const).map((sk) => (
                <Star key={sk} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
              Est. 2018 · San Francisco
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4 hero-text-shadow"
          >
            <span className="text-foreground">Where Craft</span>
            <br />
            <span className="text-amber-glow">Meets Kitchen</span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-px w-48 bg-gradient-to-r from-primary/80 to-transparent mb-6 origin-left"
          />

          {/* About blurb */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-sans"
          >
            {info.about.slice(0, 160)}...
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              onClick={() => onNavigate("menu")}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-amber-lg font-semibold tracking-wide px-8 h-14 text-base"
              data-ocid="hero.menu.primary_button"
            >
              Explore Menu
            </Button>
            <Button
              onClick={() => onNavigate("reservations")}
              size="lg"
              variant="outline"
              className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/60 px-8 h-14 text-base tracking-wide"
              data-ocid="hero.reservations.secondary_button"
            >
              Reserve a Table
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex gap-8 mt-14"
          >
            {[
              { value: "12+", label: "Craft Brews" },
              { value: "40+", label: "Menu Items" },
              { value: "5★", label: "Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => onNavigate("menu")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        data-ocid="hero.scroll.button"
      >
        <span className="text-xs tracking-widest uppercase">Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
