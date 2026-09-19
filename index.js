document.addEventListener("DOMContentLoaded", () => {
    const heroLanding = document.getElementById("heroLanding");
    const loginPanel = document.getElementById("loginPanel");
    const tabSignIn = document.getElementById("tabSignIn");
    const tabJoin = document.getElementById("tabJoin");
    const enterBtn = document.getElementById("enterBtn");

    let currentMode = "signin"; 
    let isZoomed = false; 

    window.addEventListener("wheel", (e) => {
        if (e.deltaY > 20 && !isZoomed) { 
            isZoomed = true;
            heroLanding.style.transform = "scale(5)";
            heroLanding.style.opacity = "0";
            heroLanding.style.pointerEvents = "none";
            
            // Wait 1.5 seconds before fading in the login panel
            setTimeout(() => {
                loginPanel.classList.add("active");
            }, 1500); 
        } 
        else if (e.deltaY < -20 && isZoomed) { 
            isZoomed = false;
            loginPanel.classList.remove("active");
            
            setTimeout(() => {
                heroLanding.style.transform = "scale(1)";
                heroLanding.style.opacity = "1";
                heroLanding.style.pointerEvents = "all";
            }, 400); // Slowed the reverse animation slightly too
        }
    });

    // Tsign in and login
    if(tabSignIn && tabJoin) {
        tabSignIn.addEventListener("click", () => {
            currentMode = "signin";
            tabSignIn.classList.add("active");
            tabJoin.classList.remove("active");
        });

        tabJoin.addEventListener("click", () => {
            currentMode = "join";
            tabJoin.classList.add("active");
            tabSignIn.classList.remove("active");
        });
    }

    // Enter Button 
    if(enterBtn) {
        enterBtn.addEventListener("click", () => {
            if (currentMode === "signin") {
                // Existing user -> Store demo identity and navigate straight to Bot
                localStorage.setItem("fin_user", JSON.stringify({
                    user: { name: "Alex Rivera", isNew: false }
                }));
                window.location.href = "dashboard.html";
            } else {
                // New user -> Redirect to Natural Language Onboarding
                window.location.href = "onboard.html";
            }
        });
    }
});