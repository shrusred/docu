// client/components/Modal.Folder.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; color?: string }) => void;
}

export default function FolderModal({
  isOpen,
  onClose,
  onSave,
}: FolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("var(--color-medium-blue)");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setColor("var(--color-medium-blue)");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[var(--color-light-med-grey-blue)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--color-light-med-grey-blue)]">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--color-dark-ink-blue)]">
            New Folder
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--color-very-light-grey-blue)]"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--color-mid-greyish-blue)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-4">
          {/* Folder Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-dark-ink-blue)] mb-1">
              Folder name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Medical Records"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-light-med-grey-blue)] bg-[var(--color-very-light-grey-blue)] text-[var(--color-dark-ink-blue)] placeholder-[var(--color-mid-greyish-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-dark-ink-blue)] mb-1">
              Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-light-med-grey-blue)] bg-white text-[var(--color-dark-ink-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="var(--color-medium-blue)">Blue</option>
              <option value="var(--color-primary)">Teal</option>
              <option value="#305c89">Medium-dark blue</option>
              <option value="#6fa8dc">Light-med blue</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-t border-[var(--color-light-med-grey-blue)] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--color-light-med-grey-blue)] text-[var(--color-dark-ink-blue)] bg-white hover:bg-[var(--color-very-light-grey-blue)]"
          >
            Close
          </button>
          <button
            onClick={() => name.trim() && onSave({ name, color })}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-60"
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
