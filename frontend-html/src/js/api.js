// API utility functions for PortEcho
// This file handles all API connections to the backend

const PortEchoAPI = {
    // Base URL for API requests - change this to match your backend URL
    baseUrl: 'http://localhost:8001',
    
    // Generic fetch function with error handling
    async fetchApi(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },
    
    // Container API endpoints
    containers: {
        // Get all containers
        getAll: async () => {
            return PortEchoAPI.fetchApi('/container');
        },
        
        // Get container by ID
        getById: async (containerId) => {
            return PortEchoAPI.fetchApi(`/container/${containerId}`);
        },
        
        // Create new container
        create: async (containerData) => {
            return PortEchoAPI.fetchApi('/container', {
                method: 'POST',
                body: JSON.stringify(containerData)
            });
        },
        
        // Update container
        update: async (containerId, containerData) => {
            return PortEchoAPI.fetchApi(`/container/${containerId}`, {
                method: 'PUT',
                body: JSON.stringify(containerData)
            });
        },
        
        // Delete container
        delete: async (containerId) => {
            return PortEchoAPI.fetchApi(`/container/${containerId}`, {
                method: 'DELETE'
            });
        }
    },
    
    // Telemetry API endpoints
    telemetry: {
        // Get all telemetry data
        getAll: async () => {
            return PortEchoAPI.fetchApi('/telemetry');
        },
        
        // Get telemetry for specific container
        getByContainer: async (containerId) => {
            return PortEchoAPI.fetchApi(`/telemetry/container/${containerId}`);
        },
        
        // Get telemetry for container within time range
        getByContainerRange: async (containerId, startTime, endTime) => {
            return PortEchoAPI.fetchApi(`/telemetry/container/${containerId}/range?startTime=${startTime}&endTime=${endTime}`);
        },
        
        // Submit new telemetry data
        submit: async (telemetryData) => {
            return PortEchoAPI.fetchApi('/telemetry', {
                method: 'POST',
                body: JSON.stringify(telemetryData)
            });
        }
    },
    
    // Anomaly API endpoints
    anomalies: {
        // Get all anomalies
        getAll: async () => {
            return PortEchoAPI.fetchApi('/anomalies');
        },
        
        // Get anomalies for specific container
        getByContainer: async (containerId) => {
            return PortEchoAPI.fetchApi(`/anomalies/container/${containerId}`);
        },
        
        // Get anomalies by severity
        getBySeverity: async (severity) => {
            return PortEchoAPI.fetchApi(`/anomalies/severity/${severity}`);
        }
    },
    // Reports / summaries
    reports: {
        // Get summary stats for analytics page
        getSummary: async () => {
            return PortEchoAPI.fetchApi('/anomalies/summary');
        }
    },
    
    // Health check
    healthCheck: async () => {
        return PortEchoAPI.fetchApi('/');
    }
};

// Export the API object
window.PortEchoAPI = PortEchoAPI;