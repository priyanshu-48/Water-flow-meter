import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Water Flow API endpoints
export const waterFlowAPI = {
  // Get current flow rate
  getCurrentFlowRate: () => api.get('/flow/current'),
  
  // Get today's total water usage
  getTodayUsage: () => api.get('/usage/today'),
  
  // Get average flow rate
  getAverageFlow: (period = '24h') => api.get(`/flow/average?period=${period}`),
  
  // Get historical flow data
  getHistoricalData: (startDate, endDate, interval = '1h') => 
    api.get('/flow/historical', {
      params: { startDate, endDate, interval }
    }),
  
  // Get real-time flow data (for charts)
  getRealTimeData: (duration = '24h') => 
    api.get(`/flow/realtime?duration=${duration}`),
  
  // Get sensor status
  getSensorStatus: () => api.get('/sensor/status'),
  
  // Get alerts/notifications
  getAlerts: () => api.get('/alerts'),
  
  // Get dashboard summary
  getDashboardSummary: () => api.get('/dashboard/summary'),
};

// Mock data for development (remove when connecting to real backend)
export const mockData = {
  currentFlowRate: 2.5, // L/min
  todayUsage: 1250, // L
  averageFlow: 1.8, // L/min
  sensorStatus: 'active',
  alerts: [
    { id: 1, type: 'warning', message: 'Flow rate above normal', timestamp: new Date() },
    { id: 2, type: 'info', message: 'Daily usage target reached', timestamp: new Date() }
  ],
  historicalData: Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
    flowRate: Math.random() * 5 + 0.5,
    usage: Math.random() * 100 + 10
  })),
  realTimeData: Array.from({ length: 60 }, (_, i) => ({
    time: new Date(Date.now() - (59 - i) * 60 * 1000).toISOString(),
    flowRate: Math.random() * 5 + 0.5
  }))
};

export default api;
