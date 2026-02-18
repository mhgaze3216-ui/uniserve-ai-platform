const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");
const scanChecklist = document.getElementById("scanChecklist");

// Scan steps configuration
const scanSteps = [
  { label: "Threat database scan", value: "0 threats found", delay: 800 },
  { label: "Malware signature analysis", value: "0 detected", delay: 1000 },
  { label: "Phishing pattern verification", value: "0 matches", delay: 900 },
  { label: "Redirect analysis", value: "No suspicious redirects", delay: 850 },
  { label: "SSL / HTTPS validation", value: "Valid certificate", delay: 950 }
];

let isScanning = false;

scanBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  
  if (url === "") {
    alert("Please enter a valid URL.");
    return;
  }

  if (isScanning) {
    return;
  }

  startScan(url);
});

function startScan(url) {
  isScanning = true;
  
  // Hide result and show checklist
  result.classList.remove("visible");
  result.className = "result";
  scanChecklist.classList.add("active");
  
  // Disable scan button
  scanBtn.disabled = true;
  scanBtn.textContent = "Scanning...";
  scanBtn.style.opacity = "0.6";
  scanBtn.style.cursor = "not-allowed";
  
  // Reset all scan items
  const scanItems = document.querySelectorAll(".scan-item");
  scanItems.forEach((item, index) => {
    item.classList.remove("completed", "animate-in");
    item.style.transitionDelay = "0s";
    
    // Reset icons and text
    const icon = item.querySelector(".scan-icon i");
    icon.className = "fas fa-circle-notch fa-spin";
    
    const valueSpan = item.querySelector(".scan-value");
    if (index === 0) {
      valueSpan.textContent = "Scanning...";
    } else {
      valueSpan.textContent = "Waiting...";
    }
  });
  
  // Animate items in sequence
  let cumulativeDelay = 0;
  
  scanItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("animate-in");
      
      const valueSpan = item.querySelector(".scan-value");
      if (index > 0) {
        valueSpan.textContent = "Scanning...";
      }
      
      // Complete this step after its delay
      setTimeout(() => {
        completeStep(item, scanSteps[index].value);
        
        // If last step, show final result
        if (index === scanItems.length - 1) {
          setTimeout(() => {
            showFinalResult(url);
          }, 500);
        }
      }, scanSteps[index].delay);
      
    }, cumulativeDelay);
    
    cumulativeDelay += scanSteps[index].delay + 100;
  });
}

function completeStep(item, value) {
  item.classList.add("completed");
  
  const icon = item.querySelector(".scan-icon i");
  icon.className = "fas fa-check-circle";
  
  const valueSpan = item.querySelector(".scan-value");
  valueSpan.textContent = value;
}

function showFinalResult(url) {
  // Fake scan logic (UI only)
  const isDangerous = url.includes("hack") || url.includes("phish") || url.includes("malware");
  
  result.classList.add("visible");
  
  if (isDangerous) {
    result.textContent = "⚠️ This link is potentially dangerous.";
    result.classList.add("danger");
  } else {
    result.textContent = "✅ This link appears to be safe.";
    result.classList.add("safe");
  }
  
  // Re-enable scan button
  scanBtn.disabled = false;
  scanBtn.textContent = "Scan";
  scanBtn.style.opacity = "1";
  scanBtn.style.cursor = "pointer";
  
  isScanning = false;
}

// Background animation with canvas
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Particle system for background
class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  
  draw() {
    ctx.fillStyle = `rgba(25, 93, 230, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Data stream lines
class DataLine {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.y = Math.random() * canvas.height;
    this.x = -100;
    this.length = Math.random() * 100 + 50;
    this.speed = Math.random() * 1 + 0.5;
    this.opacity = Math.random() * 0.2 + 0.05;
    this.thickness = Math.random() * 1.5 + 0.5;
  }
  
  update() {
    this.x += this.speed;
    
    if (this.x > canvas.width + 100) {
      this.reset();
    }
  }
  
  draw() {
    ctx.strokeStyle = `rgba(25, 93, 230, ${this.opacity})`;
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.length, this.y);
    ctx.stroke();
  }
}

// Create particles and lines
const particles = [];
const dataLines = [];

for (let i = 0; i < 50; i++) {
  particles.push(new Particle());
}

for (let i = 0; i < 15; i++) {
  dataLines.push(new DataLine());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  // Update and draw data lines
  dataLines.forEach(line => {
    line.update();
    line.draw();
  });
  
  requestAnimationFrame(animate);
}

animate();
