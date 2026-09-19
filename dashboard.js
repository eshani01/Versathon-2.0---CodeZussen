import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// user profile
const storedData = localStorage.getItem("fin_user");
const appData = storedData ? JSON.parse(storedData) : {
    user: { name: "Alex Rivera", google_id: "demo_123", isNew: false },
    preferences: { monthly_income: 75000, currency: "INR" },
    transactions: [
        { category_name: "Food", amount: 18000, type: "expense" },
        { category_name: "Loan", amount: 15000, type: "expense" },
        { category_name: "Travel", amount: 8000, type: "expense" },
        { category_name: "Shopping", amount: 6000, type: "expense" },
        { category_name: "Miscellaneous", amount: 3500, type: "expense" }
    ]
};

// hello/ welcome back
const greetingHeader = document.getElementById("greetingHeader");
const userNameLabel = document.getElementById("userNameLabel");
if(greetingHeader && userNameLabel) {
    greetingHeader.innerText = appData.user.isNew ? "Hello" : "Welcome back";
    userNameLabel.innerText = appData.user.name;
}

// bot setup
const container = document.getElementById("bot-canvas-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 10; //size of bot

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
if(container) container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00f2fe, 2.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// bot glb file
let robot;
const loader = new GLTFLoader();
loader.load('./my-bot.glb', (gltf) => {
    robot = gltf.scene;
    // Adjust this number if your bot sits too high or too low
    robot.position.y = -3; 
    scene.add(robot);
});

// bot following cursor logic
let mouseX = 0, mouseY = 0;
const halfX = window.innerWidth / 2;
const halfY = window.innerHeight / 3;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX - halfX;
    mouseY = e.clientY - halfY;
});

let targetRobotX = 0; // Tracks where the bot should stand

function animate() {
    requestAnimationFrame(animate);
    if (robot) {
        const targetX = (mouseX * 0.0008) + (Math.PI / 2);
        const targetY = (mouseY * 0.0008);
        robot.rotation.y += 1 * (targetX - robot.rotation.y);
        robot.rotation.x += 1 * (targetY - robot.rotation.x);
        
        // Smoothly slides the BOT to the right, keeping it facing forward
        robot.position.x += (targetRobotX - robot.position.x) * 0.08;
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// orbit around bot
// -------------------------------------------------------------
// REUSABLE UI UPDATE FUNCTIONS
// -------------------------------------------------------------

// Function to calculate and draw the 3D Orbits
function buildOrbits() {
    const orbitContainer = document.getElementById("orbitSystem");
    if (!orbitContainer) return;

    // Clear existing orbits
    orbitContainer.innerHTML = '';

    const expenses = appData.transactions.filter(t => t.type === 'expense');
    const values = expenses.map(t => t.amount);
    const maxSpend = Math.max(...values, 1);
    const minSpend = Math.min(...values, 0);
    const totalSpend = values.reduce((a, b) => a + b, 0);

    const minRadius = 300; 
    const maxRadius = 350; 

    expenses.forEach((txn, index) => {
        // Reverse calculation so highest spend is furthest away
        const normalized = (txn.amount - minSpend) / (maxSpend - minSpend || 1);
        const radius = minRadius + (normalized * (maxRadius - minRadius));

        const angle = (index * (360 / expenses.length)) * (Math.PI / 180);
        const x = 400 + radius * Math.cos(angle);
        const y = 400 + radius * Math.sin(angle);

        const ring = document.createElement("div");
        ring.className = "orbit-circle";
        ring.style.width = `${radius * 2}px`;
        ring.style.height = `${radius * 2}px`;
        orbitContainer.appendChild(ring);

        const node = document.createElement("div");
        node.className = "orbit-node";
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.innerHTML = `<span class="cat-name">${txn.category_name}</span><span class="cat-amount">₹${txn.amount}</span>`;
        
        node.addEventListener("click", () => {
            openModal(txn.category_name, txn.amount, Math.round((txn.amount / totalSpend) * 100));
        });

        orbitContainer.appendChild(node);
    });
}

// Function to rebuild the Analytics Doughnut Chart
let expenseChart = null;
function buildChart() {
    const chartCanvas = document.getElementById('expenseDoughnut');
    if (!chartCanvas) return;

    const chartExpenses = appData.transactions.filter(t => t.type === 'expense');
    const chartLabels = chartExpenses.map(t => t.category_name);
    const chartValues = chartExpenses.map(t => t.amount);

    // Destroy the old chart if it exists so we can draw a fresh one
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartValues,
                backgroundColor: ['#00f2fe', '#fe0979', '#f8e71c', '#00ff87', '#bc13fe', '#ff5e00'],
                borderWidth: 2,
                borderColor: '#12121a', 
                hoverOffset: 10 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'right', labels: { color: '#ffffff', padding: 20, font: { family: "'Space Grotesk', sans-serif", size: 12 } } },
                tooltip: {
                    backgroundColor: 'rgba(5, 5, 8, 0.9)', titleFont: { family: "'Space Grotesk', sans-serif", size: 14 },
                    bodyFont: { family: "'Space Grotesk', sans-serif", size: 13, weight: 'bold' }, padding: 15, cornerRadius: 8, displayColors: false,
                    callbacks: { label: function(context) { return ` ₹${context.parsed.toLocaleString()}`; } }
                }
            }
        }
    });
}

// Run these on initial load
buildOrbits();
buildChart();

// -------------------------------------------------------------
// EVENT LISTENERS & LOGIC
// -------------------------------------------------------------

// 1. Modal Updates & Bot Sliding
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const speechBubble = document.getElementById("speechBubble");
const orbitSystem = document.getElementById("orbitSystem");

function openModal(category, amount, share) {
    document.getElementById("modalCategoryTitle").innerText = category;
    document.getElementById("modalSpent").innerText = `₹${amount.toLocaleString()}`;
    document.getElementById("modalShare").innerText = `${share}%`;
    
    let trendText = share > 30 ? "High Impact" : "Normal Level";
    document.getElementById("modalTrend").innerText = trendText;

    speechBubble.innerText = `Finny: "${category} accounts for ${share}% of your total outflow. Tap detail to review potential leaks."`;
    
    // Slides Bot to the right
    targetRobotX = 2.5; 
    if(orbitSystem) orbitSystem.classList.add("blur-target");
    modalBackdrop.style.display = "flex";
}

if(closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        modalBackdrop.style.display = "none";
        // Slides Bot back to center
        targetRobotX = 0;
        if(orbitSystem) orbitSystem.classList.remove("blur-target");
    });
}

// 2. HUD Navigation & Panel Sliding Logic
const panels = document.querySelectorAll('.action-panel');
const closeBtns = document.querySelectorAll('.close-panel-btn');

function openPanel(panelId) {
    panels.forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(panelId);
    if(targetPanel) targetPanel.classList.add('active');
}

document.getElementById('btnQuickAdd')?.addEventListener('click', () => openPanel('panelQuickAdd'));
document.getElementById('btnAnalytics')?.addEventListener('click', () => openPanel('panelAnalytics'));
document.getElementById('btnSavings')?.addEventListener('click', () => openPanel('panelSavings'));

closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.action-panel').classList.remove('active');
    });
});

// 3. NEW: Add Expense Logic
const btnSubmitNewExpense = document.getElementById('submitNewExpense');
const newExpCategory = document.getElementById('newExpCategory');
const newExpAmount = document.getElementById('newExpAmount');

if (btnSubmitNewExpense) {
    btnSubmitNewExpense.addEventListener('click', () => {
        const category = newExpCategory.value.trim();
        const amount = parseFloat(newExpAmount.value);

        if (!category || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid category and amount.");
            return;
        }

        // Add the new transaction to our local appData object
        appData.transactions.push({
            category_name: category,
            amount: amount,
            type: "expense",
            source_type: "manual_add",
            date: new Date().toISOString().split('T')[0]
        });

        // Save the updated data back to the browser's vault
        localStorage.setItem("fin_user", JSON.stringify(appData));

        // Re-draw the Orbits and the Chart immediately!
        buildOrbits();
        buildChart();

        // Clear the inputs and slide the panel away
        newExpCategory.value = '';
        newExpAmount.value = '';
        document.getElementById('panelQuickAdd').classList.remove('active');
        
        // Bonus: Make Finny acknowledge it!
        speechBubble.innerText = `Finny: "I've added ${category} to your orbit and updated your charts."`;
    });
}

// 4. Future Savings Tracker Logic
const saveReasonInput = document.getElementById('saveReason');
const saveTargetInput = document.getElementById('saveTarget');
const saveDateInput = document.getElementById('saveDate');
const btnCreateGoal = document.getElementById('btnCreateGoal');
const savingsProgressSection = document.getElementById('savingsProgressSection');
const savingsStatusText = document.getElementById('savingsStatusText');
const savingsFill = document.getElementById('savingsFill');
const addSavingsAmount = document.getElementById('addSavingsAmount');
const btnDepositSavings = document.getElementById('btnDepositSavings');

let savingsData = JSON.parse(localStorage.getItem('fin_savings')) || null;

function updateSavingsUI() {
    if (!savingsData || !savingsProgressSection) return;

    if (saveReasonInput) saveReasonInput.style.display = 'none';
    if (saveTargetInput) saveTargetInput.style.display = 'none';
    if (saveDateInput) saveDateInput.style.display = 'none';
    if (btnCreateGoal) btnCreateGoal.style.display = 'none';
    
    savingsProgressSection.style.display = 'block';

    const percentage = Math.min((savingsData.current / savingsData.target) * 100, 100).toFixed(1);
    
    savingsStatusText.innerHTML = `<span style="color: var(--neon-cyan); font-size: 1.1rem;">${savingsData.reason}</span><br>₹${savingsData.current.toLocaleString()} / ₹${savingsData.target.toLocaleString()} (${percentage}%)`;
    savingsFill.style.width = `${percentage}%`;

    if (savingsData.current >= savingsData.target) {
        savingsStatusText.innerHTML += " <br><span style='color: var(--neon-green);'>🏆 Goal Reached!</span>";
        savingsFill.style.background = "var(--neon-green)";
        if(btnDepositSavings) btnDepositSavings.style.display = 'none';
        if(addSavingsAmount) addSavingsAmount.style.display = 'none';
    }
}

updateSavingsUI();

if (btnCreateGoal) {
    btnCreateGoal.addEventListener('click', () => {
        const reason = saveReasonInput.value;
        const target = parseFloat(saveTargetInput.value);
        const date = saveDateInput.value;

        if (!reason || isNaN(target) || target <= 0) {
            alert("Please enter a valid reason and target amount.");
            return;
        }

        savingsData = { reason: reason, target: target, date: date, current: 0 };
        localStorage.setItem('fin_savings', JSON.stringify(savingsData));
        updateSavingsUI();
    });
}

if (btnDepositSavings) {
    btnDepositSavings.addEventListener('click', () => {
        const deposit = parseFloat(addSavingsAmount.value);
        if (isNaN(deposit) || deposit <= 0) return; 

        savingsData.current += deposit;
        localStorage.setItem('fin_savings', JSON.stringify(savingsData));
        
        addSavingsAmount.value = ''; 
        updateSavingsUI();
    });
}