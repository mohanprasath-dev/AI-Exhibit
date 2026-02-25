"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Camera,
  Mail,
  Check,
  X,
  Loader2,
  Moon,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type TabType = "profile" | "notifications" | "appearance" | "privacy";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

export default function SettingsPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailVotes: true,
    emailWinners: true,
    emailNewsletter: false,
    browserNotifications: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showVotes: true,
    showSubmissions: true,
  });

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userAvatar = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* User Info Card */}
            <div className="glass rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-foreground font-bold text-lg">
                    {userName[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{email}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="glass rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-violet-300/60 hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              <hr className="border-white/10 my-2" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>

                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/10">
                    <div className="relative">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt={userName}
                          width={96}
                          height={96}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-foreground font-bold text-3xl">
                          {userName[0].toUpperCase()}
                        </div>
                      )}
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white hover:bg-violet-400 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-medium text-foreground">{userName}</h3>
                      <p className="text-muted-foreground text-sm">Your profile photo is synced from Google</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Display Name
                      </label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Input
                          value={email}
                          disabled
                          className="opacity-60"
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email is managed by your Google account</p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider mb-4">
                        Email Notifications
                      </h3>
                      <div className="space-y-4">
                        <NotificationToggle
                          label="Vote notifications"
                          description="Get notified when someone votes on your entries"
                          checked={notifications.emailVotes}
                          onChange={(checked) =>
                            setNotifications({ ...notifications, emailVotes: checked })
                          }
                        />
                        <NotificationToggle
                          label="Winner announcements"
                          description="Get notified about Hall of Fame winners"
                          checked={notifications.emailWinners}
                          onChange={(checked) =>
                            setNotifications({ ...notifications, emailWinners: checked })
                          }
                        />
                        <NotificationToggle
                          label="Newsletter"
                          description="Receive weekly updates and featured creations"
                          checked={notifications.emailNewsletter}
                          onChange={(checked) =>
                            setNotifications({ ...notifications, emailNewsletter: checked })
                          }
                        />
                      </div>
                    </div>

                    <hr className="border-white/10" />

                    {/* Browser Notifications */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider mb-4">
                        Browser Notifications
                      </h3>
                      <NotificationToggle
                        label="Push notifications"
                        description="Get real-time notifications in your browser"
                        checked={notifications.browserNotifications}
                        onChange={(checked) =>
                          setNotifications({ ...notifications, browserNotifications: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>

                  <div>
                    <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider mb-4">
                      Theme
                    </h3>
                    <div className="flex items-center gap-4 p-6 rounded-xl border-2 border-violet-500/50 bg-violet-500/10">
                      <Moon className="w-8 h-8 text-violet-300" />
                      <div>
                        <p className="font-medium text-foreground">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">The cosmic dark theme is always active</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      AI Exhibit uses a premium dark theme by default
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Privacy Settings */}
                  <div className="glass rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Privacy Settings</h2>

                    <div className="space-y-4">
                      <NotificationToggle
                        label="Show profile publicly"
                        description="Allow others to see your profile page"
                        checked={privacy.showProfile}
                        onChange={(checked) =>
                          setPrivacy({ ...privacy, showProfile: checked })
                        }
                        icon={privacy.showProfile ? Eye : EyeOff}
                      />
                      <NotificationToggle
                        label="Show my votes"
                        description="Display entries you've voted on"
                        checked={privacy.showVotes}
                        onChange={(checked) =>
                          setPrivacy({ ...privacy, showVotes: checked })
                        }
                        icon={privacy.showVotes ? Eye : EyeOff}
                      />
                      <NotificationToggle
                        label="Show my submissions"
                        description="Display your submitted entries publicly"
                        checked={privacy.showSubmissions}
                        onChange={(checked) =>
                          setPrivacy({ ...privacy, showSubmissions: checked })
                        }
                        icon={privacy.showSubmissions ? Eye : EyeOff}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end mt-8">
                      <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveSuccess ? (
                          <Check className="w-4 h-4" />
                        ) : null}
                        {saveSuccess ? "Saved!" : "Save Changes"}
                      </Button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="glass rounded-2xl p-6 md:p-8 border border-red-500/20">
                    <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Irreversible and destructive actions
                    </p>

                    <Button
                      variant="outline"
                      className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 md:p-8 max-w-md w-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Delete Account</h3>
                  <p className="text-muted-foreground text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-foreground/80 mb-6">
                Are you sure you want to delete your account? All your data, submissions,
                and votes will be permanently removed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    // Handle delete account
                    setShowDeleteModal(false);
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Notification Toggle Component
function NotificationToggle({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-violet-300" />}
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors",
          checked ? "bg-violet-500" : "bg-violet-700"
        )}
      >
        <motion.div
          layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          animate={{ left: checked ? "calc(100% - 20px)" : "4px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}


