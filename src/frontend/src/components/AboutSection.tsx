import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { DEFAULT_RESTAURANT_INFO } from "../data/sampleData";
import { useRestaurantInfo } from "../hooks/useQueries";

export default function AboutSection() {
  const { data: restaurantInfo, isLoading } = useRestaurantInfo();
  const info = restaurantInfo ?? DEFAULT_RESTAURANT_INFO;

  const values = [
    {
      icon: "🌾",
      title: "Locally Sourced",
      description:
        "We partner with Bay Area farmers and artisan producers to bring the freshest ingredients to your plate every single day.",
    },
    {
      icon: "🍺",
      title: "Brewed In-House",
      description:
        "Our brewmaster crafts every batch on-site with traditional techniques and a relentless passion for flavor complexity.",
    },
    {
      icon: "🔥",
      title: "Scratch Kitchen",
      description:
        "Everything from our sauces to our bread is made from scratch daily. No shortcuts, no compromises.",
    },
    {
      icon: "🤝",
      title: "Community First",
      description:
        "Brew is more than a restaurant — it's a gathering place. We host local artists, live music, and community events monthly.",
    },
  ];

  return (
    <section className="min-h-screen py-24 pt-28" data-ocid="about.section">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-[0.25em] uppercase mb-3">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Spirit of Brew
          </h2>
          <div className="divider-amber max-w-xs mx-auto" />
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/assets/generated/brew-hero.dim_1200x600.jpg"
                alt="Inside Brew Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-5 shadow-deep">
              <p className="font-display text-4xl font-bold text-primary">6+</p>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                Years Serving
              </p>
            </div>
            {/* Amber accent */}
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-2xl">
              🏆
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Est. 2018
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton
                  className="h-4 w-full bg-muted"
                  data-ocid="about.loading_state"
                />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {info.about
                  .split(". ")
                  .reduce<string[]>((acc, sentence, idx) => {
                    if (idx % 3 === 0) acc.push(sentence);
                    else acc[acc.length - 1] += `. ${sentence}`;
                    return acc;
                  }, [])
                  .map((para, paraIdx) => (
                    <p
                      key={para.slice(0, 20)}
                      className={paraIdx === 0 ? "text-foreground text-lg" : ""}
                    >
                      {para}
                    </p>
                  ))}
              </div>
            )}

            <blockquote className="border-l-2 border-primary pl-6 italic text-muted-foreground">
              "Great beer, great food, and great company — that's the Brew
              promise."
              <footer className="mt-2 text-sm not-italic text-primary font-medium">
                — Marcus Chen, Founder & Head Brewer
              </footer>
            </blockquote>
          </motion.div>
        </div>

        {/* Values grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            What We Stand For
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 group"
                data-ocid={`about.values.item.${i + 1}`}
              >
                <div className="text-3xl mb-3">{value.icon}</div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {value.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-card rounded-2xl border border-border p-8 sm:p-12 text-center"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Awards & Recognition
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground text-sm">
            {[
              "🏅 Best Craft Beer 2023 — SF Weekly",
              "⭐ Michelin Bib Gourmand 2022",
              "🍺 Bay Area Brew Awards — Gold Medal",
              "🌿 Green Restaurant Certified",
            ].map((award) => (
              <span
                key={award}
                className="bg-background/60 border border-border rounded-full px-5 py-2"
              >
                {award}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
