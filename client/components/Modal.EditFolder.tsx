// client/components/Modal.EditFolder.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

/** ——— Types you can optionally import elsewhere ——— */
export type ShareRow = {
  id?: string;
  nameOrEmail: string;
  permission: "Editor" | "Viewer";
};

export type EditFolderPayload = {
  id: string | null;
  name: string;
  shares: ShareRow[];
};

/** ——— Props ——— */
type Props = {
  isOpen: boolean;
  folderId: string | null;
  initialName?: string;
  /** Optional: if you want to pre-seed shares later */
  initialShares?: ShareRow[];
  onClose: () => void;
  onSave: (payload: EditFolderPayload) => void;
};

export default function EditFolderModal({
  isOpen,
  folderId,
  initialName,
  initialShares,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(initialName ?? "");
  const [rows, setRows] = useState<ShareRow[]>(initialShares ?? []);
  const [newShare, setNewShare] = useState("");
  const [newPerm, setNewPerm] = useState<"Editor" | "Viewer">("Editor");

  // Reset state whenever modal opens or initial data changes
  useEffect(() => {
    if (isOpen) {
      setName(initialName ?? "");
      setRows(initialShares ?? []);
      setNewShare("");
      setNewPerm("Editor");
    }
  }, [isOpen, initialName, initialShares]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const addRow = () => {
    const val = newShare.trim();
    if (!val) return;
    setRows((prev) => [
      ...prev,
      {
        id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
        nameOrEmail: val,
        permission: newPerm,
      },
    ]);
    setNewShare("");
    setNewPerm("Editor");
  };

  const removeRow = (id?: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: folderId ?? null,
      name: name.trim(),
      shares: rows,
    });

    // --- Example API hook (commented) ---
    // fetch(`/api/folders/${encodeURIComponent(folderId ?? "")}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: name.trim(), shares: rows }),
    // }).catch(console.error);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[var(--color-light-med-grey-blue)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-light-med-grey-blue)]">
          <h3 className="text-lg font-semibold text-[var(--color-dark-ink-blue)]">
            Edit Folder
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
        <div className="px-5 py-5 space-y-5">
          {/* Folder name */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] items-center gap-3">
            <label className="text-sm font-medium text-[var(--color-dark-ink-blue)]">
              Folder Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-light-med-grey-blue)] bg-[var(--color-very-light-grey-blue)] text-[var(--color-dark-ink-blue)] placeholder-[var(--color-mid-greyish-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Shares list */}
          <div className="rounded-xl border border-[var(--color-light-med-grey-blue)] overflow-hidden">
            <div className="bg-[var(--color-very-light-grey-blue)] px-4 py-2.5 text-sm font-medium text-[var(--color-dark-ink-blue)]">
              Shared with
            </div>

            {rows.length === 0 ? (
              <div className="px-4 py-4 text-sm text-[var(--color-mid-greyish-blue)]">
                No one is shared yet.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-light-med-grey-blue)]">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr,160px,44px] items-center gap-3 px-4 py-3"
                  >
                    <div className="text-[var(--color-dark-ink-blue)] break-all">
                      {row.nameOrEmail}
                    </div>
                    <div>
                      <select
                        value={row.permission}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? {
                                    ...r,
                                    permission: e.target.value as
                                      | "Editor"
                                      | "Viewer",
                                  }
                                : r
                            )
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-light-med-grey-blue)] bg-white text-[var(--color-dark-ink-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-coral-red)] text-white hover:opacity-90"
                        aria-label="Remove"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new share */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr,160px,44px] items-center gap-3 rounded-xl border border-[var(--color-light-med-grey-blue)] bg-[var(--color-light-med-blue)]/30 px-4 py-3">
            <label className="hidden sm:block text-sm font-medium text-[var(--color-dark-ink-blue)]">
              Invite
            </label>
            <input
              value={newShare}
              onChange={(e) => setNewShare(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRow();
                }
              }}
              placeholder="Name or email"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-light-med-grey-blue)] bg-white text-[var(--color-dark-ink-blue)] placeholder-[var(--color-mid-greyish-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <select
              value={newPerm}
              onChange={(e) =>
                setNewPerm(e.target.value as "Editor" | "Viewer")
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-light-med-grey-blue)] bg-white text-[var(--color-dark-ink-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button
              onClick={addRow}
              disabled={!newShare.trim()}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-teal-blue)] text-white disabled:opacity-60"
              aria-label="Add"
              title="Add"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* (Optional) Help / note row */}
          <p className="text-xs sm:text-[13px] text-[var(--color-mid-greyish-blue)]">
            People you invite will receive access to this folder with the
            selected permission.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--color-light-med-grey-blue)] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--color-light-med-grey-blue)] text-[var(--color-dark-ink-blue)] bg-white hover:bg-[var(--color-very-light-grey-blue)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
