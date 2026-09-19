const express = require('express');
const router = express.Router();
const multer = require('multer');

// Stores uploaded images temporarily in memory
const upload = multer({ storage: multer.memoryStorage() });

const naturalInputController = require('../controllers/naturalInputController');
const receiptOcrController = require('../controllers/receiptOcrController');
const aiChatController = require('../controllers/aiChatController');

// DUMMY AUTH (Remove this once Person A writes middleware/auth.js)
const dummyAuth = (req, res, next) => {
    req.user = { id: 1, name: "Test User" };
    next();
};
router.use(dummyAuth);

router.post('/parse-text', naturalInputController.processText);
router.post('/scan-receipt', upload.single('receipt_image'), receiptOcrController.processReceipt);
router.post('/chat', aiChatController.chat);

module.exports = router;