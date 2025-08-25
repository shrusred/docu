// === client/components/Dashboard.Sidebar.tsx ===
"use client";

import React from "react";
import { Home, FileText, Folder, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider?: "local" | "google";
}

interface SidebarProps {
  activeItem: string;
  onNavigate: (href: string) => void;
  user: User | null;
  onLogout: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  path: string;
}

export default function Sidebar({
  activeItem,
  onNavigate,
  user,
  onLogout,
}: SidebarProps) {
  const router = useRouter();

  const navigationItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "dashboard",
      path: "/dashboard/main",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      href: "documents",
      path: "/dashboard/main/documents",
    },
    {
      id: "folders",
      label: "Folders",
      icon: Folder,
      href: "folders",
      path: "/dashboard/main/docfolders",
    },
    {
      id: "family-groups",
      label: "Family Groups",
      icon: Users,
      href: "family-groups",
      path: "/dashboard/main/familygroups",
    },
  ];

  const handleItemClick = (item: SidebarItem) => {
    router.push(item.path);
    onNavigate(item.href);
  };

  return (
    <aside className="w-1/4 lg:w-1/5 xl:w-1/6 bg-white border-r border-brand-light-med min-h-screen overflow-hidden">
      {/* Navigation Container - Much smaller to ensure containment */}
      <div className="h-4/5 mt-[10%] mb-[10%] mx-[8%] flex flex-col">
        <nav className="h-full w-full flex flex-col justify-evenly">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div
                key={item.id}
                className="flex-1 flex items-center w-full px-[2%]"
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-[0.5em] px-[3%] py-[6%] rounded-md text-left
                    transition-all duration-300 ease-in-out transform
                    ${
                      isActive
                        ? "bg-brand-teal text-white shadow-md scale-[1.01]"
                        : "text-brand-dark-grey"
                    }
                  `}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      const textElement = e.currentTarget.querySelector(
                        ".button-text"
                      ) as HTMLElement;
                      const iconElement = e.currentTarget.querySelector(
                        ".button-icon"
                      ) as HTMLElement;
                      if (textElement) textElement.style.color = "#2CA6A4"; // brand-teal
                      if (iconElement) iconElement.style.color = "#2CA6A4"; // brand-teal
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const textElement = e.currentTarget.querySelector(
                        ".button-text"
                      ) as HTMLElement;
                      const iconElement = e.currentTarget.querySelector(
                        ".button-icon"
                      ) as HTMLElement;
                      if (textElement) textElement.style.color = "#4B5A6D"; // brand-dark-grey
                      if (iconElement) iconElement.style.color = "#7D8CA3"; // brand-mid
                    }
                  }}
                >
                  {/* Icon - Smaller size with gap spacing */}
                  <div className="flex-shrink-0">
                    <Icon
                      className={`
                        button-icon w-[1.5em] h-[1.5em] transition-all duration-300
                        ${isActive ? "text-white" : "text-brand-mid"}
                      `}
                    />
                  </div>

                  {/* Label - Much smaller text to fit container */}
                  <span
                    className={`
                      button-text font-medium text-[clamp(0.7rem,1.8vw,1rem)] flex-1 leading-tight
                      transition-all duration-300
                      ${isActive ? "text-white" : "text-brand-dark-grey"}
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
