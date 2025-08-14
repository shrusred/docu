"use client";

import React from "react";

interface QuickActionsCardProps {
  onAction: (action: "document" | "folder") => void;
  className?: string;
}

export default function QuickActionsCard({
  onAction,
  className = "",
}: QuickActionsCardProps) {
  // Icon components using SVG
  const DocumentIcon = () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const FolderIcon = () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );

  const PlusIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );

  const UploadIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CreateIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-3.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
        clipRule="evenodd"
      />
      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
    </svg>
  );

  const actionItems = [
    {
      type: "document" as const,
      title: "Upload Document",
      subtitle: "Add new document",
      icon: <DocumentIcon />,
      actionIcon: <UploadIcon />,
      color: "#2CA6A4", // Teal blue
      hoverColor: "#238B89",
    },
    {
      type: "folder" as const,
      title: "Create Folder",
      subtitle: "Organize documents",
      icon: <FolderIcon />,
      actionIcon: <CreateIcon />,
      color: "#6FA8DC", // Light-med blue
      hoverColor: "#5A8BC4",
    },
  ];

  const handleActionClick = (actionType: "document" | "folder") => {
    onAction(actionType);
  };

  return (
    <div
      className={`rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{
        background: "linear-gradient(135deg, #AAB7C7 0%, #6FA8DC 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {actionItems.map((item, index) => (
          <button
            key={item.type}
            onClick={() => handleActionClick(item.type)}
            className="w-full p-4 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            />

            <div className="flex items-center justify-between relative z-10">
              {/* Left Side - Icon and Text */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 4px 12px ${item.color}40`,
                  }}
                >
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Side - Action Icon */}
              <div className="flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center group-hover:rotate-180 transition-all duration-500"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {item.actionIcon}
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300"
                  style={{
                    backgroundColor: item.color,
                    color: "white",
                  }}
                >
                  <PlusIcon />
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${item.color}20 0%, ${item.hoverColor}20 100%)`,
              }}
            />
          </button>
        ))}
      </div>

      {/* Additional Quick Actions */}
      <div className="mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center justify-center space-x-4">
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onClick={() => console.log("Scan document")}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 7.5v-.75zm9.75 0A.75.75 0 0116.5 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 17.25v-.75zm9.75 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm-3 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z"
                clipRule="evenodd"
              />
            </svg>
            <span>Scan</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onClick={() => console.log("Import from cloud")}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M10.5 3A1.501 1.501 0 009 4.5v6A1.5 1.5 0 0010.5 12h6a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0016.5 3h-6zM9.75 8.25a.75.75 0 000 1.5h.008a.75.75 0 000-1.5h-.008zM5.25 6a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V6zM2.25 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75v-.008zM9.75 15.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5h-.008zM5.25 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-.008zM22.58 9.94c0-1.526-.982-2.94-2.58-3.52V4.875c0-.621-.504-1.125-1.125-1.125h-2.25C15.879 3.75 15.375 4.254 15.375 4.875V6.42c-1.598.58-2.58 1.994-2.58 3.52 0 2.071 1.679 3.75 3.75 3.75s3.75-1.679 3.75-3.75z"
                clipRule="evenodd"
              />
            </svg>
            <span>Import</span>
          </button>
        </div>
      </div>
    </div>
  );
}
