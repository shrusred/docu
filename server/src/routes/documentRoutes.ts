// server/routes/documentRoutes.ts
import express, { Request, Response } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { getGridFSBucket } from "../config/gridfs";
import Document from "../models/Document";

const router = express.Router();

// 🚨 DEVELOPMENT SETTING - CHANGE TO false FOR PRODUCTION
const BYPASS_AUTH = true; // TODO: Set to false when deploying to production

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept PDFs, Excel files, and images
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper function to get user ID based on auth mode
const getUserId = (req: Request): string | null => {
  if (BYPASS_AUTH) {
    // Development mode - use dummy user ID
    return "507f1f77bcf86cd799439011";
  } else {
    // Production mode - get from authenticated user
    return (req as any).user?.id || null;
  }
};

// Helper function to check document ownership
const findUserDocument = async (documentId: string, req: Request) => {
  if (BYPASS_AUTH) {
    // Development mode - find any document by ID
    return await Document.findById(documentId);
  } else {
    // Production mode - verify user ownership
    const userId = getUserId(req);
    if (!userId) return null;

    return await Document.findOne({
      _id: documentId,
      userId: userId,
    });
  }
};

// Upload Document
router.post(
  "/upload",
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = getUserId(req);

      if (!BYPASS_AUTH && !userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const bucket = getGridFSBucket();

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: {
          userId: new mongoose.Types.ObjectId(userId!),
          uploadDate: new Date(),
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });

      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", async () => {
        try {
          const document = new Document({
            userId: new mongoose.Types.ObjectId(userId!),
            filename: req.file!.originalname,
            originalName: req.file!.originalname,
            fileId: uploadStream.id,
            mimeType: req.file!.mimetype,
            fileSize: req.file!.size,
          });

          await document.save();

          res.json({
            message: "File uploaded successfully",
            document: {
              id: document._id,
              filename: document.filename,
              fileSize: document.fileSize,
              uploadDate: document.uploadDate,
            },
          });
        } catch (saveError) {
          console.error("Error saving document metadata:", saveError);
          res.status(500).json({ error: "Failed to save document metadata" });
        }
      });

      uploadStream.on("error", (error: Error) => {
        console.error("GridFS upload error:", error);
        res.status(500).json({ error: "Upload failed" });
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Get list of documents
router.get("/list", async (req: Request, res: Response) => {
  try {
    let documents;

    if (BYPASS_AUTH) {
      // Development mode - return all documents
      documents = await Document.find({})
        .sort({ uploadDate: -1 })
        .select("filename originalName fileSize uploadDate tags description");
    } else {
      // Production mode - return only user's documents
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      documents = await Document.find({ userId })
        .sort({ uploadDate: -1 })
        .select("filename originalName fileSize uploadDate tags description");
    }

    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// View/Download Document
router.get("/view/:documentId", async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    console.log(
      `📁 ${BYPASS_AUTH ? "[DEV]" : "[PROD]"} Viewing document:`,
      documentId
    );

    if (!BYPASS_AUTH) {
      // Production mode - verify authentication
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    const document = await findUserDocument(documentId, req);

    if (!document) {
      console.log("❌ Document not found in database");
      return res.status(404).json({ error: "Document not found" });
    }

    console.log("📄 Document found:", document.filename);
    console.log("🔗 GridFS fileId:", document.fileId);
    console.log("📋 MIME type:", document.mimeType);

    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(document.fileId);

    // Set appropriate headers based on actual file type
    res.set({
      "Content-Type": document.mimeType || "application/octet-stream",
      "Content-Disposition": "inline", // Shows in browser instead of downloading
      "Cache-Control": "no-cache",
    });

    downloadStream.pipe(res);

    downloadStream.on("error", (error: Error) => {
      console.error("❌ GridFS streaming error:", error);
      res.status(404).json({ error: "File not found in GridFS storage" });
    });

    downloadStream.on("end", () => {
      console.log("✅ File streamed successfully:", document.filename);
    });
  } catch (error) {
    console.error("❌ Error in view route:", error);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
});

// Update document metadata
router.put("/:documentId", async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { filename, description, tags } = req.body;

    if (!BYPASS_AUTH) {
      // Production mode - verify authentication
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    const document = await findUserDocument(documentId, req);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Update document metadata
    if (filename) document.filename = filename;
    if (description !== undefined) document.description = description;
    if (tags !== undefined) document.tags = tags;

    await document.save();

    res.json({
      message: "Document updated successfully",
      document: {
        id: document._id,
        filename: document.filename,
        description: document.description,
        tags: document.tags,
      },
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete document
router.delete("/:documentId", async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    if (!BYPASS_AUTH) {
      // Production mode - verify authentication
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    const document = await findUserDocument(documentId, req);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const bucket = getGridFSBucket();

    // Delete from GridFS
    await bucket.delete(document.fileId);

    // Delete metadata from MongoDB
    await Document.findByIdAndDelete(documentId);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// 🚨 TEMPORARY: Simple upload route for testing
// TODO: REMOVE THIS ROUTE WHEN MAIN UPLOAD COMPONENT IS READY
router.post(
  "/upload-test",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const bucket = getGridFSBucket();
      const userId = getUserId(req) || "507f1f77bcf86cd799439011";

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: {
          userId: userId,
          uploadDate: new Date(),
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });

      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", async () => {
        try {
          const document = new Document({
            userId: userId,
            filename: req.file!.originalname,
            originalName: req.file!.originalname,
            fileId: uploadStream.id,
            mimeType: req.file!.mimetype,
            fileSize: req.file!.size,
          });

          await document.save();

          res.json({
            message: "File uploaded successfully",
            document: {
              id: document._id,
              filename: document.filename,
              fileSize: document.fileSize,
              uploadDate: document.uploadDate,
            },
          });
        } catch (saveError) {
          console.error("Error saving document metadata:", saveError);
          res.status(500).json({ error: "Failed to save document metadata" });
        }
      });

      uploadStream.on("error", (error: Error) => {
        console.error("GridFS upload error:", error);
        res.status(500).json({ error: "Upload failed" });
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/* 
TODO: AUTHENTICATION INTEGRATION GUIDE

When ready to enable authentication, follow these steps:

1. Set BYPASS_AUTH = false at the top of this file

2. Ensure your authentication middleware is applied to these routes in server.ts:
   app.use('/api/documents', authenticateToken, documentRoutes);

3. Your authenticateToken middleware should set req.user with:
   - req.user.id (user's database ID)
   - Any other user properties you need

4. Example authenticateToken middleware:
   
   const authenticateToken = (req, res, next) => {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'Access token required' });
     }
     
     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if (err) {
         return res.status(403).json({ error: 'Invalid token' });
       }
       req.user = user;
       next();
     });
   };

5. Update your frontend to include Authorization header:
   headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`,
     'Content-Type': 'application/json'
   }

6. Remove the /upload-test route as it's only for development
*/

export default router;
