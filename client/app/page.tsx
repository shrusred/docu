// === client/app/dashboard/dashboard/page.tsx ===
"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard.Header";
import Sidebar from "../../components/Sidebar";
import SummaryCard from "@/components/SummaryCard";
import RecentActivityCard from "@/components/RecentActivityCard";
import QuickActionsCard from "@/components/QuickActionsCard";

// Local interfaces
interface DashboardStats {
  documentsCount: number;
  updatedThisWeek: number;
  upcomingExpires: number;
  sharedWithYou: number;
}

interface RecentActivity {
  id: string;
  type: "upload" | "share" | "update";
  user: string;
  action: string;
  document?: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

export default function DashboardPage() {
  // State management
  const [stats, setStats] = useState<DashboardStats>({
    documentsCount: 42,
    updatedThisWeek: 23,
    upcomingExpires: 1,
    sharedWithYou: 5,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "upload",
      user: "User 1",
      action: "uploaded",
      document: "Labreport1.pdf",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "share",
      user: "You",
      action: "shared Car Insurance with User 1",
      timestamp: new Date(),
    },
  ]);

  const [user, setUser] = useState<User>({
    id: "1",
    name: "Test User",
  });

  const [notifications, setNotifications] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls to your Express backend
        // const statsResponse = await fetch('/api/dashboard/stats', {
        //   headers: {
        //     'Authorization': `Bearer ${getAuthToken()}`,
        //   },
        // });
        // const activityResponse = await fetch('/api/dashboard/activity', {
        //   headers: {
        //     'Authorization': `Bearer ${getAuthToken()}`,
        //   },
        // });
        // const userResponse = await fetch('/api/user/profile', {
        //   headers: {
        //     'Authorization': `Bearer ${getAuthToken()}`,
        //   },
        // });

        // Simulate API delay for development
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // const statsData = await statsResponse.json();
        // const activityData = await activityResponse.json();
        // const userData = await userResponse.json();

        // setStats(statsData);
        // setRecentActivity(activityData);
        // setUser(userData);

        console.log("Dashboard data loaded successfully");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Handle error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle quick actions
  const handleQuickAction = (action: "document" | "folder") => {
    console.log(`Quick action: ${action}`);
    // TODO: Implement navigation
    // Example with Next.js router:
    // if (action === 'document') {
    //   router.push('/dashboard/documents/upload');
    // } else if (action === 'folder') {
    //   router.push('/dashboard/folders/create');
    // }
  };

  // Handle sidebar navigation
  const handleNavigation = (href: string) => {
    console.log(`Navigate to: ${href}`);
    // TODO: Implement with Next.js router
    // router.push(href);
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F4F7FA" }}
      >
        <div className="text-center space-y-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "#2CA6A4" }}
          ></div>
          <p className="text-lg" style={{ color: "#7D8CA3" }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F7FA" }}>
      {/* Header */}
      <DashboardHeader user={user} notifications={notifications} />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeItem="dashboard" onNavigate={handleNavigation} />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Alert for expiring documents */}
          {stats.upcomingExpires > 0 && (
            <div
              className="border rounded-lg p-4 mb-6 animate-pulse"
              style={{
                backgroundColor: "#F4F7FA",
                borderColor: "#D9534F",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6"
                      style={{ color: "#D9534F" }}
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
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "#1E2A38" }}
                    >
                      ⚠️ Attention Required
                    </h3>
                    <p className="text-sm" style={{ color: "#4B5A6D" }}>
                      You have {stats.upcomingExpires} document(s) expiring
                      soon.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation("/dashboard/reminders")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: "#D9534F" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#C9302C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#D9534F";
                  }}
                >
                  View Reminders
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Card Wrapper */}
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <SummaryCard stats={stats} />
            </div>

            {/* Recent Activity Card Wrapper */}
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <RecentActivityCard activities={recentActivity} />
            </div>

            {/* Quick Actions Card Wrapper */}
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <QuickActionsCard onAction={handleQuickAction} />
            </div>
          </div>

          {/* Additional Dashboard Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div
              className="rounded-lg shadow-sm p-6 border"
              style={{
                backgroundColor: "white",
                borderColor: "#E5ECF3",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#1E2A38" }}
              >
                Quick Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: "#7D8CA3" }}>Total Documents</span>
                  <span className="font-bold" style={{ color: "#3A6EA5" }}>
                    {stats.documentsCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#7D8CA3" }}>This Week's Updates</span>
                  <span className="font-bold" style={{ color: "#2CA6A4" }}>
                    {stats.updatedThisWeek}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#7D8CA3" }}>Shared Documents</span>
                  <span className="font-bold" style={{ color: "#6FA8DC" }}>
                    {stats.sharedWithYou}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Summary */}
            <div
              className="rounded-lg shadow-sm p-6 border"
              style={{
                backgroundColor: "white",
                borderColor: "#E5ECF3",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#1E2A38" }}
              >
                Activity Summary
              </h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#2CA6A4" }}
                    ></div>
                    <span className="text-sm" style={{ color: "#4B5A6D" }}>
                      <span
                        className="font-medium"
                        style={{ color: "#1E2A38" }}
                      >
                        {activity.user}
                      </span>{" "}
                      {activity.action}
                    </span>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm italic" style={{ color: "#AAB7C7" }}>
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
