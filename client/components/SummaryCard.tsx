"use client";

import React from "react";

interface SummaryCardProps {
  stats: {
    documentsCount: number;
    updatedThisWeek: number;
    upcomingExpires: number;
    sharedWithYou: number;
  };
  className?: string;
}

export default function SummaryCard({
  stats,
  className = "",
}: SummaryCardProps) {
  // Icon components using SVG
  const DocumentsIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 100 2h4a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );

  const UpdateIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 17H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ExpiryIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ShareIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        fillRule="evenodd"
        d="M14.828 2.828a4 4 0 00-5.656 0L7.757 4.243a1 1 0 101.414 1.414l1.415-1.414a2 2 0 012.828 0l1.415 1.414a1 1 0 001.414-1.414l-1.415-1.415zm-7.071 9.899L6.343 14.14a2 2 0 000 2.828l1.414 1.415a1 1 0 001.414-1.414L7.757 15.55a2 2 0 010-2.828l1.414-1.415a1 1 0 00-1.414-1.414zM16.243 8.45l1.414 1.414a2 2 0 010 2.828l-1.414 1.415a1 1 0 01-1.414-1.414l1.414-1.415a2 2 0 000-2.828L14.83 7.036a1 1 0 111.414-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const statItems = [
    {
      label: "Documents count",
      value: stats.documentsCount,
      icon: <DocumentsIcon />,
      color: "#3A6EA5", // Medium blue
    },
    {
      label: "Updated this week",
      value: stats.updatedThisWeek,
      icon: <UpdateIcon />,
      color: "#2CA6A4", // Teal blue (success)
    },
    {
      label: "Upcoming expires",
      value: stats.upcomingExpires,
      icon: <ExpiryIcon />,
      color: stats.upcomingExpires > 0 ? "#D9534F" : "#2CA6A4", // Coral red for alerts, teal for none
    },
    {
      label: "Shared with you",
      value: stats.sharedWithYou,
      icon: <ShareIcon />,
      color: "#6FA8DC", // Light-med blue
    },
  ];

  return (
    <div
      className={`rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{
        background: "linear-gradient(135deg, #3A6EA5 0%, #305C89 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path
              fillRule="evenodd"
              d="M20 13.5a6 6 0 01-5.27 5.97 2 2 0 11-3.46 0A6 6 0 016 13.5a6 6 0 016-6 .75.75 0 000-1.5 7.5 7.5 0 00-7.5 7.5 7.5 7.5 0 0015 0 6 6 0 01-6 6 .75.75 0 000-1.5 6 6 0 005.27-5.97z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: item.color,
                  color: "white",
                }}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium opacity-90">
                {item.label}:
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="font-bold text-lg"
                style={{
                  color:
                    item.value === 0 ? "rgba(255, 255, 255, 0.7)" : "white",
                }}
              >
                {item.value}
              </span>
              {item.label === "Upcoming expires" && item.value > 0 && (
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "#D9534F" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with quick action */}
      <div className="mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-75">
            Last updated: {new Date().toLocaleDateString()}
          </span>
          <button
            className="text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 font-medium"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
            }}
            onClick={() => console.log("Refresh stats")}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
