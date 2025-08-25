// === server/routes/dashboardRoutes.ts ===
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// TODO: Create proper dashboard controller
// For now, this returns placeholder data to get your frontend working

// Protected dashboard route - requires JWT authentication
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log("=== Dashboard Data Request ===");

    if (!req.user || typeof req.user === "string") {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Cast req.user to proper interface based on your JWT payload
    const user = req.user as {
      id: string;
      email: string;
      iat?: number;
      exp?: number;
    };

    console.log("User ID:", user.id);
    console.log("User Email:", user.email);

    // TODO: Replace with real database queries
    // This is placeholder data to match your frontend interface
    const placeholderStats = {
      documentsCount: 42,
      updatedThisWeek: 23,
      upcomingExpires: 1,
      sharedWithYou: 5,
    };

    const placeholderActivity = [
      {
        id: "1",
        type: "upload",
        user: "You", // Using string since we don't have user name in JWT
        action: "uploaded",
        document: "Labreport1.pdf",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        metadata: {
          documentType: "Medical",
        },
      },
      {
        id: "2",
        type: "share",
        user: "You",
        action: "shared Car Insurance with User 1",
        document: "Car Insurance.pdf",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        metadata: {
          documentType: "Insurance",
          sharedWith: "User 1",
        },
      },
      {
        id: "3",
        type: "update",
        user: "You", // Using string since we don't have user name in JWT
        action: "updated",
        document: "Passport.pdf",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        metadata: {
          documentType: "ID",
        },
      },
    ];

    const placeholderNotifications = 2;

    console.log("=== Returning Placeholder Dashboard Data ===");
    console.log("Stats:", placeholderStats);
    console.log("Activities:", placeholderActivity.length);

    res.json({
      success: true,
      data: {
        stats: placeholderStats,
        recentActivity: placeholderActivity,
        notifications: placeholderNotifications,
      },
      message: "Dashboard data retrieved successfully (placeholder data)",
    });
  } catch (error) {
    console.error("=== Dashboard Data Error ===");
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
});

// Health check for dashboard routes
router.get("/health", (req, res) => {
  res.json({
    message: "Dashboard routes working",
    timestamp: new Date().toISOString(),
    status: "placeholder data active",
  });
});

export default router;
