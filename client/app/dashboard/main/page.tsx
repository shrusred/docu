// === client/app/dashboard/main/page.tsx ===
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/Dashboard.Header";
import Sidebar from "@/components/Dashboard.Sidebar";
import SummaryCard from "@/components/SummaryCard";
import RecentActivityCard from "@/components/RecentActivityCard";
import QuickActionsCard from "@/components/QuickActionsCard";

// TODO: Move these interfaces to client/types/dashboard.ts later
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider?: "local" | "google";
}

interface DashboardStats {
  documentsCount: number;
  updatedThisWeek: number;
  upcomingExpires: number;
  sharedWithYou: number;
}

interface RecentActivity {
  id: string;
  type: "upload" | "share" | "update" | "delete";
  user: string;
  action: string;
  document?: string;
  timestamp: Date;
  metadata?: {
    documentType?: string;
    sharedWith?: string;
    folderName?: string;
  };
}

interface DashboardApiResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    notifications: number;
  };
  message?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dashboard data state
  const [stats, setStats] = useState<DashboardStats>({
    documentsCount: 0,
    updatedThisWeek: 0,
    upcomingExpires: 0,
    sharedWithYou: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState(0);

  // Loading and error states (following your Auth.LoginForm pattern)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    // 🚨 TESTING BYPASS - REMOVE AFTER TESTING - FOR DEVELOPMENT ONLY
    const BYPASS_AUTH_FOR_TESTING = true;

    if (BYPASS_AUTH_FOR_TESTING) {
      console.log("🚨 AUTH BYPASSED FOR TESTING - REMOVE IN PRODUCTION!");
      const mockUser = {
        id: "test-user-123",
        name: "Test User",
        email: "test@example.com",
        authProvider: "local" as const,
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        console.log("No auth token or user data found, redirecting to login");
        router.push("/auth/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log("User authenticated:", parsedUser.email);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  // Fetch dashboard data from backend
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // 🚨 TESTING BYPASS - REMOVE AFTER TESTING
        const BYPASS_DATA_FOR_TESTING = true;

        if (BYPASS_DATA_FOR_TESTING) {
          console.log("🚨 USING MOCK DATA FOR TESTING - REMOVE IN PRODUCTION!");
          // Simulate loading delay
          setTimeout(() => {
            setStats({
              documentsCount: 42,
              updatedThisWeek: 23,
              upcomingExpires: 1,
              sharedWithYou: 5,
            });
            setNotifications(2);
            setRecentActivity([
              {
                id: "1",
                type: "upload",
                user: "Test User",
                action: "uploaded",
                document: "Labreport1.pdf",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                metadata: { documentType: "Medical" },
              },
              {
                id: "2",
                type: "share",
                user: "You",
                action: "shared Car Insurance with User 1",
                document: "Car Insurance.pdf",
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                metadata: { documentType: "Insurance", sharedWith: "User 1" },
              },
              {
                id: "3",
                type: "update",
                user: "John Doe",
                action: "updated",
                document: "Passport.pdf",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                metadata: { documentType: "ID" },
              },
            ]);
            setIsLoading(false);
          }, 1000);
          return;
        }

        const token = localStorage.getItem("token");

        // TODO: Create this endpoint in your backend
        // Create: server/routes/dashboardRoutes.ts
        // Create: server/controllers/dashboardController.ts
        // Add to server.ts: app.use("/api/dashboard", dashboardRoutes);
        const response = await fetch("http://localhost:5001/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // TODO: Make sure your backend accepts Bearer token
          },
        });

        if (response.ok) {
          const data: DashboardApiResponse = await response.json();

          if (data.success) {
            setStats(data.data.stats);
            setNotifications(data.data.notifications);

            // Convert timestamp strings to Date objects
            const activitiesWithDates = data.data.recentActivity.map(
              (activity) => ({
                ...activity,
                timestamp: new Date(activity.timestamp),
              })
            );
            setRecentActivity(activitiesWithDates);

            console.log("Dashboard data loaded successfully");
          } else {
            setError(data.message || "Failed to load dashboard data");
          }
        } else {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/auth/login");
            return;
          }

          const errorData = await response.json();
          setError(errorData.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError("Cannot connect to server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, router]);

  // Handle sidebar navigation
  const handleNavigation = (href: string) => {
    console.log(`Navigate to: ${href}`);

    // TODO: Update these routes based on your actual folder structure
    switch (href) {
      case "dashboard":
        router.push("/dashboard/main");
        break;
      case "documents":
        router.push("/dashboard/main/documents");
        break;
      case "folders":
        router.push("/dashboard/main/docfolders");
        break;
      case "reminders":
        router.push("/dashboard/main/reminders");
        break;
      case "family-groups":
        router.push("/dashboard/main/family-groups");
        break;
      case "profile":
        router.push("/dashboard/main/profile");
        break;
      default:
        router.push(`/dashboard/main/${href}`);
    }
  };

  // Handle quick actions
  const handleQuickAction = (action: "document" | "folder") => {
    console.log(`Quick action: ${action}`);

    // TODO: Update these routes based on your actual structure
    if (action === "document") {
      router.push("/dashboard/dashboard/documents/upload"); // TODO: Create this route
    } else if (action === "folder") {
      router.push("/dashboard/dashboard/folders/create"); // TODO: Create this route
    }
  };

  // Handle header actions
  const handleNotificationClick = () => {
    console.log("Notification clicked");
    router.push("/dashboard/dashboard/reminders"); // TODO: Update route if different
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    router.push("/dashboard/dashboard/profile"); // TODO: Update route if different
  };

  const handleExternalLinkClick = () => {
    console.log("External link clicked");
    // TODO: Add help documentation or external link
    window.open("https://docs.yourdomain.com", "_blank");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out");
    router.push("/auth/login");
  };

  // Retry function for error state
  const handleRetry = () => {
    window.location.reload(); // Simple retry by reloading
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto"></div>
          <p className="text-lg text-brand-mid">
            {!isAuthenticated
              ? "Checking authentication..."
              : "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg border border-brand-light-med max-w-md text-center">
          <div className="text-brand-coral text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">
            Something went wrong
          </h2>
          <div className="p-3 bg-brand-coral text-white rounded text-sm mb-6">
            {error}
          </div>
          <button onClick={handleRetry} className="btn-brand-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <DashboardHeader
        user={user!}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onExternalLinkClick={handleExternalLinkClick}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeItem="dashboard"
          onNavigate={handleNavigation}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Expiration Alert */}
          {stats.upcomingExpires > 0 && (
            <ExpirationAlert
              count={stats.upcomingExpires}
              onViewReminders={() => handleNavigation("reminders")}
            />
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {/* TODO: Update SummaryCard props based on your component */}
              <SummaryCard stats={stats} />
            </div>

            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {/* TODO: Update RecentActivityCard props based on your component */}
              <RecentActivityCard
                activities={recentActivity}
                onViewAll={() => handleNavigation("activity")} // TODO: Create activity route if needed
              />
            </div>

            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {/* TODO: Update QuickActionsCard props based on your component */}
              <QuickActionsCard onAction={handleQuickAction} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// TODO: Move these components to separate files later for better modularity

// Expiration Alert Component
interface ExpirationAlertProps {
  count: number;
  onViewReminders: () => void;
}

const ExpirationAlert: React.FC<ExpirationAlertProps> = ({
  count,
  onViewReminders,
}) => {
  return (
    <div className="border border-brand-coral rounded-lg p-4 mb-6 bg-white animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-brand-coral"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-dark">
              ⚠️ Attention Required
            </h3>
            <p className="text-sm text-brand-dark-grey">
              You have {count} document(s) expiring soon.
            </p>
          </div>
        </div>
        <button
          onClick={onViewReminders}
          className="px-4 py-2 bg-brand-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
        >
          View Reminders
        </button>
      </div>
    </div>
  );
};

// Activity Summary Component
// interface ActivitySummaryProps {
//   activities: RecentActivity[];
//   onViewAll: () => void;
// }

// const ActivitySummary: React.FC<ActivitySummaryProps> = ({
//   activities,
//   onViewAll,
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 border border-brand-light-med">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-brand-dark">
//           Activity Summary
//         </h3>
//         {activities.length > 3 && (
//           <button
//             onClick={onViewAll}
//             className="text-sm text-brand-teal hover:text-brand-blue transition-colors"
//           >
//             View All
//           </button>
//         )}
//       </div>
//       <div className="space-y-3">
//         {activities.slice(0, 3).map((activity) => (
//           <div key={activity.id} className="flex items-center space-x-3">
//             <div className="w-2 h-2 rounded-full bg-brand-teal"></div>
//             <span className="text-sm text-brand-dark-grey">
//               <span className="font-medium text-brand-dark">
//                 {activity.user}
//               </span>{" "}
//               {activity.action}
//             </span>
//           </div>
//         ))}
//         {activities.length === 0 && (
//           <p className="text-sm italic text-brand-light-med-2">
//             No recent activity
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// Check authentication on component mount
// useEffect(() => {
//   const checkAuth = () => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("user");

//     if (!token || !userData) {
//       console.log("No auth token or user data found, redirecting to login");
//       router.push("/auth/login");
//       return;
//     }

//     try {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//       setIsAuthenticated(true);
//       console.log("User authenticated:", parsedUser.email);
//     } catch (error) {
//       console.error("Invalid user data in localStorage:", error);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       router.push("/auth/login");
//     }
//   };

//   checkAuth();
// }, [router]);
