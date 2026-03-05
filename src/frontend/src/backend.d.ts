import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reservation {
    id: bigint;
    status: string;
    date: string;
    createdAt: bigint;
    time: string;
    guestName: string;
    email: string;
    notes: string;
    partySize: bigint;
    phone: string;
}
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    category: string;
    price: number;
}
export interface RestaurantInfo {
    about: string;
    email: string;
    address: string;
    openingHours: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(name: string, description: string, price: number, category: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReservation(guestName: string, email: string, phone: string, date: string, time: string, partySize: bigint, notes: string): Promise<bigint>;
    deleteMenuItem(id: bigint): Promise<void>;
    deleteReservation(id: bigint): Promise<void>;
    getAllReservations(): Promise<Array<Reservation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRestaurantInfo(): Promise<RestaurantInfo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAvailableMenuItems(): Promise<Array<MenuItem>>;
    listMenuItems(): Promise<Array<MenuItem>>;
    listMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleMenuItemAvailability(id: bigint): Promise<boolean>;
    updateMenuItem(id: bigint, name: string, description: string, price: number, category: string): Promise<void>;
    updateReservationStatus(id: bigint, status: string): Promise<void>;
    updateRestaurantInfo(address: string, phone: string, email: string, openingHours: string, about: string): Promise<void>;
}
