import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Stack "mo:core/Stack";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Menu Item Type
  type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    available : Bool;
  };

  module MenuItem {
    public func compareByCategory(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      switch (Text.compare(item1.category, item2.category)) {
        case (#equal) { Float.compare(item1.price, item2.price) };
        case (order) { order };
      };
    };
  };

  // Reservation Type
  type Reservation = {
    id : Nat;
    guestName : Text;
    email : Text;
    phone : Text;
    date : Text;
    time : Text;
    partySize : Nat;
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  // Restaurant Info Type
  type RestaurantInfo = {
    address : Text;
    phone : Text;
    email : Text;
    openingHours : Text;
    about : Text;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // State
  var nextMenuItemId = 1;
  var nextReservationId = 1;
  let menuItems = Map.empty<Nat, MenuItem>();
  let reservations = Map.empty<Nat, Reservation>();
  var restaurantInfo : ?RestaurantInfo = null;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Item Functions
  public query ({ caller }) func listMenuItems() : async [MenuItem] {
    menuItems.values().toArray().reverse();
  };

  public query ({ caller }) func listAvailableMenuItems() : async [MenuItem] {
    menuItems.values().toArray().filter(func(item) { item.available });
  };

  public query ({ caller }) func listMenuItemsByCategory(category : Text) : async [MenuItem] {
    menuItems.values().toArray().filter(
      func(item) {
        (item.category == category) and item.available;
      }
    ).sort(MenuItem.compareByCategory);
  };

  public shared ({ caller }) func addMenuItem(name : Text, description : Text, price : Float, category : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };
    let id = nextMenuItemId;
    nextMenuItemId += 1;

    let menuItem : MenuItem = {
      id;
      name;
      description;
      price;
      category;
      available = true;
    };
    menuItems.add(id, menuItem);
    id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, name : Text, description : Text, price : Float, category : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };

    let existingItem = menuItems.get(id);
    switch (existingItem) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        let updatedMenuItem : MenuItem = {
          id;
          name;
          description;
          price;
          category;
          available = item.available;
        };
        menuItems.add(id, updatedMenuItem);
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };

    if (not (menuItems.containsKey(id))) {
      Runtime.trap("Menu item not found");
    };

    menuItems.remove(id);
  };

  public shared ({ caller }) func toggleMenuItemAvailability(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle menu item availability");
    };

    let existingItem = menuItems.get(id);
    switch (existingItem) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        let updatedMenuItem : MenuItem = {
          id = item.id;
          name = item.name;
          description = item.description;
          price = item.price;
          category = item.category;
          available = not (item.available);
        };
        menuItems.add(id, updatedMenuItem);
        updatedMenuItem.available;
      };
    };
  };

  // Reservation Functions
  public shared ({ caller }) func createReservation(guestName : Text, email : Text, phone : Text, date : Text, time : Text, partySize : Nat, notes : Text) : async Nat {
    let id = nextReservationId;
    nextReservationId += 1;

    let reservation : Reservation = {
      id;
      guestName;
      email;
      phone;
      date;
      time;
      partySize;
      status = "pending";
      notes;
      createdAt = Time.now();
    };

    reservations.add(id, reservation);
    id;
  };

  public query ({ caller }) func getAllReservations() : async [Reservation] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all reservations");
    };
    reservations.values().toArray().reverse();
  };

  public shared ({ caller }) func updateReservationStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update reservation status");
    };

    let existingReservation = reservations.get(id);
    switch (existingReservation) {
      case (null) { Runtime.trap("Reservation not found") };
      case (?res) {
        let updatedReservation : Reservation = {
          id = res.id;
          guestName = res.guestName;
          email = res.email;
          phone = res.phone;
          date = res.date;
          time = res.time;
          partySize = res.partySize;
          status;
          notes = res.notes;
          createdAt = res.createdAt;
        };
        reservations.add(id, updatedReservation);
      };
    };
  };

  public shared ({ caller }) func deleteReservation(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete reservations");
    };

    if (not (reservations.containsKey(id))) {
      Runtime.trap("Reservation not found");
    };

    reservations.remove(id);
  };

  // Restaurant Info Functions
  public query ({ caller }) func getRestaurantInfo() : async ?RestaurantInfo {
    restaurantInfo;
  };

  public shared ({ caller }) func updateRestaurantInfo(address : Text, phone : Text, email : Text, openingHours : Text, about : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update restaurant info");
    };

    restaurantInfo := ?{
      address;
      phone;
      email;
      openingHours;
      about;
    };
  };
};
