/**
 * A simple Node.js backend server for a water flow meter project.
 * It uses Express to handle API endpoints for receiving and serving flow data.
 *
 * To run this file:
 * 1. Make sure you have Node.js installed.
 * 2. In your terminal, navigate to the directory where you saved this file.
 * 3. Run `npm install express cors` to install the required packages.
 * 4. Run `node server.js` to start the server.
 *
 * This server will run on http://localhost:8082.
 */




/*
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8082; // The same port as seen in your screenshots

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// A simple in-memory array to simulate a database for storing flow data.
// In a production environment, you would use a real database like MongoDB or PostgreSQL.
const flowData = [
  // Example historical data, similar to your screenshot.
  { id: 1, flowRate: 15.5, timestamp: "2025-08-28T10:00:00Z" },
  { id: 2, flowRate: 20.2, timestamp: "2025-08-28T10:05:00Z" },
  { id: 3, flowRate: 18.7, timestamp: "2025-08-28T10:10:00Z" }
];

// Threshold for abnormal flow rate. This can be configured.
const ABNORMAL_FLOW_THRESHOLD = 20;

// Root endpoint for a simple health check.
app.get('/', (req, res) => {
  res.send('Water Flow Meter Backend is running!');
});

/**
 * Endpoint to get all stored flow data.
 * The frontend dashboard will call this to populate charts and history.
 
app.get('/flow', (req, res) => {
  res.json(flowData);
});

/**
 * Endpoint to receive new flow data from The Things Network via a webhook.
 * It expects a JSON body with a 'uplink_message' key containing the decoded payload.
 
app.post('/data', (req, res) => {
  // The Things Network webhook payload structure is nested.
  const payload = req.body;

  // Make sure the payload has the expected structure
  if (!payload || !payload.uplink_message || !payload.uplink_message.decoded_payload) {
    console.error('Received an invalid payload from webhook:', payload);
    return res.status(400).json({ error: 'Invalid payload structure.' });
  }

  // Extract the flow rate from the decoded payload.
  // We assume the decoded payload has a 'flowRate' key.
  const { flowRate } = payload.uplink_message.decoded_payload;

  if (flowRate === undefined) {
    console.error('Missing flowRate in decoded payload:', payload.uplink_message.decoded_payload);
    return res.status(400).json({ error: 'Missing flowRate in decoded payload.' });
  }

  // Create a new data entry with a unique ID and current timestamp
  const newEntry = {
    id: flowData.length + 1,
    flowRate: parseFloat(flowRate),
    timestamp: new Date().toISOString()
  };

  // Add the new data to our in-memory storage
  flowData.push(newEntry);
  console.log('Received new flow rate data from Things Network:', newEntry);

  // Check for abnormal flow rate and log an alert.
  if (newEntry.flowRate > ABNORMAL_FLOW_THRESHOLD) {
    console.warn(`ALERT: Abnormal flow rate detected at ${newEntry.timestamp} with value ${newEntry.flowRate}.`);
  }

  res.status(201).json({ message: 'Data received successfully!', data: newEntry });
});

// Start the server and log a message to the console.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8082; // Ensure this matches the port in your frontend code

// Middleware
app.use(cors()); // Enable CORS to allow requests from your frontend
app.use(express.json());

// Mock data for the API endpoints
const mockData = {
  dashboardSummary: {
    currentFlowRate: 2.5,
    todayUsage: 1250,
    averageFlow: 1.8,
  },
  alerts: [
    { id: 1, severity: 'high', message: 'Flow rate above normal', time: '18:21' },
    { id: 2, severity: 'low', message: 'Daily usage target reached', time: '17:55' }
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

// API Endpoints
app.get('/dashboard/summary', (req, res) => {
  res.json(mockData.dashboardSummary);
});

app.get('/flow/realtime', (req, res) => {
  res.json(mockData.realTimeData);
});

app.get('/flow/historical', (req, res) => {
  res.json(mockData.historicalData);
});

app.get('/alerts', (req, res) => {
  res.json(mockData.alerts);
});

// Endpoint to simulate new real-time data
app.get('/flow/realtime/update', (req, res) => {
  const newFlow = Math.random() * 5 + 0.5;
  const newTimestamp = new Date().toISOString();
  res.json([{ time: newTimestamp, flowRate: newFlow }]);
});

app.listen(port, () => {
  console.log(`Water Flow API listening at http://localhost:${port}`);
});
