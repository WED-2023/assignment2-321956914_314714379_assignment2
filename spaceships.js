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
    const pages = document.querySelectorAll('.content-page');
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