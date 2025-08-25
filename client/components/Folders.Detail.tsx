// client/components/Folders.Detail.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Folder as FolderIcon,
  Edit3,
  Eye,
  Share2,
  Download,
  FileText,
  Upload as UploadIcon,
  X,
} from "lucide-react";

import DocumentUploadReplaceModal from "@/components/Modal.Document.Upload.Replace";
import EditFolderModal, {
  ShareRow,
  EditFolderPayload,
} from "@/components/Modal.EditFolder";

/** ---------- Types ---------- */
type ShareEntry = {
  id: string;
  name: string;
  role: "Editor" | "Viewer" | string;
};

type Folder = {
  id: string;
  name: string;
  color?: string;
  sharedWith: ShareEntry[];
};

type DocItem = {
  id: string;
  name: string; // filename/title to show
  mime?: string;
  folderId?: string; // optional if your API returns it
};

interface Props {
  folderId: string;
}

/** ---------- Component ---------- */
export default function FoldersDetail({ folderId }: Props) {
  const router = useRouter();

  // Folder state
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  // Docs state
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);

  // Replace/Upload modal
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replaceMode, setReplaceMode] = useState<"replace" | "upload">(
    "replace"
  );
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Edit Folder modal
  const [editFolderOpen, setEditFolderOpen] = useState(false);

  // Mock family + folders for the upload/replace modal (until your APIs exist)
  const mockFamily = [
    { id: "1", name: "John Smith", role: "Spouse", email: "john@example.com" },
    {
      id: "2",
      name: "Sarah Smith",
      role: "Daughter",
      email: "sarah@example.com",
    },
  ];
  const mockFolders = [
    { id: "1", name: "Medical Records", color: "var(--color-medium-blue)" },
    { id: "2", name: "Insurance Documents", color: "var(--color-medium-blue)" },
  ];

  /** ---------- Load folder (mock for now) ---------- */
  useEffect(() => {
    setLoading(true);
    const mockFolder: Folder = {
      id: folderId,
      name: `Folder ${folderId}`,
      color: "var(--color-medium-blue)",
      sharedWith: [
        { id: "u2", name: "User 2", role: "Editor" },
        { id: "u3", name: "User 3", role: "Viewer" },
      ],
    };
    const t = setTimeout(() => {
      setFolder(mockFolder);
      setLoading(false);
    }, 150);
    return () => clearTimeout(t);
  }, [folderId]);

  /** ---------- Load docs from your backend with safe parsing ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoadingDocs(true);
        const res = await fetch("http://localhost:5001/api/documents/list");
        if (!res.ok) throw new Error("Failed to load documents");
        const raw = await res.json();

        // Normalize: try common keys your API might return
        const normalized: DocItem[] = (Array.isArray(raw) ? raw : []).map(
          (d: any, i: number) => ({
            id: String(d.id ?? d._id ?? d.documentId ?? i + 1),
            name: String(
              d.filename ??
                d.originalName ??
                d.title ??
                d.name ??
                `Document-${i + 1}.pdf`
            ),
            mime: d.mimeType ?? d.mimetype ?? "application/pdf",
            folderId: d.folderId ?? d.folder ?? undefined,
          })
        );
        if (alive) setDocs(normalized);
      } catch (e) {
        console.error(e);
        if (alive)
          setDocs([
            { id: "d1", name: "HealthID.pdf", mime: "application/pdf" },
            { id: "d2", name: "abc.pdf", mime: "application/pdf" },
            { id: "d3", name: "xyz.pdf", mime: "application/pdf" },
          ]);
      } finally {
        if (alive) setIsLoadingDocs(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** If your API marks docs by folder, filter here */
  const visibleDocs = useMemo(() => {
    if (!folderId) return docs;
    const hasFolderId = docs.some((d) => d.folderId);
    return hasFolderId ? docs.filter((d) => d.folderId === folderId) : docs;
  }, [docs, folderId]);

  /** Map current folder shares -> modal initialShares */
  const initialSharesForModal = useMemo<ShareRow[]>(() => {
    if (!folder) return [];
    return folder.sharedWith.map((u) => ({
      id: u.id,
      nameOrEmail: u.name,
      permission: u.role === "Editor" ? "Editor" : "Viewer",
    }));
  }, [folder]);

  /** ---------- Actions ---------- */
  const openViewer = (docId: string) => {
    setViewerDocId(docId);
    setViewerOpen(true);
  };

  const openReplace = (docId: string) => {
    setSelectedDocId(docId);
    setReplaceMode("replace");
    setReplaceOpen(true);
  };

  const openUpload = () => {
    setSelectedDocId(null);
    setReplaceMode("upload");
    setReplaceOpen(true);
  };

  const onUploadComplete = (success: boolean, message?: string) => {
    if (success) {
      (async () => {
        try {
          const res = await fetch("http://localhost:5001/api/documents/list");
          if (res.ok) {
            const raw = await res.json();
            const normalized: DocItem[] = (Array.isArray(raw) ? raw : []).map(
              (d: any, i: number) => ({
                id: String(d.id ?? d._id ?? d.documentId ?? i + 1),
                name: String(
                  d.filename ??
                    d.originalName ??
                    d.title ??
                    d.name ??
                    `Document-${i + 1}.pdf`
                ),
                mime: d.mimeType ?? d.mimetype ?? "application/pdf",
                folderId: d.folderId ?? d.folder ?? undefined,
              })
            );
            setDocs(normalized);
          }
        } catch {
          /* noop */
        }
      })();
    }
    if (message) alert(message);
  };

  const buildViewUrl = (id: string) =>
    `http://localhost:5001/api/documents/view/${encodeURIComponent(id)}`;

  // ---------- UI ----------
  if (loading || !folder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent mb-3" />
          <p className="text-[var(--color-mid-greyish-blue)]">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[var(--color-very-light-grey-blue)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Folder header (no breadcrumbs) */}
        <div className="bg-white border border-[var(--color-light-med-grey-blue)] rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{
                  background: folder.color || "var(--color-medium-blue)",
                  borderColor: "var(--color-light-med-grey-blue)",
                }}
              >
                <FolderIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-dark-ink-blue)] leading-tight">
                  {folder.name}
                </h1>
                {/* Shared with (compact) */}
                <div className="mt-1 text-sm text-[var(--color-mid-greyish-blue)]">
                  {folder.sharedWith.map((u, i) => (
                    <span key={u.id}>
                      {i > 0 && ", "}
                      <span className="font-medium">{u.name}</span> ({u.role})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={openUpload}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90"
              >
                <UploadIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </button>
              <button
                onClick={() => setEditFolderOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[var(--color-light-med-grey-blue)] text-[var(--color-dark-ink-blue)] hover:bg-[var(--color-very-light-grey-blue)]"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit this folder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Documents grid */}
        <div
          className="
            grid gap-5
            [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))]
          "
        >
          {isLoadingDocs && (
            <div className="col-span-full text-center text-[var(--color-mid-greyish-blue)]">
              Loading documents…
            </div>
          )}

          {!isLoadingDocs && visibleDocs.length === 0 && (
            <div className="col-span-full text-center text-[var(--color-mid-greyish-blue)]">
              No documents in this folder yet.
            </div>
          )}

          {visibleDocs.map((d) => (
            <article
              key={d.id}
              className="bg-white border border-[var(--color-light-med-grey-blue)] rounded-2xl p-4 sm:p-5 shadow-sm"
            >
              {/* Blue tile with Doc/PDF icon */}
              <div className="rounded-xl bg-[var(--color-medium-blue)]/85 border border-[var(--color-light-med-grey-blue)] p-5 flex flex-col items-center justify-center min-h-[9rem]">
                <div className="relative w-16 h-20 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[var(--color-medium-blue)]" />
                  <span className="absolute -bottom-2 text-[10px] font-bold tracking-wide bg-[var(--color-coral-red)] text-white px-2 py-0.5 rounded">
                    {(d.mime || "").includes("pdf") ? "PDF" : "DOC"}
                  </span>
                </div>
                <div className="mt-3 text-sm text-white/95 line-clamp-1">
                  {d.name}
                </div>
              </div>

              {/* Actions row */}
              <div className="mt-3 flex items-center justify-between text-[var(--color-dark-ink-blue)]">
                <button
                  onClick={() => openViewer(d.id)}
                  className="p-2 rounded hover:bg-[var(--color-very-light-grey-blue)]"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openReplace(d.id)}
                  className="p-2 rounded hover:bg-[var(--color-very-light-grey-blue)]"
                  title="Edit (replace file)"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => alert("Share (stub)")}
                  className="p-2 rounded hover:bg-[var(--color-very-light-grey-blue)]"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <a
                  href={buildViewUrl(d.id)}
                  download
                  className="p-2 rounded hover:bg-[var(--color-very-light-grey-blue)]"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* --------- Viewer Modal (iframe) --------- */}
      {viewerOpen && viewerDocId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/90 border border-[var(--color-light-med-grey-blue)] hover:bg-[var(--color-very-light-grey-blue)]"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[var(--color-dark-ink-blue)]" />
            </button>
            <iframe
              src={buildViewUrl(viewerDocId)}
              title="Document Viewer"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* --------- Upload/Replace Modal (external component) --------- */}
      <DocumentUploadReplaceModal
        isOpen={replaceOpen}
        onClose={() => setReplaceOpen(false)}
        documentId={selectedDocId ?? ""} // when uploading new, this can be ignored by your modal
        mode={replaceMode} // "upload" | "replace"
        availableFamilyMembers={mockFamily as any}
        availableFolders={mockFolders as any}
        onUploadComplete={onUploadComplete}
        onDocumentUpdated={() => {
          /* optional refresh hook */
        }}
      />

      {/* --------- Edit Folder Modal (your component) --------- */}
      <EditFolderModal
        isOpen={editFolderOpen}
        folderId={folder?.id ?? null}
        initialName={folder?.name}
        initialShares={initialSharesForModal}
        onClose={() => setEditFolderOpen(false)}
        onSave={(payload: EditFolderPayload) => {
          // Update local state with new name & shares
          setFolder((prev) =>
            prev
              ? {
                  ...prev,
                  name: payload.name,
                  sharedWith: payload.shares.map((s) => ({
                    id: s.id ?? Math.random().toString(36).slice(2),
                    name: s.nameOrEmail,
                    role: s.permission,
                  })),
                }
              : prev
          );
          setEditFolderOpen(false);

          // ---- API (commented) ----
          // fetch(`/api/folders/${encodeURIComponent(payload.id ?? "")}`, {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(payload),
          // }).catch(console.error);
        }}
      />
    </section>
  );
}
