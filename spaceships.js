document.addEventListener('DOMContentLoaded', () => {
    navigateTo('welcome');

    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      registerUser();
    });

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        loginUser(); 
    });

    const closeAboutBtn = document.getElementById('closeAboutBtn');
    closeAboutBtn.addEventListener('click', function(event) {
        closeAboutModal();
    })

    const startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', function(event){
        handleStartGame();
    })

    const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
    backToWelcomeBtn.addEventListener('click', function(event) {
        navigateTo('welcome');
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
        }
    });


    aboutModal.addEventListener('click', (e) => {
        const rect = aboutModal.getBoundingClientRect();
        const isInDialog = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
        if (!isInDialog) {
            closeAboutModal();
        }
    });


    const yearSelect = document.getElementById('regYear');
    const monthSelect = document.getElementById('regMonth');
    const daySelect = document.getElementById('regDay');
    
    // Days
    for (let d = 1; d <= 31; d++) {
            let option = document.createElement('option');
            option.value = d;
            option.textContent = d;
            daySelect.appendChild(option);
          }

    // Months
    for (let m = 1; m <= 12; m++) {
        let option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        monthSelect.appendChild(option);
      }

    // Years
    for (let y = 2025; y >= 1925; y--) {
      let option = document.createElement('option');
      option.value = y;
      option.textContent = y;
      yearSelect.appendChild(option);
    }
})

let users = [
    { username: 'p', password: 'testuser' } // only existing username when starting the website
];

function registerUser(){
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();

    // errors array that will add each error if it happens, and then adds them together to display to user.
    const errors = [];

    // all fields filled
    if (!username || !password || !confirmPassword || !firstName || !lastName || !email) {
        errors.push("All fields are required, please make sure you filled them all.");
    }

    // Password : minimum length of 8 , includes letters and numbers
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }

    if(!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        errors.push("Password must include letters and numbers")
    }

    // Confirm password match
    if (password !== confirmPassword) {
        errors.push("The provided confirm password and password do not match.");
    }

    // First and last name should not contain numbers
    if (/\d/.test(firstName) || /\d/.test(lastName)) {
        errors.push("First and last names cannot contain numbers.");
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Invalid email.");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false; 
    }

    users.push({ username, password });
    alert("Registration successful!");
    navigateTo('welcome');
    return false;

}

function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert("Login successful!");
        navigateTo('configuration'); 
    } else {
        alert("Invalid username or password.");
    }
}

function navigateTo(pageId) {
    const pages = document.querySelectorAll('.applicationpage');
    pages.forEach(page => page.style.display = 'none');
    const targetPage = document.getElementById(pageId);
    targetPage.style.display = 'block';

}


function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal.open) {
        modal.showModal();
    }
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal.open) {
        modal.close();
    }
}

function handleStartGame() {
    const shootKeyInput = document.getElementById('shootKey');
    const gameDurationInput = document.getElementById('gameDuration');
    const goodShipColorInput = document.getElementById('goodShipColor');
    const badShipColorInput = document.getElementById('badShipColor');

    const shootKeyRaw = shootKeyInput.value;
    const duration = parseInt(gameDurationInput.value);
    const goodShipColor = goodShipColorInput.value;
    const badShipColor = badShipColorInput.value;

    const errors = [];

    const validShootKey = /^[a-zA-Z]$/.test(shootKeyRaw) || shootKeyRaw === ' ';
    if (!validShootKey) {
        errors.push("Please enter a valid shooting key (A-Z or Space).");
    }

    if (isNaN(duration) || duration < 2) {
        errors.push("Game duration must be at least 2 minutes.");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    navigateTo('game'); 
    startGame();

}


let canvas, ctx;
let playerImg, badShip1Img, badShip2Img, badShip3Img, badShip4Img;
let player = {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  speed: 5
};

let enemyShips = [];
let keys = {};
let enemySpeed = 1; 
let direction = 1; 
let maxAccelerations = 4; 
let accelerationInterval = 5000; 
let accelerations = 0;


function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
  
    player.x = Math.random() * (canvas.width - player.width);
    player.y = canvas.height - player.height;

    playerImg = new Image();
    playerImg.src = 'assets/goodship.png';
    
    badShip1Img = new Image();
    badShip1Img.src = 'assets/badship1.png'; 

    badShip2Img = new Image();
    badShip2Img.src = 'assets/badship2.png'; 

    badShip3Img = new Image();
    badShip3Img.src = 'assets/badship3.png'; 

    badShip4Img = new Image();
    badShip4Img.src = 'assets/badship4.png'; 

    createEnemyShips();


    playerImg.onload = () => {
      requestAnimationFrame(gameLoop);
    };
  
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
  }


function update() {
    const upperLimit = canvas.height * 0.6;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
  
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(upperLimit, Math.min(canvas.height - player.height, player.y));

    moveEnemies()
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    enemyShips.forEach(ship => {
        ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    });

  }
  
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }


  function createEnemyShips() {
    const numRows = 4;
    const numCols = 5;
    const shipWidth = 50; 
    const shipHeight = 40; 
    const spacing = 7; 

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * (shipWidth + spacing); 
            const y = row * (shipHeight + spacing); 
            let shipImage;

            switch(row) {
                case 0:
                    shipImage = badShip1Img; 
                    break;
                case 1:
                    shipImage = badShip2Img; 
                    break;
                case 2:
                    shipImage = badShip3Img; 
                    break;
                case 3:
                    shipImage = badShip4Img; 
                    break;
            }

            enemyShips.push({
                x: x,
                y: y,
                width: shipWidth,
                height: shipHeight,
                image: shipImage
            });
        }
    }
}

function accelerateEnemies() {
    if (accelerations < maxAccelerations) {
        enemySpeed += 1.5; // Increase speed (you can change this value to control how fast the ships accelerate)
        accelerations++;
    } 
}

setInterval(accelerateEnemies, accelerationInterval);


function moveEnemies() {
    let maxX = canvas.width - 50;
    let minX = 0;

    // Move all enemy ships together
    enemyShips.forEach(ship => {
        ship.x += direction * enemySpeed;
    });

    if (enemyShips[enemyShips.length - 1].x >= maxX || enemyShips[0].x <= minX) {
        direction *= -1; // Reverse direction
    }
}