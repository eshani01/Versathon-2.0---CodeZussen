const geminiService = require('../services/geminiService');

exports.processText = async (req, res) => {
    try {
        const { text } = req.body;
        const currentDate = new Date().toISOString().split('T')[0];

        // 1. Ask Gemini to extract data
        const aiData = await geminiService.parseTextToTransaction(text, currentDate);

        // 2. FAKE DB SAVE (Wait for Person A for real DB saving)
        console.log("Success! Gemini extracted:", aiData);
        
        res.status(200).json({ 
            success: true, 
            message: "Text parsed successfully! (DB skipped until Person A is done)",
            transaction: aiData 
        });

    } catch (error) {
        console.error("Text Error:", error);
        res.status(500).json({ success: false, message: "AI failed to process text" });
    }
};