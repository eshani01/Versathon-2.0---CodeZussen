require('dotenv').config();

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔍 Asking Google for your allowed models...");
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("\n✅ SUCCESS! Your API key has access to these models:");
            
            data.models.forEach(m => {
                // Only print models that can generate text/content
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    // Removes the "models/" prefix so it's easy to copy
                    console.log(`👉 ${m.name.replace('models/', '')}`); 
                }
            });
            
            console.log("\n📝 Pick the most recent 'flash' model from this list and use that in your code!");
        } else {
            console.log("❌ Error getting models:", data);
        }
    } catch (error) {
        console.log("❌ Request failed:", error);
    }
}

checkModels();