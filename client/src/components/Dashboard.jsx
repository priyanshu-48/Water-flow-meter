import React, { useState, useEffect } from 'react';
import { Droplets, TrendingUp, Clock, Activity } from 'lucide-react';
import StatCard from './StatCard.jsx';
import FlowChart from './FlowChart.jsx';
import AlertsPanel from './AlertsPanel.jsx';
import { waterFlowAPI, mockData } from '../services/api.jsx';

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
        console.log('Dashboard component is rendering.');
        
        // Simple direct fetch to test connection
        console.log('Trying to fetch data from the backend using FETCH...');
        const response = await fetch('http://localhost:8082/dashboard/summary');
        if (response.ok) {
          const summaryData = await response.json();
          console.log('SUCCESS: Data fetched from backend!', summaryData);
          
          // Get other endpoints
          const alertsResponse = await fetch('http://localhost:8082/alerts');
          const realtimeResponse = await fetch('http://localhost:8082/flow/realtime');
          
          const alertsData = alertsResponse.ok ? await alertsResponse.json() : [];
          const realtimeData = realtimeResponse.ok ? await realtimeResponse.json() : [];
          
          console.log('All data fetched successfully');
          
          setDashboardData({
            currentFlowRate: summaryData.currentFlowRate || 2.5,
            todayUsage: summaryData.todayUsage || 1250,
            averageFlow: summaryData.averageFlow || 1.8,
            alerts: alertsData,
            realTimeData: realtimeData,
            historicalData: realtimeData
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
        
        setLoading(false);
        console.log('Dashboard data set, loading complete');

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Fallback to mock data
        console.log('Using fallback mock data');
        setDashboardData({
          currentFlowRate: mockData.currentFlowRate,
          todayUsage: mockData.todayUsage,
          averageFlow: mockData.averageFlow,
          alerts: mockData.alerts,
          realTimeData: mockData.realTimeData,
          historicalData: mockData.historicalData
        });
        setLoading(false);
        setError(null);
      }
    };

    fetchDashboardData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      // Update current flow rate with some variation
      setDashboardData(prev => ({
        ...prev,
        currentFlowRate: Math.random() * 5 + 0.5,
        realTimeData: [...prev.realTimeData.slice(1), {
          time: new Date().toISOString(),
          flowRate: Math.random() * 5 + 0.5
        }]
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Water Flow Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and analytics</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <div className="lg:col-span-2">
          <div className="chart-container">
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
        </div>
        <AlertsPanel alerts={dashboardData.alerts} />
      </div>
    </div>
  );
};

export default Dashboard;
