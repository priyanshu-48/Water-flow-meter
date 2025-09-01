/*import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content }
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation }
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">FlowMeter</h1>
            <div className="w-6"></div> {/* Spacer for centering }
          </div>
        </header>

        {/* Main Content Area }
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
*/





import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Menu, Droplets, TrendingUp, Clock, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8082', // Hardcoding for single-file deployment
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Water Flow API endpoints
const waterFlowAPI = {
  // Get dashboard summary
  getDashboardSummary: () => api.get('/dashboard/summary'),
  // Get real-time flow data (for charts)
  getRealTimeData: (duration = '24h') => api.get(`/flow/realtime?duration=${duration}`),
  // Get historical flow data
  getHistoricalData: (startDate, endDate, interval = '1h') => api.get('/flow/historical', {
    params: { startDate, endDate, interval }
  }),
  // Get alerts/notifications
  getAlerts: () => api.get('/alerts'),
};

// Component for a placeholder sidebar.
// This is a placeholder since the full Sidebar component file was not provided.
const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-300 ease-in-out bg-white w-64 shadow-xl z-20`}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold text-gray-800">FlowMeter</h2>
        <button onClick={onToggle} className="lg:hidden text-gray-600 hover:text-gray-900">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-8 px-4">
        {/* Navigation links will go here*/ }
        <p className="text-gray-400">Navigation links will go here</p>
      </nav>
    </div>
  );
};

// Component for displaying a single statistic card
const StatCard = ({ title, value, unit, icon: Icon, color, trend, trendValue }) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const trendColorMap = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-full ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{unit}</p>
        </div>
        <div className={`flex items-center text-sm ${trendColorMap[trend]}`}>
          {trend === 'up' && <TrendingUp size={16} className="mr-1" />}
          {trend === 'down' && <TrendingUp size={16} className="transform rotate-180 mr-1" />}
          <span>{trendValue}</span>
        </div>
      </div>
    </div>
  );
};

// Component for displaying a chart
const FlowChart = ({ data, title, type, height }) => {
  const chartData = data.map(d => ({
    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    flowRate: d.flowRate
  }));

  const ChartComponent = type === 'line' ? LineChart : AreaChart;
  const ChartElement = type === 'line' ? Line : Area;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {type === 'area' ? (
              <defs>
                <linearGradient id="colorFlowRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
            ) : null}
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <ChartElement 
              type="monotone" 
              dataKey="flowRate" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorFlowRate)" 
              strokeWidth={2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component for the alerts panel
const AlertsPanel = ({ alerts }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 lg:col-span-1">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Alerts</h3>
    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
      {alerts.length === 0 && (
        <li className="py-3 text-gray-500 text-center">No new alerts</li>
      )}
      {alerts.map((alert, index) => (
        <li key={index} className="py-3">
          <div className="flex items-start">
            <span className={`flex-shrink-0 w-2 h-2 mt-1 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{alert.message}</p>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// The main Dashboard component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    currentFlowRate: 0,
    todayUsage: 0,
    averageFlow: 0,
    alerts: [],
    realTimeData: [],
    historicalData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, realtimeRes, historicalRes, alertsRes] = await Promise.all([
          waterFlowAPI.getDashboardSummary(),
          waterFlowAPI.getRealTimeData(),
          waterFlowAPI.getHistoricalData(),
          waterFlowAPI.getAlerts()
        ]);
        setDashboardData({
          currentFlowRate: summaryRes.data.currentFlowRate,
          todayUsage: summaryRes.data.todayUsage,
          averageFlow: summaryRes.data.averageFlow,
          realTimeData: realtimeRes.data,
          historicalData: historicalRes.data,
          alerts: alertsRes.data
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(async () => {
      try {
        const res = await waterFlowAPI.getRealTimeData('1min');
        if (res.data.length > 0) {
          setDashboardData(prev => ({
            ...prev,
            realTimeData: [...prev.realTimeData.slice(-4), ...res.data]
          }));
        }
      } catch (err) {
        console.error('Error fetching real-time data:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans antialiased">
      {/* Header*/ }
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Water Flow Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and analytics for your system.</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Current Flow Rate"
          value={dashboardData.currentFlowRate.toFixed(1)}
          unit="L/min"
          icon={Droplets}
          color="blue"
          trend="up"
          trendValue="+0.3 L/min"
        />
        <StatCard
          title="Today's Usage"
          value={dashboardData.todayUsage.toLocaleString()}
          unit="L"
          icon={Activity}
          color="green"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Average Flow"
          value={dashboardData.averageFlow.toFixed(1)}
          unit="L/min"
          icon={TrendingUp}
          color="orange"
          trend="neutral"
          trendValue="Stable"
        />
        <StatCard
          title="Peak Usage"
          value="4.2"
          unit="L/min"
          icon={Clock}
          color="purple"
          trend="down"
          trendValue="-0.8 L/min"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FlowChart
          data={dashboardData.realTimeData}
          title="Real-time Flow Rate"
          type="area"
          height={300}
        />
        <FlowChart
          data={dashboardData.historicalData}
          title="24-Hour Flow History"
          type="line"
          height={300}
        />
      </div>

      {/* Alerts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1,250</p>
              <p className="text-sm text-gray-600">Liters Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-600">Efficiency</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">12</p>
              <p className="text-sm text-gray-600">Active Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">2.1</p>
              <p className="text-sm text-gray-600">Avg L/min</p>
            </div>
          </div>
        </div>
        <AlertsPanel alerts={dashboardData.alerts} />
      </div>
    </div>
  );
};

// The main App component
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">FlowMeter</h1>
            <div className="w-6"></div> {/* Spacer for centering*/ }
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}



export default App;

