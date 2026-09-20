const ai = require('../config/gemini');

const transactionSchema = {
    type: "object",
    properties: {
        amount: { type: "number" },
        category_name: { type: "string", description: "e.g., 'Food', 'Utilities', 'Salary'" },
        transaction_type: { type: "string", enum: ["income", "expense"] },
        description: { type: "string", description: "Short description" },
        date: { type: "string", description: "YYYY-MM-DD format" },
        merchant: { type: "string", description: "Merchant name if available" }
    },
    required: ["amount", "category_name", "transaction_type", "description", "date"]
};

exports.parseTextToTransaction = async (text, currentDate) => {
    const prompt = `Extract financial transaction details as JSON. Assume current date is ${currentDate}. Text: "${text}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
        // 👇 TEMPORARILY REMOVED THE STRICT SCHEMA 👇
        config: { responseMimeType: 'application/json' } 
    });
    return JSON.parse(response.text);
};

exports.parseReceiptImage = async (mimeType, base64Data) => {
    const prompt = "Analyze this receipt. Extract total amount, merchant, date, short description, and category.";
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite', // Updated to your supported model
        contents: [
            { role: 'user', parts: [
                { inlineData: { data: base64Data, mimeType: mimeType } },
                { text: prompt }
            ]}
        ],
        config: { responseMimeType: 'application/json', responseSchema: transactionSchema }
    });
    return JSON.parse(response.text);
};