"use client";

import React from "react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export default function Sidebar({
  activeItem = "dashboard",
  onNavigate,
  className = "",
}: SidebarProps) {
  // Icon components using SVG (no external dependencies)
  const HomeIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );

  const DocumentIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const FolderIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );

  const BellIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-5 5v-5zM4.5 21.5h6.482a3 3 0 005.196-2.683l-.006-.017c-.296-.632-.296-1.382 0-2.014l.006-.017a3 3 0 00-5.196-2.683H4.5a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25h.818a2.25 2.25 0 001.585-.659l.525-.525a2.25 2.25 0 011.586-.658h2.172a2.25 2.25 0 011.586.658l.525.525a2.25 2.25 0 001.585.659H15A2.25 2.25 0 0117.25 9v2.25"
      />
    </svg>
  );

  const UsersIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );

  const UserIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const menuItems: SidebarItem[] = [
    { icon: <HomeIcon />, label: "Dashboard", href: "/dashboard" },
    {
      icon: <DocumentIcon />,
      label: "Documents",
      href: "/dashboard/documents",
    },
    { icon: <FolderIcon />, label: "Folders", href: "/dashboard/folders" },
    { icon: <BellIcon />, label: "Reminders", href: "/dashboard/reminders" },
    {
      icon: <UsersIcon />,
      label: "Family groups",
      href: "/dashboard/family-groups",
    },
  ];

  const handleClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  const isItemActive = (itemLabel: string) => {
    return (
      activeItem === itemLabel.toLowerCase() ||
      (activeItem === "dashboard" && itemLabel === "Dashboard")
    );
  };

  return (
    <aside
      className={`w-64 min-h-screen shadow-xl ${className}`}
      style={{ backgroundColor: "#D6DDE5" }}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b" style={{ borderColor: "#AAB7C7" }}>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg, #2CA6A4 0%, #305C89 100%)",
            }}
          >
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg" style={{ color: "#1E2A38" }}>
              DocuFam
            </h2>
            <p className="text-xs" style={{ color: "#7D8CA3" }}>
              Document Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.href}
              onClick={() => handleClick(item.href)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group relative ${
                isItemActive(item.label) ? "shadow-md" : "hover:shadow-sm"
              }`}
              style={{
                backgroundColor: isItemActive(item.label)
                  ? "white"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isItemActive(item.label)) {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isItemActive(item.label)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0px)";
                }
              }}
            >
              {/* Active indicator */}
              {isItemActive(item.label) && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                  style={{ backgroundColor: "#2CA6A4" }}
                />
              )}

              <div
                className="transition-all duration-200 group-hover:scale-110"
                style={{
                  color: isItemActive(item.label) ? "#2CA6A4" : "#7D8CA3",
                }}
              >
                {item.icon}
              </div>
              <span
                className="font-medium transition-colors duration-200"
                style={{
                  color: isItemActive(item.label) ? "#1E2A38" : "#4B5A6D",
                }}
              >
                {item.label}
              </span>

              {/* Hover indicator */}
              <div
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: "#2CA6A4" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Settings - Separate section */}
        <div className="pt-6 mt-6 border-t" style={{ borderColor: "#AAB7C7" }}>
          <div
            onClick={() => handleClick("/dashboard/profile")}
            className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0px)";
            }}
          >
            <div
              className="transition-all duration-200 group-hover:scale-110"
              style={{ color: "#7D8CA3" }}
            >
              <UserIcon />
            </div>
            <span
              className="font-medium transition-colors duration-200"
              style={{ color: "#4B5A6D" }}
            >
              Profile Settings
            </span>
            <div
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: "#2CA6A4" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom User Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div
          className="p-4 rounded-lg border shadow-sm"
          style={{
            backgroundColor: "#F4F7FA",
            borderColor: "#E5ECF3",
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#2CA6A4" }}
            >
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#1E2A38" }}
              >
                Test User
              </p>
              <p className="text-xs truncate" style={{ color: "#7D8CA3" }}>
                Premium Account
              </p>
            </div>
            <button
              className="p-1 rounded-full transition-colors duration-200"
              style={{ color: "#7D8CA3" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E5ECF3";
                e.currentTarget.style.color = "#2CA6A4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#7D8CA3";
              }}
              onClick={() => console.log("User menu")}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
