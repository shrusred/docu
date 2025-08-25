"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Filter, Eye, Edit, Download, FileText } from "lucide-react";

interface Document {
  id?: string;
  _id?: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  tags?: string[];
  description?: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  // Fetch documents from backend on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      // TODO: Implement backend search endpoint for better performance
      // For now, filtering on frontend
      const filtered = documents.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      // 🚨 TEMPORARY: BYPASSING AUTHENTICATION FOR DEVELOPMENT
      // TODO: REMOVE THIS BYPASS AND RESTORE AUTHENTICATION IN PRODUCTION
      const bypassAuth = true; // Set to false to re-enable auth

      if (!bypassAuth) {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No auth token found - user may not be logged in");
          // TODO: Redirect to login page or show login prompt
          // router.push('/login');
          setLoading(false);
          return;
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Only add auth header if not bypassing
      if (!bypassAuth) {
        const token = localStorage.getItem("token");
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5001/api/documents/list", {
        headers,
      });

      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs);
        setFilteredDocuments(docs);
      } else if (response.status === 401 && !bypassAuth) {
        console.error("Token expired or invalid");
        // TODO: Clear token and redirect to login
        // localStorage.removeItem('token');
        // router.push('/login');
      } else {
        console.error("Failed to fetch documents:", response.statusText);
        // TODO: Add proper error handling with toast notifications
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // TODO: Add proper error handling with toast notifications
    } finally {
      setLoading(false);
    }
  };

  // Get document URL for viewing/downloading
  const getDocumentUrl = (doc: Document) => {
    // 🚨 TEMPORARY: BYPASSING AUTHENTICATION FOR DEVELOPMENT
    // TODO: REMOVE THIS BYPASS AND RESTORE AUTHENTICATION IN PRODUCTION
    const bypassAuth = true; // Set to false to re-enable auth
    const docId = doc.id || doc._id;

    if (bypassAuth) {
      return `http://localhost:5001/api/documents/view/${docId}`;
    } else {
      const token = localStorage.getItem("token");
      return `http://localhost:5001/api/documents/view/${docId}?token=${token}`;
    }
  };

  const handleViewDocument = (doc: Document) => {
    // Set selected document and show PDF viewer modal
    setSelectedDocument(doc);
    setShowPDFViewer(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    const url = getDocumentUrl(doc);

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditDocument = (docId: string) => {
    // Navigate to individual document detail page
    router.push(`/dashboard/main/documents/${docId}`);
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // 🚨 TEMPORARY: BYPASSING AUTHENTICATION FOR DEVELOPMENT
      // TODO: REMOVE THIS BYPASS AND RESTORE AUTHENTICATION IN PRODUCTION
      const bypassAuth = true; // Set to false to re-enable auth

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Only add auth header if not bypassing
      if (!bypassAuth) {
        const token = localStorage.getItem("token");
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:5001/api/documents/${docId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (response.ok) {
        await fetchDocuments(); // Refresh the list
        // TODO: Add success toast notification
      } else {
        console.error("Delete failed:", response.statusText);
        // TODO: Add error toast notification
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      // TODO: Add error toast notification
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-1 p-[3vw] bg-brand-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-[8vw] w-[8vw] max-h-12 max-w-12 border-b-2 border-brand-teal mx-auto mb-[2vh]"></div>
          <p className="text-brand-mid text-[clamp(0.875rem,2vw,1rem)]">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-[3vw] bg-brand-light min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-[4vh]">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-brand-dark">
          Documents
        </h1>

        {/* TODO: Add upload button that navigates to upload component */}
        <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-brand-mid">
          Upload handled in separate component
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-[2vw] mb-[4vh]">
        <div className="relative flex-1 max-w-[40vw]">
          <Search className="absolute left-[1vw] top-1/2 transform -translate-y-1/2 text-brand-mid w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[3vw] pr-[3vw] py-[1.5vh] border border-brand-light-med rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-[clamp(0.875rem,2vw,1rem)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-[1vw] top-1/2 transform -translate-y-1/2 text-brand-mid hover:text-brand-dark transition-colors"
            >
              <X className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]" />
            </button>
          )}
        </div>

        {/* Document Count */}
        <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-brand-mid whitespace-nowrap">
          {filteredDocuments.length} document
          {filteredDocuments.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2vw] mb-[4vh]">
        {filteredDocuments.map((doc) => {
          console.log("Document object:", doc);
          const docId = doc.id || doc._id || `doc-${Math.random()}`;

          return (
            <div
              key={docId}
              className="bg-white border border-brand-light-med rounded-lg p-[1.5vw] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-brand-teal"
            >
              {/* PDF Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-brand-light to-brand-light-med rounded-lg mb-[2vh] flex flex-col items-center justify-center relative overflow-hidden">
                <FileText className="w-[clamp(3rem,8vw,4rem)] h-[clamp(3rem,8vw,4rem)] text-brand-teal mb-[1vh]" />
                <div className="absolute bottom-[1vh] left-[1vh] right-[1vh]">
                  <div className="bg-red-500 text-white text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold px-[1vw] py-[0.5vh] rounded">
                    PDF
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="space-y-[1vh] mb-[2vh]">
                <h3
                  className="font-medium text-brand-dark truncate text-[clamp(0.875rem,2vw,1rem)] leading-tight"
                  title={doc.filename}
                >
                  {doc.filename}
                </h3>
                <div className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-brand-mid space-y-[0.5vh]">
                  <div>Size: {formatFileSize(doc.fileSize)}</div>
                  <div>Uploaded: {formatDate(doc.uploadDate)}</div>
                </div>

                {/* Tags display */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-[0.5vw]">
                    {doc.tags.map((tag, tagIndex) => (
                      <span
                        key={`${docId}-tag-${tagIndex}`}
                        className="px-[1vw] py-[0.5vh] bg-brand-light text-brand-dark text-[clamp(0.625rem,1.5vw,0.75rem)] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewDocument(doc)}
                  className="p-[1vh] text-brand-mid hover:text-brand-teal hover:bg-brand-light rounded-lg transition-all duration-200 hover:scale-110"
                  title="View Document"
                >
                  <Eye className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]" />
                </button>
                <button
                  onClick={() => handleEditDocument(docId)}
                  className="p-[1vh] text-brand-mid hover:text-brand-blue hover:bg-brand-light rounded-lg transition-all duration-200 hover:scale-110"
                  title="Edit Document Details"
                >
                  <Edit className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]" />
                </button>
                <button
                  onClick={() => handleDownloadDocument(doc)}
                  className="p-[1vh] text-brand-mid hover:text-brand-dark hover:bg-brand-light rounded-lg transition-all duration-200 hover:scale-110"
                  title="Download Document"
                >
                  <Download className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && !loading && (
        <div className="text-center py-[8vh]">
          <div className="w-[clamp(4rem,12vw,6rem)] h-[clamp(4rem,12vw,6rem)] bg-brand-light rounded-full flex items-center justify-center mx-auto mb-[2vh]">
            {searchQuery ? (
              <Search className="w-[clamp(2rem,6vw,3rem)] h-[clamp(2rem,6vw,3rem)] text-brand-mid" />
            ) : (
              <FileText className="w-[clamp(2rem,6vw,3rem)] h-[clamp(2rem,6vw,3rem)] text-brand-mid" />
            )}
          </div>
          <h3 className="text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-brand-dark mb-[1vh]">
            {searchQuery ? "No documents found" : "No documents uploaded yet"}
          </h3>
          <p className="text-brand-mid text-[clamp(0.875rem,2vw,1rem)]">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Upload your first document to get started"}
          </p>
          {/* 🚨 DEVELOPMENT MODE: Authentication bypassed */}
          <p className="text-red-500 text-[clamp(0.625rem,1.5vw,0.75rem)] mt-[1vh] font-mono">
            DEV MODE: Auth bypass enabled
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showPDFViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-[2vw]">
          <div className="bg-white rounded-lg w-full max-w-[90vw] h-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-[2vh] border-b border-brand-light-med bg-brand-light rounded-t-lg">
              <div className="flex items-center space-x-[1vw]">
                <FileText className="w-[clamp(1.25rem,3vw,1.5rem)] h-[clamp(1.25rem,3vw,1.5rem)] text-brand-teal" />
                <div>
                  <h2 className="text-[clamp(1rem,2.5vw,1.25rem)] font-semibold text-brand-dark truncate max-w-[40vw]">
                    {selectedDocument.filename}
                  </h2>
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-brand-mid">
                    {formatFileSize(selectedDocument.fileSize)} •{" "}
                    {formatDate(selectedDocument.uploadDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-[1vw]">
                {/* Download Button */}
                <button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="flex items-center space-x-[0.5vw] px-[1.5vw] py-[1vh] bg-brand-teal text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  title="Download Document"
                >
                  <Download className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]" />
                  <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] hidden sm:inline">
                    Download
                  </span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowPDFViewer(false)}
                  className="p-[1vh] text-brand-mid hover:text-brand-dark hover:bg-white rounded-lg transition-all duration-200 hover:scale-110"
                  title="Close Viewer"
                >
                  <X className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" />
                </button>
              </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 bg-gray-100 relative overflow-hidden">
              {/* Document Iframe Viewer */}
              <iframe
                src={getDocumentUrl(selectedDocument)}
                className="w-full h-full border-none"
                title={`Document viewer: ${selectedDocument.filename}`}
                style={{ minHeight: "60vh" }}
                onError={() => {
                  console.error("Failed to load document in iframe");
                }}
              />

              {/* Fallback for non-viewable files */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 hidden"
                id="fallback-viewer"
              >
                <div className="text-center p-[4vw]">
                  <FileText className="w-[clamp(4rem,12vw,6rem)] h-[clamp(4rem,12vw,6rem)] text-brand-teal mx-auto mb-[2vh]" />
                  <h3 className="text-[clamp(1rem,2.5vw,1.25rem)] font-medium text-brand-dark mb-[1vh]">
                    Document Preview
                  </h3>
                  <p className="text-brand-mid text-[clamp(0.875rem,2vw,1rem)] mb-[2vh]">
                    {selectedDocument.filename}
                  </p>
                  <p className="text-brand-mid text-[clamp(0.75rem,1.5vw,0.875rem)] mb-[3vh]">
                    This document type may not support inline preview.
                    <br />
                    Use the download button to view the full document.
                  </p>
                  <button
                    onClick={() => handleDownloadDocument(selectedDocument)}
                    className="flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] bg-brand-teal text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 mx-auto"
                  >
                    <Download className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]" />
                    <span className="text-[clamp(0.875rem,1.8vw,1rem)]">
                      Download Document
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-[2vh] border-t border-brand-light-med bg-gray-50 rounded-b-lg">
              <div className="flex items-center space-x-[2vw]">
                {/* Document Tags */}
                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <div className="flex flex-wrap gap-[0.5vw]">
                    {selectedDocument.tags.map((tag, tagIndex) => (
                      <span
                        key={`modal-tag-${tagIndex}`}
                        className="px-[1vw] py-[0.5vh] bg-brand-light text-brand-dark text-[clamp(0.625rem,1.5vw,0.75rem)] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Document Description */}
                {selectedDocument.description && (
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-brand-mid max-w-[40vw] truncate">
                    {selectedDocument.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-[1vw]">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    const docId =
                      selectedDocument.id || selectedDocument._id || "";
                    handleEditDocument(docId);
                  }}
                  className="flex items-center space-x-[0.5vw] px-[1.5vw] py-[1vh] border border-brand-light-med text-brand-dark rounded-lg hover:bg-brand-light transition-all duration-200"
                  title="Edit Document Details"
                >
                  <Edit className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]" />
                  <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] hidden sm:inline">
                    Edit
                  </span>
                </button>

                {/* View in New Tab */}
                <button
                  onClick={() =>
                    window.open(getDocumentUrl(selectedDocument), "_blank")
                  }
                  className="flex items-center space-x-[0.5vw] px-[1.5vw] py-[1vh] border border-brand-light-med text-brand-dark rounded-lg hover:bg-brand-light transition-all duration-200"
                  title="Open in New Tab"
                >
                  <Eye className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]" />
                  <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] hidden sm:inline">
                    New Tab
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
