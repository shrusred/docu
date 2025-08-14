"use client";

import React from "react";
import { Bell, User, ExternalLink } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface DashboardHeaderProps {
  user: User;
  notifications: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onExternalLinkClick?: () => void;
}

export default function DashboardHeader({
  user,
  notifications,
  onNotificationClick,
  onProfileClick,
  onExternalLinkClick,
}: DashboardHeaderProps) {
  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      console.log("Notification clicked");
      // TODO: Navigate to notifications page
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      console.log("Profile clicked");
      // TODO: Navigate to profile or show dropdown
    }
  };

  const handleExternalLinkClick = () => {
    if (onExternalLinkClick) {
      onExternalLinkClick();
    } else {
      console.log("External link clicked");
      // TODO: Open external link or help
    }
  };

  return (
    <header
      className="text-white px-6 py-4 shadow-lg"
      style={{ backgroundColor: "#1E2A38" }}
    >
      <div className="flex items-center justify-between max-w-full">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg, #2CA6A4 0%, #305C89 100%)",
            }}
          >
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h1
            className="text-xl font-semibold tracking-wide"
            style={{ color: "#E5ECF3" }}
          >
            Docufam
          </h1>
        </div>

        {/* User Profile and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Notification Bubble */}
          <div className="relative hidden sm:block">
            <div
              className="px-4 py-2 rounded-full text-sm font-medium shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: "#2CA6A4",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#238B89";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2CA6A4";
              }}
            >
              reminders about expiring documents
            </div>
            {notifications > 0 && (
              <div
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce"
                style={{
                  backgroundColor: "#D9534F",
                  color: "white",
                }}
              >
                {notifications > 99 ? "99+" : notifications}
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200 group"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4B5A6D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
              style={{
                background: "linear-gradient(135deg, #6FA8DC 0%, #3A6EA5 100%)",
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <span
              className="font-medium hidden md:block group-hover:opacity-90 transition-opacity"
              style={{ color: "#AAB7C7" }}
            >
              {user.name}
            </span>
          </button>

          {/* Bell Icon with Notification Count */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg transition-all duration-200 group"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4B5A6D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Bell
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              style={{ color: "#D6DDE5" }}
            />
            {notifications > 0 && (
              <div
                className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: "#D9534F",
                  color: "white",
                }}
              >
                {notifications > 9 ? "9+" : notifications}
              </div>
            )}
          </button>

          {/* External Link Icon */}
          <button
            onClick={handleExternalLinkClick}
            className="p-2 rounded-lg transition-all duration-200 group"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4B5A6D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ExternalLink
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              style={{ color: "#D6DDE5" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile notification banner - shown only on small screens */}
      <div className="sm:hidden mt-3">
        <div
          className="px-3 py-2 rounded-lg text-sm font-medium shadow-md flex items-center justify-between"
          style={{
            backgroundColor: "#2CA6A4",
            color: "white",
          }}
        >
          <span>reminders about expiring documents</span>
          {notifications > 0 && (
            <div
              className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-2"
              style={{
                backgroundColor: "#D9534F",
                color: "white",
              }}
            >
              {notifications > 9 ? "9+" : notifications}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
