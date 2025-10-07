// Settings page functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const saveButton = document.querySelector('.settings-footer .btn');

    // Tab navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Form handling
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    // Save button
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveSettings();
        });
    }

    // Toggle switches
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h3').textContent;
            console.log(`${settingName}: ${this.checked ? 'enabled' : 'disabled'}`);
        });
    });

    // Theme selector
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }

    // Language selector
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            applyLanguage(this.value);
        });
    }

    // Load saved settings
    loadSettings();
});

function saveSettings() {
    // Collect form data
    const formData = {
        profile: {
            fullName: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            role: document.getElementById('role')?.value || '',
            department: document.getElementById('department')?.value || ''
        },
        notifications: {
            emailAlerts: document.querySelector('input[type="checkbox"]')?.checked || false,
            smsAlerts: document.querySelectorAll('input[type="checkbox"]')[1]?.checked || false,
            pushNotifications: document.querySelectorAll('input[type="checkbox"]')[2]?.checked || false,
            criticalAlerts: document.querySelectorAll('input[type="checkbox"]')[3]?.checked || false,
            weeklyReports: document.querySelectorAll('input[type="checkbox"]')[4]?.checked || false
        },
        appearance: {
            theme: document.getElementById('theme')?.value || 'dark',
            language: document.getElementById('language')?.value || 'en'
        }
    };

    // Save to localStorage
    localStorage.setItem('portecho-settings', JSON.stringify(formData));

    // Show success message
    showSuccessMessage('Settings saved successfully!');
}

function loadSettings() {
    const savedSettings = localStorage.getItem('portecho-settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Load profile settings
        if (settings.profile) {
            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const roleInput = document.getElementById('role');
            const departmentInput = document.getElementById('department');
            
            if (fullNameInput) fullNameInput.value = settings.profile.fullName;
            if (emailInput) emailInput.value = settings.profile.email;
            if (roleInput) roleInput.value = settings.profile.role;
            if (departmentInput) departmentInput.value = settings.profile.department;
        }

        // Load notification settings
        if (settings.notifications) {
            const checkboxes = document.querySelectorAll('.toggle input');
            const notificationKeys = ['emailAlerts', 'smsAlerts', 'pushNotifications', 'criticalAlerts', 'weeklyReports'];
            
            notificationKeys.forEach((key, index) => {
                if (checkboxes[index] && settings.notifications[key] !== undefined) {
                    checkboxes[index].checked = settings.notifications[key];
                }
            });
        }

        // Load appearance settings
        if (settings.appearance) {
            const themeSelect = document.getElementById('theme');
            const languageSelect = document.getElementById('language');
            
            if (themeSelect && settings.appearance.theme) {
                themeSelect.value = settings.appearance.theme;
                applyTheme(settings.appearance.theme);
            }
            
            if (languageSelect && settings.appearance.language) {
                languageSelect.value = settings.appearance.language;
            }
        }
    }
}

function applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    
    // Add new theme class
    body.classList.add(`theme-${theme}`);
    
    // Save theme preference
    localStorage.setItem('portecho-theme', theme);
}

function applyLanguage(language) {
    // Apply language changes
    console.log(`Language changed to: ${language}`);
    
    // Save language preference
    localStorage.setItem('portecho-language', language);
}

function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(successDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .success-content {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
