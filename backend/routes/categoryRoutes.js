const express = require("express");

const {
    getAllCategories
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getAllCategories);

module.exports = router;
