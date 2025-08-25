// server/models/Document.ts
import mongoose, { Schema } from "mongoose";

// Simple interface without extending Document
interface IDocumentModel {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  fileId: mongoose.Types.ObjectId;
  mimeType: string;
  fileSize: number;
  uploadDate: Date;
  tags?: string[];
  description?: string;
}

const DocumentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  tags: [String],
  description: String,
});

// Export without generic type parameter
export default mongoose.model("Document", DocumentSchema);
