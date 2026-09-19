const geminiService = require('../services/geminiService');

exports.processReceipt = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });

        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        // 1. Ask Gemini to scan the receipt
        const aiData = await geminiService.parseReceiptImage(mimeType, base64Image);

        // 2. FAKE DB SAVE (Wait for Person A for real DB saving)
        console.log("Success! Gemini scanned:", aiData);

        res.status(200).json({ 
            success: true, 
            message: "Receipt scanned successfully! (DB skipped until Person A is done)",
            transaction: aiData 
        });

    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ success: false, message: "AI failed to scan receipt" });
    }
};