import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  LogIn,
  Settings,
  ShieldAlert,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import MenuManagement from "./MenuManagement";
import ReservationManagement from "./ReservationManagement";
import RestaurantInfoManagement from "./RestaurantInfoManagement";

interface AdminPanelProps {
  onBack: () => void;
  isAdmin: boolean;
}

export default function AdminPanel({ onBack, isAdmin }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("menu");
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2
          className="w-8 h-8 text-primary animate-spin"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center max-w-sm w-full"
          data-ocid="admin.login.dialog"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            data-ocid="admin.login.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In with Internet Identity
              </>
            )}
          </Button>
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full mt-3 text-muted-foreground"
            data-ocid="admin.login.cancel_button"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-8 text-center max-w-sm w-full"
          data-ocid="admin.unauthorized.panel"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your account does not have admin privileges.
          </p>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10"
            data-ocid="admin.unauthorized.close_button"
          >
            Return to Site
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.panel">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
              data-ocid="admin.back.button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/brew-logo-transparent.dim_200x200.png"
                alt=""
                className="w-7 h-7 rounded-full"
              />
              <span className="font-display text-lg font-bold text-primary">
                BREW
              </span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase ml-1 hidden sm:inline">
                Admin Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Admin Mode
            </span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="bg-card border border-border h-auto p-1 gap-1 mb-8 flex flex-wrap"
            data-ocid="admin.tabs.tab"
          >
            <TabsTrigger
              value="menu"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
              data-ocid="admin.menu.tab"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Menu Management
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
              data-ocid="admin.reservations.tab"
            >
              <CalendarDays className="w-4 h-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
              data-ocid="admin.info.tab"
            >
              <Settings className="w-4 h-4" />
              Restaurant Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>
          <TabsContent value="reservations">
            <ReservationManagement />
          </TabsContent>
          <TabsContent value="info">
            <RestaurantInfoManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
