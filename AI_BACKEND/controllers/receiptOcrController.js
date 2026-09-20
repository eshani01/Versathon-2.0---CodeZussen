const { parseReceiptImage } = require('../services/geminiService');
const { createTransaction } = require('../db/queries'); 

// 1. The dictionary mapping AI words to your Database Category IDs
const categoryMap = {
    'food': 1,
    'dining': 1,
    'transport': 2,
    'utilities': 3,
    'shopping': 4,
    'entertainment': 5,
    'health': 6,
    'other': 7
};

// 2. The single, unified controller function
exports.processReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        // A. Let Gemini extract the data
        const mimeType = req.file.mimetype;
        const base64Data = req.file.buffer.toString('base64');
        const aiData = await parseReceiptImage(mimeType, base64Data);

        // B. Convert the AI's category string into a Database ID
        // Note: Safely check if aiData.category exists first, fallback to 'other' (7)
        const categoryString = aiData.category ? aiData.category.toLowerCase() : 'other';
        const finalCategoryId = categoryMap[categoryString] || 7;

        // C. Save it to the REAL Database!
        const savedTransaction = await createTransaction(
            req.body.userId,            // <-- CHANGED: Now uses the REAL logged-in user!
            finalCategoryId,          // The mapped integer ID (1-7)
            aiData.amount,              // Extracted amount
            aiData.transaction_type,    // 'expense'
            `${aiData.merchant}: ${aiData.description}`, // Combined description
            aiData.date,                // Extracted date
            'receipt',                  // sourceType
            'Scanned via AI'            // rawInput
        );

        // D. Send the saved database row back to your HTML frontend
        res.json({ 
            success: true, 
            message: "Receipt scanned and saved to Database!", 
            transaction: savedTransaction 
        });

    } catch (error) {
        console.error("AI/DB Error:", error);
        res.status(500).json({ success: false, message: "Failed to process receipt" });
    }
};