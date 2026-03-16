"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, User, Lock, Save, CreditCard, Crown, Check } from "lucide-react";
import { UsageDisplay } from "@/components/billing/usage-display";

export default function SettingsPage() {
  const { data: userData, isLoading, refetch } = trpc.user.me.useQuery();
  const { data: subscriptionData, isLoading: subLoading } = trpc.billing.getSubscription.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const createPortal = trpc.billing.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const createCheckout = trpc.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state when data loads
  useEffect(() => {
    if (userData) {
      setName(userData.name ?? "");
      setImage(userData.image ?? "");
    }
  }, [userData]);

  const displayName = name || userData?.name || "";
  const displayImage = image;

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSaveProfile = () => {
    const updates: { name?: string; image?: string } = {};
    if (displayName && displayName !== userData?.name) updates.name = displayName;
    if (displayImage !== (userData?.image ?? "")) updates.image = displayImage;
    if (Object.keys(updates).length > 0) {
      updateProfile.mutate(updates);
    } else {
      toast.info("No changes to save");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      // Better Auth exposes changePassword as a client method
      const result = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!result.ok) {
        const data = await result.json().catch(() => ({}));
        toast.error(data.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Lock className="size-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="size-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle>Profile Information</GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 rounded-xl">
                  <AvatarImage src={displayImage} alt={displayName} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">Enter a URL below to set your avatar</p>
                </div>
              </div>

              <Separator />

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder={userData?.name ?? "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Avatar URL</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/avatar.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </GlowCardContent>
          </GlowCard>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle>Account Settings</GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="space-y-6">
              {/* Email (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email ?? ""}
                  disabled
                  className="opacity-70"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <Separator />

              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password (min 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 size-4" />
                  )}
                  Update Password
                </Button>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back.
                </p>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </GlowCardContent>
          </GlowCard>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Subscription
              </GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="space-y-6">
              {subLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Current Plan */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xl font-bold capitalize">
                          {subscriptionData?.tier ?? "Free"}
                        </p>
                        {subscriptionData?.tier !== "free" && subscriptionData?.status === "active" && (
                          <Crown className="size-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        Status: {subscriptionData?.status ?? "active"}
                      </p>
                      {subscriptionData?.stripeCurrentPeriodEnd && (
                        <p className="text-xs text-muted-foreground">
                          Renews: {new Date(subscriptionData.stripeCurrentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {subscriptionData?.tier !== "free" ? (
                      <Button
                        variant="outline"
                        onClick={() => createPortal.mutate()}
                        disabled={createPortal.isPending}
                      >
                        {createPortal.isPending ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        Manage Subscription
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => createCheckout.mutate({ plan: "pro" })}
                          disabled={createCheckout.isPending}
                        >
                          {createCheckout.isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : null}
                          Upgrade to Pro
                        </Button>
                        <Button
                          onClick={() => createCheckout.mutate({ plan: "team" })}
                          disabled={createCheckout.isPending}
                        >
                          {createCheckout.isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : null}
                          Upgrade to Team
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Plan features summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: "Free", price: "$0", features: ["Browse models", "Community reviews", "100 API calls/day"] },
                      { tier: "Pro", price: "$19/mo", features: ["Unlimited downloads", "10,000 API calls/day", "Advanced comparisons"] },
                      { tier: "Team", price: "$49/mo", features: ["10 seats", "50,000 API calls/day", "SSO", "Custom integrations"] },
                    ].map((p) => (
                      <div
                        key={p.tier}
                        className={`p-4 rounded-xl border ${
                          subscriptionData?.tier?.toLowerCase() === p.tier.toLowerCase()
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/60 bg-muted/10"
                        }`}
                      >
                        <p className="font-semibold text-sm">{p.tier}</p>
                        <p className="text-lg font-bold mt-1">{p.price}</p>
                        <ul className="mt-3 space-y-1">
                          {p.features.map((f) => (
                            <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Check className="size-3 text-primary" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Usage Display */}
                  <UsageDisplay />
                </>
              )}
            </GlowCardContent>
          </GlowCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
