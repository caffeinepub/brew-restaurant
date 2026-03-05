import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { DEFAULT_RESTAURANT_INFO } from "../data/sampleData";
import { useRestaurantInfo } from "../hooks/useQueries";

export default function ContactSection() {
  const { data: restaurantInfo, isLoading } = useRestaurantInfo();
  const info = restaurantInfo ?? DEFAULT_RESTAURANT_INFO;

  const contactItems = [
    {
      icon: MapPin,
      label: "Location",
      value: info.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(info.address)}`,
      ocid: "contact.address.link",
    },
    {
      icon: Phone,
      label: "Phone",
      value: info.phone,
      href: `tel:${info.phone.replace(/[^+\d]/g, "")}`,
      ocid: "contact.phone.link",
    },
    {
      icon: Mail,
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
      ocid: "contact.email.link",
    },
  ];

  return (
    <section className="min-h-screen py-24 pt-28" data-ocid="contact.section">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-[0.25em] uppercase mb-3">
            Get in Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Us
          </h2>
          <div className="divider-amber max-w-xs mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            We'd love to hear from you. Stop by, call, or send us a message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <>
                {(["addr", "phone", "email"] as const).map((skKey) => (
                  <div
                    key={skKey}
                    className="bg-card rounded-xl border border-border p-5"
                    data-ocid="contact.loading_state"
                  >
                    <Skeleton className="h-4 w-16 bg-muted mb-3" />
                    <Skeleton className="h-4 w-full bg-muted" />
                  </div>
                ))}
              </>
            ) : (
              contactItems.map(
                ({ icon: Icon, label, value, href, ocid }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={label === "Location" ? "_blank" : undefined}
                    rel={
                      label === "Location" ? "noopener noreferrer" : undefined
                    }
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-card-hover transition-all group"
                    data-ocid={ocid}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
                        {label}
                      </p>
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {value}
                      </p>
                    </div>
                  </motion.a>
                ),
              )
            )}

            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
                    Opening Hours
                  </p>
                  {isLoading ? (
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-32 bg-muted" />
                      <Skeleton className="h-3 w-36 bg-muted" />
                      <Skeleton className="h-3 w-28 bg-muted" />
                    </div>
                  ) : (
                    <div className="space-y-1 text-sm text-foreground">
                      {info.openingHours.split("\n").map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="h-full min-h-80 bg-card rounded-2xl border border-border overflow-hidden relative">
              {/* Styled map placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light to-background">
                {/* Grid lines */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, oklch(0.72 0.18 68) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.72 0.18 68) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Streets */}
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="40%"
                    x2="100%"
                    y2="40%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="2"
                  />
                  <line
                    x1="0"
                    y1="60%"
                    x2="100%"
                    y2="60%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="1"
                  />
                  <line
                    x1="30%"
                    y1="0"
                    x2="30%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="1"
                  />
                  <line
                    x1="60%"
                    y1="0"
                    x2="60%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="2"
                  />
                  <line
                    x1="0"
                    y1="25%"
                    x2="100%"
                    y2="25%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="75%"
                    x2="100%"
                    y2="75%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="15%"
                    y1="0"
                    x2="15%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="45%"
                    y1="0"
                    x2="45%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="75%"
                    y1="0"
                    x2="75%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="85%"
                    y1="0"
                    x2="85%"
                    y2="100%"
                    stroke="oklch(0.72 0.18 68)"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Location pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-amber">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  </div>
                </div>

                {/* Address label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card to-transparent">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      {info.address}
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(info.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                    data-ocid="contact.map.link"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Neighborhood info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 max-w-5xl mx-auto bg-card rounded-2xl border border-border p-6 sm:p-8"
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-3">
            In the Heart of the Craft District
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Located in San Francisco's vibrant Craft District, Brew is
            accessible by BART (Mission Station), multiple Muni lines, and is
            surrounded by paid street parking. We're just a short walk from
            Dolores Park and the Mission Cultural Center.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              "🚇 BART Access",
              "🚌 Muni Lines 14, 49",
              "🅿️ Street Parking",
              "🚶 5 min from Dolores Park",
            ].map((item) => (
              <span
                key={item}
                className="text-xs text-muted-foreground bg-background/60 border border-border rounded-full px-4 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
