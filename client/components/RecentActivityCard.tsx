"use client";

import React from "react";

interface RecentActivity {
  id: string;
  type: "upload" | "share" | "update" | "delete" | "create";
  user: string;
  action: string;
  document?: string;
  timestamp: Date;
}

interface RecentActivityCardProps {
  activities: RecentActivity[];
  className?: string;
}

export default function RecentActivityCard({
  activities,
  className = "",
}: RecentActivityCardProps) {
  // Icon components for different activity types
  const UploadIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L12 4.414 9.707 6.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ShareIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
        clipRule="evenodd"
      />
    </svg>
  );

  const UpdateIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 17H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M10 5a2 2 0 00-2 2v1a1 1 0 002 0V7h4v1a1 1 0 102 0V7a2 2 0 00-2-2h-4zM8 11a1 1 0 012 0v6a1 1 0 11-2 0v-6zm6 0a1 1 0 10-2 0v6a1 1 0 102 0v-6z"
      />
      <path
        fillRule="evenodd"
        d="M15 5h-6l-.27 1.243a25.855 25.855 0 01.27 13.757h5a25.855 25.855 0 01.27-13.757L15 5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CreateIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <UploadIcon />;
      case "share":
        return <ShareIcon />;
      case "update":
        return <UpdateIcon />;
      case "delete":
        return <DeleteIcon />;
      case "create":
        return <CreateIcon />;
      default:
        return <UpdateIcon />;
    }
  };

  // Get icon color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "#2CA6A4"; // Teal blue
      case "share":
        return "#6FA8DC"; // Light-med blue
      case "update":
        return "#3A6EA5"; // Medium blue
      case "delete":
        return "#D9534F"; // Coral red
      case "create":
        return "#2CA6A4"; // Teal blue
      default:
        return "#7D8CA3"; // Mid greyish blue
    }
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div
      className={`rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{
        background: "linear-gradient(135deg, #6FA8DC 0%, #3A6EA5 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 group"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Activity Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: getActivityColor(activity.type),
                  color: "white",
                }}
              >
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="opacity-90">{activity.action}</span>
                      {activity.document && (
                        <span className="font-medium text-white">
                          {" "}
                          {activity.document}
                        </span>
                      )}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>

                  {/* Activity Type Badge */}
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                    }}
                  >
                    {activity.type}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <svg
                className="w-8 h-8 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm opacity-80 italic">No recent activity</p>
            <p className="text-xs opacity-60 mt-1">
              Activity will appear here when you start using DocuFam
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-75">
            {activities.length} recent{" "}
            {activities.length === 1 ? "activity" : "activities"}
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
            onClick={() => console.log("View all activities")}
          >
            View All
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
