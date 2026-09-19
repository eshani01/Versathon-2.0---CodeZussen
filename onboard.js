document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("onboardForm");
    const sentenceInput = document.getElementById("onboardSentence");
    const previewContainer = document.getElementById("aiPreview");

    let extractedTransactions = [];

    // Client-side 
    if(sentenceInput) {
        sentenceInput.addEventListener("input", () => {
            const text = sentenceInput.value;
            previewContainer.innerHTML = "";
            extractedTransactions = [];

            const dynamicPattern = /(\d+[\d,]*)\s+(?:on|for)\s+([a-zA-Z]+)/gi;
            
            let match;
            while ((match = dynamicPattern.exec(text)) !== null) {
                const amount = parseFloat(match[1].replace(/,/g, ''));
                
                // Capitalize the first letter of whatever category it finds (e.g., "crafts" -> "Crafts")
                const categoryName = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();

                extractedTransactions.push({
                    category_name: categoryName, 
                    amount: amount,          
                    type: "expense",         
                    source_type: "nlp_onboard", 
                    date: new Date().toISOString().split('T')[0] 
                });

                const chip = document.createElement("span");
                chip.className = "spend-chip";
                chip.innerText = `Detected: ${categoryName} ~ ₹${amount}`;
                previewContainer.appendChild(chip);
            }
        });
    }

    if(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("onboardName").value;
            const monthlyIncome = parseFloat(document.getElementById("onboardIncome").value);
            
            const userData = {
                user: {
                    google_id: "demo_google_123", 
                    name: name,
                    email: "demo@gmail.com",
                    isNew: true
                },
                preferences: {
                    monthly_income: monthlyIncome,
                    currency: "INR",
                    savings_target: 0
                },
                transactions: extractedTransactions
            };

            // Save to browser memory 
            localStorage.setItem("fin_user", JSON.stringify(userData));

            window.location.href = "dashboard.html";
        });
    }
});