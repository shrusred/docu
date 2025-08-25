// === client/components/RecentActivityCard.tsx ===
"use client";

import React from "react";
import {
  Upload,
  Share2,
  Edit3,
  Trash2,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react";

// TODO: Move to client/types/dashboard.ts later
interface RecentActivity {
  id: string;
  type: "upload" | "share" | "update" | "delete" | "expire";
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

interface RecentActivityCardProps {
  activities: RecentActivity[];
  onViewAll?: () => void;
  maxItems?: number;
}

export default function RecentActivityCard({
  activities,
  onViewAll,
  maxItems = 5,
}: RecentActivityCardProps) {
  // Get the appropriate icon for each activity type
  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "upload":
        return Upload;
      case "share":
        return Share2;
      case "update":
        return Edit3;
      case "delete":
        return Trash2;
      case "expire":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  // Get the appropriate color for each activity type
  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "upload":
        return "text-brand-teal";
      case "share":
        return "text-brand-blue";
      case "update":
        return "text-brand-blue-light";
      case "delete":
        return "text-brand-coral";
      case "expire":
        return "text-orange-500";
      default:
        return "text-brand-mid";
    }
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    return timestamp.toLocaleDateString();
  };

  // Get document type badge color
  const getDocumentTypeBadge = (type?: string) => {
    if (!type) return null;

    const colors = {
      Medical: "bg-red-100 text-red-800",
      Legal: "bg-blue-100 text-blue-800",
      Insurance: "bg-green-100 text-green-800",
      ID: "bg-purple-100 text-purple-800",
      Certificates: "bg-yellow-100 text-yellow-800",
      Miscellaneous: "bg-gray-100 text-gray-800",
    };

    const colorClass =
      colors[type as keyof typeof colors] || colors.Miscellaneous;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {type}
      </span>
    );
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-brand-light-med h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-dark">
          Recent Activity
        </h3>
        {activities.length > maxItems && onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-sm text-brand-teal hover:text-brand-blue transition-colors"
          >
            <span>View All</span>
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* Activity List */}
      <div className="flex-1 space-y-4">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-brand-light transition-colors"
              >
                {/* Activity Icon */}
                <div className={`flex-shrink-0 mt-0.5`}>
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                    <Icon size={14} className={iconColor} />
                  </div>
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-dark-grey">
                        <span className="font-medium text-brand-dark">
                          {activity.user}
                        </span>{" "}
                        {activity.action}
                      </p>

                      {/* Document name if available */}
                      {activity.document && (
                        <p className="text-sm font-medium text-brand-dark mt-1">
                          {activity.document}
                        </p>
                      )}

                      {/* Document type badge */}
                      {activity.metadata?.documentType && (
                        <div className="mt-2">
                          {getDocumentTypeBadge(activity.metadata.documentType)}
                        </div>
                      )}

                      {/* Additional metadata */}
                      {activity.metadata?.sharedWith && (
                        <p className="text-xs text-brand-mid mt-1">
                          Shared with: {activity.metadata.sharedWith}
                        </p>
                      )}

                      {activity.metadata?.folderName && (
                        <p className="text-xs text-brand-mid mt-1">
                          In folder: {activity.metadata.folderName}
                        </p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 ml-2">
                      <p className="text-xs text-brand-mid">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8">
              <Clock
                size={32}
                className="text-brand-light-med-2 mx-auto mb-3"
              />
              <p className="text-sm text-brand-light-med-2 font-medium">
                No recent activity
              </p>
              <p className="text-xs text-brand-mid mt-1">
                Activity will appear here when you start using DocuFam
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with activity count */}
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-brand-light-med">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brand-mid">
              Showing {displayedActivities.length} of {activities.length}{" "}
              activities
            </p>
            {activities.length > maxItems && (
              <p className="text-xs text-brand-teal">
                +{activities.length - maxItems} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
