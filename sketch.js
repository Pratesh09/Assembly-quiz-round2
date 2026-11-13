let currentScreen = "Start";
let screenAlpha = 0; 
let textAnimY = -100; 
let particles = []; 
let bgOffset = 0; 

// Confetti Timing Variables
let lastConfettiSpawnTime = 0; // Tracks the 750ms interval
let endScreenStartTime = 0;    // Tracks the total time spent on the End screen

// UPDATE YOUR QUESTIONS AND OPTIONS HERE
const quizData = {
  "Q6": {
    question: "Q6: Write your Question 6 here?",
    options: [
      { label: "Option A text", target: "Wrong6" },
      { label: "Option B text (Correct)", target: "Correct6" }
    ]
  },
  "Q7": {
    question: "Q7: Write your Question 7 here?",
    options: [
      { label: "Option A text", target: "Wrong7" },
      { label: "Option B text (Correct)", target: "Correct7" },
      { label: "Option C text", target: "Wrong7" }
    ]
  },
  "Q8": {
    question: "Q8: Write your Question 8 here?",
    options: [
      { label: "Option A text", target: "Wrong8" },
      { label: "Option B text", target: "Wrong8" },
      { label: "Option C text (Correct)", target: "Correct8" }
    ]
  },
  "Q9": {
    question: "Q9: Write your Question 9 here?",
    options: [
      { label: "Option A text", target: "Wrong9" },
      { label: "Option B text", target: "Wrong9" },
      { label: "Option C text (Correct)", target: "Correct9" }
    ]
  },
  "Q10": {
    question: "Q10: Write your Question 10 here?",
    options: [
      { label: "Option A text", target: "Wrong10" },
      { label: "Option B text", target: "Wrong10" },
      { label: "Option C text (Correct)", target: "Correct10" }
    ]
  }
};

let activeButtons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  updateScreenButtons();
  screenAlpha = 255;
  textAnimY = -100;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScreenButtons();
}

function draw() {
  drawEnhancedBackground();
  drawHeader();
  drawQuestionCard();

  for (let btn of activeButtons) {
    btn.updateAnimation();
    btn.draw();
  }

  // CONFETTI LOGIC ON END SCREEN
  if (currentScreen === "End") {
    let timeOnEndScreen = millis() - endScreenStartTime;

    // Only spawn new confetti bursts if under the 5000ms (5s) limit
    if (timeOnEndScreen <= 5000) {
      if (millis() - lastConfettiSpawnTime > 750) { // 750ms spawn delay
        spawnRandomConfettiBurst();
        lastConfettiSpawnTime = millis();
      }
    }

    // Update & draw remaining active particles (will naturally fall off screen)
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isOffScreen()) {
        particles.splice(i, 1);
      }
    }
  }

  // Fade transition overlay
  if (screenAlpha > 0) {
    fill(15, 23, 42, screenAlpha);
    noStroke();
    rect(0, 0, width, height);
    screenAlpha -= 12;
  }
}

// Spawns a burst of confetti at a random location on screen
function spawnRandomConfettiBurst() {
  let burstX = random(width * 0.1, width * 0.9);
  let burstY = random(height * 0.1, height * 0.6);

  for (let i = 0; i < 25; i++) {
    particles.push(new ConfettiParticle(burstX, burstY));
  }
}

function drawEnhancedBackground() {
  let topColor = color(15, 23, 42);   
  let botColor = color(30, 41, 59);   
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    stroke(lerpColor(topColor, botColor, inter));
    line(0, y, width, y);
  }

  stroke(255, 255, 255, 12);
  strokeWeight(1);
  let gridSize = 40;
  bgOffset = (bgOffset + 0.3) % gridSize;

  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = bgOffset; y < height; y += gridSize) {
    line(0, y, width, y);
  }
}

function drawQuestionCard() {
  push();
  let cardW = min(550, width * 0.9);
  let cardH = max(130, height * 0.22);
  let cardX = width / 2 - cardW / 2;
  let cardY = height * 0.15;

  fill(30, 41, 59, 230);
  stroke(51, 65, 85);
  strokeWeight(2);
  rect(cardX, cardY, cardW, cardH, 16);

  fill(255);
  noStroke();
  
  if (currentScreen === "Start") {
    textSize(width < 500 ? 22 : 28);
    textStyle(BOLD);
    let targetY = cardY + cardH / 2;
    textAnimY = lerp(textAnimY, targetY, 0.1);
    text("Welcome to the Quiz!", width / 2, textAnimY);
  } else if (quizData[currentScreen]) {
    textSize(width < 500 ? 18 : 22);
    textStyle(BOLD);
    textWrap(WORD);
    text(quizData[currentScreen].question, cardX + 20, cardY + 20, cardW - 40, cardH - 40);
  } else if (currentScreen.startsWith("Correct")) {
    fill(74, 222, 128);
    textSize(width < 500 ? 24 : 32);
    textStyle(BOLD);
    text("Correct Answer! 🎉", width / 2, cardY + cardH / 2);
  } else if (currentScreen.startsWith("Wrong")) {
    fill(248, 113, 113);
    textSize(width < 500 ? 24 : 32);
    textStyle(BOLD);
    text("Incorrect Try Again! ❌", width / 2, cardY + cardH / 2);
  } else if (currentScreen === "End") {
    fill(255);
    textSize(width < 500 ? 24 : 32);
    textStyle(BOLD);
    text("Quiz Completed! 🏆", width / 2, cardY + cardH / 2);
  }
  pop();
}

function mousePressed() {
  for (let btn of activeButtons) {
    if (btn.isMouseOver()) {
      if (btn.id === "button18") {
        activeButtons = activeButtons.filter(b => b.id !== "button2");
      }
      triggerScreenChange(btn.target);
      break;
    }
  }
}

function triggerScreenChange(targetScreen) {
  screenAlpha = 255;
  setTimeout(() => {
    currentScreen = targetScreen;
    updateScreenButtons();

    if (currentScreen === "End") {
      particles = [];
      endScreenStartTime = millis(); // Track when End screen loaded
      lastConfettiSpawnTime = millis();
      spawnRandomConfettiBurst();    // Initial burst on load
    }
  }, 90);
}

function updateScreenButtons() {
  activeButtons = [];
  let btnW = min(280, width * 0.8);
  let btnH = 50;

  if (currentScreen === "Start") {
    activeButtons.push(new Button("button1", width / 2 - btnW / 2, height * 0.5, btnW, btnH, "Start Quiz", "Q6", "#3B82F6"));
  } 
  else if (quizData[currentScreen]) {
    let opts = quizData[currentScreen].options;
    let startY = height * 0.42;
    opts.forEach((opt, idx) => {
      let buttonId = getButtonIdForQuestionOption(currentScreen, idx);
      activeButtons.push(new Button(buttonId, width / 2 - btnW / 2, startY + (idx * (btnH + 15)), btnW, btnH, opt.label, opt.target, "#6366F1"));
    });
  } 
  else if (currentScreen.startsWith("Wrong")) {
    let qNum = currentScreen.replace("Wrong", "");
    let retryButtonId = getRetryButtonId(qNum);
    activeButtons.push(new Button(retryButtonId, width / 2 - btnW / 2, height * 0.5, btnW, btnH, "Try Again", "Q" + qNum, "#F59E0B"));
  } 
  else if (currentScreen.startsWith("Correct")) {
    let qNum = parseInt(currentScreen.replace("Correct", ""));
    let nextScreen = qNum < 10 ? "Q" + (qNum + 1) : "End";
    let nextButtonId = getNextButtonId(qNum);

    if (currentScreen === "Correct10") {
      activeButtons.push(new Button("button18", width / 2 - btnW / 2, height * 0.46, btnW, btnH, "Finish", "End", "#10B981"));
      activeButtons.push(new Button("button2", width / 2 - btnW / 2, height * 0.46 + btnH + 15, btnW, btnH, "Back to Q9", "Q9", "#64748B"));
    } else {
      activeButtons.push(new Button(nextButtonId, width / 2 - btnW / 2, height * 0.5, btnW, btnH, "Next Question", nextScreen, "#10B981"));
    }
  }
}

function drawHeader() {
  push();
  fill(15, 23, 42, 220);
  stroke(51, 65, 85);
  rect(0, 0, width, 60);
  fill(255);
  textSize(width < 500 ? 15 : 18);
  textStyle(BOLD);
  text("App Lab Quiz (" + currentScreen + ")", width / 2, 30);
  pop();
}

function getButtonIdForQuestionOption(q, idx) {
  const mapping = {
    "Q6": ["button41", "button39"],
    "Q7": ["button43", "button45", "button46"],
    "Q8": ["button47", "button48", "button49"],
    "Q9": ["button34", "button35", "button36"],
    "Q10": ["button3", "button4", "button5"]
  };
  return mapping[q] ? mapping[q][idx] : "btn";
}

function getRetryButtonId(qNum) {
  const mapping = { "6": "button59", "7": "button60", "8": "button24", "9": "button42", "10": "button51" };
  return mapping[qNum] || "btn";
}

function getNextButtonId(qNum) {
  const mapping = { 6: "button54", 7: "button55", 8: "button56", 9: "button57" };
  return mapping[qNum] || "btn";
}

class Button {
  constructor(id, x, y, w, h, label, target, col) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.target = target;
    this.col = col;
    this.currentScale = 1.0;
  }

  updateAnimation() {
    let targetScale = this.isMouseOver() ? 1.04 : 1.0;
    this.currentScale = lerp(this.currentScale, targetScale, 0.2);
  }

  draw() {
    push();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    scale(this.currentScale);
    translate(-(this.w / 2), -(this.h / 2));

    stroke(255, 255, 255, 80);
    strokeWeight(1.5);
    let finalColor = color(this.col);
    if (this.currentScale > 1.01) {
      finalColor = lerpColor(color(this.col), color(255), 0.15);
    }
    fill(finalColor);

    rect(0, 0, this.w, this.h, 12);
    fill(255);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    text(this.label, this.w / 2, this.h / 2);
    pop();
  }

  isMouseOver() {
    return mouseX >= this.x && mouseX <= this.x + this.w &&
           mouseY >= this.y && mouseY <= this.y + this.h;
  }
}

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-7, 7);
    this.vy = random(-10, -1);
    this.w = random(6, 12);
    this.h = random(4, 8);
    
    let palette = [
      color(244, 63, 94),   
      color(59, 130, 246),  
      color(16, 185, 129),  
      color(245, 158, 11),  
      color(168, 85, 247)   
    ];
    this.c = random(palette);
    
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.2, 0.2);
    this.gravity = random(0.2, 0.35);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.c);
    noStroke();
    rect(0, 0, this.w, this.h);
    pop();
  }

  isOffScreen() {
    return this.y > height + 20;
  }
}
