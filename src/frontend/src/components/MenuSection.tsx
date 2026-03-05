import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import type { MenuItem } from "../backend.d";
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from "../data/sampleData";
import { useAvailableMenuItems } from "../hooks/useQueries";

const categoryIcons: Record<string, string> = {
  Starters: "🥗",
  Mains: "🍽️",
  Brews: "🍺",
  Desserts: "🍮",
  Drinks: "🥤",
};

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-card-hover overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="font-display text-xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Subtle amber bottom line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </motion.div>
  );
}

function MenuSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((sk) => (
        <div key={sk} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </div>
            <Skeleton className="h-7 w-14 bg-muted flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MenuSection() {
  const { data: backendItems, isLoading } = useAvailableMenuItems();

  // Use backend data if available and non-empty, else fall back to sample data
  const items =
    backendItems && backendItems.length > 0 ? backendItems : SAMPLE_MENU_ITEMS;

  const itemsByCategory = MENU_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  return (
    <section className="min-h-screen py-24 pt-28" data-ocid="menu.section">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-[0.25em] uppercase mb-3">
            Our Offerings
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Menu
          </h2>
          <div className="divider-amber max-w-xs mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Crafted with locally sourced ingredients and served with pride.
            Paired perfectly with our award-winning house brews.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs defaultValue="Starters" className="w-full">
          <TabsList
            className="flex flex-wrap justify-center gap-1 bg-transparent h-auto mb-10"
            data-ocid="menu.category.tab"
          >
            {MENU_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:border-foreground/30 transition-all"
                data-ocid={`menu.${cat.toLowerCase()}.tab`}
              >
                <span>{categoryIcons[cat]}</span>
                {cat}
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs px-1.5 py-0 h-4 bg-foreground/10 text-muted-foreground data-[state=active]:bg-primary-foreground/20"
                >
                  {itemsByCategory[cat]?.length ?? 0}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {MENU_CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {isLoading ? (
                <MenuSkeletons />
              ) : itemsByCategory[cat]?.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="menu.empty_state"
                >
                  <span className="text-4xl mb-4 block">
                    {categoryIcons[cat]}
                  </span>
                  <p className="font-display text-lg">Nothing here yet</p>
                  <p className="text-sm mt-1">Check back soon for updates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {itemsByCategory[cat]?.map((item, idx) => (
                    <MenuItemCard
                      key={item.id.toString()}
                      item={item}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
