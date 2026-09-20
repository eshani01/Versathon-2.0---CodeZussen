const ai = require('../config/gemini');

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const fakeTotalSpent = 1250; 
        
        const systemPrompt = `You are a helpful personal finance assistant. User context: They have spent ₹${fakeTotalSpent} this month. Keep answers under 3 sentences.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash', // Updated here too
            contents: `System: ${systemPrompt}\nUser: ${message}`
        });

        res.json({ success: true, reply: response.text });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, message: "Chatbot failed" });
    }
};