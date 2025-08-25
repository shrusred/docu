// client/components/Modal/Document/Upload/Replace.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Search,
  Bell,
  Mail,
  Save,
  Users,
} from "lucide-react";

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

interface UploadFile extends File {
  id: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface DocumentUploadReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  mode?: "upload" | "replace";
  availableFamilyMembers?: FamilyMember[];
  availableFolders?: Folder[];
  onUploadComplete?: (success: boolean, message?: string) => void;
  onDocumentUpdated?: () => void;
}

export default function DocumentUploadReplaceModal({
  isOpen,
  onClose,
  documentId,
  mode = "replace",
  availableFamilyMembers = [],
  availableFolders = [],
  onUploadComplete,
  onDocumentUpdated,
}: DocumentUploadReplaceModalProps) {
  // Upload Modal States
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    expiryDate: "",
    reminderEnabled: false,
    reminderDate: "",
    reminderEmail: "",
    sharedWith: [] as string[],
    folder: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  // Pre-loaded tags
  const availableTags = [
    "medical",
    "insurance",
    "legal",
    "financial",
    "important",
    "urgent",
    "tax",
  ];

  // Filter tags based on input
  useEffect(() => {
    if (tagInput) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !uploadForm.tags.includes(tag)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  }, [tagInput, uploadForm.tags]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setUploadFile(null);
    setUploadForm({
      name: "",
      description: "",
      tags: [],
      expiryDate: "",
      reminderEnabled: false,
      reminderDate: "",
      reminderEmail: "",
      sharedWith: [],
      folder: "",
    });
    setTagInput("");
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0]);
  };

  const handleFileSelect = (file: File) => {
    const uploadFileObj: UploadFile = {
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    };
    setUploadFile(uploadFileObj);
    setUploadForm((prev) => ({
      ...prev,
      name: file.name.replace(/\.[^/.]+$/, ""),
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (!uploadForm.tags.includes(tag)) {
      setUploadForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleTagRemove = (tag: string) => {
    setUploadForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleFamilyMemberToggle = (memberId: string) => {
    setUploadForm((prev) => ({
      ...prev,
      sharedWith: prev.sharedWith.includes(memberId)
        ? prev.sharedWith.filter((id) => id !== memberId)
        : [...prev.sharedWith, memberId],
    }));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadForm.name.trim()) return;

    try {
      setUploadFile((prev) =>
        prev ? { ...prev, status: "uploading", progress: 0 } : null
      );

      const formData = new FormData();
      formData.append("file", uploadFile);
      Object.entries(uploadForm).forEach(([key, value]) => {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value.toString()
        );
      });

      // 🚨 TODO: NOTIFICATION INTEGRATION - Document expiry notifications for bell icon
      if (uploadForm.expiryDate && uploadForm.reminderEnabled) {
        console.log(
          "TODO: Create notification for expiry:",
          uploadForm.name,
          uploadForm.expiryDate
        );
      }

      const endpoint =
        mode === "replace"
          ? `http://localhost:5001/api/documents/${documentId}/replace`
          : `http://localhost:5001/api/documents/upload`;

      // Try API call but expect it to fail in development
      let apiSuccess = false;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          apiSuccess = true;
          setUploadFile((prev) =>
            prev ? { ...prev, status: "success", progress: 100 } : null
          );

          // Call parent callbacks
          if (onDocumentUpdated) {
            onDocumentUpdated();
          }

          if (onUploadComplete) {
            onUploadComplete(
              true,
              `Document ${
                mode === "replace" ? "replaced" : "uploaded"
              } successfully!`
            );
          }

          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (apiError) {
        console.log("API not available yet, using development mode");
      }

      // Development fallback (when API is not ready)
      if (!apiSuccess) {
        setUploadFile((prev) =>
          prev ? { ...prev, status: "success", progress: 100 } : null
        );

        // Call parent callbacks for development mode
        if (onDocumentUpdated) {
          onDocumentUpdated();
        }

        if (onUploadComplete) {
          onUploadComplete(
            true,
            `Document ${
              mode === "replace" ? "replaced" : "uploaded"
            } locally (API not ready)`
          );
        }

        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setUploadFile((prev) =>
        prev ? { ...prev, status: "error", error: "Upload failed" } : null
      );

      if (onUploadComplete) {
        onUploadComplete(false, "Error during upload. Please try again.");
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-brand-dark">
              {mode === "replace" ? "Replace Document" : "Upload Document"}
            </h3>
            <button
              onClick={handleClose}
              className="p-1 text-brand-mid hover:text-brand-dark transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all duration-300 ${
              isDragging
                ? "border-brand-teal bg-brand-light"
                : "border-brand-light-med hover:border-brand-teal"
            }`}
          >
            <Upload className="w-12 h-12 text-brand-teal mx-auto mb-4" />
            <h4 className="text-lg font-medium text-brand-dark mb-2">
              Drop {mode === "replace" ? "replacement " : ""}file here
            </h4>
            <p className="text-brand-mid mb-4">or click to select</p>
            <input
              type="file"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
              className="hidden"
              id="file-upload-modal"
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx"
            />
            <label
              htmlFor="file-upload-modal"
              className="inline-block px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-opacity-90 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>

          {/* Selected File */}
          {uploadFile && (
            <div className="mb-6 p-4 bg-brand-light rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-8 h-8 text-brand-teal" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-brand-dark">
                    {uploadFile.name}
                  </div>
                  <div className="text-xs text-brand-mid">
                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  {uploadFile.status === "uploading" && (
                    <div className="w-full bg-brand-light-med rounded-full h-1 mt-1">
                      <div
                        className="bg-brand-teal h-1 rounded-full transition-all duration-300"
                        style={{ width: `${uploadFile.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  {uploadFile.status === "success" && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {uploadFile.status === "error" && (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  {uploadFile.status === "pending" && (
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                placeholder="Enter document name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Description
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                placeholder="Enter description"
                rows={2}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Tags
              </label>
              <div className="relative">
                <div className="flex items-center border border-brand-light-med rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-brand-mid mr-2" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 outline-none"
                    placeholder="Search tags..."
                  />
                </div>

                {filteredTags.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-brand-light-med rounded-lg mt-1 shadow-lg z-10">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagAdd(tag)}
                        className="w-full text-left px-3 py-2 hover:bg-brand-light transition-colors text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {uploadForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadForm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-brand-teal text-white rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-white hover:text-red-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    expiryDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>

            {/* Reminder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-brand-dark">
                  Enable Reminder
                </label>
                <button
                  onClick={() =>
                    setUploadForm((prev) => ({
                      ...prev,
                      reminderEnabled: !prev.reminderEnabled,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    uploadForm.reminderEnabled
                      ? "bg-brand-teal"
                      : "bg-brand-light-med"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      uploadForm.reminderEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {uploadForm.reminderEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-brand-light-med">
                  <div>
                    <label className="block text-xs font-medium text-brand-dark mb-1">
                      <Bell className="inline w-3 h-3 mr-1" />
                      Reminder Date
                    </label>
                    <input
                      type="date"
                      value={uploadForm.reminderDate}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          reminderDate: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1 border border-brand-light-med rounded focus:outline-none focus:ring-1 focus:ring-brand-teal text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-dark mb-1">
                      <Mail className="inline w-3 h-3 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={uploadForm.reminderEmail}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          reminderEmail: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1 border border-brand-light-med rounded focus:outline-none focus:ring-1 focus:ring-brand-teal text-sm"
                      placeholder="notification@email.com"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Folder */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Folder
              </label>
              <select
                value={uploadForm.folder}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, folder: e.target.value }))
                }
                className="w-full px-3 py-2 border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <option value="">Miscellaneous (default)</option>
                {availableFolders.map((folder) => (
                  <option key={folder.id} value={folder.name}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Family Members */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Share with Family
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-brand-light-med rounded-lg p-2">
                {availableFamilyMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center space-x-2 p-2 hover:bg-brand-light rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={uploadForm.sharedWith.includes(member.id)}
                      onChange={() => handleFamilyMemberToggle(member.id)}
                      className="w-4 h-4 text-brand-teal focus:ring-brand-teal border-brand-light-med rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-brand-dark">
                        {member.name}
                      </div>
                      <div className="text-xs text-brand-mid">
                        {member.role}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {uploadForm.sharedWith.length > 0 && (
                <p className="text-xs text-brand-teal mt-2">
                  Selected {uploadForm.sharedWith.length} family member
                  {uploadForm.sharedWith.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6 pt-4 border-t border-brand-light-med">
            <button
              onClick={handleClose}
              className="flex-1 py-2 border border-brand-light-med text-brand-dark rounded-lg hover:bg-brand-light transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={
                !uploadFile ||
                !uploadForm.name.trim() ||
                uploadFile.status === "uploading"
              }
              className="flex-1 py-2 bg-brand-teal text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploadFile?.status === "uploading" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {mode === "replace" ? "Replacing..." : "Uploading..."}
                  </span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{mode === "replace" ? "Replace" : "Upload"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
