const express = require("express");

const {
    getProfile,
    updatePreferences
} = require("../controllers/userController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, getProfile);

// Update financial preferences
router.put("/preferences", authMiddleware, updatePreferences);

module.exports = router;