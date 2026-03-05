import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Reservation } from "../../backend.d";
import {
  useAllReservations,
  useDeleteReservation,
  useUpdateReservationStatus,
} from "../../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-dim/20 text-amber-glow border-amber-dim/30",
  confirmed: "bg-primary/20 text-primary border-primary/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const STATUSES = ["pending", "confirmed", "cancelled"] as const;

export default function ReservationManagement() {
  const { data: reservations, isLoading } = useAllReservations();
  const updateStatus = useUpdateReservationStatus();
  const deleteReservation = useDeleteReservation();

  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered =
    filterStatus === "all"
      ? (reservations ?? [])
      : (reservations ?? []).filter((r) => r.status === filterStatus);

  const handleStatusChange = async (
    reservation: Reservation,
    status: string,
  ) => {
    try {
      await updateStatus.mutateAsync({ id: reservation.id, status });
      toast.success(`Reservation ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReservation.mutateAsync(deleteTarget.id);
      toast.success("Reservation deleted");
    } catch {
      toast.error("Failed to delete reservation");
    }
    setDeleteTarget(null);
  };

  const counts = {
    total: reservations?.length ?? 0,
    pending: reservations?.filter((r) => r.status === "pending").length ?? 0,
    confirmed:
      reservations?.filter((r) => r.status === "confirmed").length ?? 0,
    cancelled:
      reservations?.filter((r) => r.status === "cancelled").length ?? 0,
  };

  return (
    <div data-ocid="admin.reservations.section">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: counts.total, color: "text-foreground" },
          { label: "Pending", value: counts.pending, color: "text-amber-glow" },
          {
            label: "Confirmed",
            value: counts.confirmed,
            color: "text-primary",
          },
          {
            label: "Cancelled",
            value: counts.cancelled,
            color: "text-destructive",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-card rounded-xl border border-border p-4"
          >
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
              {label}
            </p>
            <p className={`font-display text-3xl font-bold ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Reservations
        </h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger
            className="bg-card border-border w-40"
            data-ocid="admin.reservations.filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div
            className="p-6 space-y-4"
            data-ocid="admin.reservations.loading_state"
          >
            {(["r1", "r2", "r3", "r4", "r5"] as const).map((sk) => (
              <Skeleton key={sk} className="h-12 w-full bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.reservations.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Guest</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Party
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reservation, idx) => (
                  <motion.tr
                    key={reservation.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-border hover:bg-accent/30 transition-colors"
                    data-ocid={`admin.reservations.row.item.${idx + 1}`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {reservation.guestName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.email}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {reservation.date} · {reservation.time}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <p className="text-sm text-foreground">
                          {reservation.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.time}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-foreground">
                        {reservation.partySize.toString()} guests
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={reservation.status}
                        onValueChange={(v) =>
                          handleStatusChange(reservation, v)
                        }
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger
                          className={`h-8 text-xs border rounded-full px-3 w-32 ${STATUS_COLORS[reservation.status] ?? "bg-muted/20 text-foreground border-border"}`}
                          data-ocid={`admin.reservations.status.select.${idx + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {STATUSES.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="capitalize"
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(reservation)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        data-ocid={`admin.reservations.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {filtered.length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.reservations.empty_state"
              >
                <p className="font-display text-lg">No reservations found</p>
                <p className="text-sm mt-1">
                  {filterStatus === "all"
                    ? "No reservations have been made yet"
                    : `No ${filterStatus} reservations`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes expansion hint */}
      {filtered.some((r) => r.notes) && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Some reservations have special notes. Contact guests directly for
          details.
        </p>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="admin.reservations.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Reservation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the reservation for{" "}
              <strong className="text-foreground">
                {deleteTarget?.guestName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="admin.reservations.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.reservations.delete.confirm_button"
            >
              {deleteReservation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
