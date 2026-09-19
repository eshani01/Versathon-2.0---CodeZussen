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
const orbitContainer = document.getElementById("orbitSystem");
if(orbitContainer) {
    const expenses = appData.transactions.filter(t => t.type === 'expense');
    const values = expenses.map(t => t.amount);
    const maxSpend = Math.max(...values, 1);
    const minSpend = Math.min(...values, 0);
    const totalSpend = values.reduce((a, b) => a + b, 0);

    const minRadius = 200; 
    const maxRadius = 300; 

    expenses.forEach((txn, index) => {
        const normalized = (txn.amount - minSpend) / (maxSpend - minSpend || 1);
        const radius = maxRadius + (normalized * (maxRadius - minRadius));

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
    
    // Slide bot smoothly to the right (positive X)
    targetRobotX = 2.5; 
    
    // Blur the rings in the background
    if(orbitSystem) orbitSystem.classList.add("blur-target");
    
    modalBackdrop.style.display = "flex";
}

if(closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        modalBackdrop.style.display = "none";
        
        // Slide bot back to the center
        targetRobotX = 0;
        
        // Unblur the rings
        if(orbitSystem) orbitSystem.classList.remove("blur-target");
    });
}