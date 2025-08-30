# Water Flow Meter Dashboard

A modern React dashboard for monitoring and analyzing water flow sensor data in real-time.

## Features

- 📊 **Real-time Monitoring**: Live water flow rate tracking with automatic updates
- 📈 **Interactive Charts**: Beautiful visualizations using Recharts
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, minimal design with Tailwind CSS
- 🔔 **Alert System**: Real-time notifications and warnings
- 📊 **Key Metrics**: Current flow rate, daily usage, average flow, and peak usage
- 🔄 **Auto-refresh**: Data updates every 30 seconds
- 🚀 **Ready for Backend**: Prepared API endpoints with Axios

## Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd water-flow-meter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard component
│   ├── Sidebar.js       # Navigation sidebar
│   ├── StatCard.js      # Reusable stat card
│   ├── FlowChart.js     # Chart components
│   └── AlertsPanel.js   # Alerts display
├── services/
│   └── api.js          # API service with Axios
├── App.js              # Main app component
├── index.js            # React entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The dashboard is prepared with placeholder API endpoints. To connect to your backend:

1. Update the `baseURL` in `src/services/api.js`
2. Replace mock data calls with real API calls
3. Ensure your backend provides the following endpoints:

### Required API Endpoints

- `GET /api/flow/current` - Current flow rate
- `GET /api/usage/today` - Today's total usage
- `GET /api/flow/average` - Average flow rate
- `GET /api/flow/historical` - Historical data
- `GET /api/flow/realtime` - Real-time data
- `GET /api/alerts` - System alerts
- `GET /api/sensor/status` - Sensor status

### Example API Response Format

```json
{
  "currentFlowRate": 2.5,
  "todayUsage": 1250,
  "averageFlow": 1.8,
  "alerts": [
    {
      "id": 1,
      "type": "warning",
      "message": "Flow rate above normal",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "realTimeData": [
    {
      "time": "2024-01-01T12:00:00Z",
      "flowRate": 2.5
    }
  ]
}
```

## Customization

### Styling

- Colors can be customized in `tailwind.config.js`
- Component styles are in `src/index.css`
- Individual component styling can be modified in their respective files

### Adding New Features

1. **New Charts**: Add new chart components in `src/components/`
2. **New Metrics**: Extend the `StatCard` component or create new ones
3. **New Pages**: Add routes in the sidebar and create new page components

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

