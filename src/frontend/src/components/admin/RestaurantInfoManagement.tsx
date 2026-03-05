import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_RESTAURANT_INFO } from "../../data/sampleData";
import {
  useRestaurantInfo,
  useUpdateRestaurantInfo,
} from "../../hooks/useQueries";

interface InfoForm {
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  about: string;
}

export default function RestaurantInfoManagement() {
  const { data: restaurantInfo, isLoading } = useRestaurantInfo();
  const updateInfo = useUpdateRestaurantInfo();

  const [form, setForm] = useState<InfoForm>({
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    about: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const info = restaurantInfo ?? DEFAULT_RESTAURANT_INFO;
    setForm({
      address: info.address,
      phone: info.phone,
      email: info.email,
      openingHours: info.openingHours,
      about: info.about,
    });
  }, [restaurantInfo]);

  const handleChange = (field: keyof InfoForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleReset = () => {
    const info = restaurantInfo ?? DEFAULT_RESTAURANT_INFO;
    setForm({
      address: info.address,
      phone: info.phone,
      email: info.email,
      openingHours: info.openingHours,
      about: info.about,
    });
    setIsDirty(false);
  };

  const handleSave = async () => {
    try {
      await updateInfo.mutateAsync(form);
      toast.success("Restaurant info updated successfully");
      setIsDirty(false);
    } catch {
      toast.error("Failed to update restaurant info");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="admin.info.loading_state">
        {(["address", "phone", "email", "hours", "about"] as const).map(
          (sk) => (
            <div key={sk} className="space-y-1.5">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div data-ocid="admin.info.section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Restaurant Information
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your restaurant's public details
          </p>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground"
              data-ocid="admin.info.reset.button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <span className="text-xs text-amber-glow font-medium">
              Unsaved changes
            </span>
          </motion.div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 sm:p-8 space-y-6 max-w-2xl">
        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="info-address" className="font-medium">
            Address
          </Label>
          <Input
            id="info-address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="142 Barrel Lane, San Francisco, CA 94110"
            className="bg-background border-border"
            data-ocid="admin.info.address.input"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="info-phone" className="font-medium">
              Phone
            </Label>
            <Input
              id="info-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (415) 555-BREW"
              className="bg-background border-border"
              data-ocid="admin.info.phone.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="info-email" className="font-medium">
              Email
            </Label>
            <Input
              id="info-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="hello@brewrestaurant.com"
              className="bg-background border-border"
              data-ocid="admin.info.email.input"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="space-y-1.5">
          <Label htmlFor="info-hours" className="font-medium">
            Opening Hours
          </Label>
          <Textarea
            id="info-hours"
            value={form.openingHours}
            onChange={(e) => handleChange("openingHours", e.target.value)}
            placeholder={
              "Mon–Thu: 11:30 AM – 10:00 PM\nFri–Sat: 11:30 AM – 11:00 PM\nSun: 12:00 PM – 9:00 PM"
            }
            className="bg-background border-border resize-none"
            rows={4}
            data-ocid="admin.info.hours.textarea"
          />
          <p className="text-xs text-muted-foreground">
            Each line will be displayed separately on the Contact page.
          </p>
        </div>

        {/* About */}
        <div className="space-y-1.5">
          <Label htmlFor="info-about" className="font-medium">
            About / Description
          </Label>
          <Textarea
            id="info-about"
            value={form.about}
            onChange={(e) => handleChange("about", e.target.value)}
            placeholder="Tell guests about your restaurant's story, atmosphere, and values..."
            className="bg-background border-border resize-none"
            rows={6}
            data-ocid="admin.info.about.textarea"
          />
          <p className="text-xs text-muted-foreground">
            This description appears on the Home and About pages.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={updateInfo.isPending || !isDirty}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
            data-ocid="admin.info.save.save_button"
          >
            {updateInfo.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {updateInfo.isSuccess && !isDirty && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-primary"
            data-ocid="admin.info.success_state"
          >
            ✓ Changes saved successfully
          </motion.p>
        )}

        {updateInfo.isError && (
          <p
            className="text-center text-sm text-destructive"
            data-ocid="admin.info.error_state"
          >
            Failed to save. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
