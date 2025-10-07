// Login page functionality with Firebase Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('rememberMe');
    const googleSignInBtn = document.getElementById('googleSignIn');
    
    // Check if user is already signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, redirect to dashboard
            console.log("User is signed in, redirecting to dashboard");
            redirectToDashboard();
        }
    });

    // Load saved email if "Remember Me" was checked
    if (localStorage.getItem('rememberMe') === 'true') {
        emailInput.value = localStorage.getItem('savedEmail') || '';
        rememberMeInput.checked = true;
    }

    // Email/Password Sign In
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeInput.checked;

            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Signing In...';
            submitBtn.disabled = true;

            // Firebase email/password authentication
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Save email if "Remember Me" is checked
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('savedEmail', email);
                    } else {
                        localStorage.removeItem('rememberMe');
                        localStorage.removeItem('savedEmail');
                    }
                    
                    // Show success message and redirect
                    console.log("Login successful, redirecting to dashboard");
                    redirectToDashboard();
                })
                .catch((error) => {
                    // Handle errors
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    console.error("Login error:", error.code, error.message);
                    
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        showError('Invalid email or password');
                    } else {
                        showError(error.message);
                    }
                });
        });
    } else {
        console.error("Login form not found!");
    }
    
    // Google Sign In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // Redirect to dashboard
                    console.log("Google sign-in successful, redirecting to dashboard");
                    redirectToDashboard();
                })
                .catch((error) => {
                    console.error("Google sign-in error:", error);
                    showError(error.message);
                });
        });
    } else {
        console.error("Google sign-in button not found!");
    }
    
    // Function to show error messages
    function showError(message) {
        console.error("Error:", message);
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorElement.classList.add('hidden');
            }, 5000);
        } else {
            // If loginError element doesn't exist, create a dynamic error message
            alert("Login Error: " + message);
        }
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Function to redirect to dashboard
function redirectToDashboard() {
    // Add any pre-redirect logic here (e.g., saving state, showing messages)
    console.log("Redirecting to dashboard now...");
    window.location.href = '../pages/dashboard.html';
}
