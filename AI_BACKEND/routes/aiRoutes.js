const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import Person A's auth middleware
const authMiddleware = require('../middleware/auth');

const { processReceipt } = require('../controllers/receiptOcrController');
// ... your other AI controllers

const upload = multer({ storage: multer.memoryStorage() });

// Add authMiddleware BEFORE your controller
router.post('/scan-receipt', upload.single('receipt_image'), processReceipt);

// Do the same for your text route if you have it!
// router.post('/parse-text', authMiddleware, processText); 

module.exports = router;