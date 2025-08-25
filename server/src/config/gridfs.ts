// server/config/gridfs.ts
import mongoose from "mongoose";

let gfsBucket: any = null;

export const getGridFSBucket = () => {
  if (!gfsBucket) {
    if (!mongoose.connection.db) {
      throw new Error("MongoDB connection not established");
    }

    // Use Mongoose's internal GridFS - no import conflicts!
    const { GridFSBucket } = mongoose.mongo;
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });
    console.log("GridFS initialized with Mongoose driver");
  }
  return gfsBucket;
};
