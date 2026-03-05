import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TIME_SLOTS } from "../data/sampleData";
import { useCreateReservation } from "../hooks/useQueries";

interface FormData {
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  notes: string;
}

interface FormErrors {
  guestName?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  partySize?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.guestName.trim()) errors.guestName = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  if (!data.date) errors.date = "Please select a date";
  else {
    const selected = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) errors.date = "Date cannot be in the past";
  }
  if (!data.time) errors.time = "Please select a time";
  if (!data.partySize) errors.partySize = "Please select party size";
  return errors;
}

// Get today's date in YYYY-MM-DD format
function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function ReservationSection() {
  const [form, setForm] = useState<FormData>({
    guestName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    partySize: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const createReservation = useCreateReservation();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createReservation.mutateAsync({
        guestName: form.guestName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        partySize: Number(form.partySize),
        notes: form.notes.trim(),
      });
      setSubmitted(true);
      toast.success("Reservation confirmed! See you soon.");
    } catch {
      toast.error("Failed to create reservation. Please try again.");
    }
  };

  const handleReset = () => {
    setForm({
      guestName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      partySize: "",
      notes: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section
      className="min-h-screen py-24 pt-28"
      data-ocid="reservations.section"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-[0.25em] uppercase mb-3">
            Join Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Reserve a Table
          </h2>
          <div className="divider-amber max-w-xs mx-auto" />
          <p className="text-muted-foreground mt-4">
            Book your table online and we'll have everything ready for your
            arrival. We look forward to hosting you.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center"
              data-ocid="reservations.success_state"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Reservation Confirmed!
              </h3>
              <p className="text-muted-foreground mb-2">
                We've received your reservation for{" "}
                <span className="text-foreground font-medium">
                  {form.guestName}
                </span>
                .
              </p>
              <p className="text-muted-foreground mb-6">
                <span className="text-primary">{form.date}</span> at{" "}
                <span className="text-primary">{form.time}</span> ·{" "}
                {form.partySize}{" "}
                {Number(form.partySize) === 1 ? "guest" : "guests"}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation will be sent to{" "}
                <span className="text-foreground">{form.email}</span>.
              </p>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10"
                data-ocid="reservations.new.button"
              >
                Make Another Reservation
              </Button>
            </motion.div>
          ) : (
            /* Reservation Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6"
                noValidate
              >
                {/* Guest Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="guestName"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="guestName"
                    type="text"
                    placeholder="John Smith"
                    value={form.guestName}
                    onChange={(e) => handleChange("guestName", e.target.value)}
                    className={`bg-background border-border focus:border-primary h-11 ${errors.guestName ? "border-destructive" : ""}`}
                    autoComplete="name"
                    data-ocid="reservations.name.input"
                  />
                  {errors.guestName && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="reservations.name.error_state"
                    >
                      {errors.guestName}
                    </p>
                  )}
                </div>

                {/* Email & Phone in a grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`bg-background border-border focus:border-primary h-11 ${errors.email ? "border-destructive" : ""}`}
                      autoComplete="email"
                      data-ocid="reservations.email.input"
                    />
                    {errors.email && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="reservations.email.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`bg-background border-border focus:border-primary h-11 ${errors.phone ? "border-destructive" : ""}`}
                      autoComplete="tel"
                      data-ocid="reservations.phone.input"
                    />
                    {errors.phone && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="reservations.phone.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date & Time grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      min={getTodayStr()}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className={`bg-background border-border focus:border-primary h-11 [color-scheme:dark] ${errors.date ? "border-destructive" : ""}`}
                      data-ocid="reservations.date.input"
                    />
                    {errors.date && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="reservations.date.error_state"
                      >
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Time
                    </Label>
                    <Select
                      value={form.time}
                      onValueChange={(v) => handleChange("time", v)}
                    >
                      <SelectTrigger
                        className={`bg-background border-border h-11 ${errors.time ? "border-destructive" : ""}`}
                        data-ocid="reservations.time.select"
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="reservations.time.error_state"
                      >
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Party Size */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    Party Size
                  </Label>
                  <Select
                    value={form.partySize}
                    onValueChange={(v) => handleChange("partySize", v)}
                  >
                    <SelectTrigger
                      className={`bg-background border-border h-11 ${errors.partySize ? "border-destructive" : ""}`}
                      data-ocid="reservations.party_size.select"
                    >
                      <SelectValue placeholder="Number of guests" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.partySize && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="reservations.party_size.error_state"
                    >
                      {errors.partySize}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Special Requests{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Dietary restrictions, celebrations, accessibility needs..."
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="bg-background border-border focus:border-primary resize-none min-h-[100px]"
                    data-ocid="reservations.notes.textarea"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={createReservation.isPending}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-amber font-semibold tracking-wide text-base"
                  data-ocid="reservations.submit.submit_button"
                >
                  {createReservation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Reservation"
                  )}
                </Button>

                {createReservation.isError && (
                  <p
                    className="text-destructive text-sm text-center"
                    data-ocid="reservations.error_state"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>

              {/* Info Note */}
              <p className="text-center text-xs text-muted-foreground mt-4">
                For large parties (20+) or special events, please call us
                directly at{" "}
                <span className="text-foreground">+1 (415) 555-BREW</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
