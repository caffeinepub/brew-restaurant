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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../../backend.d";
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from "../../data/sampleData";
import {
  useAddMenuItem,
  useAllMenuItems,
  useDeleteMenuItem,
  useToggleMenuItemAvailability,
  useUpdateMenuItem,
} from "../../hooks/useQueries";

interface MenuItemForm {
  name: string;
  description: string;
  price: string;
  category: string;
}

const emptyForm: MenuItemForm = {
  name: "",
  description: "",
  price: "",
  category: "Starters",
};

export default function MenuManagement() {
  const { data: backendItems, isLoading } = useAllMenuItems();
  const items =
    backendItems && backendItems.length > 0 ? backendItems : SAMPLE_MENU_ITEMS;

  const addItem = useAddMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const toggleAvailability = useToggleMenuItemAvailability();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuItemForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<MenuItemForm>>({});

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<MenuItemForm> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.description.trim())
      errors.description = "Description is required";
    const priceNum = Number.parseFloat(form.price);
    if (!form.price || Number.isNaN(priceNum) || priceNum <= 0)
      errors.price = "Enter a valid price";
    if (!form.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const price = Number.parseFloat(form.price);
    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          category: form.category,
        });
        toast.success("Menu item updated");
      } else {
        await addItem.mutateAsync({
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          category: form.category,
        });
        toast.success("Menu item added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem.mutateAsync(deleteTarget.id);
      toast.success("Menu item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
    setDeleteTarget(null);
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await toggleAvailability.mutateAsync(item.id);
      toast.success(`${item.name} ${item.available ? "hidden" : "shown"}`);
    } catch {
      toast.error("Failed to update availability");
    }
  };

  return (
    <div data-ocid="admin.menu.section">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Menu Items
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} items across {MENU_CATEGORIES.length} categories
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          data-ocid="admin.menu.add.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4" data-ocid="admin.menu.loading_state">
            {(["m1", "m2", "m3", "m4", "m5"] as const).map((sk) => (
              <Skeleton key={sk} className="h-12 w-full bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.menu.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Available
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <motion.tr
                    key={item.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-border hover:bg-accent/30 transition-colors"
                    data-ocid={`admin.menu.row.item.${idx + 1}`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className="bg-accent text-accent-foreground"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-display font-semibold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => handleToggle(item)}
                        disabled={toggleAvailability.isPending}
                        data-ocid={`admin.menu.availability.switch.${idx + 1}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          data-ocid={`admin.menu.edit_button.${idx + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          data-ocid={`admin.menu.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {items.length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.menu.empty_state"
              >
                <p className="font-display text-lg">No menu items yet</p>
                <p className="text-sm mt-1">
                  Click "Add Item" to create your first menu item
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-card border-border sm:max-w-lg"
          data-ocid="admin.menu.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingItem
                ? "Update the details for this menu item."
                : "Fill in the details for the new menu item."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setFormErrors((e_) => ({ ...e_, name: undefined }));
                }}
                placeholder="Crispy Calamari"
                className="bg-background border-border"
                data-ocid="admin.menu.name.input"
              />
              {formErrors.name && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="admin.menu.name.error_state"
                >
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => {
                  setForm((f) => ({ ...f, description: e.target.value }));
                  setFormErrors((e_) => ({ ...e_, description: undefined }));
                }}
                placeholder="A brief, appetizing description..."
                className="bg-background border-border resize-none"
                rows={3}
                data-ocid="admin.menu.description.textarea"
              />
              {formErrors.description && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="admin.menu.description.error_state"
                >
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, price: e.target.value }));
                    setFormErrors((e_) => ({ ...e_, price: undefined }));
                  }}
                  placeholder="12.00"
                  className="bg-background border-border"
                  data-ocid="admin.menu.price.input"
                />
                {formErrors.price && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="admin.menu.price.error_state"
                  >
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    className="bg-background border-border"
                    data-ocid="admin.menu.category.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {MENU_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border"
              data-ocid="admin.menu.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addItem.isPending || updateItem.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin.menu.dialog.save_button"
            >
              {addItem.isPending || updateItem.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editingItem ? (
                "Save Changes"
              ) : (
                "Add Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="admin.menu.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Menu Item
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="admin.menu.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.menu.delete.confirm_button"
            >
              {deleteItem.isPending ? (
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
