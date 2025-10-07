// Main JavaScript functionality for PortEcho

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
});

// Utility functions
const utils = {
    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format number with commas
    formatNumber: function(num) {
        return num.toLocaleString();
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show loading state
    showLoading: function(element) {
        element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    },

    // Hide loading state
    hideLoading: function(element, content) {
        element.innerHTML = content;
    }
};

// API functions
const api = {
    baseUrl: 'http://localhost:8001',

    // Generic fetch function
    fetch: async function(url, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Get containers
    getContainers: function() {
        return this.fetch('/container');
    },

    // Get telemetry data
    getTelemetry: function(containerId = null) {
        const url = containerId ? `/telemetry/container/${containerId}` : '/telemetry';
        return this.fetch(url);
    },

    // Get alerts
    getAlerts: function() {
        return this.fetch('/anomalies');
    },

    // Get routes
    getRoutes: function() {
        return this.fetch('/routes');
    }
};

// Export for use in other scripts
window.PortEcho = {
    utils,
    api
};
