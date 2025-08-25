// client/components/Documents/DetailView.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Calendar,
  Edit3,
  Plus,
  X,
  Upload,
} from "lucide-react";
import DocumentUploadReplaceModal from "@/components/Modal.Document.Upload.Replace";

// ===== Types =====
interface Document {
  id?: string;
  _id?: string;
  filename: string;
  originalName?: string;
  fileSize?: number;
  uploadDate: string;
  tags?: string[];
  description?: string;
  mimeType?: string;
  title?: string;
  expiryDate?: string;
  sharedWith?: Array<{
    id: string;
    name: string;
    role: string;
    access: "view" | "edit";
  }>;
  folder?: string;
  lastUpdated?: string;
  reminderEnabled?: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface DocumentDetailViewProps {
  documentId: string;
  onBackToDocuments?: () => void;
  onDocumentUpdated?: (document: Document) => void;
}

// ===== Component =====
export default function DocumentDetailView({
  documentId,
  onBackToDocuments,
  onDocumentUpdated,
}: DocumentDetailViewProps) {
  const router = useRouter();

  // UI state
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showReplaceModal, setShowReplaceModal] = useState<boolean>(false);

  // Data state
  const [availableFamilyMembers, setAvailableFamilyMembers] = useState<
    FamilyMember[]
  >([]);
  const [availableFolders, setAvailableFolders] = useState<Folder[]>([]);

  const [editForm, setEditForm] = useState({
    title: "",
    filename: "",
    description: "",
    tags: "",
    expiryDate: "",
    folder: "",
    sharedWith: "",
  });

  // ------- Mock fallbacks (remove when API is ready) -------
  const mockFamilyMembers: FamilyMember[] = [
    { id: "1", name: "John Smith", role: "Spouse", email: "john@example.com" },
    {
      id: "2",
      name: "Sarah Smith",
      role: "Daughter",
      email: "sarah@example.com",
    },
    {
      id: "3",
      name: "Dr. Johnson",
      role: "Family Doctor",
      email: "dr.johnson@clinic.com",
    },
  ];

  const mockFolders: Folder[] = [
    { id: "1", name: "Medical Records", color: "red" },
    { id: "2", name: "Insurance Documents", color: "blue" },
    { id: "3", name: "Legal Papers", color: "green" },
    { id: "4", name: "Personal Documents", color: "purple" },
    { id: "5", name: "Miscellaneous", color: "gray" },
  ];

  useEffect(() => {
    if (documentId) {
      fetchDocumentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // ------- Data fetching -------
  const fetchDocumentData = async () => {
    try {
      setLoading(true);
      const bypassAuth = true; // flip when auth is ready
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!bypassAuth) {
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const [docResponse, foldersResponse, familyResponse] = await Promise.all([
        fetch(`http://localhost:5001/api/documents/${documentId}`, { headers }),
        fetch("http://localhost:5001/api/folders/list", { headers }),
        fetch("http://localhost:5001/api/family/members", { headers }),
      ]);

      // Document
      if (docResponse.ok) {
        const docData: Document = await docResponse.json();
        applyDocumentToState(docData);
      } else {
        await fetchMockDocument();
      }

      // Folders / Family
      setAvailableFolders(
        foldersResponse.ok ? await foldersResponse.json() : mockFolders
      );
      setAvailableFamilyMembers(
        familyResponse.ok ? await familyResponse.json() : mockFamilyMembers
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      await fetchMockDocument();
      setAvailableFolders(mockFolders);
      setAvailableFamilyMembers(mockFamilyMembers);
    } finally {
      setLoading(false);
    }
  };

  const applyDocumentToState = (doc: Document) => {
    setDocument(doc);
    setEditForm({
      title: doc.title || "",
      filename: doc.filename || "",
      description: doc.description || "",
      tags: doc.tags?.join(", ") || "",
      expiryDate: doc.expiryDate || "",
      folder: doc.folder || "",
      sharedWith: doc.sharedWith?.map((s) => s.name).join(", ") || "",
    });
    setReminderEnabled(Boolean(doc.reminderEnabled));
  };

  const fetchMockDocument = async () => {
    const mockDocument: Document = {
      id: documentId,
      title: "Lab Report 1",
      filename: "Labreport1.pdf",
      originalName: "labreport1.pdf",
      fileSize: 2_048_000,
      uploadDate: new Date().toISOString(),
      lastUpdated: "7-30-25 11:00AM EST",
      tags: ["medical", "important"],
      description:
        "Annual lab report containing blood work results and analysis.",
      mimeType: "application/pdf",
      expiryDate: "2025-12-31",
      folder: "Medical Records",
      sharedWith: [
        { id: "1", name: "Family member 1", role: "Spouse", access: "view" },
      ],
      reminderEnabled: false,
    };
    applyDocumentToState(mockDocument);
  };

  // ------- Actions -------
  const handleSave = async () => {
    if (!document) return;
    try {
      setLoading(true);
      const updateData: Partial<Document> = {
        title: editForm.title,
        filename: editForm.filename,
        description: editForm.description,
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        expiryDate: editForm.expiryDate,
        folder: editForm.folder,
        reminderEnabled,
      };

      const res = await fetch(
        `http://localhost:5001/api/documents/${documentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (res.ok) {
        const updated: Document = await res.json();
        applyDocumentToState(updated);
        setEditing(false);
        onDocumentUpdated?.(updated);
        alert("Document updated successfully!");
      } else {
        const updatedLocal = { ...document, ...updateData } as Document;
        applyDocumentToState(updatedLocal);
        setEditing(false);
        onDocumentUpdated?.(updatedLocal);
        alert("Document updated locally (API not ready)");
      }
    } catch (err) {
      console.error(err);
      setEditing(false);
      alert("Document updated locally");
    } finally {
      setLoading(false);
    }
  };

  const handleShareMember = async (
    memberId: string,
    access: "view" | "edit"
  ) => {
    const member = availableFamilyMembers.find((m) => m.id === memberId);
    if (!member || !document) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/documents/${documentId}/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: memberId, access }),
        }
      );

      if (res.ok) {
        const updated: Document = await res.json();
        applyDocumentToState(updated);
        onDocumentUpdated?.(updated);
      } else {
        // Fallback local update
        const newShared = [...(document.sharedWith || [])];
        const idx = newShared.findIndex((s) => s.id === memberId);
        if (idx >= 0) newShared[idx].access = access;
        else
          newShared.push({
            id: member.id,
            name: member.name,
            role: member.role,
            access,
          });
        const updatedLocal = { ...document, sharedWith: newShared } as Document;
        applyDocumentToState(updatedLocal);
        onDocumentUpdated?.(updatedLocal);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveShare = async (memberId: string) => {
    if (!document) return;
    try {
      const res = await fetch(
        `http://localhost:5001/api/documents/${documentId}/unshare`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: memberId }),
        }
      );

      if (res.ok) {
        const updated: Document = await res.json();
        applyDocumentToState(updated);
        onDocumentUpdated?.(updated);
      } else {
        const newShared =
          document.sharedWith?.filter((s) => s.id !== memberId) || [];
        const updatedLocal = { ...document, sharedWith: newShared } as Document;
        applyDocumentToState(updatedLocal);
        onDocumentUpdated?.(updatedLocal);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadComplete = (success: boolean, message?: string) => {
    if (success) {
      fetchDocumentData();
      // Force iframe refresh to show updated document
      const iframe = window.document.querySelector(
        "iframe"
      ) as HTMLIFrameElement | null;
      if (iframe) iframe.src = `${iframe.src}?t=${Date.now()}`;
    }
    if (message) alert(message);
  };

  const handleBackClick = () => {
    if (onBackToDocuments) onBackToDocuments();
    else router.push("/dashboard/main/documents");
  };

  // ------- Render -------
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal mx-auto mb-4" />
          <p className="text-brand-mid text-lg font-medium">
            Loading document...
          </p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
        <div className="text-center">
          <FileText className="w-24 h-24 text-brand-mid mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-dark mb-4">
            Document Not Found
          </h2>
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Documents</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <div className="bg-white border-b border-brand-light-med">
        <div className="px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-brand-mid">
            <button
              onClick={() => router.push("/dashboard/main")}
              className="hover:text-brand-teal transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={handleBackClick}
              className="hover:text-brand-teal transition-colors"
            >
              Folders
            </button>
            <span>/</span>
            <span className="text-brand-dark font-medium">
              {document.folder || "Folder"}
            </span>
            <span>/</span>
            <span className="text-brand-dark font-medium">
              {document.filename}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-brand-light-med p-6">
              <div className="aspect-[3/4] bg-white rounded-lg relative overflow-hidden border border-brand-light-med mb-4 max-h-[70vh]">
                <iframe
                  src={`http://localhost:5001/api/documents/view/${documentId}`}
                  className="w-full h-full border-none"
                  title={`Document: ${document.filename}`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const url = `http://localhost:5001/api/documents/view/${documentId}`;
                    const a = window.document.createElement("a");
                    a.href = url;
                    a.download = document.filename || "document";
                    window.document.body.appendChild(a);
                    a.click();
                    window.document.body.removeChild(a);
                  }}
                  className="flex items-center justify-center w-12 h-12 bg-brand-light border border-brand-light-med rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:5001/api/documents/view/${documentId}`,
                      "_blank"
                    )
                  }
                  className="flex items-center justify-center w-12 h-12 bg-brand-light border border-brand-light-med rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowReplaceModal(true)}
                  className="flex items-center justify-center w-12 h-12 bg-brand-light border border-brand-light-med rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
                  title="Replace File"
                >
                  <Upload className="w-5 h-5" />
                </button>

                <div className="flex-1" />
                <div className="text-sm text-brand-mid">
                  Last updated: {document.lastUpdated}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Title */}
            <div className="bg-white rounded-xl border border-brand-light-med p-4">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-lg font-bold text-brand-dark">Title</h1>
                <button
                  onClick={() => setEditing((s) => !s)}
                  className="p-2 text-brand-mid hover:text-brand-teal hover:bg-brand-light rounded-lg transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {editing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm"
                  placeholder="Enter document title"
                />
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full text-left hover:bg-brand-light p-2 rounded-lg transition-colors"
                >
                  <h2 className="text-base font-medium text-brand-dark">
                    {document.title || document.filename}
                  </h2>
                </button>
              )}
            </div>

            {/* Expiry & Reminder */}
            <div className="bg-white rounded-xl border border-brand-light-med p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Expiry date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={editForm.expiryDate}
                      onChange={(e) =>
                        setEditForm({ ...editForm, expiryDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm"
                    />
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 hover:bg-brand-light p-2 rounded-lg transition-colors w-full"
                    >
                      <Calendar className="w-5 h-5 text-brand-teal" />
                      <span className="text-sm text-brand-dark">
                        {document.expiryDate
                          ? new Date(document.expiryDate).toLocaleDateString()
                          : "Set expiry date"}
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-dark">
                    Reminder
                  </span>
                  <button
                    onClick={() => setReminderEnabled((s) => !s)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      reminderEnabled ? "bg-brand-teal" : "bg-brand-light-med"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        reminderEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Share with */}
            <div className="bg-white rounded-xl border border-brand-light-med p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-brand-dark">
                  Share with
                </h3>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-1 text-brand-teal hover:bg-brand-light rounded-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="w-full px-3 py-2 border border-brand-light-med rounded-lg text-sm text-brand-mid hover:border-brand-teal hover:bg-brand-light transition-colors text-left"
              >
                Click to add family members
              </button>

              {document.sharedWith && document.sharedWith.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h4 className="text-xs font-medium text-brand-dark">
                    Shared with
                  </h4>
                  {document.sharedWith.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between py-2 px-2 bg-brand-light rounded-lg"
                    >
                      <div>
                        <span className="text-sm text-brand-dark">
                          {person.name}
                        </span>
                        <span className="text-xs text-brand-mid ml-2">
                          {person.access === "view"
                            ? "view access"
                            : "edit access"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveShare(person.id)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save */}
            {editing && (
              <button
                onClick={handleSave}
                className="w-full py-3 bg-brand-teal text-white rounded-xl font-medium text-sm hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-brand-dark">
                  Share with Family
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 text-brand-mid hover:text-brand-dark rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {availableFamilyMembers.map((member) => {
                  const isShared = document?.sharedWith?.some(
                    (s) => s.id === member.id
                  );
                  const sharedAccess =
                    document?.sharedWith?.find((s) => s.id === member.id)
                      ?.access || "view";
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-brand-light-med rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-brand-dark">
                          {member.name}
                        </div>
                        <div className="text-xs text-brand-mid">
                          {member.role} • {member.email}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isShared ? (
                          <>
                            <select
                              value={sharedAccess}
                              onChange={(e) =>
                                handleShareMember(
                                  member.id,
                                  e.target.value as "view" | "edit"
                                )
                              }
                              className="text-xs border border-brand-light-med rounded px-2 py-1"
                            >
                              <option value="view">View</option>
                              <option value="edit">Edit</option>
                            </select>
                            <button
                              onClick={() => handleRemoveShare(member.id)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex space-x-1">
                            <button
                              onClick={() =>
                                handleShareMember(member.id, "view")
                              }
                              className="px-3 py-1 bg-brand-light text-brand-dark rounded hover:bg-brand-teal hover:text-white transition-colors text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleShareMember(member.id, "edit")
                              }
                              className="px-3 py-1 bg-brand-teal text-white rounded hover:bg-opacity-90 transition-colors text-xs"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-brand-light-med">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      <DocumentUploadReplaceModal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        documentId={documentId}
        mode="replace"
        availableFamilyMembers={availableFamilyMembers}
        availableFolders={availableFolders}
        onUploadComplete={handleUploadComplete}
        onDocumentUpdated={fetchDocumentData}
      />
    </div>
  );
}
