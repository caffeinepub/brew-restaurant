import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, Reservation, RestaurantInfo } from "../backend.d";
import { useActor } from "./useActor";

// ─── Read Queries ───────────────────────────────────────────────────

export function useAvailableMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems", "available"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRestaurantInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<RestaurantInfo | null>({
    queryKey: ["restaurantInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRestaurantInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllReservations() {
  const { actor, isFetching } = useActor();
  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────

export function useCreateReservation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestName,
      email,
      phone,
      date,
      time,
      partySize,
      notes,
    }: {
      guestName: string;
      email: string;
      phone: string;
      date: string;
      time: string;
      partySize: number;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createReservation(
        guestName,
        email,
        phone,
        date,
        time,
        BigInt(partySize),
        notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      category,
    }: {
      name: string;
      description: string;
      price: number;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMenuItem(name, description, price, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      category,
    }: {
      id: bigint;
      name: string;
      description: string;
      price: number;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMenuItem(id, name, description, price, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useToggleMenuItemAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleMenuItemAvailability(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useUpdateReservationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReservationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useDeleteReservation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteReservation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useUpdateRestaurantInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      address,
      phone,
      email,
      openingHours,
      about,
    }: {
      address: string;
      phone: string;
      email: string;
      openingHours: string;
      about: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRestaurantInfo(
        address,
        phone,
        email,
        openingHours,
        about,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantInfo"] });
    },
  });
}
