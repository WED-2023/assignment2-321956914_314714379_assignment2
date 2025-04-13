const bgMusic = new Audio('assets/gamebackgroundmusic.mp3');
bgMusic.loop = true;

const gameOverSound = new Audio('assets/gameover.mp3');
const enemyDestroyedSound = new Audio('assets/explosion_enemy.mp3');

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('welcome');

    window.addEventListener('keydown', (e) => {
        if (!keys[e.key]) {
            keys[e.key] = true;
    
            if (e.key === window.shootKey || (window.shootKey === ' ' && e.code === 'Space')) {
                createPlayerBullet();
            }

            if(e.key === 'Escape'){
                closeAboutModal();
            }
        }
    });


    window.addEventListener('keyup', (e) => {
        
        if (e.key === " ") e.preventDefault();

        keys[e.key] = false;


    });

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
        resetGame();
        navigateTo('welcome');
    });

    const newGameButton = document.getElementById('newGameButton');
    newGameButton.addEventListener('click', function(event) {
        resetGame();
        startGame();
    });

    const customMessageClose = document.getElementById('customMessageClose');
    customMessageClose.addEventListener('click', function(event) {
        hideMessage()();
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
});

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
        errors.push("Password must include letters and numbers.")
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
        showMessage(errors.join("\n"));
        return false; 
    }

    users.push({ username, password });
    showMessage("Registration successful!");
    navigateTo('welcome');
    return false;

}

function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        showMessage("Login successful!");
        navigateTo('configuration'); 
    } else {
        showMessage("Invalid username or password.");
    }
}

function navigateTo(pageId) {
    const pages = document.querySelectorAll('.applicationpage');
    pages.forEach(page => page.style.display = 'none');
    const targetPage = document.getElementById(pageId);
    targetPage.style.display = 'block';

    if (pageId === 'welcome') {
        const loginUsername = document.getElementById('username');
        const loginPassword = document.getElementById('password');
        loginUsername.value = '';
        loginPassword.value = '';

        const shootKeyInput = document.getElementById('shootKey');
        const gameDurationInput = document.getElementById('gameDuration');
        const goodShipColorInput = document.getElementById('goodShipColor');
        const badShipColorInput = document.getElementById('badShipColor');

        shootKeyInput.value = '';
        gameDurationInput.value = '';
        goodShipColorInput.value = '';
        badShipColorInput.value = '';
    }

    if (pageId === 'game') {
        document.getElementById('mainMenu').style.display = 'none';
    } 

    if (pageId !== 'game'){
        document.getElementById('mainMenu').style.display = 'block';
    }

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
        showMessage(errors.join("\n"));
        return;
    }

    // Save the configuration data 
    window.shootKey = shootKeyRaw; 
    window.duration = duration; 
    window.goodShipColor = goodShipColor; 
    window.badShipColor = badShipColor; 

    navigateTo('game'); 
    startGame();

}


let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let playerImg, badShip1Img, badShip2Img, badShip3Img, badShip4Img;
let player = {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  speed: 5
};
let enemyBullets = []
let playerBullets = []
let enemyShips = [];
let keys = {};
let enemySpeed = 2; 
let direction = 1; 
let maxAccelerations = 4; 
let accelerationInterval = 5000; 
let accelerations = 0;
let enemyBulletSpeed = 3;
let score = 0;
let lives = 3;
let gameStartTime;
let gameRunning = true;
let gameLoopFrameId;
let accelerationIntervalId;

function startGame() {

    bgMusic.currentTime = 0;
    bgMusic.play();
    gameRunning = true;
  
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

    gameStartTime = Date.now();
    playerImg.onload = () => {
      requestAnimationFrame(gameLoop);
    };

    startAcceleratingEnemies();
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
    updatePlayerBullet()
    updateEnemyBullet()
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMetrics();

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    enemyShips.forEach(ship => {
        ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    });

    playerBullets.forEach(bullet => {
        ctx.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y >= canvas.height * 0.75) {
        enemyShoot();
    }

    enemyBullets.forEach(bullet => {
        ctx.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
    });

  }
  
  function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    gameLoopFrameId = requestAnimationFrame(gameLoop);
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
                image: shipImage,
                row: row
            });
        }
    }
}

function startAcceleratingEnemies() {
    accelerationIntervalId = setInterval(accelerateEnemies, accelerationInterval);
}

// Function to stop accelerating enemies
function stopAcceleratingEnemies() {
    clearInterval(accelerationIntervalId);
}

function accelerateEnemies() {
    if (accelerations < maxAccelerations) {
        enemySpeed += 1.5; 
        enemyBulletSpeed += 1.5; 
        accelerations++;
    } 
}



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

function createPlayerBullet() {
    const bullet = {
        x: player.x + player.width / 2 - 5, 
        y: player.y,
        width: 50,
        height: 50,
        speed: 7, 
        image: new Image(),
    };
    bullet.image.src = 'assets/playerBullet.png'; 

    playerBullets.push(bullet);
}

function updatePlayerBullet()
{
    playerBullets.forEach(bullet => {
        bullet.y -= bullet.speed; 
        if (bullet.y < 0) {
            playerBullets = playerBullets.filter(b => b !== bullet);
        }

        // Check collision with enemies
        for (let i = 0; i < enemyShips.length; i++) {
            const ship = enemyShips[i];
            if (
                bullet.x < ship.x + ship.width &&
                bullet.x + bullet.width > ship.x &&
                bullet.y < ship.y + ship.height &&
                bullet.y + bullet.height > ship.y
            ) {
                switch(ship.row) {
                    case 0:
                        score += 20;
                        break;
                    case 1:
                        score += 15;
                        break;
                    case 2:
                        score += 10;
                        break;
                    case 3:
                        score += 5;
                        break;
                }

                playerBullets = playerBullets.filter(b => b !== bullet);
                enemyShips.splice(i, 1);
                enemyDestroyedSound.currentTime = 0;
                enemyDestroyedSound.play();

                if(enemyShips.length === 0){
                    endGame(4)
                }
                break;
            }
        }
    });
}

function createEnemyBullet(enemy) {
    const bullet = {
        x: enemy.x + enemy.width / 2 - 5, 
        y: enemy.y,
        width: 50,
        height: 50,
        speed: enemyBulletSpeed, 
        image: new Image(),
        progress: 0
    };
    bullet.image.src = 'assets/enemyBullet.png'; 

    enemyBullets.push(bullet);
}

function updateEnemyBullet()
{
    enemyBullets.forEach(bullet => {
        bullet.y += bullet.speed; 
        
        bullet.progress = bullet.y / canvas.height;

        if (bullet.y > canvas.height) {
            enemyBullets = enemyBullets.filter(b => b !== bullet);
        }

        // Collision with player
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            lives--;
            if (lives === 0)
            {
                endGame(1)
            }

            player.x = Math.random() * (canvas.width - player.width);
            player.y = canvas.height - player.height;

            enemyBullets = enemyBullets.filter(b => b !== bullet);
        }
    });
}

function enemyShoot() {
        const randomEnemy = enemyShips[Math.floor(Math.random() * enemyShips.length)];

        createEnemyBullet(randomEnemy);
}

function drawMetrics() {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000); 
    const totalSeconds = window.duration * 60;
    const remainingTime = Math.max(0, totalSeconds - elapsed); 

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Lives: ${lives}`, 10, 50);

    ctx.textAlign = 'right';
    ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width - 10, 25);

    if (remainingTime === 0 && score < 100)
        {
            endGame(2)
        }

    if (remainingTime === 0 && score >= 100)
        {
            endGame(3)
        }

}

function endGame(code) {
    gameRunning = false;
    let message = "";
    bgMusic.pause();
    bgMusic.currentTime = 0; // Reset for next time
    gameOverSound.play();

    switch(code) {
        case 1:
            message = "You Lost!";
            break;
        case 2:
            message = `You can do better... \nFinal Score: ${score}`;
            break;
        case 3:
            message = `Winner! 🏆`;
            break;
        case 4:
            message = `Champion! 🚀`;
            break;
    }

    showMessage(message);

}

function showMessage(text) {
    const messageBox = document.getElementById('customMessage');
    const messageText = document.getElementById('customMessageText');
    messageText.innerHTML = text.replace(/\n/g, '<br>'); // This line is key!
    messageBox.classList.remove('hidden');

    // Hide the message after 3 seconds
    setTimeout(function() {
        hideMessage();
    }, 3000); 
}

function hideMessage() {
    const messageBox = document.getElementById('customMessage');
    messageBox.classList.add('hidden');
}


function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopFrameId);
    stopAcceleratingEnemies();
    bgMusic.pause();
    bgMusic.currentTime = 0; 
    score = 0;
    lives = 3;
    playerBullets = [];
    enemyBullets = [];
    enemyShips = [];
    direction = 1;
    accelerations = 0;
    enemySpeed = 2;
    enemyBulletSpeed = 3;

    player.x = Math.random() * (canvas.width - player.width);
    player.y = canvas.height - player.height;

}